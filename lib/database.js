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

/*Funzione per verificare la connessione al database*/
export async function check_db_connection() {
  try {
    // Connessione al server (opzionale a partire dalla versione v4.7)
    await client.connect();
    // Invia un ping per confermare una connessione avvenuta con successo
    await client.db(process.env.DB_DBNAME).command({ ping: 1 });
      return {
        status: 200,
        message: 'Database connection successful'
      };
  }
  catch (error) {
    console.error('Connection to MongoDB failed:', error);
    return {
      status: 401,
      message: 'Database connection unauthorized or failed',
      error: error.message
  };
  } 
  finally {
    // Assicura che il client venga chiuso al termine
    await client.close();
  }
 }



export async function run(user) {
  try {
    // Connessione al server (opzionale a partire dalla versione v4.7)
    await client.connect();
    // Invia un ping per confermare una connessione avvenuta con successo
    await client.db("PWMDB").command({ ping: 1 });
    await client.db("PWMDB").createCollection("customers", function(err, res) {
      if (err) throw error;
    });
    var myobj = { name: "Company Inc", address: "Highway 37" };
    client.db("PWMDB").collection("users").insertOne(user, function(err, res) {
      if (err) throw err;
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