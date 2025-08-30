import React, { useEffect, useState } from "react";
import { getVideoByvideoId } from "../Api/playlist.api";

import { useLocation } from 'react-router-dom';

const Playvideolist = () => {
  const location = useLocation();
 const playlist = location.state?.playlist;
  console.log("playlist : ",playlist)


  const [videoDetails, setVideoDetails] = useState({});
  const [currentVideo, setCurrentVideo] = useState(null);

  const handleGetVideoInfo = async (videoId) => {
    try {
      const response = await getVideoByvideoId(videoId);
      if (response?.data?.data) {
        setVideoDetails((prev) => ({
          ...prev,
          [videoId]: response.data.data[0], // Assuming API returns an array
        }));
        if (!currentVideo) {
          setCurrentVideo(response.data.data[0]); // Set first video as playing
        }
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  useEffect(() => {
    if (playlist?.videos?.length > 0) {
      Promise.all(playlist.videos.map((videoId) => handleGetVideoInfo(videoId)));
    }
  }, [playlist.videos]);

  return (
    <div className="flex flex-col md:flex-row h-full bg-black text-white p-2 md:p-4">
      {/* Left Section: Video Player & Info */}
      <div className="md:w-2/3 w-full p-2 md:p-4">
        {currentVideo ? (
          <>
            <video
              src={currentVideo.videoFile}
              controls
              autoPlay
              className="w-full h-[200px] sm:h-[300px] md:h-[400px] rounded-lg"
            />

            {/* User Info & Views */}
            <div className="flex items-center gap-3 mt-3">
              <img
                src={currentVideo.ownerInfo?.[0]?.avatar || "https://via.placeholder.com/40"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-base sm:text-lg font-bold">
                  {currentVideo.ownerInfo?.[0]?.username || "Unknown User"}
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {currentVideo.views} views •{" "}
                  {new Date(currentVideo.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h1 className="text-lg sm:text-xl font-bold mt-3">{currentVideo.title}</h1>
            <p className="text-gray-300 text-sm sm:text-base">{currentVideo.description}</p>
          </>
        ) : (
          <p className="text-gray-500">Select a video...</p>
        )}
      </div>

      {/* Right Section: Playlist & Video List */}
      <div className="md:w-1/3 w-full overflow-y-auto border-t md:border-t-0 md:border-l border-yellow-500 p-2 md:p-4 mt-4 md:mt-0">
        {/* Playlist Info */}
        <div className="mb-4 p-3 bg-neutral-900 rounded-lg">
          <h2 className="text-lg sm:text-xl text-yellow-500 font-bold">{playlist.name}</h2>
          <p className="text-gray-400 text-sm">{playlist.description}</p>
          <p className="text-gray-400 text-sm">Videos: {playlist.videos.length}</p>

          {/* Playlist Creator Info */}
          <div className="flex items-center gap-2 mt-2">
            <img
              src={playlist.ownerInfo[0]?.avatar || "https://via.placeholder.com/40"}
              alt="Creator Avatar"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            />
            <h3 className="text-sm sm:text-base font-semibold">
              @{playlist.ownerInfo[0]?.username || "Unknown Creator"}
            </h3>
          </div>
        </div>

        {/* Playlist Videos */}
        <h2 className="text-base sm:text-lg font-semibold mb-2">Videos</h2>
        {playlist.videos.map((videoId) => {
          const video = videoDetails[videoId];
          return (
            <div
              key={videoId}
              className={`flex gap-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-700 ${
                currentVideo?.videoFile === video?.videoFile ? "bg-neutral-800" : ""
              }`}
              onClick={() => setCurrentVideo(video)}
            >
              {video ? (
                <>
                  <img
                    src={video.thumbnail || ""}
                    alt="Thumbnail"
                    className="w-20 h-12 sm:w-24 sm:h-16 object-cover rounded-md"
                  />
                  <div className="flex flex-col justify-center">
                    <h1 className="text-xs sm:text-sm font-semibold">{video.title}</h1>
                    <p className="text-gray-500 text-xs sm:text-xs">{video.views} views</p>
                    <p className="text-gray-500 text-xs sm:text-xs">
                      @{video.ownerInfo?.[0]?.username || "Unknown"}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-400 text-xs sm:text-sm">Loading...</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Playvideolist;
