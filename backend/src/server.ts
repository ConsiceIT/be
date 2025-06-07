/* eslint-disable @typescript-eslint/no-require-imports */
import compression from 'compression'
import express from 'express'
import rateLimit from 'express-rate-limit'
import fs from 'fs'
import path from 'path'
import { envs } from './core/config/env'
import { ONE_HUNDRED, ONE_THOUSAND, SIXTY } from './core/constants'
import { swaggerSpec, swaggerUi } from './swagger'

export const server = async (): Promise<void> => {
	const app = express()

	//* Middlewares
	app.use(express.json()) // Parse JSON
	app.use(express.urlencoded({ extended: true })) // Parse URL-encoded
	app.use(compression()) // Compress responses

	// Rate limit
	app.use(
		rateLimit({
			max: ONE_HUNDRED,
			windowMs: SIXTY * SIXTY * ONE_THOUSAND, // 1 hour
			message: 'Too many requests from this IP, please try again in one hour'
		})
	)

	// Dynamically load all route files from ./src/routes
	const routesPath = path.join(__dirname, 'routes')
	fs.readdirSync(routesPath).forEach((file) => {
		if (file.endsWith('.ts')) {
			const route = require(path.join(routesPath, file)).default
			if (route) {
				app.use(envs.API_PREFIX, route)
			}
		}
	})

	if (envs.NODE_ENV === 'dev') app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

	//* Start server
	app.listen(envs.PORT, () => {
		console.log(`Server running on port ${envs.PORT}...`)
	})
}
