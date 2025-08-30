import React, { useEffect, useState, useRef } from "react";
import play from "../../assets/play.png";
import SideBar from "./sideBar";
import UploadVideo from "./uploadVideo";
import CreateTweet from "./createTweet";
import { getUserDashboard, logoutUser } from "../Api/dashboard.api";
import { Link ,useNavigate} from "react-router-dom";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploadModal, setIsUploadModal] = useState(false);
  const [isPostModelOpen, setIsPostModelOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [UserInfo, setUserInfo] = useState({});
  const [isProfileDDopen, setIsProfileDDopen] = useState(false);

  const navigate = useNavigate()

  const token = localStorage.getItem("accessToken");

  const profileRef = useRef(null); // Ref for detecting outside click

  useEffect(() => {
     const token = localStorage.getItem("accessToken");

  if (!token) {
    console.log("No token found, redirecting to login.");
    navigate("/"); // Optional, if you want forced login
    return;
  }

  handleUserInfo();

  const handleLogin = () => {
    handleUserInfo();
  };

    window.addEventListener("loginSuccess", handleLogin);

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileDDopen(false);
    }
  };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
    window.removeEventListener("loginSuccess", handleLogin);
    document.removeEventListener("mousedown", handleClickOutside);
  };
  },[token]);

  const handleUserInfo = async () => {
    try {
      const response = await getUserDashboard();
      if (response && response.data) {
        setUserInfo(response.data.data);
        console.log("UserInfo : ",response.data.data)
      }
    } catch (error) {
      console.error("Error on getting userInfo in navbar: ", error);
      alert("Error : ",error)
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleUploadModal = () => {
    setIsUploadModal(!isUploadModal);
    setIsDropdownOpen(false);
  };

  const togglePostModal = () => {
    setIsPostModelOpen(!isPostModelOpen);
    setIsDropdownOpen(false);
  };

  const handleProfile = () => setIsProfileDDopen(!isProfileDDopen);


  const handleSignOut=async()=>{
    try {
       await logoutUser();
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");

        alert("successfully logout");
        setIsProfileDDopen(!isProfileDDopen)
          //  window.location.reload();
        navigate("/");
    } catch (error) {
      alert("Error on signOut : ",error)
    }
  }


  const handleToGODashboard=()=>{
    setIsProfileDDopen(!isProfileDDopen)
  }


  const {
    avatar,
    fullname,
    username,
  } = UserInfo;



  return (
    <>
      <nav className="sticky w-[100%] relative top-0 bg-black z-50">
       <div className="flex items-center justify-between px-4 py-2 md:px-16">
      
      {/* Left section: Menu + Logo */}
      <div className="flex items-center space-x-4">
        {/* Hamburger Menu */}
        <button
          className="text-white "
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <div className="space-y-1">
            <span className="block w-6 h-1 bg-white"></span>
            <span className="block w-6 h-1 bg-white"></span>
            <span className="block w-6 h-1 bg-white"></span>
          </div>
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={play} className="h-8 w-12" alt="Logo" />
          <h1 className="font-bold text-xl text-white">StreamTube</h1>
        </div>
      </div>

      {/* Right section: Buttons + Profile */}
      <div className="flex items-center space-x-4">
        {/* Create Button */}
        <button
  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  className="
    flex items-center justify-center px-3 py-2 rounded-3xl
    bg-transparent text-black 
    md:flex-row md:space-x-2 md:bg-neutral-800 md:text-white md:hover:bg-neutral-700
    transition-colors duration-200 sm:bg-neutral-800 sm:text-white
  "
>
  <span className="text-3xl text-white font-thin">+</span>
  <span className="hidden sm:inline md:inline text-base">Create</span>
</button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-12 right-0 w-44 bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden z-50">
            <button
              onClick={toggleUploadModal}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700"
            >
              📹 Upload Video
            </button>
            <button
              onClick={togglePostModal}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700"
            >
              📝 Post Tweet
            </button>
          </div>
        )}

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button onClick={handleProfile}>
            <img
              src={avatar}
              className="  h-10 w-10 rounded-full"
              alt="Profile"
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileDDopen && (
            <div className="absolute right-0 top-14 w-64 bg-black text-white rounded-lg shadow-lg overflow-hidden z-50 p-4">
              <div className="flex items-center gap-3 border-b border-gray-700 pb-3">
                <img src={avatar} alt="Profile" className="h-12 w-12 rounded-full" />
                <div>
                  <h1 className="font-bold">{fullname}</h1>
                  <h1 className="text-gray-400">@{username}</h1>
                  <Link to="/dashboard" onClick={handleToGODashboard} className="text-blue-400">
                    View your channel
                  </Link>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-gray-400">
                <button onClick={handleSignOut} className="hover:text-white">Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </nav>

  {/* Sidebar */}
  {isMenuOpen && <SideBar />}

  {/* Upload Video Modal */}
  {isUploadModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <UploadVideo closeModal={toggleUploadModal} />
    </div>
  )}

  {/* Post Tweet Modal */}
  {isPostModelOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <CreateTweet closeModal={togglePostModal} />
    </div>
  )}
    </>
  );
};

export default Navbar;
