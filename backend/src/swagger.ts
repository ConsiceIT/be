import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { envs } from './core/config/env'

// Swagger definition
const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'My API',
			version: '1.0.0',
			description: 'API documentation using Swagger'
		},
		servers: [
			{
				url: `http://localhost:${envs.PORT}`
			}
		]
		// components: {
		// 	securitySchemes: {
		// 		bearerAuth: {
		// 			type: 'http',
		// 			scheme: 'bearer',
		// 			bearerFormat: 'JWT'
		// 		}
		// 	}
		// }
	},
	apis: ['./src/routes/**/*.ts']
}

const swaggerSpec = swaggerJSDoc(swaggerOptions)

export { swaggerSpec, swaggerUi }
