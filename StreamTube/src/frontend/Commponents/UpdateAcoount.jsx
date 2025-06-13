import React, { useState } from 'react';
import { updateAccountDetail } from "../Api/user.api";

const UpdateAccount = ({ onClose }) => {
  const [fullname, setnewFullName] = useState("");
  const [email, setemail] = useState("");

  const handleAccountUpdate = async () => {
    try {
      const response = await updateAccountDetail({ fullname, email });
      if (response) {
        alert("Account updated successfully");
        onClose(); // Close modal
      }
    } catch (error) {
      console.log("Error updating account:", error);
      alert("Error updating account");
    }
  };

  return (
    <div className=" text-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-yellow-400">Update Account Details</h2>
      
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">New Full Name</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setnewFullName(e.target.value)}
          placeholder="Enter full name or current name"
          className="px-4 py-2 rounded-md border border-yellow-400 bg-white text-black focus:outline-none focus:ring-1 focus:ring-yellow-300"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">New Email</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setemail(e.target.value)}
          placeholder="Enter email or current email" 
          className="px-4 py-2 rounded-md border border-yellow-400 bg-white text-black focus:outline-none focus:ring-1 focus:ring-yellow-300"
        />
      </div>

      <button
        onClick={handleAccountUpdate}
        className="w-full mt-4 bg-yellow-400 text-black font-semibold py-2 rounded-md hover:bg-yellow-500 transition"
      >
        Update
      </button>
    </div>
  );
};

export default UpdateAccount;
