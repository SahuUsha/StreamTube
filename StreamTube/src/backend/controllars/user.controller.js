import verifyJWT from "../middleware/auth.middleware.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const generateAccessAndRefreshToken = async(userId)=>{
    try {
        
            const user = await User.findById(userId);
            if (!user) {
              throw new ApiError(404, "User not found");
            }
        
            // Generate tokens
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();
    
            user.refreshToken = refreshToken;
     
            await user.save({ validateBeforeSave: false });  
    
            return { accessToken, refreshToken };
    } catch (err) {
        console.error("Error generating tokens:", err);  // Log the actual error here
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
    }

  
}


const registerUser = asyncHandler(async(req,res)=>{

    const {fullname , email , username,password} = req.body 
    console.log("email: ",email)
    console.log("password: ",password)
    console.log(req.body)

    if(
        [fullname,email,username,password].some((field)=> field?.trim()==="")

    ){
        throw new ApiError(400, "All field are required")
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        throw new ApiError(400, "Invalid email format");
    }

    const existedUser =await  User.findOne({

        $or : [{username},{email}]
       })
    //    console.log(existedUser);
       if(existedUser){
        throw new ApiError(409 ,"User with email or username already exist")
       }

       const avatarLocalPath =  req.files?.avatar?.[0]?.path
       console.log(avatarLocalPath);
       const coverImageLocalPath = req.files?.coverImage?.[0]?.path
       console.log(coverImageLocalPath)


       if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
       }

       const avatar= await uploadOnCloudinary(avatarLocalPath)

       const coverImage= coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null

       if(!avatar){
        throw new ApiError(400,"Failed to upload avatar file")
     }
    
    const user= await User.create({
        fullname ,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username
    
     })
     const createdUser = await User.findById(user._id).select(
        "-password -refreshTocken " // here we write what do attribut we don't want
    )

    if(!createdUser){
        throw new ApiError(500,"some thing went worng while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})

 
const loginUser = asyncHandler(async(req,res)=>{

    const {email ,username,password} = req.body 

    if(!password){
        throw new ApiError(400 , "password is required")
    }

    if(!username && !email  ){
        throw new ApiError(400 , "username and email is required")
     }
    
 
     const user = await User.findOne({
 
        $or : [{email},{username}]  // find on basis of either username or email
 
     })
 
     if(!user){
         throw new ApiError(404,"User does not exist");
     }

     const isPasswordValid =  await user.isPasswordCorrect(password)

     if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credential");
     }

     const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)
     console.log(accessToken)
     console.log(refreshToken)

     const loggedInUser =  await User.findById(user._id).select("-password -refreshToken");

     const options = {  // here we are designing option to send  cookies
        httpOnly : true,
        secure : true
        // if we keep both true then we can  modified it by server only we can modified it through frontend
      }
      // verifyJWT()
      

      return res
      .status(200)
      .cookie("accessToken", accessToken  ,options)
      .cookie("refreshToken" , refreshToken,options)
      .json
      (
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
      )
})

const logoutUser = asyncHandler(async(req,res)=>{
    // we have get access of user through middleware

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken : undefined
            }
        },
        {
            new : true // we can set new attribute
        }
    )
    const options={
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .clearCookie("accessToken" , options)
    // .clearCookie("refreshToken" , options)
    .json(
        new ApiResponse(200,{},"user logged out")
)})

const refreshaccessToken= asyncHandler(async(req,res)=>{
    // we can accecc refreshToken from cookies
  try {
      const inocomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
      if(!inocomingRefreshToken){
        throw new ApiError(401,"unauthorized request of refresh token")
      }
    // we wan raw token which is present in database
      const decodedToken = jwt.verify(inocomingRefreshToken ,proccess.env.REFRESH_TOKEN_SECRET )
      console.log(decodedToken)
    
      const user = await User.findById(decodedToken?._id)
      if(!user){
        throw new ApiError("Invalid refesh token")
      }
    
      if(inocomingRefreshToken!=user?.refreshToken){
        throw new ApiError("Invalid refesh token or refreshToken is expired")
      }
     
      const options={
      httpOnly : true,
      secure : true
      }
    
      const { accessToken, newRefreshToken} = await generateAccessandRefreshTokens(user?._id)
    
      return res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",newRefreshToken,options
      .json(
        new ApiResponse(200 ,{accessToken,refreshToken: newRefreshToken }, " refresh  accessToken")
      )
      )
  } catch (error) {
     throw new ApiError(401 ,error?.message || "Invalid refresh token")
  }
 })

 const changeCurrentPassword = asyncHandler(async(req,res)=>{
    // we can take confirfPassword
    const {oldPassword,newPassword} = req.body
    // const {oldPassword,newPassword,confirmPassword} = req.body
  
    // if(newPassword!=confirmPassword){
    //   throw new ApiError(400 , "newpassword and confirmpassword is not same")
    // }
  
    const user = await User.findById(req.user?._id)
  
    const isPasswordCorrect=  await  user.isPasswordCorrect(oldPassword)
  
    if(!isPasswordCorrect){
      throw new ApiError(400,"Invalid Password")
    }
  
    user.password = newPassword
    await user.save({validateBeforeSave : false})
  
  
  return res
  .status(200)
  .json(
    new ApiResponse(200,{},"Password change successfully")
  )
  })

  const getCurrentUser = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(200,
      req.user,
      "current user fetched successfully"
    )
  })

  const updateAccountDetail=asyncHandler(async (req,res)=>{
    const{fullname, email} = req.body
  
    if(!fullname || !email){
      throw new ApiError(400 , "All field is required")
    }
  
    
  const updatedUser =   await User.findByIdAndUpdate(req.user?._id,
    {
       $set:{
        fullname,
        email : email
  
       }
    },{
      new : true  // new updated info return
    }
  ).select("-password")
    // for files create separate controller
  
    return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Account is updated successfully"))
  })

