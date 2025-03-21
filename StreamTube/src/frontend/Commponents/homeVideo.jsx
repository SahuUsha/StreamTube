

import React ,{useState,useEffect}from 'react'
import FullScreenVideo from './fullScreenVideo';
import { useNavigate } from "react-router-dom";

const HomeVideo = ({video}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  

  useEffect(() => {
    let timer;
    if (isHovered) {
      timer = setTimeout(() => setShowVideo(true), 1000); // Wait 2 seconds before showing video
    } else {
      clearTimeout(timer);
      setShowVideo(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered]);

  return (
    <div 
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
     

      <div className=" rounded-lg overflow-hidden shadow-lg">
        {showVideo ? (
          <video 
            src={video.videoFile} 
             controls
     autoPlay
            loop 
            muted 
            className="w-full h-48 object-cover"
          ></video>
        ) : (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-3 flex gap-3 ">
          <img
            src={video.ownerInfo[0]?.avatar}
            alt={video.ownerInfo[0]?.username}
            className="w-10 h-10 rounded-full flex-shrink-0"
          />
          <div className='flex-grow'>
            <h3 className="text-white  font-semibold text-[1.05rem]">{video?.title}</h3>
            <p className="text-neutral-400 text-[1.1rem]">{video.ownerInfo[0]?.username}</p>
            <p className="text-neutral-400 text-[1rem]">{video.views} views{video.uploadDate}</p>
          </div>
          <div>
            <button onClick={()=>navigate("/video",{state: {video}})   } className='bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500  font-semibold  px-3 py-1 rounded-md'>Watch</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeVideo

