import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { deleteVideo,
     getAllVideos, 
     getVideoById, 
     getYourVideo, 
     incrementVideoView,
      publishVideo,
      updatedVideo } from "../controllars/video.controller.js";
import { upload } from "../middleware/multer.middleare.js";


const router = Router();
router.use(verifyJWT) ; // apply for all routes

router.route("/").get(getAllVideos).post(
    // [
    //     body('title').
    // ],
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount : 1,
        },
        {
            name: "thumbnail",
            maxCount: 1,
        }
    ]),
    publishVideo
);

router.route("/:videoId").get(getVideoById).patch(updatedVideo).delete(deleteVideo)
router.route("/view/:videoId").post(incrementVideoView)
router.route("/y/yourvideo").get( getYourVideo)


export default router