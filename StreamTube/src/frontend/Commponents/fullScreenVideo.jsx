import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaThumbsUp } from 'react-icons/fa';
import { addComment, checkSubscribed, getAllComments, getCommentLike, getVideoLikes, likeVideo, subscribeVideo, toggleCommentLike, videoSubscriber, viewCountVideo } from '../Api/video.api';
import { AddToPlaylist, getAllPlaylist } from '../Api/playlist.api';


const FullScreenVideo = () => {
    const location = useLocation();
    const video = location.state?.video;
    console.log("Video:", video);
    
    if (!video) {
        return <p className="text-white text-center">No video found.</p>;
    }
    
    const [IsLiked, setIsLiked] = useState(false)
    const [videoLike, setVideoLike] = useState(video.totalLikes || 0)
    const [subscriber, setsubscriber] = useState(0)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [allComments, setallComments] = useState([])
    const [totalComments , setTotalComments] = useState(0)
    const [commit, setCommit] = useState("")
    const [videoLikecount, setVideoLikeCount] = useState(0)
    // const [likeCount, setlikeCount] = useState(0)
    const [playVideoId, setplayVideoId] = useState(null);
    const [playPlaylistId, setplayPlaylistId] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);


  useEffect(()=>{
        handlegetComments(video._id)
        handlegetVideoLike(video._id)
        handleVideoView(video._id)
     

  },[video])
   
//   useEffect(() => {
//     allComments.forEach(comment => {
//         handleGetLikeComment(comment._id);
//     });
// }, [allComments]);

    useEffect(()=>{
        if (video?.ownerInfo?.[0]?._id) {
        handleGetVideoSubscriber(video.ownerInfo[0]._id)
        ischeckSubscribed(video.ownerInfo[0]._id)
        console.log("subscribed : ",isSubscribed)
        }
    },[video,isSubscribed])

const handleLikeVideo=async(videoid)=>{
    try {

    //   const videoIdString = videoid.toString(); // Convert ObjectId to string
    //   console.log("Tweet ID being sent:", videoIdString);
      
      
      const response = await likeVideo(videoid)
      console.log(response);
       
      if (response && response?.data?.data) {
        // setVideoLike(response.data.data.totalLikes);
        setIsLiked(response.data.data.liked);
        // console.log("Updated likes:", response.data.data.totalLikes); // Debugging
        handlegetVideoLike(video._id)
    } else {
        console.error("Unexpected response format:", response);
    }

    } catch (error) {
       console.error("video like error : ",error)
    }
  }

const handlegetVideoLike=async(videoId)=>{
    try {
        const response = await getVideoLikes(videoId)
        console.log("video like : ", response);
        if(response?.data?.data !== undefined){
            setVideoLikeCount(response.data.data)
        }
    } catch (error) {
        console.log("Error on getting video like: ", error);
    }
}

  const handleGetVideoSubscriber=async(channelId)=>{
    try {
        const response = await videoSubscriber(channelId);
        console.log("channel subscriber : ", response);
        if(response?.data?.data?.subscriber !== undefined){

            setsubscriber(response.data.data.subscriber)

        }
        
    } catch (error) {
        console.log("Error on getting subscriber: ", error);
    }
  }



const ischeckSubscribed=async(channelId)=>{
    try {
        const response = await checkSubscribed(channelId)
        console.log("subscribed channel check: ", response);
        if(response?.data?.data !== undefined){
            setIsSubscribed(Boolean(response.data.data)); 
            console.log("subscribed : ",response.data.data)
        }
    } catch (error) {
        console.log("Error on checking subscribed: ", error);
    }
}


const handleSubscribe=async(channelId)=>{
        try {
            const response = await subscribeVideo(channelId)
            console.log("subscribed channel : ", response);
            if(response && response.data){
               setIsSubscribed(response.data.data.subscriber)
            }

        } catch (error) {
            console.error("Error subscribing:", error);
        }
}  


