import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { healthcheck } from "../controllars/health.controller.js";


const router = Router();

router.use(verifyJWT)

router.route('/').post(healthcheck)

export default router