const updateUserAvatar = asyncHandler(async(req,res)=>{
    console.log(req.file)
   const avatarLocalPath=  req.file?.path;
   console.log(avatarLocalPath)
  
   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is missing")
   }
  
  
  await deleteOldImage(req.user._id , avatarLocalPath)
  
  const avatar = await uploadOnClodinary(avatarLocalPath)
  
  if(!avatar.url){
    throw new ApiError(400,"new avatar is failed to upload");
  }
  
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set:{
        avatar : avatar.url
      }
    },
    {
      new : true
    }
  ).select("-password")
  
  return res
      .status(200)
      .json(
        new ApiResponse(200,user,"Avatar is updated successfully")
      )
  
  }
  )

  const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const coverImageLocalPath = req.file?.path
  
    let coverImage ="";
    // coverImage is not compulsory
    if(coverImageLocalPath){
      // throw new ApiError(400 ,"coverImage is missing")
      await deleteOldImage(req.user._id ,coverImageLocalPath)
      coverImage = await uploadOnClodinary(coverImageLocalPath)
    }
  
   const user=  await User.findByIdAndUpdate(req.user?._id,
      {
        $set:{
          coverImage: coverImage?.url || ""
        }
      },
      {
        new: true
      }
    ).select("-password")
  
  
   return res
        .status(200)
        .json(
          new ApiResponse(200,user,"coverImage is updated" )
        )
  
  })

  const deleteOldImage =async(userId, coverImageLocalPath)=>{
    if(!userId){
      throw new ApiError(404,"User does not exist")
    }
    try {
      const user = await User.findById(userId)
  
      if(!user){
        throw new ApiError(400 ,"User not found to delete image")
      }
  
      if(coverImageLocalPath){
  
        if(user.coverImage){
          const imageurl = await getPublishIdfromCloudinary(user.coverImage)
          if(imageurl){
            await deleteFromCloudinary(imageurl)
          }
        }
      }
    } catch (error) {
      console.log(error)
      
    }
  }

  const getUserChannelProfile= asyncHandler(async(req,res)=>{
    // now we will take user from params--> from url
  
    const {username} = req.params 
  
  
    if(!username?.trim()){
      throw new ApiError(400,"Username is missing")
    }
  
  
    // we are using aggregation directly 
    const channel = await User.aggregate([ // it return array
      // create aggregation pipline
  
      {
           $match : {
            username : username?.toLowerCase()
           }
      },
      {
        $lookup:{
          from : "subscriptions", // in database it become pural
          localField : "_id",
          foreignField:"channel",
          as:"subscribers"
        }
      },
      {
        $lookup:{
          from : "subscriptions", // in database it become pural
          localField : "_id",
          foreignField:"subscriber",
          as:"subscribedTo" // maine kisko subscipe kar rakha hai
        }
      },
      {
        $addFields : {
          subscribersCount : {
            $size : "$subscribers"
          },
          channelSubscribedToCount : {
            $size : "$subscribedTo"
          },
          // now check user subscibe this channel or not 
          isSubscribed :{
            $cond :{
              if : {$in:[req.user?._id|| null , "$subscribers.subscriber"]},
              then:true,
              else : false // sent to frontend if true : subscribeed and if false : not subscribed channel
            }
          }
        }
      }, 
      {
          $project : { // it will not return everthing ,it will give only selected thing
           fullname : 1,
           username : 1,
           subscribersCount: 1,
           channelSubscribedToCount : 1,
           avatar : 1,
           coverImage: 1,
           email : 1,
        }
      }
    ])
  
    console.log(channel)
  
    if(!channel?.length){
      throw new ApiError(400 ,"channel  does not exist")
    }
    
    console.log(channel)
  
    return res
    .status(200)
    .json(
      new ApiResponse(200,channel[0],"channel fetched successfully")
    )
  }
  )

  const getWatchHistory = asyncHandler(async(req,res)=>{
    const user = await User.aggregate([
      {
        $match : {
          _id: new mongoose.Types.ObjectId(req.user._id) // convert to id from mongodb id string
        }
      },
      {
          $lookup : {
            from : "videos",
            localField : "watchHistory",
            foreignField : "_id",
            as : "watchHistory",
            pipeline :[
              {
              $lookup : {
                from : "users",
                localField : "owner",
                foreignField : "_id",
                as: "owner",
                pipeline : [
                  {
                    $project :{
                      fullname : 1,
                      username:1,
                      avatar : 1

                    }
                  }
                ]

              }
            },
            {
              // it only for frontend to send data 
              $addFields:{
                owner : {
                  $first :"$owner"
                }
              }
            }
            ]

          }
      },
    ])
 return res
 .status(200)
 .json(
  new ApiResponse(
    200,
    user[0].watchHistory ,
    "watch history is fetched successfully"
  )
 )
    
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshaccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetail,
    updateUserAvatar,
    updateUserCoverImage,
    getWatchHistory,
    getUserChannelProfile

}