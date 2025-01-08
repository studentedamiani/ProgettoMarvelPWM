import { createHash } from 'crypto';


export function isValidString(string) {
  // Verifica se la stringa è definita e non è una stringa vuota
  if (string === undefined || string === null || typeof string !== 'string' || string.trim() === '') {
    return false;
  }
  return true;
}

export function isValidDate(string) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!string || !dateRegex.test(string)) {
    return false;
  }
  const dateParts = string.split('-');
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);

  const isValidYear = year >= 1000 && year <= 9999;
  const isValidMonth = month >= 1 && month <= 12;
  const isValidDay = day >= 1 && day <= new Date(year, month, 0).getDate();

  return isValidYear && isValidMonth && isValidDay;
}
export function isValidPassword(password){
  return isValidString(password) && password.length >= 7;
}
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidNickname(nickname) {
  if (typeof nickname !== 'string') {
     return false;
  }
  if (nickname.length > 16 || nickname.length<4) {
     return false;
  }
  if (nickname.includes(' ')) {
     return false;
  }
  return true;
}

/**
 * 
 * 
 * Generates MD5 hash from a string
 * @param {string} str - String to hash
 * @returns {string} MD5 hash
 */
export function getMD5(str) {
    return createHash('md5')
        .update(str)
        .digest('hex');
}

 //Generate a random integer between min and max
 export async function getRandomInt(min, max) {
    // Assicuriamoci che min sia effettivamente minore di max
    if (min > max) {
      [min, max] = [max, min];
  }
  
  // Arrotondiamo i numeri per sicurezza
  min = Math.ceil(min);
  max = Math.floor(max);
  
  // Formula per generare un numero random incluso tra min e max
  return Math.floor(Math.random() * (max - min + 1)) + min;
}