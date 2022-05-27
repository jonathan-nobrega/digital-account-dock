import { https, logger } from "firebase-functions";


/**
 * Test
 */
export const ping = https.onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.json({
      status: 200,
      message: "PING! It's working.."
  });
});

/**
 * Client CRUD route
 */
 export const clients = https.onRequest(async (request, response) => {
    const route = await require("./routes/clients.route")
    return await route(request, response)
})

// /**
//  * Digital accounts CRUD route
//  */
//  export const accounts = https.onRequest(async (request, response) => {
//     const route = await require("./routes/accounts.route")
//     return await route(request, response)
// })