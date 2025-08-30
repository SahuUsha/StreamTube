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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-neutral-800 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-2xl text-white relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✖
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-4">Edit Video</h2>

        <label className="block mb-2 text-gray-300 text-sm sm:text-base">
          Title
        </label>
        <input
          type="text"
          className="w-full p-2 sm:p-3 rounded bg-neutral-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block mt-4 mb-2 text-gray-300 text-sm sm:text-base">
          Description
        </label>
        <textarea
          className="w-full p-2 sm:p-3 rounded bg-neutral-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 rounded bg-neutral-600 hover:bg-gray-500 transition-all duration-200 text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className={`px-4 sm:px-5 py-2 rounded bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 text-sm sm:text-base ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoEditModal;
