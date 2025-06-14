import React, { useEffect, useState } from "react";
import { fetchAllVideo } from "../Api/video.api";
import { getAllTweet } from "../Api/tweet.api";
import HomeVideo from "../Commponents/homeVideo";
import HomeTweet from "../Commponents/homeTweet";
import CreateTweet from "../Commponents/createTweet";
import FullScreenVideo from "../Commponents/fullScreenVideo";

const Home = () => {
  const [allVideos, setAllVideos] = useState([]);
  const [showVideos, setShowVideos] = useState(true);
  const [allTweets, setAllTweets] = useState([]);
  const [showTweets, setShowTweets] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleVideos = async () => {
    setShowVideos(true);
    setShowTweets(false);
    setLoading(true);

    try {
      const response = await fetchAllVideo({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortType: "asc",
      });

      console.log("Fetched Videos:", response);
      console.log("videos : ",response.data.data)

      if (response?.data?.data && Array.isArray(response.data.data)) {
        setAllVideos(response.data.data); // ✅ Set correct array
      } else {
        setAllVideos([]); // ✅ Ensure empty array if no data
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTweets = async () => {
    setShowVideos(false);
    setShowTweets(true);
    setLoading(true);

    try {
      const response = await getAllTweet();
      console.log("Fetched Tweets:", response);

      if (response?.data?.data && Array.isArray(response.data.data)) {
        setAllTweets(response.data.data); // ✅ Ensure correct data
      } else {
        setAllTweets([]);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleVideos(); // ✅ Fetch videos on mount
  }, []);

  return (
    <div className="lg:ml-[17%]">
      <div className="text-white ">
        <button
          onClick={handleVideos} // ✅ Correctly call function
          className="bg-neutral-800 p-[0.2rem] m-2 px-3 rounded-xl text-xl hover:bg-neutral-700"
        >
          Videos
        </button>
        <button
          onClick={handleTweets} // ✅ Correctly call function
          className="bg-neutral-800 p-[0.2rem] m-2 px-3 rounded-xl text-xl hover:bg-neutral-700"
        >
          Tweets
        </button>
      </div>

      <div>
        {loading ? (
          <p>Loading...</p>
        ) : showVideos && allVideos.length > 0 ? (
          <ul  className="flex flex-wrap gap-1">
            {allVideos.map((video) => ( // ✅ Use `allVideos.map`
               <HomeVideo key={video._id} video={video} /> 
            ))}
          </ul>
        ) : showTweets && allTweets.length > 0 ? (
          <ul className="space-y-4">
            {allTweets.map((tweet) => (
              <HomeTweet key={tweet._id} tweet={tweet} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No content found.</p>
        )}
      </div>
      
    </div>
  );
};

export default Home;
