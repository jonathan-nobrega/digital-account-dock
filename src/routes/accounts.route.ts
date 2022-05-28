import { Router } from "express"
import firebaseConfig from '../firebaseconfig.json';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore';
import cors from "cors"

/**
 * Initiallizing Firebase credentials and Firestore database access
 */
initializeApp(firebaseConfig);
const firestore = getFirestore();

const router = Router()
router.use(cors({ origin: true }))

/**
 * Get all records from Accounts
 */
router.get('/', async (req, res) => {
    try {

        await getDocs(collection(firestore, 'collection-test'))
            .then(a => {
                a.forEach(b => {
                    console.log(b.data())
                })
            })

        res.status(200).send()
    } catch (err) {
        res.status(400).send(err)
    }
});

// GET todas accounts
// GET accounts especifico
// POST nova account
// DELETE account


module.exports = router
