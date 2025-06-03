/* eslint-disable @typescript-eslint/no-require-imports */
import compression from 'compression'
import express, { type Application } from 'express'
import rateLimit from 'express-rate-limit'
import fs from 'fs'
import path from 'path'
import { ONE_HUNDRED, ONE_THOUSAND, SIXTY } from './core/constants'
import { swaggerSpec, swaggerUi } from './swagger'

interface ServerOptions {
	port: number
	apiPrefix: string
}

export class Server {
	private readonly app: Application
	private readonly port: number
	private readonly apiPrefix: string

	constructor(options: ServerOptions) {
		const { port, apiPrefix } = options
		this.port = port
		this.apiPrefix = apiPrefix
		this.app = express()
	}

	async start(): Promise<void> {
		//* Middlewares
		this.app.use(express.json()) // Parse JSON
		this.app.use(express.urlencoded({ extended: true })) // Parse URL-encoded
		this.app.use(compression()) // Compress responses

		// Rate limit
		this.app.use(
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
					this.app.use(this.apiPrefix, route)
				}
			}
		})

		this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

		//* Start server
		this.app.listen(this.port, () => {
			console.log(`Server running on port ${this.port}...`)
		})
	}
}
