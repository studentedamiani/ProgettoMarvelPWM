
//import { dbUserCollection } from "./user.js";
import { getMD5,isValidString,isValidPassword,isValidEmail } from "./utils.js";
import { ObjectId } from "mongodb"
/*Manage the connection to database*/
import { MongoClient, ServerApiVersion } from 'mongodb';
// Create a MongoClient instance with a MongoClientOptions object to set the Stable API version
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
   if (login.email == undefined && login.username == undefined) {
      res.status(400).send("Missing Parameter");
      return;
   }
   if (login.password == undefined) {
      res.status(400).send("Missing Parameter");
      return;
   }
   if (!isValidEmail(login.email) && !isValidString(login.username)) {
      res.status(400).send("Invalid username or Email");
      return;
   }
   if (!isValidString(login.password) || !isValidPassword(login.password)) {
      res.status(400).send("Password is invalid");
      return;
   }
   login.password = getMD5(login.password);
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
         return;
      } else {
         res.json({
            _id: loggedUser._id,
            username: loggedUser.username,
            email: loggedUser.email,
            name : loggedUser.name
         });
         return;
      }
   }catch(e){
      res.status(500).send("An erorr has occurred. Try again later");
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
      return;
   }
   if(!isValidEmail(login.email) ){
      res.status(400).send("Invalid Email");
      return;
   }
   if(!isValidString(login.username) ){
      res.status(400).send("Invalid username");
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
         return;
      } else {
         res.json(loggedUser);
         return;
      }
   }catch(e){
      res.status(500).send("Internal Error");
      return;
   }
}