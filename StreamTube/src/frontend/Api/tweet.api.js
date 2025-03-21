import { api } from "../api";


export const getAllTweet = async()=>{
    try {
        const response = await api.get('/tweets');
        console.log('Tweet : ',response)
        return response
        
    } catch (error) {
        console.error("Error on fetching tweets : ",error)
    }
}
  
export const creatTweet = async(content)=>{
    try {
        const response = await api.post('/tweets',content);
        console.log('Created tweet : ',response)
        return response
        
    } catch (error) {
        console.log("Error on creating tweet : ",error)
    }
}


export const likeTweet = async(tweetId)=>{
    console.log("Tweet ID being sent:", tweetId); // Debugging

    if (!tweetId) {
        console.error("Error: params is undefined!");
        return;
    }

    try {
        const response = await api.post(`/likes/toggle/t/${tweetId}`)
        console.log("like tweet : ",response.data)
        return response.data
    } catch (error) {
        console.log("error liking tweet : ",error.response?.data || error.message)
    }
}