import 'dotenv/config';
import { getMD5,getRandomInt } from './utils.js';
import { response } from 'express';
import * as database from './database.js';
var timestamp = Date.now();
var parameters = `ts=${timestamp}&apikey=${process.env.PUBLIC_KEY}&hash=${getMD5(timestamp+process.env.PRIVATE_KEY+process.env.PUBLIC_KEY)}&`
/*To determine the maximum I can reach with the characters I make the first call by putting a single return line as a parameter*/
export async function returnCharactersNumber()
{  
  return fetch(`http://gateway.marvel.com/v1/public/characters?${parameters}limit=1&`)
  .then(response => response.json())
  .catch(error => console.error('error', error));
}

/*Print the package by calling the marvel 5 times with a limit of 1, random offset and validating each character before writing it into the json.
Once the number of characters required by the parameter is reached, the package is returned*/
export async function returnPackage(param) {
 var valid_characters_count =0; //Declare and initializa of variable
 var loop_check = 0; //Declare and initializa of variable
 var query;
 let reponse_package = [];
 let max_characters
 let creditChage = {
    username: param.username,
    credits: Number(-1)
 }
const creditResponse = await database.variate_credits(creditChage).catch(response => { 
 
  if (response.code === 401) {
    throw { code: 401, message: "Insufficient credits" };
  }
  return response;

})
//Get the number of avaible characters
if (!creditResponse || creditResponse.code !== 401) {
  await returnCharactersNumber().then(response => { max_characters=response.data.total;});
  do{
    query="limit=1&offset="+Number(await getRandomInt(0, max_characters))+"&";
    try {
      /*Get a random character*/
        const response = await fetch(`http://gateway.marvel.com/v1/public/characters?${parameters}${query}`);
        const data = await response.json();
        if (isCharacterValid(data.data.results[0]) &&
        //Evito duplicazioni 
            !reponse_package.some(item => item.data.results[0].id === data.data.results[0].id)) {
              //If the card is valid save that into database
              /*Create the structure*/
              let saveCard = {
                cardID: data.data.results[0].id,
                userID: param.user_id,
                albumID: param.album_id
              }
              try{
                  await  database.savecard(saveCard);
                  reponse_package.push(data);
                  reponse_package.count++;
                  valid_characters_count++;
              } catch (e) {
                  res.status(500).send(`Generic Error: ${e}`);
                  return;
              }
            }
    } catch (error) {
        console.error('Error fetching Marvel data:', error);
        throw error;
    }
      loop_check++;
  } while (valid_characters_count < param.cards && loop_check <200) 
    return reponse_package;
}}

/*Generic function*/
export async function getFromMarvel(res, url, query){
  var parameters = `ts=${timestamp}&apikey=${process.env.PUBLIC_KEY}&hash=${getMD5(timestamp+process.env.PRIVATE_KEY+process.env.PUBLIC_KEY)}&`
  return fetch(`http://gateway.marvel.com/v1/${url}?${parameters}${query}`)
  .then(response => response.json())
  .then(data => {
    if (data.code !="RequestThrottled") {

    
    let response_package = [];
            data.data.results.forEach(element => {
              if (isCharacterValid(element)) {
                response_package.push(element);
              }
            });
            return {
              code: 200,
              data: response_package
            };
    }
    else{
      return {
        code:401,
        message: data.message
      };
    }
      })        
    .catch(error => {
          console.error('Error:', error);
          throw error;
        });
} 




function isCharacterValid(character) {
/*To be valid, the character must have a description, an image and a name*/
 if (character.description  && character.thumbnail.path  && character.name)
    {return true;}
  else
  {return false;}
}
