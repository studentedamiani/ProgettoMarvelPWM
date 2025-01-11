import 'dotenv/config';
import { getMD5,getRandomInt } from './utils.js';
import { response } from 'express';
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
export async function returnPackage(characters_number) {
 var valid_characters_count =0; //Declare and initializa of variable
 var loop_check = 0; //Declare and initializa of variable
 var query;
 let reponse_package = [];
 let max_characters
//Get the number of avaible characters
await returnCharactersNumber().then(response => { max_characters=response.data.total;});
  do{
    query="limit=1&offset="+Number(await getRandomInt(0, max_characters))+"&";
    try {
      /*Get a random character*/
        const response = await fetch(`http://gateway.marvel.com/v1/public/characters?${parameters}${query}`);
        const data = await response.json();
        if (isCharacterValid(data.data.results[0])) {
          reponse_package.push(data);
          reponse_package.count++;
          valid_characters_count++;
      }
    } catch (error) {
        console.error('Error fetching Marvel data:', error);
        throw error;
    }
      loop_check++;
  } while (valid_characters_count < characters_number && loop_check <200) 
    return reponse_package;
}
/*Generic function*/
export async function getFromMarvel(res, url, query){
  var parameters = `ts=${timestamp}&apikey=${process.env.PUBLIC_KEY}&hash=${getMD5(timestamp+process.env.PRIVATE_KEY+process.env.PUBLIC_KEY)}&`
  return fetch(`http://gateway.marvel.com/v1/${url}?${parameters}${query}`)
  .then(response => response.json())
  .then(data => {
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
