
// import { api } from "../api.js";

import axios from "axios";


// export const fetchAllVideo=async(query)=>{
//     const token =  localStorage.getItem('accessToken');
//     console.log('Token from localStorage:', token); 
//     try {
//         const response = await api.get("/videos",{ headers :{
//             Authorization: `Bearer ${token}`,
//         }, params:query});
//         return response;
//     } catch (error) {
//         console.log("Error on fetching videos",error)
//         throw error.response?.data || error;
//     }
// };

const API_URL = 'https://streamtube-v2gc.onrender.com/api/v1';

const token = localStorage.getItem('accessToken')

console.log("it is token: ",token)
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,  // Send the token in the Authorization header
    },
});

api.interceptors.request.use((config) => {
    // const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const fetchAllVideo = async (queryParams) => {
   
    try {
        const response = await api.get('/videos', { params: queryParams });
        console.log('Videos:', response);
        return response
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
};

export const uploadVideo=async(videodata)=>{
    try {
        const response = await api.post("/videos", videodata, {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure correct content type
          },
        });
        console.log("uploaded video : ", response);
        return response;
      } catch (error) {
        console.log("Error on uploading: ", error);
      }
}

export const likeVideo=async(videoId)=>{
    try {
        const response = await api.post(`/likes/toggle/v/${videoId}`);
        console.log("liked video : ", response);
        return response;
      }catch (error) {
        console.log("Error on liking: ", error);
      }
}

export const subscribeVideo=async(channelId)=>{
    try {
        const response = await api.post(`/subscribe/c/${channelId}`)
        console.log("subscribed channel : ", response);
        return response;
    } catch (error) {
        console.log("Error on subscribing: ", error);
    }
}

export const videoSubscriber=async(channelId)=>{
    try {
        const response = await api.get(`/subscribe/c/${channelId}`)
        console.log("channel subscriber : ", response);
        return response;
    } catch (error) {
        console.log("Error on getting subscriber: ", error);
    }
}


export const checkSubscribed=async(channelId)=>{
    try {
        const response = await api.post(`/subscribe/checksub/${channelId}`)
        console.log("subscribed channel : ", response);
        return response;
        
    } catch (error) {
        console.log("Error on checking subscribed: ", error);
    }
}

export const getAllComments=async(videoId)=>{
    try {
        const response = await api.get(`/comments/user/${videoId}`)
        console.log("comments : ", response);
        return response;

    } catch (error) {
        console.log("Error on getting comments: ", error);
    }
}

export const addComment=async(videoId,content)=>{
    try {
        const response = await api.post(`/comments/${videoId}`,{ content })
        console.log("comment added :",response)
        return response;
    } catch (error) {
        console.log("Error on adding comment: ", error);
    }
}

export const getVideoLikes=async(videoId)=>{
    try {
        const response = await api.get(`/likes/videolikes/${videoId}`)
        console.log("video likes : ",response)
        return response

        } catch (error) {
            console.log("Error on getting likes: ", error);
        
    }
}

export const getCommentLike = async(commentId)=>{
    try {
        const response = await api.get(`/likes/commentlikes/${commentId}`)
        console.log("no. of comment likes : ",response)
        return response
        
    } catch (error) {
        console.log("Error on getting likes: ", error);
        
    }
}

export const toggleCommentLike = async(commentId)=>{
    try {
        const response = await api.post(`/likes/toggle/c/${commentId}`)
        console.log("toggle comment liked : ",response)
        return response
        
    } catch (error) {
        console.log("Error on liking comment: ", error);
    }
}


export const getVideoById = async()=>{
    try {
        
    } catch (error) {
        
    }
}


export const getYourVideo =async()=>{
    try {
        const response = await api.get(`/videos/y/yourvideo`)
        console.log(response)
        return response
        
    } catch (error) {
        console.log("error on getting your video: ",error)
        
    }

}


export const getLikedVideos = async()=>{
    try {
        
        const response  =  await api.get(`/likes/videos`)
        console.log("liked videos : ",response)
        return response

    } catch (error) {
        console.log("Error on getting liked videos: ", error);
    }
    
}


export const viewCountVideo = async(videoId)=>{
    try {
        const response = await api.post(`/videos/view/${videoId}`)
        console.log("video viwed : ",response)
        return response
        
    } catch (error) {
        console.log("Error on viewing video: ", error);
    }
}

export const deleteVideo = async(videoId)=>{
    try {
        const response = await api.delete(`/videos/${videoId}`)
        console.log("video deleted : ",response)
        return response
    } catch (error) {
        console.log("Error on deleting video: ", error);
    }
}

export const updateVideo = async(videoId,videoData)=>{
    try {
        const response = await api.patch(`/videos/${videoId}`,videoData)
        console.log("video updated : ",response)
        return response

    } catch (error) {
         console.log("Error on updating video: ", error);
    }
}