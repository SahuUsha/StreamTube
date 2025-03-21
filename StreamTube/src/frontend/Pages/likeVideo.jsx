import React, { useState, useEffect, useRef } from "react";
import { getLikedVideos } from "../Api/video.api";
import { useNavigate } from "react-router-dom";

const LikeVideo = () => {
  const [likeVideo, setLikeVideo] = useState([]);
  const [playVideo, setPlayVideo] = useState(null);
  const hoverTimeout = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    handleGetVideo();
  }, []);

  const handleGetVideo = async () => {
    try {
      const response = await getLikedVideos();
      if (response && response.data) {
        setLikeVideo(response.data.data);
      }
    } catch (error) {
      console.log("Error on getting liked videos: ", error);
    }
  };

  const handleMouseEnter = (index) => {
    clearTimeout(hoverTimeout.current[index]);
    hoverTimeout.current[index] = setTimeout(() => {
      setPlayVideo(index);
    }, 1000);
  };

  const handleMouseLeave = (index) => {
    clearTimeout(hoverTimeout.current[index]);
    setPlayVideo(null);
  };

  return (
    <div className="bg-black text-white min-h-screen flex justify-center p-5">
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-6">
        {/* Left Section - List of Videos */}
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">Liked Videos</h1>

          {likeVideo.map((item, index) => {
            const video = item.video;
            if (!video) return null;

            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer w-full"
              >
                <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                {playVideo === index ? (
                  <video
                    src={video.videoFile}
                    className="w-full sm:w-44 sm:h-28 object-cover rounded-md"
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full sm:w-44 sm:h-28 object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col text-center sm:text-left">
                  <h2 className="text-sm sm:text-base font-semibold">{video.title}</h2>
                  <p className="text-xs sm:text-sm text-gray-400">@{video.ownerInfo[0]?.username || "Unknown"}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {video.views} views • {new Date(video.createdAt).toDateString()}
                  </p>
                  <button
                    onClick={() => navigate("/video", { state: { video } })}
                    className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 
                    text-black font-bold py-2 px-4 sm:w-[9rem] mt-2 rounded-lg shadow-lg transition duration-300 
                    hover:brightness-110 hover:shadow-xl"
                  >
                    Watch
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Section - First Video Highlighted */}
        {likeVideo.length > 0 && (
          <div className="w-full md:w-1/3 bg-gradient-to-br from-neutral-900  to-gray-900   p-4 h-auto md:h-[80vh] rounded-lg">
            <div className="relative">
              <img
                src={likeVideo[0].video.thumbnail}
                alt={likeVideo[0].video.title}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <div className="mt-3 text-center">
              <h2 className="text-base sm:text-lg font-semibold">{likeVideo[0].video.title}</h2>
              <p className="text-sm text-gray-400">@{likeVideo[0].video.ownerInfo[0]?.username || "Unknown"}</p>
              <p className="text-sm text-gray-500">{likeVideo[0].video.views} views</p>
            </div>
            <button
              onClick={() => navigate("/video", { state: { video: likeVideo[0].video } })}
              className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 
              text-black font-bold py-2 px-6 w-full mt-4 rounded-lg shadow-lg transition duration-300 
              hover:brightness-110 hover:shadow-xl"
            >
              Play
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikeVideo;
