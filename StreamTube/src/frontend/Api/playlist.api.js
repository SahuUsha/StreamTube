import { api } from "../api"



export const createPlaylist=async({name,description})=>{
    try {
        const response = await api.post("/playlists",{name,description})
        console.log("Create Response : ",response)
        return response

    } catch (error) {
        console.log("Error on creating playlist : ",error)
    }

}


export const getMyPlaylists = async()=>{
    try {
        const response = await api.get("/playlists/ownplaylist")
        console.log("My Playlists");
        return response

    } catch (error) {
        console.log("error on getting my playlist")
    }
}

export const getVideoByvideoId =async(videoid)=>{
    try {
        const response = await api.get(`/videos/${videoid}`)
        console.log("particular video : ",response);
        return response
               
    } catch (error) {
        console.log("error on getting  : ",error)
        
    }
}

export const getAllPlaylist = async()=>{
    try {
        const response = await api.get("/playlists");
        console.log("all playlist : ",response )
        return response
    } catch (error) {
        console.log("error on getting all playlist : ",error)
        
    }
}


export const AddToPlaylist=async(videoId,playlistId)=>{

   try {
    console.log("Video id : ",videoId)
    console.log("playlistId : ",playlistId)
    const response = await api.patch(`/playlists/add/${videoId}/${playlistId}`)
    console.log("Add to playlist : ",);
    return response;
   } catch (error) {
    console.log("Error adding video to playlist : ",error)
   }
}