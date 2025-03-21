import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, getPublishIdfromCloudinary, 
    // getVideoDurationFromUrl, 
    uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

import ffmpeg from 'fluent-ffmpeg';
import { parse } from "dotenv";


const getAllVideos = asyncHandler(async(req,res)=>{
    const {page = 1 , limit = 10 , query , sortBy ="createdAt", sortType ,userId} = req.query
    console.log(req.query)


    const videolimit = parseInt(limit);
    const pageSkip = (page-1)*videolimit
    const sortStage ={};
    sortStage[sortBy] = sortType === 'asc' ? 1: -1;

    const AllVideo = await Video.aggregate([
        {
            $match :{
                isPublished : true,
                // ...(query &&{ title : {$regex : query , $option : "i"}} ),
                // ...(userId && {owner : mongoose.Types.ObjectId(userId)})             
            },
        }, 
        {
            $lookup:{
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as : "ownerInfo",
                pipeline : [
                    {
                        $project :{
                            username : 1,
                            avatar : 1
                        }
                    }
                ]
            }
        },
        {
            $addFields :{
                ownerDetails : {
                    $arrayElemAt : ["$ownerDetails",0]
                }
            }
        },
        {
           $sort : sortStage,
        },
        {
            $skip : pageSkip
        },
        {
             $limit : videolimit,
        },
        {
            $project : {
                _id:1,
            videoFile : 1,
            thumbnail : 1,
            title : 1,
            description:1,
            views:1,
            createdAt:1,
            "ownerInfo._id" : 1,
            "ownerInfo.username" : 1,
            "ownerInfo.avatar" :1,

        }
    }
    ])
  
    console.log(AllVideo)
return res
    .status(200)
    .json(200,{ data : AllVideo ,meta : {
        currentPage : parseInt(page,10),
        limit : videolimit,
        total :AllVideo.length,
    }})

})

const publishVideo = asyncHandler(async(req,res)=>{
    // get what video want to upload
    const {title ,  description, isPublished } = req.body
    // console.log(req.body)
    if([title,description].some((field) => field?.trim()==="")){
        throw new ApiError(400, "title and dicription are required")
    }

    
    const videoLocalPath = req.files?.videoFile?.[0]?.path
    // console.log(videoLocalPath)

    if(!videoLocalPath){
        throw new ApiError(400,"VideoFile is required");
    }


    // extract duration 
//    let duration ;
//    try {
//     duration =  await getVideoDuration(videoLocalPath);
//    } catch (error) {
//     console.log(error)
//     throw new ApiError(400,"failed to retrive video duration")
//    }



    const videoFile = await uploadOnCloudinary(videoLocalPath)
    // console.log(videoFile) 

    if(!videoFile){
        throw new ApiError(400,"Failed to upload video")
    }

    // const duration = await getVideoDurationFromUrl(videoFile?.url)
    // console.log(duration)
   
    // if(!duration){
    //     throw new ApiError(401,"failed to fetch video duration")
    // }

    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    console.log(thumbnailLocalPath)

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    // console.log(thumbnail)

    if(!thumbnail){
        throw new ApiError(400 , "Failed to uplod thumbnail")
    }


    // if(!isPublished){
    //     throw new ApiError("video is not allowed for publish");
    // }
    
    
    try {
        const video= await Video.create(
            {
            title,
            description,
            videoFile : videoFile?.url,
            thumbnail : thumbnail?.url, 
            owner : req.user,
            isPublished,
            // duration,
            // duration:  ,
            
        }
    )
    
        const videoPublished = await Video.findById(video._id)
        // console.log(videoPublished)
    
        
    
        if(!videoPublished){
            throw new ApiError(500, "Video is not published")
        }
        return res.status(202).json(
            new ApiResponse(200,videoPublished,"Video published successFully")
        )
    } catch (error) {
        console.log("Error : ",error)
    }
})


const getVideoById = asyncHandler(async(req,res)=>{
    const {videoId}   = req.params 
    console.log(videoId) 
    console.log(req.params)

    // if(!mongoose.Types.ObjectId.isValid(videoId)){
    //     throw new ApiError(500 , "Invalid ObjectId")
    // }

    if(!videoId){
        throw new ApiError(400, "video id not found")
    }
    const video =   await Video.aggregate([
         {
            $match:{_id :new mongoose.Types.ObjectId(videoId)}
         },{
            $lookup:{
                from: "users",
                localField :"owner",
                foreignField : "_id",
                as: "ownerInfo"
            
            }
         },
         {
            $project : {

                _id : 1,
                videoFile : 1,
                thumbnail : 1,
                title : 1,
                description :1,
                owner :1,
                createdAt :1 ,
                views :1,
                "ownerInfo._id" : 1,
                "ownerInfo.username" : 1,
                "ownerInfo.avatar" : 1

            }
         }
    ])
    if(!video){
        throw new ApiError(400 , "Failed to get video by Id")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"get video by id successsfully")
)
})

