import 'dotenv/config';
import { getMD5,getRandomInt } from './utils.js';
import { response } from 'express';
var timestamp = Date.now();
var parameters = `ts=${timestamp}&apikey=${process.env.PUBLIC_KEY}&hash=${getMD5(timestamp+process.env.PRIVATE_KEY+process.env.PUBLIC_KEY)}&`
/*Per determinare il massimo a cui posso arrivare con i personaggi faccio la prima chiamata mettendo come parametro una riga sola di ritorno*/
export async function returnCharactersNumber()
{
  var timestamp = Date.now();
  
  return fetch(`http://gateway.marvel.com/v1/public/characters?${parameters}limit=1&`)
  .then(response => response.json())
  .catch(error => console.error('error', error));
}
/*Stampa il pacchetto richiamando la marvel 5 volte con limite o1, offest ramdomico e validando ogni personaggio prima di scriverlo nel json.
Al raggingimento del numero di personaggi richiesto dal paramentro ritorna il pacchetto*/
export async function returnPackage(characters_number) {
 var valid_characters_count =0; //Dichiarazione e inizializzazione della variabile
 var sicurezza = 0; //Dichiarazione e inizializzazione della variabile
 var query;
 let reponse_package = [];
 //reponse_package.push();

  do{
    query="limit=1&offset="+Number(await getRandomInt(0, 1564))+"&";
    try {
        const response = await fetch(`http://gateway.marvel.com/v1/public/characters?${parameters}${query}`);
        const data = await response.json();
        /*TEST*/
        if (isCharacterValid(data.data.results[0])) {
          reponse_package.push(data);
          reponse_package.count++;
          valid_characters_count++;
      }
      /*FINE TEST*/
    } catch (error) {
        console.error('Error fetching Marvel data:', error);
        throw error;
    }
      sicurezza++;
  } while (valid_characters_count < characters_number && sicurezza <200) 
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
  if (character.description  && character.thumbnail.path !=="http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available")
    {return true;}
  else
  console.log( character);
  {return false;}
}
