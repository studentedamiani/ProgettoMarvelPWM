import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Configuration object for Marvel API authentication and endpoint.
 * @typedef {Object} MarvelConfig
 * @property {string} base_url - The base URL for Marvel API endpoints
 * @property {string} public_key - The public API key for Marvel API authentication
 * @property {string} private_key - The private API key for Marvel API authentication
 */
const marvel = {
    base_url: process.env.BASE_URL,
    public_key: process.env.PUBLIC_KEY,
    private_key: process.env.PRIVATE_KEY,
 };
 /**
 * Main configs
 * @param {string} host - Host to use as server for NodeJS environment
 * @param {string} port - Port to use for the host if available
 * 
 */
/**
 * Configuration object for server settings
 * @type {Object}
 * @property {string} host - The host address from environment variables
 * @property {string} port - The port number from environment variables
 */
 const config = {
    host: process.env.HOST,
    port: process.env.PORT,
 };
 export { marvel,config };