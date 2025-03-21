import React, { useEffect, useState } from "react";
import { getUserDashboard } from "../Api/dashboard.api";
import YourVideo from "./YourVideo";
import Playlist from "./Playlist";
import UploadVideo from "../Commponents/uploadVideo";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({});
  const [activeTab, setActiveTab] = useState("videos");
//   const [showUploadModal, setShowUploadModal] = useState(false); // NEW STATE
  const [loading, setLoading] = useState(true);
  const [isUploadModel, setisUploadModel] = useState(false)
  const [error, setError] = useState("");

  useEffect(() => {
    handleGetUserInfo();
  }, []);

  const handleGetUserInfo = async () => {
    try {
      setLoading(true);
      const response = await getUserDashboard();
      if (response && response.data) {
        setUserInfo(response.data.data);
      }
    } catch (error) {
      console.error("Error on getting dashboard:", error);
      setError("Failed to fetch user information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  // Toggles Upload Video Modal
//   const handleVideoUpload = () => {
//     setShowUploadModal(true);
//   };

//   const handleCloseUploadModal = () => {
//     setShowUploadModal(false);
//   };

  const toggleUploadModal = () => {
    setisUploadModel(!isUploadModel);
   
  };
  

  const { 
    coverImage, 
    avatar, 
    fullname, 
    username, 
    totalSubscribers, 
    totalViews, 
    totalVideos 
  } = userInfo;

  return (
    <div className="px-4 md:px-8 max-w-7xl mx-auto">
      {/* Cover Image */}
      <div className="h-40 md:h-60 bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={coverImage || "/default-cover.jpg"}
          alt="coverImage"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Avatar and Details */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-6">
        <img
          src={avatar || "/default-avatar.png"}
          alt="avatar"
          className="w-40 h-40 md:w-40 md:h-40 rounded-full border-2 border-white -mt-11 md:-mt-16 shadow-md"
        />
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-4xl font-bold text-white">{fullname}</h1>
          <p className="text-white mt-2">@{username}</p>
          <p className="text-gray-400 font-semibold mt-2">description....</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 mt-2">
            <span>{totalSubscribers} Subscribers</span>
            <span>{totalViews} Views</span>
            <span>{totalVideos} Videos</span>
          </div>
        </div>
      </div>

      {/* Video Upload Button */}
      <div className="flex justify-center md:justify-end mt-6">
        <button
          onClick={toggleUploadModal}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Upload Video
        </button>
      </div>

      {/* Upload Video Modal */}
      {isUploadModel && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50">
        <UploadVideo closeModal={toggleUploadModal} />
      </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-4 md:gap-6 mt-8 border-b border-gray-300 pb-3">
        <button
          onClick={() => handleTabChange("videos")}
          className={`font-bold pb-1 ${activeTab === "videos" ? "text-red-600 border-b-2 border-red-600" : "text-gray-600 hover:text-red-600"}`}
        >
          Videos
        </button>
        <button
          onClick={() => handleTabChange("playlists")}
          className={`font-bold pb-1 ${activeTab === "playlists" ? "text-red-600 border-b-2 border-red-600" : "text-gray-600 hover:text-red-600"}`}
        >
          Playlists
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-6">
        {loading && <p className="text-gray-400 italic">Loading dashboard...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {activeTab === "videos" && <YourVideo />}
            {activeTab === "playlists" && <Playlist />}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
