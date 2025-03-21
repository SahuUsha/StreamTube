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
    <div className="bg-neutral-900 p-4 rounded-lg shadow-lg w-full max-w-md mx-auto relative">
      {/* Close Button */}
      {closeModal && (
        <button
          onClick={closeModal}
          className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
        >
          ✖
        </button>
      )}

      <textarea
        className="w-full p-2 bg-neutral-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
        placeholder="What's happening?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      
      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 w-full"
      >
        {loading ? "Posting..." : "Tweet"}
      </button>
    </div>
  );
};

export default CreateTweet;
