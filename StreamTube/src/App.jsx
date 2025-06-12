
// import './App.css'
import './index.css';

import {   Route,Routes} from "react-router-dom"
import LoginPage from "./frontend/Pages/LoginPage.jsx"
import RegisterPage from "./frontend/Pages/RegisterPage.jsx"
import Home from "./frontend/Pages/homePge.jsx"
import Navbar from './frontend/Commponents/nvabar.jsx';
import FullScreenVideo from './frontend/Commponents/fullScreenVideo.jsx';
import Playlist from './frontend/Pages/Playlist.jsx';
import LikeVideo from './frontend/Pages/likeVideo.jsx';
import YourVideo from './frontend/Pages/YourVideo.jsx';
import Playvideolist from './frontend/Commponents/playvideolist.jsx';
import AllPlaylist from './frontend/Pages/allPlaylist.jsx';
import Dashboard from './frontend/Pages/DashboardPages.jsx';
import Setting from './frontend/Pages/setting.jsx';

function App() {
 

  return (
  
   <div>
    <Routes>
     <Route path="/" element ={<LoginPage/>}/>
     <Route path="/register" element={<RegisterPage/>}/>
     <Route path='/video' element={<FullScreenVideo />}/>
     <Route path='/playlist' element = {<Playlist/>}/>
     <Route path='/likeVideo' element={<LikeVideo/>} />
     <Route path='/yourVideo' element = {<YourVideo/>} />
     <Route path='/playlist/videos' element = {<Playvideolist/>} />
     <Route path='/allPlaylist' element={<AllPlaylist/>}  />
     <Route path='/dashboard' element={<Dashboard/>} />
     <Route path='/setting' element={<Setting/>}/>
     
     <Route path="/home" element={<Home/>}/>
    </Routes>
   </div>
  )
}

export default App
