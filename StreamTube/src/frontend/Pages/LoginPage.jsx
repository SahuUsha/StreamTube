import React, { useState } from "react";
import { loginUser } from "../Api/user.api";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); 

  // useEffect(()=>{
  //   localStorage.removeItem("token")
  //   localStorage.removeItem("accesstoken")

  // },[])

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    const loginData = { email, password };

    // const refresh =()=>{
    //   window.location.reload();
    //    navigate('/home');

    // }

    try {
      const response = await loginUser(loginData);
      localStorage.setItem("accessToken", response.data.accessToken);
      const token = localStorage.getItem('accessToken');
      localStorage.setItem("token",token)
      console.log("Token:", token);
      setEmail("");
      setPassword("");
      // window.location.href = '/home';
      //  window.location.reload();

        // window.dispatchEvent(new Event("loginSuccess"));
      navigate('/home');
      

    } catch (error) {
      console.error("Error during login:", error);
      setError(error.message || "Login failed. Please try again.");
    }
  };

 return (
    <div className="flex flex-col md:flex-row h-full w-full bg-black">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-6 sm:p-10 text-white text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-400 mb-6">
          Welcome to StreamTube
        </h1>
        <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed">
          Discover a world of videos, tweets, and playlists! Upload your content,
          connect with creators, and enjoy interactive features like likes,
          comments, and subscriptions — all in one platform.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="bg-yellow-600 bg-opacity-10 shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md border border-yellow-400">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-yellow-400 mb-6">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email or username"
                required
                className="w-full p-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full p-3 border border-neutral-600 rounded-lg bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="w-full sm:w-40 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out shadow-md"
              >
                Submit
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-4 text-center text-red-500 text-sm sm:text-base">
              {error}
            </p>
          )}

          <div className="text-center mt-6">
            <h1 className="text-gray-300 text-sm">
              If you are not registered,{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-yellow-400 hover:font-bold hover:text-yellow-500 transition duration-300"
              >
                Register here!
              </button>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;