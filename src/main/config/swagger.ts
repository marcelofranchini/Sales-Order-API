import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sales Order API',
      version: '1.0.0',
    },
  },
  apis: ['./src/main/docs/swagger.yml'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