const handlegetComments=async(videoId)=>{
    try {
        const response = await getAllComments(videoId);
        if (response?.data?.data?.comments !== undefined) {
            console.log("comments : ", response);
            const comments = response.data.data.comments;

            // Fetch likes for each comment
            const updatedComments = await Promise.all(
                comments.map(async (comment) => {
                    const likeResponse = await getCommentLike(comment._id);
                    return { ...comment, likes: likeResponse?.data?.data || 0 };
                })
            );
            console.log("Updated comments:", updatedComments); 
            setallComments(updatedComments);
            setTotalComments(response.data.data.totalComments);
        }

    } catch(error) {
        console.log("Error on getting comments: ", error);
    }

}


const handleAddComment = async(videoId)=>{
    try {
        const response = await addComment(videoId,commit)
        console.log("comment added :",response)
        if(response && response.data){
            setCommit(response.data.data.content)
            handlegetComments(video._id)
            setCommit("")
        }
    } catch (error) {
        console.log("Error on adding comment: ", error);
    }
}


// const handleGetLikeComment=async(commentId)=>{
//        try {
//         const response = await getCommentLike(commentId); // API call to get likes
//         console.log(`Likes for comment ${commentId}:`, response.data);

//         if (response?.data?.data !== undefined) {
//             // Update the likes count for the specific comment
//             setallComments(prevComments =>
//                 prevComments.map(comment =>
//                     comment._id === commentId ? { ...comment, likes: response.data.data.likes } : comment
//                 )
//             );
//         }
//        } catch (error) {
//         console.log("Error on getting comments: ", error);
        
//        }
// }

const handleCommentLike=async(commentId)=>{
    try {
        const response = await toggleCommentLike(commentId)
        console.log("comment liked : ",response)
        if(response && response.data){
            handlegetComments(video._id)
        }

    } catch (error) {
        console.log("Error on liking comment: ", error);
    }
}


const handleVideoView=async(videoId)=>{
    try {
        const response = await viewCountVideo(videoId)
        console.log("video view : ", response);
        if(response?.data?.data !== undefined){
       
            console.log("video view count : ",response.data.data)
        }

    } catch (error) {
        console.log("Error on getting video view: ", error);
    }

}

const handleToAddPlaylist = async(videoId) => {
    try {
        const response = await getAllPlaylist();
        console.log(response);
        if (response.data && response.data.data) {
            const formattedPlaylists = response.data.data.map((playlist) => ({
                id: playlist._id,
                name: playlist.name
            }));
            setplayPlaylistId(formattedPlaylists);
            setplayVideoId(videoId);  // Store videoId when button is clicked
            setShowDropdown(true);   // Show the dropdown when playlists are loaded
        }
    } catch (error) {
        console.log("Error fetching playlists: ", error);
    }
};


// Handle Playlist Selection
const handlePlaylistSelection = (playlistId) => {
    setSelectedPlaylistId(playlistId);
};

