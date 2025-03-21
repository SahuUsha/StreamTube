import React, { useState } from "react";
import { updateVideo } from "../Api/video.api"; // Ensure this function is correctly implemented

const VideoEditModal = ({ video, onClose, onUpdate }) => {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await updateVideo(video._id, { title, description });
      console.log("Video Updated:", response);
      onUpdate(); // Refresh video list
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-8 rounded-lg shadow-lg w-[40rem] text-white">
      <h2 className="text-xl font-semibold mb-4">Edit Video</h2>

      <label className="block mb-2 text-gray-300">Title</label>
      <input
        type="text"
        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="block mt-4 mb-2 text-gray-300">Description</label>
      <textarea
        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="5"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded bg-gray-600 hover:bg-gray-500 transition-all duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className={`px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default VideoEditModal;
