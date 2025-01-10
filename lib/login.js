
//import { dbUserCollection } from "./user.js";
import { getMD5,isValidString,isValidPassword,isValidEmail } from "./utils.js";
import { ObjectId } from "mongodb"
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
/**
 * Handles user login.
 *
 * This function processes login requests and checks the provided credentials.
 * If the login is successful, it returns user information.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
export async function login(req, res) {
   let login = req.body;
   console.log(login)
   if (login.email == undefined && login.username == undefined) {
      res.status(400).send("Missing Parameter");
      console.log("[LOGIN]> login > ERROR 400: missing parameter");
      return;
   }
   if (login.password == undefined) {
      res.status(400).send("Missing Parameter");
      console.log("[LOGIN]> login > ERROR 400: missing parameter");
      return;
   }
   if (!isValidEmail(login.email) && !isValidString(login.username)) {
      res.status(400).send("Invalid username or Email");
      console.log("[LOGIN]> login > ERROR 400: missing parameter");
      return;
   }
   if (!isValidString(login.password) || !isValidPassword(login.password)) {
      res.status(400).send("Password is invalid");
      console.log("[LOGIN]> login > ERROR 400: missing parameter");
      return;
   }
   login.password = getMD5(login.password);
   console.log("password: "+login.password);
  // let collection = await dbUserCollection();
   var filter = {
      $or: [
         { $and: [ { email: login.email }, { password: login.password } ] },
         { $and: [ { username: login.username }, { password: login.password } ] },
      ],
   };
   try{
      let loggedUser = await client.db("PWMDB").collection("users").findOne(filter);
      if (loggedUser == null) {
         res.status(401).send("Unauthorized");
         console.log("[LOGIN]> login > ERROR 401: unauthorized parameter");
         return;
      } else {
         res.json({
            _id: loggedUser._id,
            username: loggedUser.username,
            email: loggedUser.email
         });
         console.log("[LOGIN]> login > USER "+loggedUser._id+" LOGGED IN");
         return;
      }
   }catch(e){
      res.status(500).send("An erorr has occurred. Try again later");
      console.log("[LOGIN]> login > ERROR 500: INTERNAL ERROR : "+e);
      return;
   }

}

/**
 * Authenticates a user based on provided credentials.
 *
 * This function verifies user authentication by matching the provided
 * credentials against the database records.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @returns {void}
 */
export async function authuser(req, res) {
   let login = req.body;
  // let collection = await dbUserCollection();
   if(!isValidString(login._id)){
      res.status(400).send("Invalid ID");
      console.log("[LOGIN]> authuser > ERROR 400: missing parameter ");
      return;
   }
   if(!isValidEmail(login.email) ){
      res.status(400).send("Invalid Email");
      console.log("[LOGIN]> authuser > ERROR 400: missing email");
      return;
   }
   if(!isValidString(login.username) ){
      res.status(400).send("Invalid username");
      console.log("[LOGIN]> authuser > ERROR 400: missing username");
      return;
   }
   var filter = {
      $and: [
         { _id: new ObjectId(login._id) },
         { email: login.email },
         { username: login.username }
      ],
   };
   try{
      let loggedUser = await client.db("PWMDB").collection("users").findOne(filter);
      if (loggedUser == null) {
         res.status(401).send("Unauthorized");
         console.log("[LOGIN]> authuser > ERROR 401: missing parameter");
         return;
      } else {
         res.json(loggedUser);
         console.log("[LOGIN]> authuser >  USER "+login._id+" AUTHORIZED");
         return;
      }
   }catch(e){
      res.status(500).send("Internal Error");
      console.log("[LOGIN]> authuser > ERROR 500: INTERNAL ERROR " + e);
      return;
   }
}