// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NongSan API',
            version: '1.0.0',
            description: 'API for NongSan',
        },
        servers: [
            {
                url: 'http://localhost:5000', // Replace with your API base URL
                description: 'Development server',
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to your API route files containing JSDoc comments
};

const specs = swaggerJsdoc(options);

export default specs;