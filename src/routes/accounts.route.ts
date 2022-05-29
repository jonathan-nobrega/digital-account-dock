import cors from "cors"
import { Router } from "express"
import firebaseConfig from '../firebaseconfig.json';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, doc, getDocs,
    getDoc, DocumentData, query, where, addDoc, deleteDoc
} from 'firebase/firestore';
import accountInterface from "../models/account.model";

/**
 * Initiallizing Firebase/Firestore credentials and Express Router
 */
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

// Rotas basicas

// get todas accounts
// get accounts especifica

// criar account
/**
 * POST - Create a new record at Clients
 */
router.post('/', async (req: { body: accountInterface }, res) => {
    try {
        const { cpf, balance } = req.body
        // criar verificacao de inputs
        let clientId
        // verifies if client exists
        const clientCheck = (await getDocs(query(collection(db, 'clients'), where('cpf', '==', Number(cpf)))))
            .forEach(a => {
                if (a) clientId = a.id
            })
        // creating random account/agency number and checking if account already exists
        const accountAgency = Math.random() * 1000
        const accountNumber = async function (suggestion?: number): Promise<any> {
            if (!suggestion) {
                let random = Math.random() * 1000 + 1000;
                (await getDocs(query(collection(db, 'accounts'), where('accountNumber', '==', random))))
                    .forEach(a => { 
                        if (a) return accountNumber() 
                    })
            }
            if (suggestion) return suggestion
        }
        console.log(accountAgency)
        console.log(accountNumber())

        // // if client exists, create account
        // if (clientId) {
        //     await addDoc(collection(db, 'accounts'), {
        //         clientId: clientId,
        //         cpf: cpf,
        //         balance: balance ? balance : 0,
        //         accountNumber: '',
        //         accountAgency: accountAgency,
        //         active: true
        //     })
        //     // await deleteDoc(doc(db, "clients", clientId))
        //     // res.status(200).send({
        //     //     message: `Successfully deleted Client with CPF ${cpf}`
        //     // })
        // } else {
        //     // res.status(404).send({
        //     //     message: `There is no Client with cpf ${cpf}.`
        //     // })
        // }
        res.end()
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
});


// deletar account

// Rotas requeridas
// ativar ou inativar a conta
// executar saque
// executar deposito
// emitir extrato baseado em período

module.exports = router
