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
         "name": "cards",
         "description": "Endpoints for managing the cards of the album."
      },
      {
          "name": "misc",
          "description": "Miscellaneous endpoints catering to various operations."
      }
    ]
    ,
    definitions: {
      user: {
          _id: "ObjectId('64df73b31e5eda5eb868ddcd')",
          name: "John",
          username: "Jhonny",
          surname: "Doe",
          email: "jhonny@example.com",
          password: "md5 hashed password",
          date: "2001-05-20",
          genres: {
              0: "pop",
              1: "rock",
              2: "metal"
          }
      },
      playlists: {
        _id: "ObjectId('64e748f0cb18ad90657b9043')",
        owner_id: "ObjectId('64df73b31e5eda5eb868ddcd')",
        title: "Example Playlist",
        description: "Description of playlist",
        public: true,
        tags: {
            0: "chill",
            1: "relax",
            2: "vibes"
        },
        songs: {
           0:{
              title: "Song 1",
              artist: "Artist1, Artist2, Artist3",
              duraion: "00:01:11"
           },
           1:{
              title: "Song 2",
              artist: "Artist1, Artist2, Artist3",
              duraion: "00:02:22"
           },
           2:{
              title: "Song 3",
              artist: "Artist1, Artist2, Artist3",
              duraion: "00:03:33"
           }
        },
        private: true
    },
      updateuser: {
          $name: "Jhon",
          $username: "johndough",
          $email: "johndough@example.com",
          $surname: "Dough"
      },
      loggeduser: {
           $_id: "64df73b31e5eda5eb868ddcd",
           $username:"johndough",
           $email: "johndough@gmail.com",
           $name: "John"
      },
      song: {
        $_id: "78kf73b31e6yda5eb868dder",
        $artist:"['artist1','artist2']",
        $duration: "00:11:22", 
        $year: "1984",
        $album: "Album Name"
      },
      loginrequest: {
        email: "johndough@gmail.com",
        username:"johndough",        
        $password: "password"  
      },
      registerrequest: {
        $name: "John",
        $username: "johndough",
        $email: "johndough@example.com",
        $password: "password"
      },
      removesong: {
        $playlist_id: "ObjectId('64e748f0cb18ad90657b9043')",
        $track_id: "78kf73b31e6yda5eb868dder",
        $owner_id: "ObjectId('64df73b31e5eda5eb868ddcd')"
      }
  }
    /*"servers": [
      {
        "url": "http://localhost:666",
        "description": "Development server"
      }
    ]*/
   
    };


  const swagger = swaggerAutogen(outputFile, endpointsFiles, doc)