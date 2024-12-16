import * as dotenv from 'dotenv';
dotenv.config();

const marvel = {
    base_url: process.env.BASE_URL,
   // token_url: process.env.TOKEN_URL,
    public_key: process.env.PUBLIC_KEY,
    private_key: process.env.PRIVATE_KEY,
 };
 
 export { marvel };