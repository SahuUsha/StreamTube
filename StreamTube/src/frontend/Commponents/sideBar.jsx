import React, { useRef, useEffect, useState } from 'react';
import home from "../../assets/home .png";
import playlist from "../../assets/playlist.png";
import video from "../../assets/video.png";
import setting from "../../assets/settings.png";
import like from "../../assets/like.png";
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Track sidebar visibility
    const sidebarRef = useRef(null);
    const navigate = useNavigate();

    // Close sidebar on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {isSidebarOpen && (
                <div ref={sidebarRef} className="bg-neutral-900 text-white absolute px-5 py-3 w-[15rem] h-[100%] z-20">
                    <div>
                        <button onClick={() => navigate('/home')} className="flex hover:bg-neutral-700 px-4 pr-28 my-3 py-[0.4rem] rounded-xl">
                            <img src={home} className="h-[2.2rem] w-[2.5rem]" alt="" />
                            <h1 className='font-bold text-[1.1rem] p-[0.3rem] pl-5'>Home</h1>
                        </button>
                        <button onClick={() => navigate('/allPlaylist')} className="flex hover:bg-neutral-700 px-4 pr-24 my-3 py-[0.4rem] rounded-xl">
                            <img src={playlist} className="h-[1.9rem] w-[2.0rem]" alt="" />
                            <h1 className='font-bold text-[1.1rem] p-[0.3rem] pl-5'>Playlist</h1>
                        </button>
                        <button onClick={() => navigate('/likeVideo')} className="flex hover:bg-neutral-700 px-4 pr-4 my-3 py-[0.4rem] rounded-xl">
                            <img src={like} className="h-[2.1rem] w-[2.2rem]" alt="" />
                            <h1 className='font-bold text-[1.1rem] p-[0.3rem] pl-5'>Liked Videos</h1>
                        </button>
                        <button onClick={() => navigate('/yourVideo')} className="flex hover:bg-neutral-700 px-4 pr-7 my-3 py-[0.4rem] rounded-xl">
                            <img src={video} className="h-[2.1rem] w-[2.1rem]" alt="" />
                            <h1 className='font-bold text-[1.1rem] p-[0.3rem] pl-5'>Your Video</h1>
                        </button>
                        <button onClick={() => navigate('/playlist')} className="flex hover:bg-neutral-700 px-4 pr-6 my-3 py-[0.4rem] rounded-xl">
                            <img src={playlist} className="h-[1.9rem] w-[2.0rem]" alt="" />
                            <h1 className='font-bold text-[1.1rem] p-[0.3rem] pl-5'>Your Playlist</h1>
                        </button>
                        <button onClick={() => navigate('/setting')} className="flex hover:bg-neutral-700 px-4 pr-24 my-3 py-[0.4rem] rounded-xl">
                            <img src={setting} className="h-[2.1rem] w-[2.3rem]" alt="" />
                            <h1 className='font-bold text-[1.1rem] p-[0.3rem] pl-5'>Setting</h1>
                        </button>
                      
                    </div>
                </div>
            )}

            {/* Sidebar Toggle Button */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="fixed top-4 left-4 bg-green-500 text-white p-3 rounded-full shadow-md">
                {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
            </button>
        </>
    );
};

export default SideBar;
