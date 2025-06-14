import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import ApiResponse from "../utils/ApiResponse.js";



const getChannelStats = asyncHandler(async(req,res)=>{
    const channelId = req.user._id;


  const getChannelStats = await User.aggregate([
      {
         $match :{
            _id : new mongoose.Types.ObjectId(channelId)
         }
      },
      {
        $lookup :{
            from : "subscriptions",
            localField: "_id",
            foreignField : "channel",
            as : "subscribers"
        }
      },
      {
        $lookup : {
            from :"videos",
            localField : "_id",
            foreignField : "owner",
            as: "videos",
           
        },
        
      },
      {
        $unwind:{
            path : "$videos",
            preserveNullAndEmptyArrays : true
        }
      },
      {
          $lookup:{
            from :"likes",
            localField: "videos._id",
            foreignField: "video",
             as: "videos.likes"
          },
         
      },
      {
        $addFields :{

            
            "videos.likesCount" : {$size : { $ifNull: ["$videos.likes", []] } } ,
            "totalSubscribers": { $size: { $ifNull: ["$subscribers", []] } }
            
        }
    },
    {
        $group : {
            _id : "$_id",
            avatar : { $first: "$avatar" },
            coverImage : { $first: "$coverImage" },
            fullname : { $first: "$fullname" },
            username : { $first: "$username" },

            totalViews : {$sum : "$videos.views"},
            totalLikes : {$sum : "$videos.likesCount"},
            totalVideos : {$sum : 1},
         //    totalSubscribers: { $size: { $ifNull: ["$subscribers", []] } },

            // totalSubscribers : {
            //     $sum : {
            //         $cond : [{$isArray : "$subscribers"}, {$size: "$subscribers"},0],
            //     }
            // }

            totalSubscribers: { $first: "$totalSubscribers" }
      }
    }
    
  ])
  if(!getChannelStats.length){
    throw new ApiError(400 , "channel status is not found")
  }

  return res.status(200).json(new ApiResponse(200, getChannelStats[0],"successfully get channel stats"))

})

const getChannelVideos = asyncHandler(async (req,res)=>{
      
    // const {userId} = req.user._id
       
    const allVideo = await Video.find({owner: req.user?._id})

    if(!allVideo){
        throw new ApiError(400, "Video is not found");
    }

    console.log(allVideo)
    return res.status(200).json(new ApiResponse(200,allVideo,"Successfully fetched video"))
 

})
export {
    getChannelStats,
    getChannelVideos
}