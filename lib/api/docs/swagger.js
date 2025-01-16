import swaggerAutogen from 'swagger-autogen';
import { config } from "../../../config/prefs.js";
const outputFile = './swagger-output.json';
const endpointsFiles = ['../../*.js', '../../../app.js'];  // This will match all .js files in lib folder and its subfolders, plus app.js

const doc = {
  "info": {
    "title": "Marvel Characters API",
    "description": "API for AFSE (Album delle Figurine dei Super Eroi)",
    "version": "1.0.0"
  },
  host: `${config.host}:${config.port}`,
  basePath: "/",
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
     "name": "fetch",
     "description": "Basic endpoint."
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
     "name": "cards",
     "description": "Endpoints for managing the cards of the album."
    },
    {
      "name": "exchanges",
      "description": "Endpoint to manage exchanges."
    },
    {
    "name": "database",
    "description": "Endpoint to check the database connection."
  }
  ],
  definitions: {
    user: {
      _id: "ObjectId('64df73b31e5eda5eb868ddcd')",
      name: "John",
      username: "Jhonny",
      surname: "Doe",
      email: "jhonny@example.com",
      password: "hashed_password",
      credits: 100,
      cards: ["card_id1", "card_id2"]
    },
    
      loggeduser: {
           $_id: "64df73b31e5eda5eb868ddcd",
           $username:"johndough",
           $email: "johndough@gmail.com",
           $name: "John"
      },
      loginrequest: {
        email: "johndough@gmail.com",
        username:"johndough",        
        $password: "password"  
      }
  }
    };
  const swagger = swaggerAutogen(outputFile, endpointsFiles, doc)