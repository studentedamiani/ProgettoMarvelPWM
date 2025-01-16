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
  if (newCredits.lessThan(0)) {
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
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(login._id) },
      { $set: updateFields }
    );
    if (!result.acknowledged) 
    {

      return {
        status: 401,
        message: 'Database update unauthorized or failed'
      };
    } else {
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
    // Connection to server
    const db = await connectToDatabase();
    //Cancello innanzitutto l'utente
    const result_users = await db.collection("users").deleteOne(
      { _id: new ObjectId(id) }
    );

    if (!result_users.acknowledged)
    {

      return {
        status: 401,
        message: 'Database deletd unauthorized or failed'
      };
    } else 
    {
      //Cancello poi tutti gli scambi inseriti da lui
      const result_exchanges = await db.collection("exchanges").deleteMany(
        { user_id: new ObjectId(id) }
      );
      if (!result_exchanges.acknowledged) 
      {
        return {
          status: 401,
          message: 'Database deletd unauthorized or failed'
        };
      } else 
      {
        //Cancello tutte le carte collegate ai suoi albun
        const result_cards = await db.collection("cards").deleteMany(
          { user_id: new ObjectId(id) }
        );
        if (!result_cards.acknowledged) 
        {

          return {
            status: 401,
            message: 'Database deletd unauthorized or failed'
          };
        } else 
        {
          //Cancello tutte le carte collegate ai suoi albun
          const result_albums = await db.collection("albums").deleteMany(
            { user_id: new ObjectId(id) }
          );
          if (!result_albums.acknowledged) 
          {
            return {
              status: 401,
              message: 'Database deletd unauthorized or failed'
            };
          } else 
          {
            //Cancello tutte le carte collegate ai suoi albun
            const result_exchange_card = await db.collection("exchanges_cards").deleteMany(
              { user_id: new ObjectId(id) }
            );
            if (!result_exchange_card.acknowledged) 
            {
              return {
                status: 401,
                message: 'Database deletd unauthorized or failed'
              };
            } else 
            {
              return {
                status: 200,
                message: 'Database delete completed! User removed'
              };
            }
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
  try 
  {
    // Connection to server
    const db = await connectToDatabase();
    let albums = await db.collection("albums").find({ user_Id: new ObjectId(id) }).toArray();;
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
    if (!albums) {
    return {
      status: 404,
      message :'Cannot create album'
    }
    } else {
      return albums;
    }
    } 
      catch (error) {
        console.error('Error creating album:', error);
          throw error;
  } 
}

export async function savecard(params) {
  try 
  {
    // Connection to server
    const db = await connectToDatabase();
    let card = await db.collection("cards").insertOne({ user_Id: new ObjectId(params.userID),
                                                        album_Id : params.albumID,
                                                        card_Id : params.cardID
     });
    // Remove all exchanges for this card
    await remove_exchange_by_card({ 
      cardId: params.cardID, 
      userId: params.userID,
      albumId: params.albumID
    });
    if (!card) {
    return {
      status: 404,
      message :'Cannot create card'
    }
    } else {
      return card;
    }
    } 
      catch (error) {
        console.error('Error creating card:', error);
          throw error;
  } 
}

export async function check_card_album(params) {
  try 
  {
    // Connection to server
    const db = await connectToDatabase();
    var filter = {
         $and: [ { user_Id: new ObjectId(params.user_Id) }, { album_Id: params.album_Id }, {card_Id: params.card_Id}] 
   };
    let cards = await db.collection("cards").find(filter).toArray();
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

export async function getDuplicatedAlbumsCards(albumid){
  try 
  {
    // Connection to server
    const db = await connectToDatabase();
    var filter;
    let cards
    filter = [
      {
        $match: {
          album_Id: albumid  // Add this stage first
        }
      },
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
  if (type=="sell_card") {
    try{
    //const credits = await get_Credits(parameters.username);
    parameters.credits = 0.2;
    const variated_credits = await variate_credits(parameters);

    const db = await connectToDatabase();

    const result_cards = await db.collection("cards").deleteOne(
      { user_Id: new ObjectId(parameters.user_id),
        album_Id : parameters.album_id,
        card_Id : parameters.card_id.toString()
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

              // Check if we need to remove exchanges
              const userCards = await db.collection("cards").find({
                user_Id: new ObjectId(parameters.user_id),
                album_Id: parameters.album_id,
                card_Id: parameters.card_id
              }).toArray();

              const existingExchanges = await db.collection("exchanges_cards").find({
                user_id: new ObjectId(parameters.user_id),
                album_id: parameters.album_id, 
                card_Id: parameters.card_id
              }).count();

              // Remove exchanges if this was the last available card
              if (userCards.length <= existingExchanges) {
                await remove_exchange_by_card({
                  cardId: parameters.card_id,
                  userId: parameters.user_id,
                  albumId: parameters.album_id
                });
              }
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
  else if (type=="exchange_cards"){
    try{
      const db = await connectToDatabase();
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
//}

export async function get_valid_exchanges (params){
  //This function will print all the valid exchanges
  //Using album to get the cards I want that I don't have and cards i  have double
  //First thing i get the duble cards so i know what cards can i give up
  const db = await connectToDatabase();
  
  const response = await getDuplicatedAlbumsCards(params.albumid);
  
  var avaible_exchanges = [];
  var exchange_cards = [];
  var filter = {};
  var card_filter = {};
  var returned_exchanges = [];
  //Then i check all the exchanges that have the cards i have as card requested
  for (let i = 0; i < response.length; i++) {
    filter = {requestedCard: response[i].card_Id.toString()};
    const exchanges = await db.collection("exchanges").find(filter).toArray();
    
    if (!exchanges || exchanges.length === 0) {
      continue; // Skip to next iteration rather than returning
    }

    for (let j = 0; j < exchanges.length; j++) {
      // Skip exchanges from the same user
      if (exchanges[j].user_id.toString() === params.userid) {
      continue;
      }

      // Get all proposed cards for this exchange
      const exchange_cards = await db.collection("exchanges_cards").find({
        exchange_id: exchanges[j]._id
      }).toArray();

      // Check if user has any of the proposed cards
      let hasAnyProposedCards = false;
      for (let card of exchange_cards) {
        const cardCheck = await check_card_album({
          album_Id: params.albumid,
          user_Id: params.userid,
          card_Id: card.card_Id
        });
        
        if (cardCheck && cardCheck.length > 0) {
          hasAnyProposedCards = true;
          break;
        }
      }

      // Skip if user has any of the proposed cards 
      if (hasAnyProposedCards) {
        continue;
      }
      // Add valid exchange to returned_exchanges
      returned_exchanges.push({
      exchange_ID: exchanges[j]._id,
      requestedCard: exchanges[j].requestedCard,
      proposedCards: exchange_cards.map(card => card.card_Id)
      });
    }    
  }
          
  return {
    status: 200,
    exchanges: returned_exchanges
  };
}

export async function create_exchange(params) {
  try {
    const db = await connectToDatabase();
    
    // Insert the main exchange record with album_id
    const exchange = await db.collection("exchanges").insertOne({
    user_id: new ObjectId(params.userId),
    album_id: params.albumId,
    requestedCard: params.cardtoGet
    });
    // Check if the proposed cards are still available
    for (const cardId of params.cardtosend) {
      // Get all cards owned by the user
      const userCards = await db.collection("cards").find({
        user_Id: new ObjectId(params.userId),
        album_Id: params.albumId,
        card_Id: cardId.id
      }).toArray();

      // Get existing exchanges using this card
      const existingExchanges = await db.collection("exchanges_cards").find({
        user_id: new ObjectId(params.userId),
        album_id: params.albumId,
        card_Id: cardId.id
      }).count();

      // If number of existing exchanges equals or exceeds owned cards, card is not available
      if (existingExchanges >= userCards.length) {
        throw new Error(`Card ${cardId.id} is no longer available for exchange`);
      }
    }
    // Insert all proposed cards with album_id
    const cardPromises = params.cardtosend.map(cardId => {
    return db.collection("exchanges_cards").insertOne({
      exchange_id: exchange.insertedId,
      card_Id: cardId.id,
      user_id: new ObjectId(params.userId),
      album_id: params.albumId
    });
    });

    await Promise.all(cardPromises);

    return {
    status: 200,
    exchange_id: exchange.insertedId,
    message: 'Exchange created successfully'
    };

  } catch (error) {
    console.error('Error creating exchange:', error);
    return {
    status: 500,
    message: 'Failed to create exchange',
    error: error.message
    };
  }
  }

  export async function remove_exchange_by_card(card) {
  try {
    const db = await connectToDatabase();
    
    // Find all exchanges with the specified requestedCard and album_id
    const exchanges = await db.collection("exchanges").find({
    requestedCard: card.cardId,
    user_id: new ObjectId(card.userId),
    album_id: card.albumId
    }).toArray();

    // Delete all associated exchange_cards entries
    const exchangeIds = exchanges.map(exchange => exchange._id);
    if (exchangeIds.length > 0) {
    await db.collection("exchanges_cards").deleteMany({
      exchange_id: { $in: exchangeIds }
    });
    }

    // Delete the exchanges
    const result = await db.collection("exchanges").deleteMany({
    requestedCard: card.cardId,
    user_id: new ObjectId(card.userId),
    album_id: card.albumId
    });

    return {
    status: 200,
    message: 'Exchanges removed successfully',
    deletedCount: result.deletedCount
    };

  } catch (error) {
    console.error('Error removing exchanges:', error);
    return {
    status: 500,
    message: 'Failed to remove exchanges',
    error: error.message
    };
  }
  }

  export async function accept_exchange(params) {
    try {
      const db = await connectToDatabase();

      // Get the exchange details
      const exchange = await db.collection("exchanges").findOne({
        _id: new ObjectId(params.exchange_id)
      });

      if (!exchange) {
        throw new Error('Exchange not found');
      }

      // Get all proposed cards
      const proposedCards = await db.collection("exchanges_cards").find({
        exchange_id: new ObjectId(params.exchange_id)
      }).toArray();
/*PARAMS: ACCEPT
      EXCHANGE CREATOR*/
      // First remove the requested card from accepting user
      await remove_card({
        user_id: params.acceptingUserId,
        album_id: params.album_id,
        card_id: Number(exchange.requestedCard)
      }, "exchange_cards");

      // Then transfer it to exchange creator
      await savecard({
        userID: exchange.user_id.toString(),
        albumID: exchange.album_id,
        cardID: Number(exchange.requestedCard)
      });

      // Handle each proposed card
      for (const card of proposedCards) {
        // First remove from exchange creator
        await remove_card({
          user_id: exchange.user_id.toString(),
          album_id: exchange.album_id,
          card_id: Number(card.card_Id)
        }, "exchange_cards");

        // Then transfer to accepting user
        await savecard({
          userID: params.acceptingUserId,
          albumID: params.album_id,
          cardID: Number(card.card_Id)
        });
      }

      // Delete the exchange and its cards
      await delete_exchange(params.exchange_id);
      return {
        status: 200,
        message: 'Exchange completed successfully'
      };

    } catch (error) {
      console.error('Error completing exchange:', error);
      return {
        status: 500,
        message: 'Failed to complete exchange',
        error: error.message
      };
    }
  }

  
  export async function delete_exchange(exchangeId) {
    try {
      const db = await connectToDatabase();

      // Delete all associated exchange_cards first
      await db.collection("exchanges_cards").deleteMany({
        exchange_id: new ObjectId(exchangeId)
      });

      // Delete the exchange itself
      const result = await db.collection("exchanges").deleteOne({
        _id: new ObjectId(exchangeId)
      });
      console.log("Delete->",result.deletedCount)
      if (result.deletedCount === 0) {
        return {
          status: 404,
          message: 'Exchange not found'
        };
      }

      return {
        status: 200,
        message: 'Exchange deleted successfully'
      };

    } catch (error) {
      console.error('Error deleting exchange:', error);
      return {
        status: 500,
        message: 'Failed to delete exchange',
        error: error.message
      };
    }
  }



  export async function get_my_exchanges (params){
    //This function will print all the valid exchanges
    //Using album to get the cards I want that I don't have and cards i  have double
    //First thing i get the duble cards so i know what cards can i give up
    const db = await connectToDatabase();
    
    const response = await getDuplicatedAlbumsCards(params.albumid);
    
    var avaible_exchanges = [];
    var exchange_cards = [];
    var filter = {};
    var card_filter = {};
    var returned_exchanges = [];
    //Then i check all the exchanges that have the cards i have as card requested
 
      filter = {user_id: new ObjectId(params.userid)};
      const exchanges = await db.collection("exchanges").find(filter).toArray();
      for (let j = 0; j < exchanges.length; j++) {
        // Get all proposed cards for this exchange
        const exchange_cards = await db.collection("exchanges_cards").find({
          exchange_id: exchanges[j]._id
        }).toArray();
        // Add exchange to returned_exchanges
        returned_exchanges.push({
        exchange_ID: exchanges[j]._id,
        requestedCard: exchanges[j].requestedCard,
        proposedCards: exchange_cards.map(card => card.card_Id)
        });
      }    
    return {
      status: 200,
      exchanges: returned_exchanges
    };
  }