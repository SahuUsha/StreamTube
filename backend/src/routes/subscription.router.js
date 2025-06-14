import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { checkSubscribed, getSubscribedChannels, getUserChannelSubscriber, toggleSubcription } from "../controllars/subscription.controller.js";


const router = Router()

router.use(verifyJWT);

router.route("/c/:channelId").post(toggleSubcription).get(getUserChannelSubscriber)

router.route("/u/:subscriberId").get(getSubscribedChannels)

router.route("/checksub/:channelId").post(checkSubscribed)


export default router