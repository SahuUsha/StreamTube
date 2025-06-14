import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    cloud_name: "ushasahu", 

    // it is secrete data don'nt need to show 
    api_key : 	639392966878455,
    // api_key: process.env.Cloudinary_ApiKey, 
    // api_secret: process.env.CLODINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    api_secret: "svpeFNZuBUN98PPHEyqcEzWvovc" // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type : "auto"})
    
       // file has been uploaded successfully
        console.log("file is uploaded on cloudinary : ",response.url);
        fs.unlinkSync(localFilePath) // remove from local
        return response

    } catch (error) {
        console.log(error)
        fs.unlinkSync(localFilePath) // remove the locally saved temporary  file as the upload operation got failed
        return null
     
    }
}


const deleteFromCloudinary = async(ImageUrl)=>{
    return cloudinary.uploader.destroy(ImageUrl);
}

const getPublishIdfromCloudinary=async(url)=>{
    const parts = url.split('/');
    return parts[parts.length-1].split('.')[0]
}

import ffmpeg from "fluent-ffmpeg"
import { resolve } from 'path';
import { rejects } from 'assert';

// const getVideoDurationFromUrl=async(url)=>{
//    return new Promise((resolve, reject)=>{
//     ffmpeg(url).ffprobe((err,metadata)=>{
//         if(err){
//             reject(err)
//         }else{
//             const duration = metadata.format.duration
//             duration = `${Math.floor(duration/60)}:${Math.floor(duration%60)}`
//             console.log(duration)
//             resolve(duration)
//         }
//     })
//    })


// }
export {uploadOnCloudinary,
    deleteFromCloudinary,
    getPublishIdfromCloudinary,
    // getVideoDurationFromUrl
}