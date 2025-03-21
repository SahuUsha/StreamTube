import React, { useEffect, useState } from "react";
import {  getAllPlaylist, getMyPlaylists, } from "../Api/playlist.api.js";
import PlaylistBox from "../Commponents/playlististbox.jsx";

const AllPlaylist = () => {
    const [playListName, setPlayListName] = useState("");
    const [description, setDescription] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [Playlists, setPlaylists] = useState([]);
  
    useEffect(() => {
      handleGetPlaylist();
    }, []);
  
  
  
    const handleGetPlaylist = async () => {
      try {
        const response = await getAllPlaylist();
        console.log("my playlist : ", response);
        if (response && response.data) {
          setPlaylists(response.data.data);
        }
      } catch (error) {
        console.log("error on getting playlist : ", error);
      }
    };
  
    return (
      <div className="text-white flex flex-col items-center w-full">
        {/* Header with Button */}
        <div className="flex justify-between items-center mt-6 w-[90%]">
          <h1 className="text-[1.8rem] font-bold">All Playlist</h1>
         
        </div>
  
        {/* Playlist Box Flex Container */}
        <div className="mt-6 w-[90%] flex flex-wrap gap-6 justify-start">
          {Playlists.map((playlist) => (
            <PlaylistBox key={playlist._id} playlist={playlist} />
          ))}
        </div>
  
      
       
      </div>
    );
}

export default AllPlaylist
