import 'dotenv/config';
import { getMD5 } from './utils.js';
/*Per determinare il massimo a cui posso arrivare con i personaggi faccio la prima chiamata mettendo come parametro una riga sola di ritorno*/
export async function returnCharactersNumber()
{
  
  var timestamp = Date.now();
  console.log(process.env.PRIVATE_KEY);
  var parameters = `ts=${timestamp}&apikey=${process.env.PUBLIC_KEY}&hash=${getMD5(timestamp+process.env.PRIVATE_KEY+process.env.PUBLIC_KEY)}&`
  return fetch(`http://gateway.marvel.com/v1/public/characters?${parameters}limit=1&`)
  .then(response => response.json())
  .catch(error => console.log('error', error));
}


export async function getFromMarvel(res, url, query){
  var timestamp = Date.now();
  var parameters = `ts=${timestamp}&apikey=${process.env.PUBLIC_KEY}&hash=${getMD5(timestamp+process.env.PRIVATE_KEY+process.env.PUBLIC_KEY)}&`
  //var max_characters;
 // var pluto;
 /* await returnCharactersNumber().then(response => {pluto = response; 
    global.max_characters = pluto.data.total;
  });
*/  
  //console.log(`http://gateway.marvel.com/v1/${url}?${parameters}${query}`);
  //console.log (getRandomInt(0, 1564));
  //query=query+"offset="+Number(await getRandomInt(0, 1564))+"&";
   console.log(`http://gateway.marvel.com/v1/${url}?${parameters}${query}`);
  return fetch(`http://gateway.marvel.com/v1/${url}?${parameters}${query}`)
  .then(response => response.json())
        //res.status(200).send()
  .catch(error => console.log('error', error));
} 


 //Add a comment here 
async function getRandomInt(min, max) {
    // Assicuriamoci che min sia effettivamente minore di max
    if (min > max) {
      [min, max] = [max, min];
  }
  
  // Arrotondiamo i numeri per sicurezza
  min = Math.ceil(min);
  max = Math.floor(max);
  
  // Formula per generare un numero random incluso tra min e max
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/*
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<db_username>:<db_password>@pwmdamianiproject.rpr6f.mongodb.net/?retryWrites=true&w=majority&appName=PWMDamianiProject";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);*/
