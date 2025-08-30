import React, { useState } from "react";
import { creatTweet } from "../Api/tweet.api";

const CreateTweet = ({ closeModal }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!content.trim()) {
      alert("Tweet cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await creatTweet({ content });
      console.log("Tweet Response:", response);
      if (response) {
        alert("Tweet posted successfully!");
        setContent(""); // Clear input after success
        closeModal && closeModal(); // Close modal if function is provided
      }
    } catch (error) {
      console.error("Error posting tweet:", error);
      alert("Failed to post tweet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
 
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-neutral-900 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg mx-auto relative">
        {/* Close Button */}
        {closeModal && (
          <button
            onClick={closeModal}
            className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl sm:text-2xl"
          >
            ✖
          </button>
        )}

        <textarea
          className="w-full p-2 sm:p-3 bg-neutral-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
          rows="6"
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-3 sm:mt-4 px-4 py-2 sm:px-5 sm:py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:bg-gray-500 w-full text-sm sm:text-base transition-colors duration-200"
        >
          {loading ? "Posting..." : "Tweet"}
        </button>
      </div>
    </div>
  );
};

export default CreateTweet;
