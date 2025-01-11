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

export async function check_user_credentials(login) {
  await client.connect();
  var filter = {
    $or: [
       { $and: [ { email: login.email }, { password: login.password } ] },
       { $and: [ { username: login.username }, { password: login.password } ] },
    ],
 };
 try {
  // Connection to server
  await client.connect();
  let response = await client.db(process.env.DB_DBNAME).collection("users").findOne(filter);
  console.log(response);
  return response;
 }

 finally {
   await client.close();
 }

}

export async function variate_credits(credits)
{
  await client.connect();
  console.log(credits.credits);
  let user = await client.db(process.env.DB_DBNAME).collection("users").findOne({ username: credits.username });
  console.log(Number(user.credits));
  credits.newCredits = Number(user.credits) + Number(credits.credits);
  console.log("newCredits:", credits.newCredits)
  if (!isNaN(credits.newCredits) && credits.newCredits < 0) {
    console.log("No crediti");
    return {
      status: 401,
      result,
      credits: NewCredit.credits
    } 
  }
  try {
    const result = await client.db(process.env.DB_DBNAME).collection("users")
      .updateOne(
        { username: credits.username },
        { $set: { credits: credits.newCredits } }
      );
      let NewCredit = await client.db(process.env.DB_DBNAME).collection("users").findOne({ username: credits.username });
      return {
        status: 200,
        result,
        credits: NewCredit.credits
      } 
  } catch (error) {
    console.error('Error updating credits:', error);
    throw error;
  } finally {
    await client.close();
  }
}