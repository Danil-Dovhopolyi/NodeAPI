const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Your API',
        version: '1.0.0',
        description: 'API documentation using Swagger',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
};
const swaggerConfig = {
    swaggerDefinition,
    apis: ['path/to/your/routes/*.js'],
};
export default swaggerConfig;
//# sourceMappingURL=swagger.js.map