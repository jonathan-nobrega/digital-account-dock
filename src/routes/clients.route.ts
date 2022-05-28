import { Router } from "express"
import * as cors from "cors"
// var firebaseConfig = require('../firebaseconfig.json')
// import firebase from "firebase/app";
require("firebase/firestore");

// firebase.initializeApp(firebaseConfig);
// const db = firebase

const router = Router()

// router.use(cors({ origin: true }))

router.get('/', async (req, res) => {

});



module.exports = router
