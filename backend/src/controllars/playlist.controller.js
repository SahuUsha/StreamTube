import mongoose from "mongoose"
import { Playlists } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"




const createPlaylist = asyncHandler(async(req,res)=>{
const {name,description} = req.body
console.log("request : ",req.body)


if([name,description].some((field) => field?.trim()==="")){
    throw new ApiError(400, "title and dicription are required")
}
console.log(name , description)

try {
    const playlist = await Playlists.create({
        name:name ,
        description,
        owner:req.user,
        videos: [] 
    })
    if(!playlist){
        throw new ApiError(400, "Fail to create playlist")
    }
    return res
    .status(200)
    .json(200, playlist,"created playlist successfully")
} catch (error) {
    console.log(error)
}
})

const getUserPlaylists = asyncHandler(async(req,res)=>{
    const {userId} = req.params

    if(!userId){
        throw new ApiError(404, "user id not found")
    }

    const playlists = await Playlists.find({owner:userId })
    console.log(playlists)

    if(!playlists || playlists.length===0){
        throw new ApiError(400, "Playlist is not found")
    }

    return res
    .status(200)
    .json(200,playlists,"Fetched user playlists successfully")
})


const getOwnPlaylists = asyncHandler(async(req,res)=>{
    const {_id: userid} = req.user
    console.log("user ID : ",userid)

    if(!userid){
        throw new ApiError(404, "user id not found")
    }

    // const playlists = await Playlists.find({owner:userId })
    // console.log(playlists)



   const  allOwnPlaylist = await Playlists.aggregate([
           {
              $match : {owner : new mongoose.Types.ObjectId(userid) }
           },
        //    {
        //        $lookup :{
        //         from : "videos",
        //         localField : "videos",
        //         foreignField : "_id",
        //         as : "video"
        //        }
        //    },
        //    {
        //     $unwind: {
        //         path: "$video",
        //         preserveNullAndEmptyArrays: true // Ensures no failure if no videos exist
        //     }
        // },
           {
             $lookup : {
                from : "users",
                localField: "owner",
                foreignField : "_id",
                as : "ownerInfo"

             }
           },
           {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                videos: 1,
                owner : 1,
                createdAt : 1,
              
                "ownerInfo._id": 1,
                "ownerInfo.username": 1,
                "ownerInfo.avatar": 1
            },
          
           },
     ])

    if(!allOwnPlaylist){
        throw new ApiError(404, "error to find ownplaylist playlist ")
    }

    return res
    .status(200)
    .json(
       new ApiResponse( 200,allOwnPlaylist,"Fetched user playlists successfully"))
})


const getAllPlaylist = asyncHandler(async(req,res)=>{

    const allPlaylist = await Playlists.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerInfo"
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                videos: 1,
                owner: 1,
                createdAt: 1,
                "ownerInfo._id": 1,
                "ownerInfo.username": 1,
                "ownerInfo.avatar": 1
            }
        }
    ]);

    if (!allPlaylist || allPlaylist.length === 0) {
        return res.status(404).json({ message: "No playlists found." });
    }

    return res.status(200).json(new ApiResponse(200,allPlaylist,"sucessfully fetch all playlist" ))

})


const getPlaylistById = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(400, "playlist id is not found");
    }

    const playlist = await Playlists.findById(playlistId)
    console.log(playlist)

    if(!playlist){
        throw new ApiError(400, "Playlist is not found");
    }

    return res.status(200).json(200,{playlist},"Fetched playlist successfully" )
})



const addVideoToPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId, videoId} = req.params

    if(!playlistId || !videoId){
        throw new ApiError(400, "playlistId and videoId are required");
    }

    const playlistToAdd = await Playlists.findById(playlistId)
   
    console.log(playlistToAdd.owner)
    console.log(req.user?._id )

    if(playlistToAdd.owner.toString()!== req.user?._id.toString()  ){
      throw new ApiError(400, "You are not allowed")
    }

    if(playlistToAdd.videos.includes(videoId)){
        throw new ApiError(403, "Video already exist in playlist");

    }

    try {
        playlistToAdd.videos.push(videoId)
        await playlistToAdd.save()
    } catch (error) {
        console.log(error)}
    
  return res.status(200).json(200,{playlistToAdd},"Video added to playlist successfully")
})

const removeVideoFromPlaylist = asyncHandler(async(req,res)=>{
    const {playlistId,videoId} = req.params

    if(!playlistId || !videoId){
        throw new ApiError(400,"playlistId and videoId are required")
    }

    const playlistToRemove = await Playlists.findById(playlistId)
    if(playlistToRemove.owner.toString()!== req.user?._id.toString()  ){
        throw new ApiError(400, "You are not allowed")
      }

    if(!playlistToRemove.videos.includes(videoId)){
        throw new ApiError(404,"Video not found in the playlist")
    }

    // remove the video from the playlist
    try {
        playlistToRemove.videos = playlistToRemove.videos.filter(
            (id)=>id.toString() !== videoId.toString()
        );
        playlistToRemove.save();
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "An error occurred while updating the playlist");
    }

    return res.status(200).json(ApiResponse(200,playlistToRemove,"Video is removed from playlist successfully"))
})

const updatePlaylist = asyncHandler(async(req,res)=>{
   const {playlistId } = req.params
   const {name,description} = req.body
  

   if(!playlistId){
    throw new ApiError(400," Playlist id is not found")
   }

    if(!description || !name){
        throw new ApiError(400, "name and description are required")
    }

   const playlist = await Playlists.findById(playlistId)

   if(!playlist){
    throw new ApiError(400,"Playlist is not found")
   }

   if(playlist.owner.toString()!== req.user?._id.toString()  ){
    throw new ApiError(400, "You are not allowed")
   }
   
   const updateField = {}

   if(name?.trim()){
    updateField.name = name;
   }
    
   if(description?.trim()){
    updateField.description = description;
   }

   const updatedPlaylist = await Playlists.findByIdAndUpdate(playlistId,
    {
        $set : updateField
    },
    {
        new : true
    }
   )

   return res
   .status(200)
   .json(new ApiResponse(200, updatedPlaylist, "Playlist is updated successfully"))

})

const deletePlaylist = asyncHandler(
    async(req, res)=>{
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(400," Playlist id is not found")
       }
       const playlist = await Playlists.findById(playlistId)

       if(!playlist){
        throw new ApiError(400,"Playlist is not found")
       }

       if(playlist.owner.toString()!== req.user?._id.toString()  ){
        throw new ApiError(400, "You are not allowed")
       }

       const deletedPlaylist =  await Playlists.findByIdAndDelete(playlistId)
         
       if(!deletedPlaylist){
        throw new ApiError(400,"Playlist is not found")
       }
             
       return res.status(200).json(new ApiResponse(200,
        deletedPlaylist, "Video deleted successfully"))
    
}
)

export {createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist,
    getOwnPlaylists,
    getAllPlaylist
} 