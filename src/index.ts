const express = require('express')
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json())
// app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))

/**
 * Test route
 */
app.get("/", (req: any, res: any) => {
  res.status(200).json({
    message: 'Ping! Please choose a specific route: /api/accounts or /api/clients'
  })
});

/**
 * Digital accounts CRUD route
 */
app.use("/api/accounts", require('./routes/accounts.route'));

/**
 * Client CRUD route
 */
app.use("/api/clients", require('./routes/clients.route'));

app.listen(8000, function () {
  console.log("Server started on port 8000.")
})