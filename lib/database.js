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

export async function check_username(user) {
  try {
          // Connessione al server (opzionale a partire dalla versione v4.7)
          await client.connect();
           const existingUser =  await client.db("PWMDB").collection("users").findOne({
              $or: [ { email: user.email }, { username: user.nickname } ]
           });
           if (existingUser) {
              return {
                status: 530,
                message: 'Nome utente o email già esistente'
              } 
           }

            return {
              status: 200,
              message: 'User does not exist'

            };
      } catch (error) {
        console.error('Connection to MongoDB failed:', error);
        return {
          status: 500,
          message: 'Internal server error'
        };
      }
        finally {
          // Assicura che il client venga chiuso al termine
          await client.close();
        }
}

export async function register_user(res,user) {
  try {
    // Connessione al server (opzionale a partire dalla versione v4.7)
    await client.connect();
    await client.db(process.env.DB_DBNAME).collection("users").insertOne(user, function(err, res) {
      if (err) 
        return {
          status: 401,
          message: 'Database insert unauthorized or failed',
          error: error.message
        } 
      //db.close();
    });
  }
  catch (error) {
    console.error('Registration of the user into the database failed:', error);
    return {
      status: 401,
      message: 'Database connection unauthorized or failed',
      error: error.message
    } 
  }
  finally {
    // Assicura che il client venga chiuso al termine dell'inserimento
    await client.close();
  }
}