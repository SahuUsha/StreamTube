import React, { useState } from "react";
import { uploadVideo } from "../Api/video.api";

const UploadVideo = ({ closeModal }) => {
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [isPublished, setIsPublished] = useState(true);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("videoFile", uploadedVideo);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    formData.append("isPublished", isPublished);

    try {
      const response = await uploadVideo(formData);
      console.log(response);
      closeModal(); // Close the modal after upload
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

   return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      {/* Modal Box */}
      <div className="relative bg-neutral-800 rounded-2xl w-full max-w-3xl md:max-w-2xl sm:max-w-lg p-6 shadow-lg 
                      flex flex-col items-center justify-start 
                      max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-white text-2xl hover:text-gray-400"
        >
          ✖
        </button>

        <h2 className="text-white text-xl md:text-lg sm:text-base font-bold mb-4 text-center">
          Upload Video
        </h2>

        {/* Upload Video */}
        <div className="w-full">
          <label htmlFor="video" className="block text-white font-semibold mb-2">
            Upload Video
          </label>
          <input
            type="file"
            id="video"
            name="video"
            accept="video/*"
            onChange={(e) => setUploadedVideo(e.target.files[0])}
            className="text-white bg-neutral-700 p-2 rounded-lg w-full text-sm"
          />
        </div>

        {/* Video Preview */}
        {uploadedVideo && (
          <div className="mt-4 w-full">
            <h3 className="text-white text-lg font-semibold mb-2">Preview:</h3>
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={URL.createObjectURL(uploadedVideo)}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Title */}
        <div className="mt-4 w-full">
          <label htmlFor="title" className="block text-white font-semibold mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded-lg bg-neutral-700 text-white border border-neutral-600 text-sm"
          />
        </div>

        {/* Description */}
        <div className="mt-4 w-full">
          <label htmlFor="description" className="block text-white font-semibold mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded-lg bg-neutral-700 text-white border border-neutral-600 resize-y text-sm"
            rows={3}
          />
        </div>

        {/* Thumbnail */}
        <div className="mt-4 w-full">
          <label htmlFor="thumbnail" className="block text-white font-semibold mb-1">
            Thumbnail
          </label>
          <input
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full p-2 rounded-lg bg-neutral-700 text-white border border-neutral-600 text-sm"
          />
        </div>

        {/* Publish Toggle */}
        <div className="mt-4 w-full flex items-center justify-between">
          <span className="text-white font-semibold text-sm">Publish</span>
          <div
            onClick={() => setIsPublished(!isPublished)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              isPublished ? "bg-yellow-500" : "bg-red-500"
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isPublished ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>

        {/* Upload Button */}
        <button
          className="bg-yellow-400 text-white p-2 rounded-lg mt-6 hover:bg-yellow-500 w-full text-sm"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
    </div>
  );
};




export default UploadVideo;
