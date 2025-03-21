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
    <div className="flex h-screen bg-black text-white p-4">
      {/* Left Section: Video Player & User Info */}
      <div className="w-2/3 p-4">
        {currentVideo ? (
          <>
            <video src={currentVideo.videoFile} controls autoPlay className="w-full h-[400px] rounded-lg"></video>

            {/* User Info & Views */}
            <div className="flex items-center gap-4 mt-3">
              <img
                src={currentVideo.ownerInfo?.[0]?.avatar || "https://via.placeholder.com/40"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-lg font-bold">{currentVideo.ownerInfo?.[0]?.username || "Unknown User"}</h1>
                <p className="text-gray-400 text-sm">{currentVideo.views} views   {new Date(currentVideo.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <h1 className="text-xl font-bold mt-3">{currentVideo.title}</h1>
            <p className="text-gray-300">{currentVideo.description}</p>
          </>
        ) : (
          <p className="text-gray-500">Select a video...</p>
        )}
      </div>

      {/* Right Section: Playlist Info & Videos */}
      <div className="w-1/3 overflow-y-auto border-l border-yellow-500 p-4">
        {/* Playlist Info (Upper Right) */}
        <div className="mb-4 p-3 bg-neutral-900 rounded-lg">
          <h2 className="text-xl text-yellow-500 font-bold">{playlist.name}</h2>
          <p className="text-gray-400">{playlist.description}</p>
          <p className="text-gray-400">Videos: {playlist.videos.length}</p>

          {/* Playlist Creator Info */}
          <div className="flex items-center gap-3 mt-2">
            <img
              src={playlist.ownerInfo[0]?.avatar || "https://via.placeholder.com/40"}
              alt="Creator Avatar"
              className="w-10 h-10 rounded-full"
            />
            <h3 className="font-semibold">@{playlist.ownerInfo[0]?.username || "Unknown Creator"}</h3>
          </div>
        </div>

        {/* Playlist Videos List */}
        <h2 className="text-lg font-semibold mb-2">Videos</h2>
        {playlist.videos.map((videoId, index) => {
          const video = videoDetails[videoId];
          return (
            <div
              key={videoId}
              className={`flex gap-4 p-2 rounded-lg cursor-pointer hover:bg-neutral-700 ${
                currentVideo?.videoFile === video?.videoFile ? "hover:bg-neutral-700" : ""
              }`}
              onClick={() => setCurrentVideo(video)}
            >
              {video ? (
                <>
                  <img src={video.thumbnail || ""} alt="Thumbnail" className="w-24 h-16 object-cover rounded-md" />
                  <div>
                    <h1 className="text-sm font-semibold">{video.title}</h1>
                    <p className="text-gray-500 text-xs">{video.views} views</p>
                    <p className="text-gray-500 text-xs">@{video.ownerInfo?.[0]?.username || "Unknown"}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-400">Loading...</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Playvideolist;
