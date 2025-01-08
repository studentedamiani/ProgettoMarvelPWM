import * as dotenv from 'dotenv';
dotenv.config();

const marvel = {
    base_url: process.env.BASE_URL,
   // token_url: process.env.TOKEN_URL,
    public_key: process.env.PUBLIC_KEY,
    private_key: process.env.PRIVATE_KEY,
 };
 /**
 * Main configs
 * @param {string} host - Host to use as server for NodeJS environment
 * @param {string} port - Port to use for the host if available
 * 
 */
 const config = {
    host: process.env.HOST,
    port: process.env.PORT,
 };
 export { marvel,config };