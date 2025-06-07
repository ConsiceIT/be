import express from 'express';
import { getCastWithReplies } from '../controllers/cast-controller.js';
import {resolveCastHashFromUrl} from '../controllers/resolve-cast-from-url.js';

const router = express.Router();

router.get('/cast/:hash', getCastWithReplies);
router.post('/resolve-cast-hash', resolveCastHashFromUrl);

export default router;
