
//import { dbUserCollection } from "./user.js";
import { getMD5,isValidString,isValidPassword,isValidEmail } from "./utils.js";
import { check_user_credentials } from "./database.js";
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
   try{
      let loggedUser = await check_user_credentials(login);
      if (loggedUser == null) {
         res.status(401).send("Unauthorized");
         return;
      } else {
         res.json({
            _id: loggedUser._id,
            username: loggedUser.username,
            email: loggedUser.email,
            name : loggedUser.name,
            credits : loggedUser.credits
         });
         return;
      }
   }catch(e){
      res.status(500).send("An erorr has occurred. Try again later");
      return;
   }

}