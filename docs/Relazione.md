<!--toc:start-->
- [Introduzione](#introduzione)
    - [Autori](#autori)
    - [Link ed informazioni utili](#link-ed-informazioni-utili)
- [Struttura dell'Applicazione](#struttura-dellapplicazione)
  - [Front-End](#front-end)
  - [Back-End](#back-end)
    - [NODEJS](#nodejs)
      - [COS'E' NODEJS ED  EXPRESS](#cose-nodejs-ed--express)
      - [FILE NODEJS](#file-nodejs)
    - [DATABASE MONGODB](#database-mongodb)
      - [COMMUNITY](#community)
        - [DESCRIZIONE](#descrizione)
        - [VALIDAZIONE JSON](#validazione-json)
        - [ATTRIBUTI](#attributi)
      - [PLAYLISTS](#playlists)
        - [VALIDAZIONE JSON](#validazione-json-1)
        - [ATTRIBUTI](#attributi-1)
      - [USERS](#users)
        - [DESCRIZIONE](#descrizione-1)
        - [VALIDAZIONE JSON](#validazione-json-2)
        - [ATTRIBUTI](#attributi-2)
- [Configurazione dell'applicazione](#configurazione-dellapplicazione)
- [Scelte implementative e features](#scelte-implementative-e-features)
  - [Swagger JS](#swagger-js)
        - [FILE SWAGGER.JS](#file-swaggerjs)
        - [INTERFACCIA GRAFICA SWAGGER](#interfaccia-grafica-swagger)
        - [INSTALLAZIONE](#installazione)
  - [Documentazione JavaScript-Doc](#documentazione-javascript-doc)
        - [Esempio commento JavaDoc](#esempio-commento-javadoc)
  - [Gestione codici HTTP](#gestione-codici-http)
        - [ESEMPIO DI GESTIONE](#esempio-di-gestione)
  - [Lingua](#lingua)
<!--toc:end-->

# Introduzione

Questo documento rappresenta la relazione del progetto "Album delle figurine dei super eroi", sviluppato nel contesto del corso "Programmazione Web e mobile" durante l'anno accademico 2024/2025.

### Autore
Il progetto è stato realizzato da:

- [Stefano Damiani](https://github.com/studentedamiani) (Matricola: 976496)

### Link ed informazioni utili
- La pagina GitHub del progetto si trova a <a href="https://github.comstudentedamianiProgettoMarvelPWM">questo link</a>
# Struttura dell'Applicazione

## Front-End
> **Front End:** 
Il Front-End è la parte dell'applicazione che si occupa dell'interfaccia utente e dell'interazione con l'utente. Si concentra sulla progettazione e sull'implementazione dell'aspetto visivo dell'applicazione e sulla gestione delle interazioni utente.

All'interno della directory `/public/`, sono presenti i seguenti elementi principali:

- `/html/` Questa directory contiene i file HTML che vengono renderizzati da browser, determinando quindi interfaccia grafica dell'applicazione.

- `/css/`: Questa directory contiene i file di stile che definiscono l'aspetto visivo dell'applicazione. Alcuni dei file principali includono:
  - /public/css/style.css - _Questo file definisce lo stile generale dell'applicazione_
  -  /public/css/card.css - _Questo file definisce lo stile che riguarda le figurine e tutti i personaggi_

- `/scripts/`: Questa directory contiene file JavaScript che gestiscono la logica del Front-End. Alcuni dei file principali includono:
  - /public/scripts/theme.js - _Questo file si occupa di adattare il tema dell'applicazione a quello definito dal sistema dell'utente_
  - /public/scripts/navbar.js - _Questo file si occupa di definire la barra di navigazione sulle pagine in cui è richiesta e gestisce il caricamento della pagina di login e verifica quando l'utente è loggato._ **TODO: Ricordasi di parlare di questo anche dopo e giustificare con il fatto che così non devo caricare sempre il file per il login che espone più cose visto che tanto questo lo devo caricare lo stesso**
  - /public/scripts/login.js - _Questo file si occupa di tutte le operazioni necessarie al login dell'utente_
  - /public/scripts/register.js - _Questo file si occupa delle operazioni necessarie alla registrazione di un utente. Si occupa anche di caricare i dati dei supereroi per fare selezionare all'utente il suo preferito_
  - /public/scripts/marvel.js - _Questo file si occupa di gestire la maggior parte di ciò che riguarda i personaggi Marvel._

La suddivisione chiara tra file HTML, file CSS e file JavaScript consente una gestione efficiente del Front-End e garantisce un'esperienza utente di alta qualità.

Per ulteriori dettagli sull'implementazione del Front-End, si rimanda alle specifiche sezioni dei file e dei componenti menzionati sopra.

## Back-End
> **Back End:** 
Il Back-End è responsabile delle funzionalità e della logica dell'applicazione lato server. Esso comprende una serie di elementi chiave presenti nella nostra struttura di lavoro. Possiamo suddividere il backend in 3 sezioni principali

### NODEJS

#### COS'E' NODEJS ED  EXPRESS
**Node.js** ed **Express** costituiscono un binomio potente nell'ambito dello sviluppo web di applicazioni scalabili ed efficienti. <br>*Node.js* fornisce un ambiente runtime JavaScript server-side, ottimizzato per l'efficienza e la scalabilità. 
<br>*Express*, un framework web basato su Node.js, semplifica la creazione di applicazioni web, offrendo funzionalità come la gestione delle richieste HTTP e dell'autenticazione. <br>
**TODO:TOGLIERE / VERIFICARE Ulteriori info a questa [pagina](https://kevinm6.github.io/TecnologieLinguaggiWeb/#nodejs).**

#### FILE NODEJS

- `/lib/api/docs/`: In questa directory sono presenti i file utilizzati per la gestione della documentazione pubblica delle API dell'applicazione, inclusi:
  - swagger.js
  - swagger_output.js

- `/config/`: Questa cartella contiene i file dedicati alla configurazione dell'applicazione, ad eccezione delle variabili d'ambiente. Al suo interno, sono presenti:
  - prefs.js - _Questo file viene utilizzato per caricare i valori inseriti dall'utente in modo che siano direttamente utilizzabili
    **TODO:Capire se serve**

- `/src/lib/`: La directory lib contiene tutte le funzioni Node.js utilizzate per le funzionalità degli endpoint. Inoltre
Alcuni dei file e delle directory principali sono:
  - /src/lib/database.js
  - /src/lib/login.js
  - /src/lib/marvel.js
  - /src/lib/register.js
  - /src/lib/user.js **TODO:Da mettere**
  - /src/lib/utils.js

- `app.js`: Questo file rappresenta il punto di ingresso principale dell'applicazione, contenente le istruzioni per l'avvio dell'app e la definizione degli endpoint.

La struttura ben organizzata del Back-End garantisce una gestione efficiente delle funzionalità server-side e contribuisce al corretto funzionamento dell'applicazione.

### DATABASE MONGODB

Nel corso di sviluppo dell'applicazione, è stato fatto largo uso del database MongoDB. Qui di seguito, vengono presentate le collezioni sono state create e utilizzate per immagazzinare i dati essenziali dell'applicazione.

> **MongoDB:** MongoDB è un database NoSQL (non relazionale), flessibile e scalabile, noto per la sua struttura orientata ai documenti. Un documento è un record dati in formato BSON (Binary JSON) che può contenere dati di varie forme e dimensioni. Ogni documento è organizzato in *collezioni*, offrendo flessibilità nella modellazione dei dati.
Per lo sviluppo di questa applicazione è stato deciso di appoggiarsi ad una versione Hosted di MongoDB, fornita da Atlas ([Maggiori informazioni](https://www.mongodb.com/it-it/atlas))

Per questa applicazione sono state utilizzate le seguenti collections:
**TODO:Inserire screen o lista vedi tu**
![Alt text](./assets/image-2.png)

Di seguito viene riportata una descrizione delle collections, del loro schema di validation JSON e dei tipi di dato

> **Validazione JSON:** La validazione JSON è un processo cruciale per garantire che i dati immagazzinati nei database siano coerenti e rispettino gli standard dell'applicazione. Definendo regole specifiche per la struttura e il formato dei dati, la validazione riduce il rischio di errori e contribuisce all'affidabilità e all'integrità del sistema. 

#### COMMUNITY
##### DESCRIZIONE
La collezione *community* ha lo scopo di raccogliere informazioni relative alle comunità all'interno della nostra applicazione.

##### VALIDAZIONE JSON

``` json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": [
      "_id",
      "creatorId",
      "name"
    ],
    "properties": {
      "_id": {
        "bsonType": "objectId",
        "description": "_id must be an ObjectId and is required"
      },
      "creatorId": {
        "bsonType": "objectId",
        "description": "creatorId must be an ObjectId and is required"
      },
      "name": {
        "bsonType": "string",
        "description": "name must be a string and is required"
      },
      "desc": {
        "bsonType": "string",
        "description": "desc must be a string"
      },
      "members": {
        "bsonType": "array",
        "description": "members must be an array of ObjectIds"
      },
      "playlists": {
        "bsonType": "array",
        "description": "playlists must be an array of ObjectIds"
      }
    }
  }
} 
```

##### ATTRIBUTI
- **_id**: identificatore univoco di una community, di tipo ObjectId. È un campo obbligatorio per identificare univocamente una community nel db.

- **creatorId**: identificatore dell'utente creatore della community, di tipo ObjectId. È un campo obbligatorio e serve a linkare la community al suo creatore.

- **name**: nome della community, di tipo stringa. È un campo obbligatorio e contiene il nome della community.

- **desc**: rappresenta la descrizione della community, di tipo stringa. È un campo facoltativo e contiene una descrizione testuale della community.

- **members**: lista di membri della community, di tipo array. Contiene una serie di ObjectId che identificano gli utenti che fanno parte della community.

- **playlists**: lista di playlist associate alla community, di tipo **array**. Contiene una serie di ObjectId che identificano le playlist associate a questa community.

#### PLAYLISTS

**DESCRIZIONE**  
La collezione *playlists* è stata creata per rappresentare le playlist musicali all'interno della nostra applicazione. 

##### VALIDAZIONE JSON

``` json
{
  "$jsonSchema": {
     "bsonType": "object",
    "required": [
      "_id",
      "owner_id",
      "title"
    ],
    "properties": {
      "_id": {
        "bsonType": "objectId",
        "description": "_id must be a ObjectId and is required"
      },
      "owner_id": {
        "bsonType": "objectId",
        "description": "owner_id must be a ObjectId and is required"
      },
      "title": {
        "bsonType": "string",
        "description": "title must be a string and is required"
      },
      "description": {
        "bsonType": "string",
        "description": "name must be a string"
      },
      "tags": {
        "bsonType": "array",
        "description": "name must be an array of ObjectIds"
      },
      "songs": {
        "bsonType": "array",
        "description": "name must be a array of ObjectIds"
      }
    }
  }
}
```
##### ATTRIBUTI
- **_id**: identificatore univoco di una playlist, di tipo ObjectId. È un campo obbligatorio per identificare univocamente una playlist nel database.

- **owner_id**: identificatore dell'utente proprietario della playlist, di tipo ObjectId. È un campo obbligatorio e serve a linkare la playlist al suo proprietario.

- **title**: titolo della playlist, di tipo stringa. È un campo obbligatorio e contiene il titolo della playlist.

- **description**: descrizione della playlist, di tipo stringa. È un campo facoltativo e contiene una descrizione testuale della playlist.

- **tags**: lista di tag associati alla playlist, di tipo array. Contiene una serie di strings che identificano i tag associati a questa playlist.

- **songs**: lista di brani musicali presenti nella playlist, di tipo array. Contiene una serie di ObjectIds che identificano i brani musicali presenti in questa playlist.


#### USERS
##### DESCRIZIONE
La collezione *users* è destinata a contenere i dati degli utenti all'interno dell'applicazione. 

##### VALIDAZIONE JSON
```json
{
  "$jsonSchema": {
    "bsonType": "object",
    "required": [
      "_id",
      "username",
      "email",
      "password"
    ],
    "properties": {
      "_id": {
        "bsonType": "objectId",
        "description": "_id must be an ObjectId and is required"
      },
      "name": {
        "bsonType": "string",
        "description": "name must be a string and is required"
      },
      "username": {
        "bsonType": "objectId",
        "description": "username must be an ObjectId and is required"
      },
      "email": {
        "bsonType": "string",
        "description": "email must be a string and is required"
      },
      "password": {
        "bsonType": "string",
        "description": "password must be a string"
      },
      "date": {
        "bsonType": "string",
        "description": "date must be a string"
      },
      "genres": {
        "bsonType": "array",
        "description": "genres must be an array of ObjectIds"
      }
    }
  }
}

```
##### ATTRIBUTI
- **_id**: identificatore univoco di un utente, di tipo ObjectId. È un campo obbligatorio per identificare univocamente un utente nel database.

- **name**: nome dell'utente, di tipo stringa. È un campo obbligatorio e contiene il nome dell'utente.

- **username**: username dell'utente, di tipo ObjectId. È un campo obbligatorio e serve a collegare il soprannome dell'utente.

- **email**: indirizzo email dell'utente, di tipo stringa. È un campo obbligatorio e contiene l'indirizzo email dell'utente.

- **password**: password dell'utente, di tipo stringa. È un campo facoltativo e contiene la password dell'utente.

- **date**: data associata all'utente, di tipo stringa. È un campo facoltativo e contiene una data associata all'utente.

- **genres**: lista di generi musicali preferiti dall'utente, di tipo array. Contiene una serie di ObjectIds che identificano i generi musicali preferiti dall'utente.

# Configurazione dell'applicazione
Il progetto necessita di un file `.env` nella directory principale del dove sono contenuti i
parametri necessari per il funzionamento.
Il file `.env` è gestito attraverso il pacchetto npm [dotenv](https://www.npmjs.com/package/dotenv)
che si occupa di popolare le relative variabili d'ambienti e renderne semplice l'utilizzo e accesso
tramite JavaScript.

*Un esempio di file env*

```sh
# Server HOST and PORT
HOST='localhost'
PORT=666

# Parametri e Credenziali MongoDB
DB_USERNAME=your_database_user - #Pay attention, this is the App user, not the manageruser
DB_PASSWORD= your_database_user_password
DB_CLUSTER=link_to_your_cluster
DB_OPTIONS=retryWrites=true&w=majority&appName=your_app_name
DB_DBNAME = your_DB_NAME


# Parametri e Credenziali Marvel
BASE_URL=http://gateway.marvel.com/v1/
PUBLIC_KEY=YOUR_PUBLIC_KEY_FROM_MARVEL
PRIVATE_KEY=YOUR_PRIVATE_KEY_FOR_MARVEL
```

# Scelte implementative e features
## Swagger JS
>**Swagger:** è un framework open-source per la progettazione, la creazione e la documentazione di API RESTful. La sua utilità si concentra sulla semplificazione del processo di sviluppo API, consentendo agli sviluppatori di definire chiaramente le specifiche delle API, testarle e generare automaticamente documentazione dettagliata.

Per la generazione dello swagger ho utilizzato il module <a href="https://www.npmjs.com/package/swagger-autogen">swagger-autogen.</a>

Tramite la creazione di un file *swagger.js* (/lib/api/docs/) con una apposita configurazione e determinati commenti nella sezione degli endpoint, è possibile generare automaticamente una documentazione per gli endpoint.

è possibile visualizzare lo swagger generato all'endpoint **/api-docs**

##### FILE SWAGGER.JS 
>**NB**: Il codice riportato di seguito non è completo, rappresenta solo un esempio molto vicino a quello utilizzato in questa applicazione!
```javascript
import swaggerAutogen from 'swagger-autogen';
import { config } from "../../../config/prefs.js";
const outputFile = './swagger-output.json';
const endpointsFiles = ['../../*.js', '../../../app.js'];  

const doc = {
    "info": {
      "title": "Marvel Characters API",
      "description": "API for AFSE (Album delle Figurine dei Super Eroi)",
      "version": "1.0.0"
    },
    host: `${config.host}:${config.port}`,
    basePath: "/",
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      {
         "name": "fetch",
         "description": "Endpoints for fetching and searching content."
      },
      {
          "name": "users",
          "description": "Endpoints for the management of user data and related operations."
      },
      ...
    ]
    ,
    definitions: {
      user: {
          _id: "ObjectId('64df73b31e5eda5eb868ddcd')",
          name: "John",
          username: "Jhonny",
          surname: "Doe",
          email: "jhonny@example.com",
          password: "md5 hashed password",
          date: "2001-05-20",
          **TODO:DA SISTEMARE **genres: {
              0: "pop",
              1: "rock",
              2: "metal"
          }
      },
      playlists: {
        _id: "ObjectId('64e748f0cb18ad90657b9043')",
        owner_id: "ObjectId('64df73b31e5eda5eb868ddcd')",
        title: "Example Playlist",
        description: "Description of playlist",
        public: true,
        tags: {
            0: "chill",
            1: "relax",
            2: "vibes"
        },
        songs: {
           0:{
              title: "Song 1",
              artist: "Artist1, Artist2, Artist3",
              duraion: "00:01:11"
           },
           1:{
              title: "Song 2",
              artist: "Artist1, Artist2, Artist3",
              duraion: "00:02:22"
           },
           2:{
              title: "Song 3",
              artist: "Artist1, Artist2, Artist3",
              duraion: "00:03:33"
           }
        },
        private: true
    },
      updateuser: {
          $name: "Jhon",
          $username: "johndough",
          $email: "johndough@example.com",
          $surname: "Dough"
      },
      loggeduser: {
           $_id: "64df73b31e5eda5eb868ddcd",
           $username:"johndough",
           $email: "johndough@gmail.com"
      },
      song: {
        $_id: "78kf73b31e6yda5eb868dder",
        $artist:"['artist1','artist2']",
        $duration: "00:11:22", 
        $year: "1984",
        $album: "Album Name"
      },
      loginrequest: {
        email: "johndough@gmail.com",
        username:"johndough",        
        $password: "password"  
      },
      registerrequest: {
        $name: "John",
        $username: "johndough",
        $email: "johndough@example.com",
        $password: "password"
      },
      authuser:{
        $_id: "64df73b31e5eda5eb868ddcd",
        $username: "johndough",
        $email: "johndough@gmail.com"
      },
      removesong: {
        $playlist_id: "ObjectId('64e748f0cb18ad90657b9043')",
        $track_id: "78kf73b31e6yda5eb868dder",
        $owner_id: "ObjectId('64df73b31e5eda5eb868ddcd')"
      }
  }
    };


  const swagger = swaggerAutogen(outputFile, endpointsFiles, doc)
```
##### INTERFACCIA GRAFICA SWAGGER
![Alt text](./assets/image-3.png)
![Alt text](./assets/image-4.png)
![Alt text](./assets/image-5.png)
![Alt text](./assets/image-6.png)


##### INSTALLAZIONE
``` npm install --save-dev swagger-autogen ```<br>
ulteriori informazioni sono presenti al link sopra riportato

## Documentazione JavaScript-Doc
La maggior parte delle funzioni ( principalmente back-end ) in questa applicazione sono state descritte tramite la convenzione **jsdoc**
>La convenzione **JSDoc**, ampiamente utilizzata nella programmazione JavaScript, consiste nell'includere commenti strutturati nel codice per documentare funzioni, classi e metodi. Questi commenti migliorano la chiarezza del codice, facilitano la comprensione e consentono la generazione automatica di documentazione tecnica. Questo standard è cruciale per progetti complessi e la collaborazione tra sviluppatori.

##### Esempio commento JavaDoc
Di seguito un esempio di un commento utilizzando lo standard JavaDoc
**TODO:FIX **
```javascript
/**
 * Retrieves a playlist by its ID.
 * 
 * @description This function retrieves a playlist by its unique ID. 
 * It checks the validity of the  provided
 * playlist ID and returns the playlist data if found. 
 * If the playlist does not exist, it returns a 404 Not Found response.
 * In case of any unexpected errors, it sends a 500 Internal Server Error response.
 * @param {Object} res - The HTTP response object.
 * @param {string} playlistid - The ID of the playlist to retrieve.
 * 
 * @returns {void}
 * 
 * @throws {Object} 400 Bad Request if the playlist ID is missing or invalid.
 * @throws {Object} 404 Not Found if the playlist with the provided ID does not exist.
 * @throws {Object} 500 Internal Server Error if any unexpected error occurs during the operation.
 * 
 */
export async function getPlaylistFromId(res, playlistid) {
   if(playlistid==undefined){
      res.status(400).send("Missing playlist id");
      utils.log("[PLAYLIST]> getPlaylistFromId > ERROR 400: Missing playlist id");
      return;     
   }
   if(!utils.isValidString(playlistid)){
      res.status(400).send("Invalid playlistid");
      utils.log("[PLAYLIST]> getPlaylistFromId > ERROR 400: Invalid playlist id");
      return;     
   }
   try {
      const collection = await dbPlaylistCollection();
      const playlist = await collection.findOne({ _id: new ObjectId(playlistid) });
      if (!playlist) {
         res.status(404).send("Playlist not found");
         utils.log("[PLAYLIST]> getPlaylistFromId > ERROR 404: Playlist not found");
         return; 
      }

      res.json(playlist);
      utils.log("[PLAYLIST]> getPlaylistFromId > SUCCESS: SUCCESFULLY FETCHED PLAYLIST "+playlistid);
      return; 

   } catch (error) {
      res.status(500).send("INTERNAL ERROR");
      utils.log("[PLAYLIST]> getPlaylistFromId > ERROR 500: INTERNAL ERROR "+error);
      return; 
   }
}
```

---

## Gestione codici HTTP

>I codici HTTP sono standard utilizzati per indicare lo stato di una richiesta HTTP effettuata tra un client (spesso un browser web) e un server. Nell'applicazione, vengono ampiamente utilizzati alcuni di questi codici per comunicare lo stato delle richieste e delle risposte:

- **Codice 400 (BAD REQUEST)**: Questo codice indica che la richiesta effettuata dal client è stata malformata o non valida. Viene utilizzato quando i dati inviati non corrispondono alle aspettative del server.

- **Codice 401 (UNAUTHORIZED)**: Indica che l'accesso a una risorsa richiede l'autenticazione. 

- **Codice 404 (NOT FOUND)**: Indica che la risorsa richiesta non è stata trovata sul server. 

- **Codice 500 (INTERNAL SERVER ERROR)**: Questo codice indica un errore interno del server.

- **Codice 200 (OK)**: Codice di successo. Indica che la richiesta è stata elaborata correttamente e che il server sta restituendo i dati richiesti al client.

##### ESEMPIO DI GESTIONE

La gestione che abbiamo deciso di attuare è stata quella di comunicare al sender il codice che la sua richiesta ha "generato"
Nell'esempio di seguito è possibile vedere la gestione dei codici 400,404,500 200

**TODO:FIX**
>**NB**: res.json(data) viene percepito dal client come un codice 200
```javascript
export async function getPlaylistFromId(res, playlistid) {
   if(playlistid==undefined){
      res.status(400).send("Missing playlist id");
      utils.log("[PLAYLIST]> getPlaylistFromId > ERROR 400: Missing playlist id");
      return;     
   }
   if(!utils.isValidString(playlistid)){
      res.status(400).send("Invalid playlistid");
      utils.log("[PLAYLIST]> getPlaylistFromId > ERROR 400: Invalid playlist id");
      return;     
   }
   try {
      const collection = await dbPlaylistCollection();
      const playlist = await collection.findOne({ _id: new ObjectId(playlistid) });
      if (!playlist) {
         res.status(404).send("Playlist not found");
         utils.log("[PLAYLIST]> getPlaylistFromId > ERROR 404: Playlist not found");
         return; 
      }

      res.json(playlist);
      utils.log("[PLAYLIST]> getPlaylistFromId > SUCCESS: SUCCESFULLY FETCHED PLAYLIST "+playlistid);
      return; 

   } catch (error) {
      res.status(500).send("INTERNAL ERROR");
      utils.log("[PLAYLIST]> getPlaylistFromId > ERROR 500: INTERNAL ERROR "+error);
      return; 
   }
}
```
---

### Esempi di Utilizo

**Pagina Iniziale**
![Home](./assets/homePage.png)

**Profilo**
![Profile](./assets/profile.png)

**Playlist Personali**
![Personal Playlists](./assets/personalPlaylist.png)

**Nuova Playlist**
![New Playlists](./assets/createPlaylist.png)

**Cerca Playlist pubbliche**
![Explore Public Playlists](./assets/searchPublicPlaylists.png)

**Esplora e importa Playlist**
![Explore and Import Playlists](./assets/exploreAndAddPlaylist.png)

**Comunità**
![Community](./assets/communityView.png)

**Modifica Comunità**
![EditCommunity](./assets/communityEdit.png)

---

## Personaggi Marvel
I personaggi Marvel, per essere utilizzati all'iterno dell'applicazione devono essere validati. Per essere validi essi devono obbligatoriamente avere un nome, una descrizione e un'immagine, che può essere quella di default.

---

## Lingua
La scelta di utilizzare la lingua inglese, come standard di programmazione, è ampiamente diffusa nell'industria del software ed è guidata principalmente dal desiderio di aderire allo standard internazionale. Questo standard è anche noto nella community di programmatori come **"English-based programming"** . <br>
Adottare questa convenzione ha numerosi vantaggi, in quanto rende il codice più leggibile e comprensibile per un pubblico globale di sviluppatori.