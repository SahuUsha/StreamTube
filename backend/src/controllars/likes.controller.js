import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/likes.model.js";
import ApiResponse from "../utils/ApiResponse.js";



const toggleVideoLike = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const userId = req.user?._id;

    if(!videoId){
        throw new ApiError(400,"videoId is required")
    }

    const existingLike = await Like.findOne({
        video : videoId,
        likedBy : userId
    });

    if(existingLike){
        await Like.findByIdAndDelete(existingLike?._id)
    }
    else{
        const newLike = await Like.create({
            video : videoId,
            likedBy : userId
        })

        if(!newLike){
            throw new ApiError(400, "faild to like video")
        }
    }

    const totalLikes = await Like.countDocuments({video:videoId});

    return res.status(200).json(
        new ApiResponse(200, {liked : !existingLike , totalLikes}, "Like toggled successfully")
    )

})

const toggleCommentLike=asyncHandler(async(req,res)=>{
    const {commentId} = req.params
    const {userId} = req.user?._id

    console.log(commentId)

    if(!commentId){
        throw new ApiError(400,"CommentId is required")
    }

    const existingLike = await Like.findOne({
        comment : commentId,
        likedBy : userId
    });
 
    if(existingLike){
        await Like.findByIdAndDelete(existingLike?._id)
    }

    else{
        const newLike = await Like.create(
            {
            comment :commentId,
            likedBy : userId,
          },
    )

        if(!newLike){
            throw new ApiError(400, "faild to like video")
        }
    }

    const totalLikes = await Like.countDocuments({comment:commentId});

    return res.status(200).json(
        new ApiResponse(200, {liked : !existingLike , totalLikes}, "Like toggled successfully")
    )
})

const toggleTweetLike = asyncHandler(async(req,res)=>{
    const {tweetId} =  req.params
    const userId = req.user?._id

    if(!tweetId){
        throw new ApiError(400, "tweet id is required");
    }
   
    const existingLike = await Like.findOne({
        tweet : tweetId,
        likedBy : userId
    });


    if(existingLike){
        await Like.findByIdAndDelete(existingLike?._id)
    }
    else{
        const newLike = await Like.create({
            tweet : tweetId,
            likedBy : userId
        })

        if(!newLike){
            throw new ApiError(400, "faild to like video")
        }
    } 

    const totalLikes = await Like.countDocuments({tweet:tweetId});

    return res.status(200).json(
        new ApiResponse(200, {liked : !existingLike , totalLikes}, "Like toggled successfully")
    )


})

const getLikesVideos = asyncHandler(async(req,res)=>{
    const {page = 1, limit= 10} = req.query
    const parsedLimit = parseInt(limit);
    const pageSkip = (page-1)*parsedLimit;
    // const allLikeVideo = await Like.find({
    //     likedBy : req.user._id 
    // }).skip(pageSkip).limit(parsedLimit)

   

    const allLikeVideo = await Like.aggregate([
        {
            $match:{
                likedBy : new mongoose.Types.ObjectId(req.user._id),
                tweet : {$exists: false},  
                comment : {$exists : false}
            }
        },
        {
            $lookup:{
                from : "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
               
            }
        },
        {
            $unwind: "$video" // Unwind to access nested video data
        },
       {
         $lookup: {
            from: "users", // Assuming your User model is stored in the "users" collection
            localField: "video.owner",
            foreignField: "_id",
            as: "video.ownerInfo"
        }
    },
    {
        $project: {
            _id: 1,
            likedBy: 1,
            "video._id": 1,
            "video.videoFile": 1,
            "video.thumbnail": 1,
            "video.title": 1,
            "video.description": 1,
            "video.duration": 1,
            "video.views": 1,
            "video.isPublished": 1,
            "video.createdAt": 1,
            "video.ownerInfo._id": 1,
            "video.ownerInfo.username": 1,
            "video.ownerInfo.avatar": 1
        }
    },


        {
            $skip : pageSkip
        },
        {
            $limit: parsedLimit
        }
    ])
     
    console.log(allLikeVideo)
 
    if(!allLikeVideo) {
        throw new ApiError(404, "No likes video found")
    }

   return res
   .status(200)
   .json(new ApiResponse(200, allLikeVideo,"successfully found video"))


})

const getVideoLikes = asyncHandler(async(req,res)=>{
    const {videoId} = req.params

    if(!videoId){
        throw new ApiError(400, "video id is required")
    }

    const likesCount = await Like.countDocuments({video:videoId})
 
    return res.status(200).json(
        new ApiResponse(200, likesCount, "Successfully fetched video likes")
    )

})

const getCommentLikes = asyncHandler(async(req,res)=>{
    const {commentId} = req.params

    if(!commentId){
        throw new ApiError(400, "comment id is required")
    }

    const likesCount = await Like.countDocuments({comment:commentId})
 
    return res.status(200).json(
        new ApiResponse(200, likesCount, "Successfully fetched comment likes")
    )
})

export {toggleVideoLike,toggleCommentLike,toggleTweetLike, getLikesVideos,getVideoLikes,getCommentLikes}