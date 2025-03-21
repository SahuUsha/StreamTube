import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist,deletePlaylist, getOwnPlaylists, getAllPlaylist } from "../controllars/playlist.controller.js";




const router= Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist).get(getAllPlaylist)
router.route("/ownplaylist").get(getOwnPlaylists)

router.route("/user/p/:userId").get(getUserPlaylists);


router.route("/:playlistId").get(getPlaylistById).patch(updatePlaylist).delete(deletePlaylist)
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist)
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist)


export default router