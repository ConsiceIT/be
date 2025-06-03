import express, { Request, Response } from 'express'
import { HttpCode } from '../core/constants'

const router = express.Router()

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Ping
 *     responses:
 *       200:
 *         description: Pong
 */
router.get('/ping', (_req: Request, res: Response) => {
	res.status(HttpCode.OK).send({
		message: 'pong'
	})
})

export default router
