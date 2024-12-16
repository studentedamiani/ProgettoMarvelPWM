// Import dei moduli necessari utilizzando il sistema di moduli ES6

import express from "express";
//import cors from "cors";
import path from 'path';
import { MongoClient, ServerApiVersion } from 'mongodb';
import 'dotenv/config';
import { marvel } from "./config/prefs.js";
import * as marvel_API from './public/scripts/marvel.js';

//var express = require('express'),
var app = express(); 
app.use(express.static(path.resolve('./public/')));
app.listen(process.env.PORT);

/*Manage the connection to database*/
// Crea un'istanza di MongoClient con un oggetto MongoClientOptions per impostare la versione Stable API
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?${process.env.DB_OPTIONS}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
    }
});
async function run() {
  try {
    // Connessione al server (opzionale a partire dalla versione v4.7)
    await client.connect();
    // Invia un ping per confermare una connessione avvenuta con successo
    await client.db("PWMDB").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    await client.db("PWMDB").createCollection("customers", function(err, res) {
      if (err) throw error;
      console.log("Collection not created!");
    });
    console.log("Collection created successfully!");
    var myobj = { name: "Company Inc", address: "Highway 37" };
    client.db("PWMDB").collection("customers").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      //db.close();
    });
    console.log("1 document inserted");

  }
  catch (error) {
    console.error('Connection to MongoDB failed:', error);
    throw error;
  } 
  finally {
    // Assicura che il client venga chiuso al termine
    await client.close();
  }
}

run().catch(console.dir);

/*

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
*/
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