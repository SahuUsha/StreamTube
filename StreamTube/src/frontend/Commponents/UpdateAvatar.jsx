import React, { useState } from 'react';
import { updateAvatar } from '../Api/user.api';

const UpdateAvatar = ({ onClose }) => {
  const [newAvatar, setNewAvatar] = useState(null);

  const handleFileChange = (e) => {
    setNewAvatar(e.target.files[0]);
  };

  const handleUpdateAvatar = async () => {
    if (!newAvatar) {
      alert("Please select an image file.");
      onClose();
      return;
    }

    const formData = new FormData();
    formData.append("avatar", newAvatar);

    try {
      const response = await updateAvatar(formData);
      console.log(response);

      if (response) {
        alert("Avatar updated successfully");
        onClose();
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Error updating avatar");
    }
  };

  return (
    <div className=" text-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-yellow-400">Update Avatar</h2>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Upload Image</label>
        <input
          type="file"
          name="newAvatar"
          accept="image/*"
          onChange={handleFileChange}
          className="bg-white text-black p-2 rounded-md border border-yellow-400"
          required
        />
      </div>

      <button
        onClick={handleUpdateAvatar}
        className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-md hover:bg-yellow-500 transition"
      >
        Update
      </button>
    </div>
  );
};

export default UpdateAvatar;
