import React, { useState } from "react";
import { loginUser } from "../Api/user.api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); 

  useEffect(()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("accesstoken")

  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    const loginData = { email, password };

    try {
      const response = await loginUser(loginData);
      localStorage.setItem("accessToken", response.data.accessToken);
      const token = localStorage.getItem('accessToken');
      localStorage.setItem("token",token)
      console.log("Token:", token);
      setEmail("");
      setPassword("");
      // window.location.href = '/home';
      navigate('/home');

    } catch (error) {
      console.error("Error during login:", error);
      setError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="flex  h-[89vh] bg-black">
      <div className="w-1/2 flex flex-col justify-center p-8 text-white">
        <h1 className="text-[3rem] font-bold text-yellow-400 mb-6">Welcome to StreamTube</h1>
        <p className="text-gray-400 text-xl">
          Discover a world of videos, tweets, and playlists! Upload your content, connect with creators, and enjoy interactive features like likes, comments, and subscriptions — all in one platform.
        </p>
      </div>

      <div className="w-1/2 flex items-center justify-center  p-12">
        <div className="bg-yellow-600 bg-opacity-10 shadow-2xl rounded-2xl p-8 w-full h-[65vh] max-w-md border border-yellow-400">
          <h2 className="text-2xl font-bold text-center text-yellow-400 mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="lg:m-5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email or username"
                required
                className="w-full p-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
            </div>

            <div className="lg:m-5 mb-7">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full p-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
              />
            </div>

            <div className="flex flex-col justify-center items-center mt-[5rem]">
              <button
                type="submit"
                className="w-[10rem] bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out shadow-md"
              >
                Submit
              </button>
            </div>
          </form>

          {error && <p className="mt-4 text-center text-red-500">{error}</p>}
          <div className="text-center mt-4">
            <h1 className="text-gray-300 text-center text-sm mt-6">If you are not registered,
              <button onClick={()=>navigate('/register')} className='text-yellow-400 hover:font-bold hover:text-yellow-500 cursor-pointer transition duration-300'>Register here!</button>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
