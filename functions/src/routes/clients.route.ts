import * as express from "express"
import * as cors from "cors"
var firebaseConfig = require('../firebaseconfig.json')
const firebase = require("firebase/app");
require("firebase/firestore");

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()

const app = express()
app.use(cors({ origin: true }))

/**
 * Fetches all Clients on database
 */
app.get('/', async (req, res) => {
    try {
        console.log('Fetching all clients..')
        console.log(db.collection('collection-teste'))

        res.status(200).send('ok')
    } catch (err) {
        console.error(err)
        res.status(400).send(err)
    }
});



module.exports = app



