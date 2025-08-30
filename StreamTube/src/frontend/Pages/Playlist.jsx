import React, { useEffect, useState } from "react";
import { createPlaylist, getMyPlaylists } from "../Api/playlist.api.js";
import PlaylistBox from "../Commponents/playlististbox.jsx";

const Playlist = () => {
  const [playListName, setPlayListName] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [Playlists, setPlaylists] = useState([]);

  useEffect(() => {
    handleGetPlaylist();
  }, []);

  const handleCreateResponse = async (e) => {
    e.preventDefault();

    try {
      const response = await createPlaylist({ name: playListName, description });
      console.log("Created Playlist:", response);
      if (response) {
        alert("Playlist created successfully");
        setShowForm(false);
        setPlayListName("");
        setDescription("");
        handleGetPlaylist();
      }
    } catch (error) {
      console.log("Error on creating playlist:", error);
      alert("Failed to create playlist: " + error);
    }
  };

  const handleGetPlaylist = async () => {
    try {
      const response = await getMyPlaylists();
      console.log("my playlist : ", response);
      if (response && response.data) {
        setPlaylists(response.data.data);
      }
    } catch (error) {
      console.log("error on getting playlist : ", error);
    }
  };

  return (
    <div className="text-white flex flex-col items-center w-full px-2 sm:px-4 md:px-6">
      {/* Header with Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 w-full max-w-6xl">
        <h1 className="text-[1.6rem] sm:text-[1.8rem] font-bold mb-4 sm:mb-0">
          Your Playlist
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 text-[1rem] sm:text-[1.1rem] text-black font-bold px-4 py-2 rounded-md"
        >
          Create Playlist
        </button>
      </div>

      {/* Playlist Box Flex Container */}
      <div className="mt-6 w-full max-w-6xl flex flex-wrap gap-4 sm:gap-6 justify-start">
        {Playlists.map((playlist) => (
          <PlaylistBox key={playlist._id} playlist={playlist} />
        ))}
      </div>

      {/* Modal/Form for Creating a Playlist */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 p-2 sm:p-4">
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Create Playlist
            </h2>

            {/* Playlist Name Input */}
            <div className="mb-4">
              <label className="block text-white mb-1">Playlist Name:</label>
              <input
                type="text"
                value={playListName}
                onChange={(e) => setPlayListName(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-yellow-500"
                required
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-white mb-1">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-yellow-500"
                required
              ></textarea>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <button
                onClick={(e) => handleCreateResponse(e)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playlist;
