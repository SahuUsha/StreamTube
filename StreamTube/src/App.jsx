import { Routes, Route } from "react-router-dom";
import LoginPage from "./frontend/Pages/LoginPage.jsx";
import RegisterPage from "./frontend/Pages/RegisterPage.jsx";
import Home from "./frontend/Pages/homePge.jsx";
import FullScreenVideo from './frontend/Commponents/fullScreenVideo.jsx';
import Playlist from './frontend/Pages/Playlist.jsx';
import LikeVideo from './frontend/Pages/likeVideo.jsx';
import YourVideo from './frontend/Pages/YourVideo.jsx';
import Playvideolist from './frontend/Commponents/playvideolist.jsx';
import AllPlaylist from './frontend/Pages/allPlaylist.jsx';
import Dashboard from './frontend/Pages/DashboardPages.jsx';
import Setting from './frontend/Pages/setting.jsx';
import ProtectedRoute from './frontend/Commponents/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/video" element={<ProtectedRoute><FullScreenVideo /></ProtectedRoute>} />
      <Route path="/playlist" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />
      <Route path="/likeVideo" element={<ProtectedRoute><LikeVideo /></ProtectedRoute>} />
      <Route path="/yourVideo" element={<ProtectedRoute><YourVideo /></ProtectedRoute>} />
      <Route path="/playlist/videos" element={<ProtectedRoute><Playvideolist /></ProtectedRoute>} />
      <Route path="/allPlaylist" element={<ProtectedRoute><AllPlaylist /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/setting" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
