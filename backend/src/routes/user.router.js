import { Router } from "express";
import { upload } from "../middleware/multer.middleare.js";
import { changeCurrentPassword, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshaccessToken, registerUser, updateAccountDetail, updateUserAvatar, updateUserCoverImage } from "../controllars/user.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
       { name : "avatar",
        maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/change-password").patch(verifyJWT,changeCurrentPassword);
router.route("/refresh-token").post(refreshaccessToken)
router.route("/updateAccountDetail").patch(verifyJWT,updateAccountDetail)
router.route("/coverImage").put(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/avatar").put(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route("/watchHistory").get(verifyJWT,getWatchHistory)
export default router;