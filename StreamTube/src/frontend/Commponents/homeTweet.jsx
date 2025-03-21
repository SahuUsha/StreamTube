import React from "react";
import { FaHeart, FaRetweet, FaComment } from "react-icons/fa";
import play from "../../assets/play.png";
import { useState , useEffect} from "react";
import { likeTweet } from "../Api/tweet.api";

const HomeTweet = ({ tweet }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [Tweetlike, setTweetLike] = useState(tweet.totalLikes || 0)
   console.log(tweet)

   useEffect(() => {
     handleLikeTweet(tweet._id)
    console.log("Tweetlike updated:", Tweetlike);
    setTweetLike(tweet.totalLikes);
    setIsLiked(tweet.liked)

},[tweet]);


   const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
  
    const intervals = {
      year: 31536000,   // 60 * 60 * 24 * 365
      month: 2592000,   // 60 * 60 * 24 * 30
      day: 86400,       // 60 * 60 * 24
      hour: 3600,       // 60 * 60
      minute: 60,
      second: 1,
    };
  
    for (const key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) {
        return `${interval} ${key}${interval !== 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  };
 

  const handleLikeTweet=async(tweetId)=>{
    try {

      const tweetIdString = tweetId.toString(); // Convert ObjectId to string
      console.log("Tweet ID being sent:", tweetIdString);
      

      const response = await likeTweet(tweetId)
      console.log(response);
       
      if (response && response.data) {
        setTweetLike(response.data.totalLikes);
        setIsLiked(response.data.liked);
        console.log("Updated likes:", response.data.totalLikes); // Debugging
    } else {
        console.error("Unexpected response format:", response);
    }

    } catch (error) {
       console.error("tweet like error : ",error)
    }
  }

  // Runs whenever Tweetlike changes


  return (
    <div className="flex space-x-4 p-4 border-b border-gray-700 w-full rounded-xl max-w-2xl bg-black text-white">
      {/* Avatar */}
      <img src={tweet.ownerInfo.avatar} alt="User Avatar" className="w-12 h-12 rounded-full" />

      {/* Tweet Content */}
      <div className="flex-1">
        {/* User Info */}
        <div className="flex items-center space-x-2">
          <h1 className="font-bold text-white mr-10">@{tweet.ownerInfo.username}</h1>
          <span className="text-gray-400 text-sm"> {getTimeAgo(tweet.updatedAt)}</span>
        </div>

        {/* Tweet Text */}
        <p className="text-gray-300 mt-1">{tweet.content}</p>

        {/* Engagement (Likes, Retweets, Comments) */}
        <div className="flex space-x-6 mt-2  text-gray-400 text-sm">
          <button onClick={()=>handleLikeTweet(tweet._id)} className="flex items-center space-x-1 hover:text-red-500">
            <FaHeart /> <span>{Tweetlike}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-blue-500">
            <FaRetweet /> <span>40</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-gray-200">
            <FaComment /> <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeTweet;
