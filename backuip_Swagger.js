import swaggerJsdoc from 'swagger-ui-express';
import swaggerAutogen from "swagger-autogen";
const outputFile = './swagger_output.json';
const endpointsFiles = ['../../../app.js']; // Usa il percorso relativo corretto per il tuo file app.js

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Marvel API',
            version: '1.0.0',
            description: 'Documentation for the APIs of my website: AFSE (Album delle Figurine dei Super Eroi)',
        },
        host: `${config.host}:${config.port}`,
        basePath: "/",
        schemes: ['http'],
        servers: [
            {
                url: 'http://localhost:666',
                description: 'Development server',
            },
        ],
        tags: [
            {
               "name": "fetch",
               "description": "Endpoints for fetching and searching content."
            },
            {
                "name": "users",
                "description": "Endpoints for the management of user data and related operations."
            },
            {
               "name": "auth",
               "description": "Endpoints related to authentication and user authorization."
            },
            {
               "name": "playlist",
               "description": "Endpoints for the orchestration of playlists."
            },
            {
               "name": "community",
               "description": "Endpoints for managing community-related data and interactions."
            },
            {
               "name": "tracks",
               "description": "Endpoints for retrieving and managing track information."
            },
            {
                "name": "misc",
                "description": "Miscellaneous endpoints catering to various operations."
            }
           
      
        ],
    },
    apis: ['../../*.js'], // Updated path to match your project structure
};

const generateSwagger = async () => {
    try {
      await swaggerAutogen()(outputFile, endpointsFiles,options);
      console.log('SWAGGER DOCUMENTATION GENERATED.');
    } catch (error) {
      console.log('ERROR WHILE GENERATING SWAGGER DOCUMENTATION:', error);
    }
  };
  
 generateSwagger();

export const specs = swaggerJsdoc(options);
