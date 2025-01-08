{
    "openapi": "3.0.0",
    "info": {
      "title": "Marvel Characters API",
      "description": "API for AFSE (Album delle Figurine dei Super Eroi)",
      "version": "1.0.0"
    },
    "servers": [
      {
        "url": "http://localhost:666",
        "description": "Development server"
      }
    ],
    "paths": {
      "/register": {
        "post": {
          "tags": ["auth"],
          "summary": "Register new user",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserRegistration"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": "User registered successfully"
            },
            "400": {
              "description": "Invalid input"
            }
          }
        }
      },
      "/login": {
        "post": {
          "tags": ["auth"],
          "summary": "Login user",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserLogin"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Login successful",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/LoginResponse"
                  }
                }
              }
            },
            "401": {
              "description": "Invalid credentials"
            }
          }
        }
      }
    },
    "components": {
      "schemas": {
        "UserRegistration": {
          "type": "object",
          "required": ["username", "email", "password"],
          "properties": {
            "username": {
              "type": "string",
              "example": "john_doe"
            },
            "email": {
              "type": "string",
              "format": "email",
              "example": "john@example.com"
            },
            "password": {
              "type": "string",
              "format": "password",
              "example": "password123"
            }
          }
        },
        "UserLogin": {
          "type": "object",
          "required": ["username", "password"],
          "properties": {
            "username": {
              "type": "string"
            },
            "password": {
              "type": "string",
              "format": "password"
            }
          }
        },
        "LoginResponse": {
          "type": "object",
          "properties": {
            "token": {
              "type": "string"
            },
            "user": {
              "type": "object",
              "properties": {
                "id": {
                  "type": "string"
                },
                "username": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  }

  
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