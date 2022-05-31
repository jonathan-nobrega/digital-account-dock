const express = require('express')
const cors = require('cors')
const app = express();
var
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
import * as swaggerDocument from './swagger.json'
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

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DOCK Challenge | Digital Account",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger.",
      contact: {
        name: "Jonathan Moraes",
        url: "https://github.com/moraesjon/",
        email: "eng.jonathan.moraes@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000/api/accounts",
      },
    ],
  },
  apis: ["/routes/accounts.route.ts"],
};
const specs = swaggerJsdoc(options);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

app.listen(8000, function () {
  console.log("Server started on port 8000.")
})