const swaggerJsdoc = require('swagger-jsdoc');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Smart Home Inventory API',
			version: '1.0.0',
			description: 'Interactive API documentation for the Smart Home Inventory backend service.',
		},
		servers: [
			{
				url: 'http://localhost:5000/api/v1',
				description: 'Development server'
			}
		],
		components: {
			securitySchemes: {
				BearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'Enter your JWT token to authorize requests'
				}
			}
		}
	},
	apis: ['./src/routes/*.js', './src/modules/**/*.routes.js', './src/modules/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
