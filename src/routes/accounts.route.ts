import { Router } from "express"
import firebaseConfig from '../firebaseconfig.json';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore';
import * as cors from "cors"

initializeApp({
    "apiKey": "AIzaSyCC05YMJlNCQWc9FXIDCKuZbhnnWN7PE2U",
    "authDomain": "api-digital-account-dock.firebaseapp.com",
    "projectId": "api-digital-account-dock",
    "storageBucket": "api-digital-account-dock.appspot.com",
    "messagingSenderId": "629115084928",
    "appId": "1:629115084928:web:7aecd3a5d28336737b0665"
});
const firestore = getFirestore();

const escolhido = doc(firestore, 'collection-test/uogrU5o0AOFi3UITuPIF')


const qwe = async function inserirDoc() {
    const ler = await getDocs(collection(firestore, 'collection-test'))
    // console.log(ler.data())
    // ler.forEach( (doc) => {
    //     console.log(doc.data())
    // })
    // const data = {
    //     descricao: 'qweqweq',
    //     price: 123,
    //     vegan: false
    // }
    // setDoc(escolhido, data)
}
// inserirDoc()

const router = Router()

// router.use(cors({ origin: true }))

router.get('/', async (req, res) => {
    try {
        
        res.status(200).send(qwe())
    } catch (err) {
        res.status(400).send(err)
    }
});

module.exports = router
