const swaggerJsdoc=require('swagger-jsdoc');
const swaggerui=require('swagger-ui-express');

const options={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'rolebase API',
            version:"1.0.0",
            description:'API documentation for rolebase access control',
            contact:{
                name:"Tanmay Karmakar",
                email:"karmakartanmay08@gmail.com",
            },
        },
        servers:[
            {url:'http://localhost:7000',description:'Development server',},
        ],
        components: {
            securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
                }
            }
        },
    },
    apis: ["./app/routes/**/*.js"],
}

const swaggerSpec=swaggerJsdoc(options);
module.exports={swaggerui,swaggerSpec};