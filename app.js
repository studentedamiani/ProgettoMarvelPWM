// Import dei moduli necessari utilizzando il sistema di moduli ES6

import express from "express";
//import cors from "cors";
import path from 'path';
import { MongoClient } from 'mongodb';

//var express = require('express'),
var app = express(); 
app.use(express.static(path.resolve('./public/')));
app.listen(666);

/*Manage the connection to database*/
// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'myDatabase';

async function main() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);

        // Perform operations
        const collection = db.collection('myCollection');
        const documents = await collection.find({}).toArray();
        console.log(documents);
    } catch (err) {
        console.error(err);
    } finally {
        // Ensure the client is closed
        await client.close();
    }
}

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