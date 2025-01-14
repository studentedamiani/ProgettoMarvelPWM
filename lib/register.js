//import { dbUserCollection } from "./user.js";
import { getMD5,isValidDate,isValidString,isValidPassword, isValidUsername } from "./utils.js";
import * as database from "./database.js";

/**
 * Registers a new user in the system.
 *
 * This function registers a new user in the system by processing user registration data. It expects an Express response object (`res`) and a user object (`user`) containing registration information. The function validates the user data and stores it in the database if it meets the criteria.
 *
 * @param {Object} res - The Express response object.
 * @param {Object} user - The user object containing registration information.
 * @param {string} user.name - The user's full name.
 * @param {string} user.username - The user's chosen username.
 * @param {string} user.email - The user's email address.
 * @param {string} user.password - The user's password.
 * @param {string} user.date - The user's birth date in the format 'yyyy-mm-dd'.
 *
 * @returns {void} This function sends an HTTP response to the client. It returns a success response (HTTP status 200) upon successful registration.
 * If any error occurs during the registration process, an appropriate error response is sent.
 * 
 * @throws {400} Bad Request - If any of the required registration parameters (`name`, `username`, `email`, `password`) is missing or if any of them is invalid (e.g., empty, not a valid string).
 * @throws {400} Bad Request - If the `date` parameter is missing or not in a valid date format ('yyyy-mm-dd').
 * @throws {400} Bad Request - If the password is not valid (less than 7 characters).
 * @throws {400} Bad Request - If the username is not valid (e.g., contains spaces).
 * @throws {400} Bad Request - If the email or username is already associated with an existing user.
 * @throws {500} Internal Error - If an internal server error occurs during the registration process.
 */
export async function register(res,user) {
   if (user.name == undefined || user.username == undefined || user.email == undefined || user.password == undefined ) {
      res.status(400).send('Missing parameter');
      return;
   }
   if(!isValidDate(user.date)){
      res.status(400).send('invalid Date!');
      return;
   }
   if(!isValidString(user.name) || !isValidString(user.email) || !isValidString(user.password)){
      res.status(400).send('Some of the data is invalid. Check and try again!');
      return;
   }
   if(!isValidPassword(user.password)){
      res.status(400).send('Password is not valid. It must be at least 7 characters long!');
      return;
   }
   if(!isValidUsername(user.username)){
      res.status(400).send('username is not valid!'); 
      return;
   }
   
   user.password = getMD5(user.password);
   try{
      const result = await database.check_username(user);
      if(result.status != 200){
         res.status(result.status).send();
         return;
      }
   
      try{
         await database.register_user(res,user);
         res.status(200).send();
      } catch (e) {
         res.status(500).send(`Generic Error: ${e}`);
         return;
      }
   } catch (e) {  
      res.status(500).send(`Generic Error: ${e}`);
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
   if(!isValidString(login._id)){
      res.status(400).send("Invalid ID");
      return;
   }
   if(!isValidString(login.username) ){
      return;
   }
   try{
      let loggedUser = await database.check_user_credentials(login);
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