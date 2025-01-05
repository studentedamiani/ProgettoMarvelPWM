import swaggerJsdoc from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Marvel API',
            version: '1.0.0',
            description: 'API documentation for AFSE (Album delle Figurine dei Super Eroi)',
        },
        servers: [
            {
                url: 'http://localhost:666',
                description: 'Development server',
            },
        ],
    },
    apis: ['../../*.js'], // Updated path to match your project structure
};

export const specs = swaggerJsdoc(options);
