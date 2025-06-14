import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { createTweet,
     getAllTweet,
     getUserTweet, 
     updateTweet } from "../controllars/tweets.controller.js";



const router = Router();

router.use(verifyJWT)

router.route("/").post(createTweet).get(getAllTweet);
router.route("/user/:userId").get(getUserTweet)

router.route("/:tweetId").patch(updateTweet).delete(updateTweet)



export default router