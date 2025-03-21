import React, { useEffect, useState } from "react";
import { getYourVideo, deleteVideo } from "../Api/video.api";
import { FaTrash, FaEdit } from "react-icons/fa";
import VideoEditModal from "../Commponents/EditVideo";

const YourVideo = () => {
  const [yourVideos, setYourVideos] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    handleGetYourVideo();
  }, []);

  const handleGetYourVideo = async () => {
    try {
      const response = await getYourVideo();
      if (response && response.data) {
        setYourVideos(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching your videos: ", error);
    }
  };

  const handleDeleteVideo = async () => {
    if (!videoToDelete) return;
    try {
      const response = await deleteVideo(videoToDelete._id);
      if (response && response.data) {
        handleGetYourVideo();
      }
    } catch (error) {
      console.log("Error deleting video: ", error);
    }
    setShowConfirmModal(false);
    setVideoToDelete(null);
  };

  return (
    <div className="text-white p-4">
      <h1 className="text-2xl font-semibold  mb-4">Your Videos</h1>

      <div className="overflow-x-auto bg-neutral-900 p-4 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left bg-neutral-800 text-yellow-500">
              <th className="p-2">Video</th>
              <th className="p-2">Thumbnail</th>
              <th className="p-2">Title & Description</th>
              <th className="p-2">Likes</th>
              <th className="p-2">Views</th>
              <th className="p-2">Created At</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {yourVideos.map((video) => (
              <tr key={video._id} className="border-b border-yellow-500">
                <td className="p-2">
                  <video src={video.videoFile} controls className="w-56 h-16 object-cover rounded-lg" />
                </td>
                <td className="p-2">
                  <img src={video.thumbnail} alt="Thumbnail" className="w-36 h-16 object-cover rounded-lg" />
                </td>
                <td className="p-2">
                  <p className="font-semibold">{video.title}</p>
                  <p className="text-gray-400 text-sm">{video.description}</p>
                </td>
                <td className="p-2">{video.likeCount || 0}</td>
                <td className="p-2">{video.views || 0}</td>
                <td className="p-2">{new Date(video.createdAt).toLocaleDateString()}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setShowConfirmModal(true);
                        setVideoToDelete(video);
                      }}
                      className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-500  text-black px-3 py-1 rounded flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-500  text-black px-3 py-1 rounded flex items-center gap-1"
                    >
                      <FaEdit /> Edit Draft
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <strong>{videoToDelete?.title}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVideo}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <VideoEditModal
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
            onUpdate={handleGetYourVideo}
          />
        </div>
      )}
    </div>
  );
};

export default YourVideo;
