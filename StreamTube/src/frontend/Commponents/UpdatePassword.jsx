import React, { useState } from 'react';
import { updatePassword } from '../Api/user.api';

const UpdatePassword = ({onClose}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = async () => {
    try {
      const response = await updatePassword({ oldPassword, newPassword });
      if (response) {
        console.log("Password updated:", response);
        alert("Password updated successfully");
        onClose()
        // setOldPassword("");
        // setNewPassword("");
      }
    } catch (error) {
      console.log("Error updating password:", error);
      alert("Error: " + (error.message || "Something went wrong"));
    }
  };

  return (
    <div className="text-white p-6 max-w-md mx-auto">
      <div className="flex flex-col gap-4">
        <label>
          Old Password
          <input
            type="password"
            value={oldPassword}
            className="text-black w-full p-2 rounded mt-1 border border-yellow-400 bg-white text-black focus:outline-none focus:ring-1 focus:ring-yellow-300"
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
          />
        </label>

        <label>
          New Password
          <input
            type="password"
            value={newPassword}
            className="text-black w-full p-2 rounded mt-1 border border-yellow-400 bg-white text-black focus:outline-none focus:ring-1 focus:ring-yellow-300"
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </label>

        <button
          onClick={handleUpdatePassword}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default UpdatePassword;
