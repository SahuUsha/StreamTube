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

  const profileRef = useRef(null); // Ref for detecting outside click

  useEffect(() => {
    handleUserInfo();

    // Close profile dropdown on outside click
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDDopen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserInfo = async () => {
    try {
      const response = await getUserDashboard();
      if (response && response.data) {
        setUserInfo(response.data.data);
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
      
        alert("successfully logout");
        setIsProfileDDopen(!isProfileDDopen)
        navigate("/users/login");
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
        <div className="flex flex-row items-center space-x-4 p-2 px-16 justify-between">
          {/* Menu Button */}
          <div className="flex space-x-2">
            <button className="text-white pr-8" onClick={toggleMenu}>
              <div className="space-y-1">
                <span className="block w-8 h-1 bg-white"></span>
                <span className="block w-8 h-1 bg-white"></span>
                <span className="block w-8 h-1 bg-white"></span>
              </div>
            </button>

            <img src={play} className="h-[2.0rem] w-[3.3rem]" alt="Logo" />
            <h1 className="font-bold text-[1.5rem] text-white">StreamTube</h1>
          </div>

          <div className="flex flex-row items-center space-x-7 relative">
            {/* Create Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4  bg-neutral-800 text-white rounded-3xl hover:bg-neutral-700"
            >
              <span className="text-[2rem] font-thin pb-2">+</span>
              <span className="text-[1.2rem]">Create</span>
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

            {/* Profile Image */}
            <div ref={profileRef} className="relative">
              <button onClick={handleProfile}>
                <div className="rounded-full">
                  <img
                    src={avatar}
                    className="h-[3.1rem] w-[3.1rem] rounded-full"
                    alt="Profile"
                  />
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileDDopen && (
                <div className="absolute right-0 top-14 w-64 bg-black text-white rounded-lg shadow-lg overflow-hidden z-50 p-4">
                  <div className="flex items-center gap-3 border-b border-gray-700 pb-3">
                    <img
                      src={avatar}
                      alt="Profile"
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <h1 className="font-bold">{fullname}</h1>
                      <h1 className="text-gray-400">@{username}</h1>
                      <Link to="/dashboard" onClick={()=>handleToGODashboard()} className="text-blue-400">
                        View your channel
                      </Link>
                    </div>
                  </div>

                  {/* Dropdown Links */}
                  <div className="mt-3 space-y-2 text-gray-400">
                    
                    <button 
                    onClick={()=>handleSignOut()}
                     className="cursor-pointer hover:text-white">Sign Out</button>
                    
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
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50">
          <UploadVideo closeModal={toggleUploadModal} />
        </div>
      )}

      {/* Post Tweet Modal */}
      {isPostModelOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60 z-50">
          <CreateTweet closeModal={togglePostModal} />
        </div>
      )}
    </>
  );
};

export default Navbar;
