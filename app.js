// Import dei moduli necessari utilizzando il sistema di moduli ES6

import express from "express";
import cors from "cors";
//import { config } from "./src/api/docs/config/prefs.js";
//import { fileURLToPath } from 'url';
//import { dirname } from 'path';
import path from 'path';
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = dirname(__filename);
//import {
//   serve as swaggerUiServe,
//   setup as swaggerUiSetup,
//} from "swagger-ui-express";
//import 'dotenv/config'

//var express = require('express'),
var app = express(); 
app.use(express.static(path.resolve('./public/')));
app.listen(666);


//import { login,authuser } from "./src/lib/login.js";
//import { getUsers, getUser, updateUser, deleteUser } from "./src/lib/user.js";
//import { Db } from "./src/lib/database.js";
//import { join } from "path";
//import { register } from "./src/lib/register.js";
//import { search, getGenres, getRecommended, getTrack } from "./src/lib/spotify/fetch.js"
//import * as playlist from "./src/lib/playlist.js";
//import * as community from "./src/lib/community.js";
//import * as utils from "./src/lib/utils.js";

//import swaggerUi from 'swagger-ui-express';
//import swaggerDocument from './src/api/docs/swagger_output.json'assert { type: 'json' };; // Specifica il percorso al tuo file Swagger JSON generato

// Creazione di un'istanza di Express per l'applicazione
/*const app = express();
//utils.createLogFolder();
// Middleware per il parsing dei dati JSON e abilitazione del CORS



app.use(express.json());
const corsOptions = {
   origin: 'http://localhost:3000', // Indirizzo del tuo frontend
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true, // Consenti l'invio dei cookie
 };
*/
 // Usa il middleware cors
// app.use(cors(corsOptions));


// Middleware per servire la documentazione API tramite Swagger UI
//app.use('/api-docs', swaggerUiServe, swaggerUiSetup(swaggerDocument));

// Middleware per servire file statici
//app.use(express.static(config.__dirname));
//app.use(express.static(join(config.__dirname, "/src/")));
//app.use(express.static(join(config.__dirname, "/src/config/")));
//app.use(express.static(join(config.__dirname, "/src/public/")));
//app.use(express.static(join(config.__dirname, "/src/Html/")));
