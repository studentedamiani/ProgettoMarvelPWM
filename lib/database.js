/*Manage the connection to database*/
import { MongoClient, ServerApiVersion,ObjectId } from 'mongodb';
import { getMD5 } from "./utils.js";
import { error } from 'console';
import Decimal from 'decimal.js';
//Create a MongoClient instance with a MongoClientOptions object to set the Stable API version
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?${process.env.DB_OPTIONS}`;
let client;
let dbConnection;

// Connection function
async function connectToDatabase() {
  if (dbConnection) return dbConnection;
  
  try {
      client = new MongoClient(uri, {
          serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
              useNewUrlParser: true,
              useUnifiedTopology: true,
              serverSelectionTimeoutMS: 5000,
              maxPoolSize: 10
          }
      });

      await client.connect();
      dbConnection = client.db(process.env.DB_DBNAME);
      console.log('Successfully connected to MongoDB.');
      return dbConnection;
  } catch (error) {
      console.error('Could not connect to MongoDB', error);
      throw error;
  }
}

// Initialize connection when file is imported
connectToDatabase().catch(console.error);

/*Function to check database connection*/
export async function check_db_connection() {
  try {
    const db = await connectToDatabase();
    // ping to confirm the connection to database
    await db.command({ ping: 1 });
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
 }

export async function check_username(user) {
  try {
            // Connection to server
            const db = await connectToDatabase();
           const existingUser =  await db.collection("users").findOne({
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
    }
export async function register_user(res,user) {
  try {
    // Connection to server
    user.credits = new Decimal(user.credits).toString();
    const db = await connectToDatabase();
    await db.collection("users").insertOne(user, function(err, res) {
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
}

export async function check_user_credentials(login) {
  if (login._id) {
    login._id = new ObjectId(login._id)
  }
  var filter = {
    $or: [
       { $and: [ { email: login.email }, { password: login.password } ] },
       { $and: [ { username: login.username }, { password: login.password } ] },
       { $and: [ { _id: login._id }, { username: login.username } ] },
    ],
 };
 try {
  // Connection to server
  const db = await connectToDatabase();
  let response = await db.collection("users").findOne(filter);
  return response;
 }
 catch (error){
    console.error("Error!", error);
 }

}

export async function variate_credits(credits) {
  const db = await connectToDatabase();
  let user = await db.collection("users").findOne({ username: credits.username });
  
  // Convert existing and new credits to Decimal for accurate calculation
  const currentCredits = new Decimal(user.credits);
  const creditChange = new Decimal(credits.credits);
  const newCredits = currentCredits.plus(creditChange);

  console.log("Current credits:", currentCredits.toString());
  console.log("Credit change:", creditChange.toString());
  console.log("New credits:", newCredits.toString());

  if (newCredits.lessThan(0)) {
    console.log("No credits");
    return {
      status: 401,
      credits: currentCredits.toString()
    };
  }

  try {
    const result = await db.collection("users")
      .updateOne(
        { username: credits.username },
        { $set: { credits: newCredits.toString() } }
      );
    
    let updatedUser = await db.collection("users").findOne({ username: credits.username });
    return {
      status: 200,
      result,
      credits: updatedUser.credits
    };
  } catch (error) {
    console.error('Error updating credits:', error);
    throw error;
  }
}

export async function get_Credits(user_param) {
  try {
    const db = await connectToDatabase();
    let user = await db.collection("users").findOne({ username: user_param });
    if (!user) {
      return {
        status: 401,
        message: 'User not found'
      };
    } else {
      // Convert credits to Decimal when retrieving
      const credits = new Decimal(user.credits);
      return {
        status: 200,
        credits: credits.toString()
      };
    }
  } catch (error) {
    console.error('Error fetching credits:', error);
    throw error;
  }
}

export async function update_user(login) {
try 
  {
    // Connection to server
    const db = await connectToDatabase();
    const updateFields = {
      email: login.email,
      username: login.username,
      name : login.name,
      surname: login.surname,
      date : login.date,
      superhero: login.superhero
    };
    
    if (login.password) 
    {
      updateFields.password = getMD5(login.password);
    }
    console.log("update fielsds----> ",updateFields);
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(login._id) },
      { $set: updateFields }
    );
    if (!result.acknowledged) 
    {

      console.log("Not worked!");
      return {
        status: 401,
        message: 'Database update unauthorized or failed'
      };
    } else {
        console.log("Worked!",result);
        return {
          status: 200,
          message: 'Database update completed!',
          data: JSON.stringify(login)
        };
    }
  }
  catch (error) {
    console.error('Registration of the user into the database failed:', error);
    return {
      status: 401,
      message: 'Database connection unauthorized or failed',
      error: error.message
    } 
  }
}

export async function delete_user(id) {
  try 
  {
    console.log("User_ID_for_delete",id);
    // Connection to server
    const db = await connectToDatabase();
    //Cancello innanzitutto l'utente
    const result_users = await db.collection("users").deleteOne(
      { _id: new ObjectId(id) }
    );

    if (!result_users.acknowledged)
    {

      console.log("Not worked users!");
      return {
        status: 401,
        message: 'Database deletd unauthorized or failed'
      };
    } else 
    {
      //Cancello poi tutti gli scambi inseriti da lui
      console.log("Worked users!",result_users);
      const result_exchanges = await db.collection("exchanges").deleteMany(
        { user_id: new ObjectId(id) }
      );
      if (!result_exchanges.acknowledged) 
      {
        console.log("Not worked exchanges!");
        return {
          status: 401,
          message: 'Database deletd unauthorized or failed'
        };
      } else 
      {
        //Cancello tutte le carte collegate ai suoi albun
        console.log("Worked exchanges!",result_exchanges);
        const result_cards = await db.collection("cards").deleteMany(
          { user_id: new ObjectId(id) }
        );
        if (!result_cards.acknowledged) 
        {

          console.log("Not worked cards!");
          return {
            status: 401,
            message: 'Database deletd unauthorized or failed'
          };
        } else 
        {
          //Cancello tutte le carte collegate ai suoi albun
          console.log("Worked cards!",result_cards);
          const result_albums = await db.collection("albums").deleteMany(
            { user_id: new ObjectId(id) }
          );
          if (!result_albums.acknowledged) 
          {
            console.log("Not worked albums!");
            return {
              status: 401,
              message: 'Database deletd unauthorized or failed'
            };
          } else 
          {
            console.log("Worked albums!",result_albums);
            return {
              status: 200,
              message: 'Database delete completed! User removed'
            };
          }
        }
      }
    }
  }
  catch (error) {
    console.error('Registration of the user into the database failed:', error);
    return {
      status: 401,
      message: 'Database connection unauthorized or failed',
      error: error.message
    } 
  }
  
}

export async function getUserAlbums(id)
{
  console.log("ID_UTENTE",id);
  try 
  {
    // Connection to server
    const db = await connectToDatabase();
    let albums = await db.collection("albums").find({ user_Id: new ObjectId(id) }).toArray();;
    console.log("Albums:",albums);
    if (!albums) {
    return {
      status: 404,
      message :'Albums not found'
    }
    } else {
      return albums;
    }
    } 
      catch (error) {
        console.error('Error fetching credits:', error);
          throw error;
  } 
}

export async function createAlbum(userid)
{
  try 
  {
    // Connection to server
    const db = await connectToDatabase();
    let albums = await db.collection("albums").insertOne({ user_Id: new ObjectId(userid.userId),
                                                           name : userid.name
     });
     console.log(albums);
    if (!albums) {
    return {
      status: 404,
      message :'Cannot create album'
    }
    } else {
      console.log(albums.insertedId);
      return albums;
    }
    } 
      catch (error) {
        console.error('Error creating album:', error);
          throw error;
  } 
}

export async function savecard(params) {
  console.log("Card save->user id-.>",params.userID);
  console.log("Card save->album id-.>",params.albumID);
  console.log("Card save->card id-.>",params.cardID);
  try 
  {
    // Connection to server
    const db = await connectToDatabase();
    let card = await db.collection("cards").insertOne({ user_Id: new ObjectId(params.userID),
                                                        album_Id : params.albumID,
                                                        card_Id : params.cardID
     });
     console.log(card);
    if (!card) {
    return {
      status: 404,
      message :'Cannot create album'
    }
    } else {
      console.log(card.insertedId);
      return card;
    }
    } 
      catch (error) {
        console.error('Error creating album:', error);
          throw error;
  } 
}

export async function check_card_album(params) {
  console.log("params",params);
  try 
  {
    // Connection to server
    const db = await connectToDatabase();
    var filter = {
         $and: [ { user_Id: new ObjectId(params.user_Id) }, { album_Id: params.album_Id }, {card_Id: params.card_Id}] 
   };
   console.log(filter);
    let cards = await db.collection("cards").find(filter).toArray();
    console.log("cards:",cards);
    if (!cards) {
    return {
      status: 404,
      message :'cards not found'
    }
    } else {
      return cards;
    }
    } 
      catch (error) {
        console.error('Error fetching cards:', error);
          throw error;
  } 
}


export async function getAlbumsCards(albumid){
  try 
  {
    // Connection to server
    const db = await connectToDatabase();
    var filter;
    let cards
   
      filter = {album_Id: albumid};
      cards = await db.collection("cards").find(filter).sort({ card_Id: 1 }).toArray();
   console.log(filter);
    if (!cards) {
    return {
      status: 404,
      message :'cards not found'
    }
    } else {
      console.log("DaTABASE ", cards);
      return cards;
    }
    } 
      catch (error) {
        console.error('Error fetching cards:', error);
          throw error;
  }
}

export async function getDuplicatedAlbumsCards(albumid){
  try 
  {
    // Connection to server
    const db = await connectToDatabase();
    var filter;
    let cards
      console.log("duplicated");
      filter = [
        {
          $group: {
            _id: {
              user_Id: "$user_Id",
              album_Id: "$album_Id",
              card_Id: "$card_Id"
            },
            count: { $sum: 1 }
          }
        },
        {
          $match: {
            count: { $gte: 2 }
          }
        }
      ];
      cards = await db.collection("cards").aggregate(filter).toArray();
   console.log(filter);
    if (!cards) {
    return {
      status: 404,
      message :'cards not found'
    }
    } else {
      // Reformat the duplicated cards data structure
      cards = cards.map(card => ({
        user_Id: card._id.user_Id,
        album_Id: card._id.album_Id,
        card_Id: card._id.card_Id
      }));
      return cards;
    }
    } 
      catch (error) {
        console.error('Error fetching cards:', error);
          throw error;
  }
}

export async function remove_card(param,type) {
  let parameters = param;
  console.log(parameters);
  if (type="sell_card") {
    try{
    //const credits = await get_Credits(parameters.username);
    parameters.credits = 0.2;
    const variated_credits = await variate_credits(parameters);

    const db = await connectToDatabase();
    console.log("Parameters",parameters);
    const result_cards = await db.collection("cards").deleteOne(
      { user_Id: new ObjectId(parameters.user_id),
        album_Id : parameters.album_id,
        card_Id : parameters.card_id
       }
    );
    if (!result_cards.acknowledged) 
    {

      console.log("Not worked cards!",result_cards);
      return {
        status: 401,
        message: 'Database deletd unauthorized or failed'
      };
    } else 
    {
      console.log("I thik worked",result_cards);
      return {
        status: 200,
        message: 'Sell completed.'
      };
    }
    
  } 
  catch (error) {
    console.error('Error fetching cards:', error);
      throw error;
    }
  }
  else if (type="exchange_cards"){
    try{
      const db = await connectToDatabase();
      console.log("Parameters",parameters);
      const result_cards = await db.collection("cards").deleteOne(
        { user_Id: new ObjectId(parameters.user_id),
          album_Id : parameters.album_id,
          card_Id : parameters.card_id
         }
      );
      if (!result_cards.acknowledged) 
      {
  
        return {
          status: 401,
          message: 'Database deletd unauthorized or failed'
        };
      } else 
      {
        return {
          status: 200,
          message: 'Sell completed.'
        };
      }
      
    } 
    catch (error) {
      console.error('Error fetching cards:', error);
        throw error;
      }
    }
  }
}