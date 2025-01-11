/*Manage the connection to database*/
import { MongoClient, ServerApiVersion } from 'mongodb';
//Create a MongoClient instance with a MongoClientOptions object to set the Stable API version
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?${process.env.DB_OPTIONS}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
    }
});

/*Function to check database connection*/
export async function check_db_connection() {
  try {
    // Connection to server
    await client.connect();
    // ping to confirm the connection to database
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
    // Check that the client is closed
    await client.close();
  }
 }

export async function check_username(user) {
  try {
            // Connection to server
            await client.connect();
           const existingUser =  await client.db("PWMDB").collection("users").findOne({
              $or: [ { email: user.email }, { username: user.username } ]
           });
           if (existingUser) {
              return {
                status: 530,
                message: 'Username or mail already exists'
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
          // Check that the client is closed
          await client.close();
        }
}

export async function register_user(res,user) {
  try {
    // Connection to server
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
    // Check that the client is closed
    await client.close();
  }
}