const updatedVideo = asyncHandler(async(req,res)=>{
    const { videoId } = req.params;
    const { title, description } = req.body;
    
    // console.log(req.files?.thumbnail?.[0])
    // const thumbnailLocalPath =  req.file?.path


    // if(!thumbnailLocalPath){
    //     throw new ApiError(400 , "thumbnailLocalPath is not found")
    // }

    
    if(!videoId){
        throw new ApiError(400, "video id not found")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(400,"video does not exist in dataBase")
    }

    if(!req.user?._id.equals(video.owner)){
        throw new ApiError(500, "only owner can edit the video")
    }

    if ([title, description].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "Title and description cannot be empty");
    }


    console.log(title, description)


    // if(!title || !description){
    //     throw new ApiError(400, "Description or email is required")
    // }

    const updateFields ={}

    if(title?.trim()) {
        updateFields.title = title
    }

    if(description?.trim()) {
        updateFields.description = description
    }

    // if(thumbnailLocalPath){
    //  await deleteforUpdatingVideo(videoId , thumbnailLocalPath)

    //  const thumbnail = await uploadOnClodinary(thumbnailLocalPath)

    //  if(!thumbnail.url){
    //     throw new ApiError(400 , "thumbnai is failed to upload")
    //  }

    //  updateFields.thumbnail = thumbnail.url
    // }

    // if (Object.keys(updateFields).length === 0) {
    //     throw new ApiError(400, "No valid fields provided to update");
    // }

    
    const updatedVideo = await Video.findByIdAndUpdate(videoId, 
        {
            $set :
              updateFields
        },
        {
            new : true
        }
    )

    if(!updatedVideo){
        throw new ApiError(400 , "failed to update video")
    }

    // await video.save({ validateBeforeSave : false})
    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video is updated successfully"))
})

const deleteforUpdatingVideo = async (videoId , thumbnailLocalPath)=>{
    if(!videoId){
        throw new ApiError(404 , "video id is required")
    }

    try {
        const video = await Video.findById(videoId)
        
        if(!video){
            throw new ApiError("400" , "video is not in Database")
        }

        if(thumbnailLocalPath){
            if(video.videoFile){
                const videoUrl = await getPublishIdfromCloudinary(video.videoFile)

                if(videoUrl){
                    await deleteFromCloudinary(videoUrl)
                }
            }
            }


    }catch (error) {
        console.log(error)
    }
}

const deleteVideo = asyncHandler(async(req,res)=>{
    const {videoId} = req.params


    if(!videoId) {
        throw new ApiError(400, "Video id is not found" );
    }


    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"video not found")
    }

   if(!req.user?._id.equals(video.owner)){
       throw new ApiError(400,"only owner can delete the video, you don't have permission")
   }

  const videoFileId = await getPublishIdfromCloudinary(video.videoFile)
  const thumbnaiId = await getPublishIdfromCloudinary(video.thumbnail)

  if(!videoFileId){
    throw new ApiError(400, "failed to fetch videoFile id")
  }

  if(!thumbnaiId){
    throw new ApiError(400, "failed to fetch thumbnail id")
  }

  await deleteFromCloudinary(videoFileId)
  await deleteFromCloudinary(thumbnaiId)


   const deletedVideo = await Video.findByIdAndDelete(videoId)
   console.log(deletedVideo)
   if(!deletedVideo){
    throw new ApiError(400 , "fail to delete video");
   }

   return res
   .status(200)
   .json(200, deletedVideo, "video deleted successfully")

})

const incrementVideoView = asyncHandler(async(req,res)=>{
    const {videoId} = req.params;
    const userId = req.user?._id

    if(!videoId){
        throw new ApiError(400,"Video Id is required");
    }

    // i have to improve this code --> when video is watch then increment the view count
    const isViewed = await Video.findOne({
       _id : videoId,
       viewedBy : userId
    })

    if(!isViewed){
        const  updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            {$inc : {views : 1},
            viewedBy : userId    //improve later --> if we keep it in array then it will be expansive to search on it
        },
            {new : true}
        )
    
        if(!updatedVideo){
            throw new ApiError(500,"Failed to update view count");
        }
    }


    return res.status(200).json(new ApiResponse(200,updatedVideo,"successfully update view count"))
})

const getYourVideo = asyncHandler(async (req, res) => {
    console.log("User from request:", req.user); // Debugging step

    const userId = req.user._id; // Ensure _id is used

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    try {
        const allVideo = await Video.aggregate([
            { 
                $match: { owner: new mongoose.Types.ObjectId(userId) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerInfo",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                username: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    ownerInfo: { $arrayElemAt: ["$ownerInfo", 0] }
                }
            },
            {
                $lookup :{
                     from : "likes",
                        localField : "_id",
                        foreignField : "video",
                        as : "likes",

                }
            },
            {
                $addFields: {
                    likeCount: { $size: "$likes" } // Count the number of likes
                }
            },
            {
                $sort: { createdAt: -1 } // Sorting in descending order
            },
            {
                $project: {
                    _id: 1,
                    videoFile: 1,
                    thumbnail: 1,
                    title: 1,
                    description: 1,
                    createdAt: 1,
                    views: 1,
                    likeCount: 1,
                    "ownerInfo._id": 1,
                    "ownerInfo.username": 1,
                    "ownerInfo.avatar": 1,
                }
            }
        ]);

        console.log("Fetched videos:", allVideo);
        return res.status(200).json(
            new ApiResponse(200, allVideo.length > 0 ? allVideo : "No video", "Successfully fetched videos")
        );
    } catch (error) {
        console.error("Error fetching videos:", error);
        throw new ApiError(500, "Internal Server Error");
    }
});




export {publishVideo,getAllVideos,getVideoById,updatedVideo,deleteVideo , incrementVideoView,getYourVideo}