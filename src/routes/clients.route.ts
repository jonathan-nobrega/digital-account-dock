import cors from "cors"
import { Router } from "express"
import firebaseConfig from '../firebaseconfig.json';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, doc, getDocs,
    getDoc, DocumentData, query, where, addDoc, deleteDoc
} from 'firebase/firestore';
import clientInterface from '../models/client.model'

/** Initiallizing Firebase/Firestore credentials and Express Router */
initializeApp(firebaseConfig);
const db = getFirestore();
const router = Router()
router.use(cors({ origin: true }))

/**
 * GET - Read all records from Clients
 */
router.get('/', async (req, res) => {
    try {
        let result: DocumentData[] = []
        await getDocs(collection(db, 'clients'))
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
 * GET - Read a specific record from Clients AAAARRUMMMAAAAAR
 */
router.get('/:clientId', async (req: any, res) => {
    try {
        const { clientId } = req.params
        const document = await getDoc(doc(db, 'clients', clientId))
        if (document.exists()) {
            res.status(200).send(document.data())
        } else {
            res.status(404).send({
                message: 'No such document!'
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
});

/**
 * POST - Create a new record at Clients
 */
router.post('/', async (req: { body: clientInterface }, res) => {
    try {
        const { name, cpf } = req.body

        // checks input requirements
        if ((typeof name) != 'string' || (typeof cpf) != 'number' || cpf.toString().length != 11) {
            res.status(401).send({
                message: 'Invalid data. Please verify if "name" is string and "cpf" is number and 11 characters long'
            })
        }
        // verifies if client already exists
        const clientQuery = await query(collection(db, 'clients'), where('cpf', '==', cpf))
        const queryEmpty = (await getDocs(clientQuery)).empty

        if (queryEmpty == false) {
            res.status(401).send({
                message: `Client with cpf ${cpf} already exists.`
            })
        } else {
            await addDoc(collection(db, 'clients'), {
                name: name,
                cpf: cpf
            })
                .then(a => {
                    res.status(200).send({
                        message: `New client ${a.id} inserted.`,
                        data: req.body
                    })
                })
                .catch(err => {
                    res.status(401).send(err)
                })
        }
    } catch (err) {
        console.log(err)
        res.status(400).send(err)
    }
});

/**
 * DELETE - Deletes a Client using its CPF
 */
router.delete('/:cpf', async (req, res) => {
    try {
        const { cpf } = req.params
        let clientId
        // verifies if client exists
        const clientQuery = query(collection(db, 'clients'), where('cpf', '==', Number(cpf)));
        const execute = (await getDocs(clientQuery))
            .forEach(a => {
                if (a) clientId = a.id
            })
        // if client exists, perform deletion
        if (clientId) {
            await deleteDoc(doc(db, "clients", clientId))
            res.status(200).send({
                message: `Successfully deleted Client with CPF ${cpf}`
            })
        } else {
            res.status(404).send({
                message: `There is no Client with cpf ${cpf}.`
            })
        }
    } catch (err) {
        res.status(400).send(err)
    }
});


module.exports = router