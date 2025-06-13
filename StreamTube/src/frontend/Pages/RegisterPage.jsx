import React, { useState } from "react";
import { registerUser } from "../Api/user.api";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(form);
      console.log("User registered successfully:", response);
      alert("Successfully registered")
      navigate('/')
      setForm({ fullname: "", username: "", email: "", password: "", avatar: null, coverImage: null });

      navigate("/login");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error : ",error)
    }
  };

  return (
    <div className="flex h-[90vh] bg-black">
      <div className="w-1/2 flex flex-col justify-center p-8 text-white">
        <h1 className="text-[3rem] font-bold text-yellow-400 mb-6">Join StreamTube</h1>
        <p className="text-gray-400 text-xl">
          Create an account to upload videos, interact with content, and be part of it by sharing your contentsr.
        </p>
      </div>

      <div className="w-3/5 flex items-center justify-center p-12">
        <div className="bg-yellow-600 bg-opacity-10 shadow-2xl rounded-2xl p-5 w-full h-auto max-w-2xl border border-yellow-400">
          <h2 className="text-2xl font-bold text-center text-yellow-400 mb-4">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={form.fullname}
              onChange={handleChange}
              required
              className="w-full p-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white focus:ring-1 focus:ring-yellow-400"
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full p-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white focus:ring-1 focus:ring-yellow-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white focus:ring-1 focus:ring-yellow-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white focus:ring-1 focus:ring-yellow-400"
            />
            <label className="block text-sm font-medium text-gray-300">Avatar</label>
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full p-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white focus:ring-1 focus:ring-yellow-400"
            />
            <label className="block text-sm font-medium text-gray-300">Cover Image</label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white focus:ring-1 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out shadow-md"
            >
              Register
            </button>
          </form>
          <p className="text-center text-gray-300 text-sm mt-4">
            Already have an account? <span onClick={() => navigate('/')} className='text-yellow-400 hover:font-bold hover:text-yellow-500 cursor-pointer transition duration-300'>Login here!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;