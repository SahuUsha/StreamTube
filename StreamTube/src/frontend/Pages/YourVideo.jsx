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
    console.log("Video response:", response.data); // log it to inspect shape

    if (Array.isArray(response.data.data)) {
      setYourVideos(response.data.data);
    } else {
      setYourVideos([]); // fallback to empty array
      console.error("Expected an array but got:", response.data.data);
    }
  } catch (error) {
    console.log("Error fetching your videos: ", error);
    setYourVideos([]); // avoid undefined in UI
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
    <div className="text-white p-2 sm:p-4">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-4">Your Videos</h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-neutral-900 p-4 rounded-lg">
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
            {yourVideos.length > 0 ? yourVideos.map((video) => (
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
                  <div className="flex justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => { setShowConfirmModal(true); setVideoToDelete(video); }}
                      className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-500 text-black px-3 py-1 rounded flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-500 text-black px-3 py-1 rounded flex items-center gap-1"
                    >
                      <FaEdit /> Edit Draft
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-400">No videos found. Upload one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {yourVideos.length > 0 ? yourVideos.map((video) => (
          <div key={video._id} className="bg-neutral-900 rounded-lg p-3 flex flex-col gap-2">
            <video src={video.videoFile} controls className="w-full h-48 sm:h-56 object-cover rounded-lg" />
            <div className="flex items-center gap-2">
              <img src={video.thumbnail} alt="Thumbnail" className="w-20 h-12 object-cover rounded-md" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{video.title}</p>
                <p className="text-gray-400 text-xs">{video.description}</p>
                <p className="text-gray-400 text-xs">Likes: {video.likeCount || 0} • Views: {video.views || 0}</p>
                <p className="text-gray-400 text-xs">{new Date(video.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex justify-between mt-2 gap-2 flex-wrap">
              <button
                onClick={() => { setShowConfirmModal(true); setVideoToDelete(video); }}
                className="flex-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-500 text-black px-3 py-2 rounded flex items-center justify-center gap-1"
              >
                <FaTrash /> Delete
              </button>
              <button
                onClick={() => setSelectedVideo(video)}
                className="flex-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-500 text-black px-3 py-2 rounded flex items-center justify-center gap-1"
              >
                <FaEdit /> Edit Draft
              </button>
            </div>
          </div>
        )) : (
          <p className="text-center text-gray-400">No videos found. Upload one!</p>
        )}
      </div>

      {/* Confirm Delete Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-neutral-800 p-6 rounded-lg shadow-lg text-center w-11/12 max-w-md">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <strong>{videoToDelete?.title}</strong>?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVideo}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2">
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
