/*Start of import of necessary modules through ES6 syntax*/
import express from "express";
import path from 'path';
import 'dotenv/config';
import { marvel } from "./config/prefs.js";
import * as database from './lib/database.js';
import * as marvel_API from './lib/marvel.js';
import * as Utils from './lib/utils.js';
import * as register from './lib/register.js';
import { login } from './lib/login.js';
import {
  serve as swaggerUiServe,
  setup as swaggerUiSetup,
} from "swagger-ui-express"
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './lib/api/docs/swagger-output.json'assert { type: 'json' };; // Specify the path to your generated Swagger JSON file
/*End of import of necessary modules through ES6 syntax*/

/*Global variable declaration*/
global.db;
/*End of global variable declaration*/
/*Start of the declaration of the express app*/
var app = express(); 
app.use(express.json());
/*End of the declaration of the express app*/

/*******************FETCH*************/
/*This section contains the endpoints for the fetch of the various pages of the application*/
/* Folder routing for HTML rendering */
app.use(express.static(path.resolve('./public/')));
/*Enpoint for the base page*/
app.get('/',async (_, res) => {
  // #swagger.tags = ['fetch']
  // #swagger.description = 'Endpoint that allows to obtain index.html page'
   res.sendFile(path.resolve("./public/html/index.html"));
});
/*Endpoint for the package page*/
app.get('/package',(req,res) => {
  // #swagger.tags = ['cards']
  // #swagger.description = 'Endpoint that allows to obtain the package page.
  res.sendFile(path.resolve("./public/html/package.html"));
});
/*Endpoint for the card page*/
app.get('/card', async (req, res) => {
  // #swagger.tags = ['cards']
  // #swagger.description = 'Endpoint that allows to fetch the login modal page with the id of the card'
  res.sendFile(path.resolve("./public/html/card_detail.html"));
});
/*Endpoint for the user manage page*/
app.get('/user', async (req, res) => {
  // #swagger.tags = ['users']
  // #swagger.description = 'Endpoint that allows to fetch the user manage page'
  res.sendFile(path.resolve("./public/html/user_profile.html"));
});
/*Endpoint for the login modal page*/
app.get('/login', async (req, res) => {
  // #swagger.tags = ['users']
  // #swagger.description = 'Endpoint that allows to fetch the login modal page'
  res.sendFile(path.resolve("./public/html/login.html"));
});
/*Endpoint for the user registration page*/
app.get('/register', async (req, res) => {
  // #swagger.tags = ['users']
  // #swagger.description = 'Endpoint that allows to fetch the user registration page'
  res.sendFile(path.resolve("./public/html/register.html"));
});
/*Endpoint for the album page*/
app.get('/album', async (req, res) => {
  // #swagger.tags = ['cards']
  // #swagger.description = 'Endpoint that allows to fetch the album page'
  res.sendFile(path.resolve("./public/html/album.html"));
});
/*Endpoint for the exchange page*/
app.get('/exchange', async (req, res) => {
  // #swagger.tags = ['cards']
  // #swagger.description = 'Endpoint that allows to fetch the exchange page'
  res.sendFile(path.resolve("./public/html/exchange.html"));
});
/*Endpoint for the credits buying*/
app.get('/get-credits', async (req, res) => {
  // #swagger.tags = ['users']
  // #swagger.description = 'Endpoint that allows to fetch the page to buy credits'
  res.sendFile(path.resolve("./public/html/get_credits.html"));
});
/*Endpoint for test page DEVONLY*/
app.get('/test', async (req, res) => {
  // #swagger.tags = ['test']
  // #swagger.description = 'Endpoint that allows to fetch the test page - DEVONLY'
  res.sendFile(path.resolve("./public/html/test_page.html"));
});
app.get('/print-credits/:username', async (req,res) => {
  // #swagger.tags = ['cards']
  // #swagger.description = 'Endpoint to get a package of characters'
  console.log(req.params.username);
await database.get_Credits(req.params.username).then(response => {res.send(response);})
});
/*************END OF FETCH***************/

