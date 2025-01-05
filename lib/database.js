/*Manage the connection to database*/
import { MongoClient, ServerApiVersion } from 'mongodb';

// Crea un'istanza di MongoClient con un oggetto MongoClientOptions per impostare la versione Stable API

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?${process.env.DB_OPTIONS}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
    }
});

export async function run() {
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
    try {
      const cursor = client.db("PWMDB").collection("customers").find();
      //await cursor.forEach(console.log);
    }
    catch (error) {
      console.error('Connection to MongoDB failed:', error);
      throw error;
    } 
    finally {
    await client.close();
    console.log("Connection closed successfully!");
    }
  }
}