import cors from "cors"
import { Router } from "express"
import firebaseConfig from '../firebaseconfig.json';
import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, doc, setDoc, getDocs,
    getDoc, DocumentData, query, where, addDoc
} from 'firebase/firestore';
import clientInterface from '../models/client.model'

/**
 * Initiallizing Firebase credentials and Firestore database access
 */
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
 * GET - Read a specific record from Clients
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
        const clientQuery = await query(collection(db, 'clients'), where('cpf', '==', cpf))
        const queryEmpty = (await getDocs(clientQuery)).empty

        if((typeof name) != 'string' || (typeof cpf) != 'number' || cpf.toString().length != 11)  {
            res.status(401).send({
                message: 'Invalid data. Please verify if "name" is string and "cpf" is number and 11 characters long'
            })
        }
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

// DELETE account


module.exports = router