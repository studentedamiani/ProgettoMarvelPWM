/*Inizio import dei moduli necessari attraverso la sintassi ES6*/
import express from "express";
//import cors from "cors";
import path from 'path';
import 'dotenv/config';
import { marvel } from "./config/prefs.js";
import * as database from './lib/database.js';
import * as marvel_API from './lib/marvel.js';
import * as Utils from './lib/utils.js';
import * as register from './lib/register.js';
import {
  serve as swaggerUiServe,
  setup as swaggerUiSetup,
} from "swagger-ui-express"
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './lib/api/docs/swagger_output.json'assert { type: 'json' };; // Specifica il percorso al tuo file Swagger JSON generato
/*Fine import dei moduli necessari attraverso la sintassi ES6*/

/*Dichiarazione variabili globali*/
global.max_characters;
global.db;
var app = express(); 
app.use(express.json());
/*******************FETCH*************/
/*Indirizzamento della cartella alla quale puntare per renderizzare HTML*/
app.use(express.static(path.resolve('./public/')));
/*Enpoint per la pagina base*/
app.get('/',async (_, res) => {
  // #swagger.tags = ['fetch']
  // #swagger.description = 'Endpoint that allows to obtain index.html page'
   res.sendFile(path.resolve("./public/html/index.html"));
});
/*Endpoint per la pagina di package*/
app.get('/package',(req,res) => {
  // #swagger.tags = ['fetch']
  // #swagger.description = 'Endpoint that allows to obtain the package page.
  res.sendFile(path.resolve("./public/html/package.html"));
});
app.get('/card', async (req, res) => {
  // #swagger.tags = ['fetch']
  // #swagger.description = 'Endpoint that allows to fetch the login modal page with the id of the card'
  res.sendFile(path.resolve("./public/html/card_detail.html"));
});
/*Endpoint per la pagina dell'utente*/
app.get('/user', async (req, res) => {
  // #swagger.tags = ['fetch']
  // #swagger.description = 'Endpoint that allows to fetch the user mangae page'
  res.sendFile(path.resolve("./public/html/user_profile.html"));
});
/*Endpoint per la modal di login*/
app.get('/login', async (req, res) => {
  // #swagger.tags = ['fetch']
  // #swagger.description = 'Endpoint that allows to fetch the login modal page'
  res.sendFile(path.resolve("./public/html/login.html"));
});
/*Endpoint per la pagina di registrazione*/
app.get('/register', async (req, res) => {
  // #swagger.tags = ['fetch']
  // #swagger.description = 'Endpoint that allows to fetch the login modal page'
  res.sendFile(path.resolve("./public/html/register.html"));
});
/*Endpoint per la test pagine*/
app.get('/test', async (req, res) => {
  // #swagger.tags = ['fetch']
  // #swagger.description = 'Endpoint that allows to fetch the test page'
  res.sendFile(path.resolve("./public/html/test_page.html"));
});
/*************FINE FETCH***************/

/***********GESTIONE SWAGGER***********/
app.use('/api-docs', swaggerUiServe, swaggerUiSetup(swaggerDocument));
var pluto;
marvel_API.returnCharactersNumber().then(response => {pluto = response; 
  global.max_characters = pluto.data.total;
});
/********FINE GESTIONE SWAGGER*********/

// Middleware per servire la documentazione API tramite Swagger UI

/*database.check_db_connection()
.then(console.log("Ok"))
.catch(sendStatus(500));
*/


app.get("/db",(req,res) => {

})


app.post("/register", async (req, res) => {
  try {
    console.log("Registrazione avviata....");
    console.log(req.body);
    console.log("SCEMO SCEMO");
    const { username, password } = req.body ;
    console.log(username);
    //const result = await
     register.register(res,req.body);
    //res.status(result.status).json(result);
    console.log("Registrazione avvenuta con successo");
    //res.status(200).json({ message: 'Registration successful' });
   // res.send("Registrazione avvenuta con successo");
    
  } catch (error) {
    console.log("Errore di registrazione");//res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/package',(req,res) => {
  // #swagger.tags = ['fetch']
  // #swagger.description = 'Endpoint to get a package of characters'
  marvel_API.returnPackage(5).then(response => {res.send(response);})
});

/**/
app.post('/check-db', async (req, res) => {
  const result = await database.check_db_connection();
  res.status(result.status).json(result);
});

app.post("/characters",(req,res) => {
     marvel_API.getFromMarvel(req ,'public/characters',req.query.query)
       .then(response => {res.send(response);})
 });

/************ATTIVAZIONE APP***********/
/*Metto in ascolto il server sulla porta definita a livello di .ENV*/
app.listen(process.env.PORT);