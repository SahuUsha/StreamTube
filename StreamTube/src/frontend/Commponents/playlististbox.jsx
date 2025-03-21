import React ,{useState}from 'react';
import Playvideolist from './playvideolist';
import { useNavigate } from "react-router-dom";
import playlistIcon from '../../assets/video-playlist.png';

const PlaylistBox = ({ playlist }) => {
 const [showVideolist, setshowVideolist] = useState(false)

  const navigate = useNavigate();

  return (
    <>
 <div 
  className="relative w-64 text-black rounded-xl overflow-hidden shadow-[0_0.5px_4px_rgba(255,223,0,0.5)] 
             transition-all duration-300 transform hover:scale-105 border border-yellow-500 z-10"
>

    <div className="">
      <img src={playlistIcon} className="w-full h-40  object-cover bg-gray-200"/>
      <span className="relative bottom-7 left-[12.5rem] bg-black bg-opacity-75 text-xs text-white px-2 py-1 rounded-md">
        {playlist.videosCount} videos
      </span>
    </div>
    <div className="p-3">
      <h1 className="text-lg text-white font-semibold truncate">{playlist.name}</h1>
      <h2 className="text-sm text-gray-500 truncate">{playlist.description}</h2>
      <div className="flex items-center gap-2 mt-2">
        <img
          src={playlist.ownerInfo[0].avatar}
          alt=""
          className="w-8 h-8 rounded-full"
        />
        <p className="text-[1rem] font-semibold text-gray-600">@{playlist.ownerInfo[0].username}</p>
      </div>
      <button

       onClick={()=>navigate("/playlist/videos", {state : {playlist}})} 

      className="mt-3 w-full bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500  px-3 py-1.5 rounded-md font-semibold hover:bg-blue-600 transition">
        View Playlist
      </button>
    </div>
  </div>
  {
    showVideolist  && (
        <Playvideolist playlist={playlist} />

    )
  }
  </>
  );
};

export default PlaylistBox;
