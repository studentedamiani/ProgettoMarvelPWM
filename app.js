/*Inizio import dei moduli necessari attraverso la sintassi ES6*/
import express from "express";
//import cors from "cors";
import path from 'path';
import 'dotenv/config';
import { marvel } from "./config/prefs.js";
import * as database from './lib/database.js';
import * as marvel_API from './lib/marvel.js';
import * as Utils from './lib/utils.js';
import {
  serve as swaggerUiServe,
  setup as swaggerUiSetup,
} from "swagger-ui-express"
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './lib/api/docs/swagger_output.json'assert { type: 'json' };; // Specifica il percorso al tuo file Swagger JSON generato
/*Fine import dei moduli necessari attraverso la sintassi ES6*/


/*Dichiarazione variabili*/
global.max_characters;
global.db;
var app = express(); 
/*Indirizzamento della cartella alla quale puntare per renderizzare HTML*/
app.use(express.static(path.resolve('./public/')));
/*Metto in ascolto il server sulla porta definita a livello di .ENV*/
app.listen(process.env.PORT);
// Middleware per servire la documentazione API tramite Swagger UI
app.use('/api-docs', swaggerUiServe, swaggerUi.setup(swaggerDocument));
var pluto;
marvel_API.returnCharactersNumber().then(response => {pluto = response; 
  global.max_characters = pluto.data.total;
})


/*Vuol dire che espone al percorso "/lib" con chiesta req e risposta res quello che c'è dentro la funzione.*/
app.get("/lib",(req,res) => {
 var pippo = '';//= 'limit=1&';
  console.log("max_characters "+(global.max_characters));
  //var pippo = "limit=9&";
  //for (let i = 0; i < 5; i++) {
    marvel_API.getFromMarvel(req ,'public/characters',pippo)
      .then(response => {res.send(response);})
      //.catch( res.sendStatus(500)/* new Error('Parameter is not a number!');*/)
  //}
 
 
})

app.get("/db",(req,res) => {
  database.run()
                .then(res.sendStatus(200))
                .catch(res.sendStatus(500));
})



