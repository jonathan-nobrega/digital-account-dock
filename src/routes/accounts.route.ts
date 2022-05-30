import cors from "cors"
import { Router } from "express"
import firebaseConfig from '../firebaseconfig.json';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, doc, getDocs, updateDoc,
    getDoc, DocumentData, query, where, addDoc, deleteDoc, FieldValue, Timestamp
} from 'firebase/firestore';
import accountInterface from "../models/account.model";
import transactionInterface from "../models/transaction.model"

/** Initiallizing Firebase/Firestore credentials and Express Router */
initializeApp(firebaseConfig);
const db = getFirestore();
const router = Router()
router.use(cors({ origin: true }))

// exigencias
// deve poder fazer consulta de extrato por período
// um portador pode fechar a conta a qualquer momento
// deve poder executar saque SE conta estiver ativa, tiver saldo e com limite diário de 2000
// deve poder executar deposito
// conta nunca pode ter saldo negativo

/** ---- Challenge Routes ---- */
/**
 * Activate ou Inactivate Account
 * If req.body.active == undefined, it will assume to be "true"
 */
router.post('/active', async (req: { body: accountInterface }, res) => {
    try {
        const { accountNumber, accountAgency, active } = req.body
        console.log(active)
        let accountId
        // verifies if account exists
        const accountQuery = (await getDocs(query(
            collection(db, 'accounts'),
            where('accountNumber', '==', Number(accountNumber)),
            where('accountAgency', '==', Number(accountAgency))
        ))).forEach(a => { if (a) accountId = a.id })
        // if client exists, perform deletion
        if (accountId) {
            const data = {
                accountNumber: accountNumber,
                accountAgency: accountAgency,
                active: (active == undefined) ? true : active
            }
            await updateDoc(doc(db, "accounts", accountId), data)
            res.status(200).send({
                message: `Successfully updated Account!`,
                data: data
            })
        } else {
            res.status(404).send({
                message: `There are no Accounts with these credentials.`
            })
        }
    } catch (err) {
        res.status(400).send(err)
    }
});

/**
 * Deposit or withdrawal money on the Account
 */
router.post('/transaction', async (req: { body: transactionInterface }, res) => {
    try {
        const { accountNumber, accountAgency, amount, type } = req.body
        const todayTimestamp = new Date()
        const todayDate: string = `${todayTimestamp.getDate()}-${todayTimestamp.getMonth() + 1}-${todayTimestamp.getFullYear()}`;
        var balance = 0
        var accountId = ''

        // Gets account data
        var accountData: accountInterface
        (await getDocs(query(
            collection(db, 'accounts'),
            where('accountNumber', '==', Number(accountNumber)),
            where('accountAgency', '==', Number(accountAgency))
        ))).forEach(a => {
            accountId = a.id
            balance = a.data().balance
        });
        // Withdraws operations
        if (type == 'withdrawal') {
            // Check today total withdraws
            var withdraws = 0;
            (await getDocs(query(
                collection(db, 'transactions'),
                where('type', '==', 'withdrawal'),
                where('date', '==', todayDate))
            )).forEach(a => {
                const amount = a.data().amount
                withdraws += amount
            })
            // Validate if withdraw is possible
            if ((withdraws + Number(amount)) >= 2001) {
                return res.status(401).send({
                    message: 'Unouthorized withdrawl: Daily limit is $2000.',
                    balance: balance
                })
            }
            if (Number(amount) > balance) {
                return res.status(401).send({
                    message: `Unouthorized withdrawl: Insufficient funds`,
                    balance: balance
                })
            } else { // Perform withdraw
                const newBalance = balance - Number(amount)
                let document = doc(db, "accounts", accountId)
                await updateDoc(document, { balance: newBalance })
                const updatedAccount = await (await getDoc(document)).data()
                res.status(200).send({
                    message: `Successful transaction!`,
                    account: updatedAccount
                })
            }
        }
        // Deposit operations
        if (type == 'deposit') {

        }
        res.end()
    } catch (err) {
        res.status(400).send(err)
    }
});

// emitir extrato baseado em período


/** -------------------------- */


/** ---- Basic Routes ---- */
/**
 * GET - Read all Accounts
 */
router.get('/', async (req, res) => {
    try {
        let result: DocumentData[] = []
        await getDocs(collection(db, 'accounts'))
            .then(async rawData => {
                rawData.forEach(a => {
                    let record = a.data()
                    result.push(record)
                })
            })
        res.status(200).send(result)
    } catch (err) {
        res.status(400).send(err)
    }
});

/**
 * POST - Create a new record at Accounts
 */
router.post('/', async (req: { body: accountInterface }, res) => {
    try {
        const { cpf, balance } = req.body
        // criar verificacao de inputs
        let clientId
        // verifies if client exists
        const clientCheck = (await getDocs(query(collection(db, 'clients'), where('cpf', '==', Number(cpf)))))
            .forEach(a => { if (a) clientId = a.id })
        // if client exists, create account
        if (clientId) {
            // creating random account/agency number and checking if account already exists
            const accountAgency = Math.round(Math.random() * 1000)
            const accountNumber = async (suggestion?: number): Promise<Number> => {
                if (!suggestion) {
                    let random = Math.round(Math.random() * 10000)
                    const numberQuery = (await getDocs(query(collection(db, 'accounts'), where('accountNumber', '==', random)))).empty;
                    return numberQuery ? accountNumber(random) : accountNumber();
                }
                return suggestion.valueOf()
            }
            const accountData = {
                clientId: clientId,
                cpf: cpf,
                balance: balance ? balance : 0,
                accountNumber: (await accountNumber()).valueOf(),
                accountAgency: accountAgency,
                active: true
            }
            await addDoc(collection(db, 'accounts'), accountData)
                .then(a => {
                    res.status(200).send({
                        message: `Successful Account creation!`,
                        data: accountData
                    })
                })
                .catch(err => {
                    res.status(400).send({
                        message: `There was an error during Account creation`
                    })
                })
        } else {
            res.status(404).send({
                message: `There is no Client with cpf ${cpf}.`
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
})

/**
 * DELETE - Deletes an Account using its Number and Agency
 */
router.delete('/', async (req, res) => {
    try {
        const { accountNumber, accountAgency } = req.body
        let accountId
        // verifies if account exists
        const accountQuery = (await getDocs(query(
            collection(db, 'accounts'),
            where('accountNumber', '==', Number(accountNumber)),
            where('accountAgency', '==', Number(accountAgency))
        ))).forEach(a => { if (a) accountId = a.id })
        // if client exists, perform deletion
        if (accountId) {
            await deleteDoc(doc(db, "accounts", accountId))
            res.status(200).send({
                message: `Successfully deleted Account!`,
                accountNumber: accountNumber,
                accountAgency: accountAgency,
                accountId: accountId
            })
        } else {
            res.status(404).send({
                message: `There are no Accounts with these credentials.`
            })
        }
    } catch (err) {
        res.status(400).send(err)
    }
});
/** --------------------- */



module.exports = router