/***********SWAGGER MAAGEMENT***********/
app.use('/api-docs', swaggerUiServe, swaggerUiSetup(swaggerDocument));
/*******END OF SWAGGER MANAGEMENT*********/

/* ****************** API ENDPOINTS ****************** */
app.get("/db",(req,res) => {
  // #swagger.tags = ['database']
  // #swagger.description = 'Endpoint that allows to register a new user'
})

/* ****************** POST ENDPOINTS ****************** */
/*Endpoint to registrer a user*/
app.post("/register", async (req, res) => {
  // #swagger.tags = ['auth']
  // #swagger.description = 'Endpoint that allows to register a new user'
   /* #swagger.parameters['body'] = {
	      in: 'body',
         description: 'Body to be registered in the DB.',
         type: 'object',
         schema: { $ref: "#/definitions/registerrequest" }
      }
*/
/* #swagger.responses[200] = {
         description: 'succesfully registered.'
      }
      #swagger.responses[400] = {
         description: 'User already exists, invalid parameter'
      }
      #swagger.responses[500] = {
         description: 'Generic error'
      }
      */
  try {
     await register.register(res,req.body);
  } catch (error) {
    console.error("Registration error");
  }
});
/*Endpoint to get a package of cards*/
app.post('/package',(req,res) => {
  // #swagger.tags = ['cards']
  // #swagger.description = 'Endpoint to get a package of characters'
  marvel_API.returnPackage(req.body).then(response => {res.send(response);})
});

/*Endpoint to get a buy credits*/
app.post('/edit-credits',(req,res) => {
  // #swagger.tags = ['users']
  // #swagger.description = 'Endpoint to buy credits'

  /* #swagger.parameters['body'] = {
    in: 'body',
    description: 'Body containing credit variation information',
    type: 'object',
    schema: { $ref: "#/definitions/creditrequest" }
     }
  */
  /* #swagger.responses[200] = {
    description: 'Credits successfully updated'
     }
     #swagger.responses[400] = {
    description: 'Invalid parameters or insufficient credits'
     }
     #swagger.responses[500] = {
    description: 'Internal server error'
     }
  */
  database.variate_credits(req.headers).then(response => {res.send(response);})
});

/*Endpoint to check the connection to the database*/
app.post('/check-db', async (req, res) => {
    // #swagger.tags = ['database']
  // #swagger.description = 'Endpoint to check the connection to the database'
  const result = await database.check_db_connection();
  res.status(result.status).json(result);
});
/*Endpoint to get the characters from the Marvel API*/
app.post("/characters",(req,res) => {
  // #swagger.tags = ['cards']
  // #swagger.description = 'Endpoint to check get characters from Marvel API'
     marvel_API.getFromMarvel(req ,'public/characters',req.query.query)
       .then(response => {res.send(response);})
 });

/* ****************** AUTHENTICATION  ****************** */
/*Endpoint to login a user*/
app.post("/login", async (req, res) => {
  // #swagger.tags = ['auth']
  // #swagger.description = 'Endpoint that allows to check if user's login data is correct and valid for logging in the application'
  /* #swagger.parameters['body'] = {
       in: 'body',
        description: 'Body to validate login.',
        type: 'object',
        schema: { $ref: "#/definitions/loginrequest" }
     }
*/
  /* 
     #swagger.responses[200] = {
        schema: { $ref: "#/definitions/loggeduser" },
        description: 'User login data is valid'
     }
     #swagger.responses[401] = {
        description: 'User not authorized'
     }
     #swagger.responses[400] = {
        description: 'Data is not valid, missing parameter'
     }
     #swagger.responses[500] = {
        description: 'Internal error'
     }
     */
  login(req, res);
});


/************APP ACTIVATION***********/
/*Start the server on the port defined in the .env file*/
app.listen(process.env.PORT);
/************STARTUP CHECK************/
database.check_db_connection()
  .then(console.log("Database connection successful"))
  .catch(error => console.error("Database connection failed:", error));