// Handle Add Function with Custom Alert
const handleAdd = async() => {
    if (selectedPlaylistId && playVideoId) {

    try {
        const response = await AddToPlaylist(playVideoId,selectedPlaylistId);
        
        if(response){

            alert(`✅ Video ID: ${playVideoId} added to Playlist ID: ${selectedPlaylistId}`);
            setShowDropdown(false); 
        }

    } catch (error) {
        alert("error : ",error)
        
    } // Close dropdown after adding
    } else {
        alert('⚠️ Please select a playlist before adding.');
    }
};

    return (
        <div className="flex flex-col md:flex-row w-full h-screen bg-black text-white">
            {/* Video Section */}
            <div className="w-full md:w-3/4 flex justify-center items-center h-[80vh]">
                <video 
                    className="w-full h-full object-contain"
                    controls
                    src={video.videoFile} 
                ></video>
            </div>
            
            {/* Video Info & Interaction Section */}
            <div className="w-full md:w-1/4 p-4 flex flex-col gap-4">
                {/* Channel Info */}
                <div className="flex items-center gap-3">
                    <img 
                        className="w-12 h-12 rounded-full"
                        src={video.ownerInfo[0]?.avatar} 
                        alt={video.ownerInfo[0]?.username} 
                    />
                    <div>
                        <h1 className="font-bold text-lg">{video.ownerInfo[0]?.username}</h1>
                        <p className="text-gray-400 text-sm">{subscriber} Subscriber</p>
                    </div>
                    <button 
    onClick={() => handleSubscribe(video.ownerInfo[0]?._id)} 
    className={`ml-auto px-4 py-1 rounded-lg transition duration-300 
        ${isSubscribed ? "bg-gray-600 " : "bg-red-600 hover:bg-red-700"}
    `}
   
>
    {isSubscribed ? "Subscribed" : "Subscribe"}
</button>
                </div>

                {/* Video Title & Description */}
                <div>
                    <h1 className="text-xl font-bold">{video.title}</h1>
                    <h1 className="text-gray-300 text-sm mt-1">{video.description}</h1>
                </div>
                
                {/* Video Actions */}
                <div className="flex items-center justify-between mt-2 text-gray-400 text-sm">
  {/* Like Button */}


  <button
    onClick={() => handleLikeVideo(video._id)}
    className="flex items-center gap-1 bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition duration-300"
  >
    <FaThumbsUp className="text-white" /> 
    <span className="text-white">{videoLikecount}</span>
  </button>

  {/* Views */}
  <p className="text-gray-300 text-[1.1rem]">{video.views} views</p>
 {/* Add to Playlist Button & Dropdown Wrapper */}
 <div className="relative inline-block">
    <button 
        onClick={() => handleToAddPlaylist(video._id)}
        className="bg-yellow-500 px-4 py-2 rounded-lg text-black font-semibold hover:bg-yellow-600 transition"
    >
        Add to Playlist
    </button>

    {/* Playlist Dropdown */}
    {showDropdown && (
        <div 
            className="absolute top-full right-0 mt-2 w-[18rem] p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-600 z-50"
        >
            {/* Close Button */}
            <button 
                onClick={() => setShowDropdown(false)}
                className="absolute top-1 right-1 text-white text-lg hover:text-red-500"
            >
                ✖
            </button>

            <select
                onChange={(e) => handlePlaylistSelection(e.target.value)}
                value={selectedPlaylistId || ''}
                className="w-full p-2 bg-gray-700 text-white rounded-md"
            >
                <option value="" disabled>Select Playlist</option>
                {playPlaylistId.map((playlist) => (
                    <option key={playlist.id} value={playlist.id}>
                        {playlist.name}
                    </option>
                ))}
            </select>

            {/* Confirm Button */}
            <button
                onClick={handleAdd}
                className="bg-white px-4 py-2 mt-2 rounded-lg text-black font-semibold hover:bg-yellow-400 transition"
            >
                Confirm Add
            </button>
        </div>
    )}
</div>
</div>


                {/* Comments Section */}
                <div>
                    <h1 className="font-bold text-lg">Comments</h1>
                    <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        value={commit}
                        onChange={(e) => setCommit(e.target.value)}
                        className="w-full p-2 bg-gray-800 rounded-lg mt-2"
                    />
                    <button onClick={()=>handleAddComment(video._id)} className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 px-6 py-1 text-black font-semibold rounded-lg mt-2 hover:bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500transition duration-300">Post</button>
                    <div className="mt-4">
                    {allComments.map(comment => (
                        //  handleGetLikeComment(comment._id),

    <div key={comment._id} className="flex items-start gap-4 p-4 border-b border-gray-700">
        {/* Avatar */}
        <img 
            src={comment.owner[0]?.avatar} 
            alt={comment.owner[0]?.username} 
            className="w-12 h-12 rounded-full object-cover"
        />

        {/* Comment Content */}
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <h1 className="font-bold">{comment.owner[0]?.username}</h1>
                <span className="text-gray-500 text-sm">{comment.timeAgo}</span>
            </div>
            <p className="text-gray-300">{comment.content}</p>

         
            <div className="mt-2 flex items-center gap-2">
                <button 
                    onClick={() => handleCommentLike(comment._id)} 
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition"
                >
                    <FaThumbsUp className="w-5 h-5" />
                    <span className="text-sm">{comment.likes || 0}</span>
                </button>
            </div>
        </div>
    </div>
))}
 </div>
                </div>
            </div>
 {/* Playlist Dropdown */}


        </div>
    );
}

export default FullScreenVideo;