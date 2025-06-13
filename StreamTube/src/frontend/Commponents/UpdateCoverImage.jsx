import React, { useState } from 'react';
import { updateCoverImage } from '../Api/user.api';

const UpdateCoverImage = ({ onClose }) => {
  const [newCoverImage, setNewCoverImage] = useState(null);

  const handleFileChange = (e) => {
    setNewCoverImage(e.target.files[0]);
  };

  const handleUpdateCoverImage = async () => {
    if (!newCoverImage) {
      alert("Please select an image file.");
      onClose();
      return;
    }

    const formData = new FormData();
    formData.append("coverImage", newCoverImage);

    try {
      const response = await updateCoverImage(formData);
      console.log(response);

      if (response) {
        alert("Cover image updated successfully");
        onClose();
      }
    } catch (error) {
      console.error("Error updating cover image:", error);
      alert("Error updating cover image");
    }
  };

  return (
    <div className=" text-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-yellow-400">Update Cover Image</h2>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Upload Image</label>
        <input
          type="file"
          name="coverImage"
          accept="image/*"
          onChange={handleFileChange}
          className="bg-white text-black p-2 rounded-md border border-yellow-400"
          required
        />
      </div>

      <button
        onClick={handleUpdateCoverImage}
        className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-md hover:bg-yellow-500 transition"
      >
        Update
      </button>
    </div>
  );
};

export default UpdateCoverImage;
