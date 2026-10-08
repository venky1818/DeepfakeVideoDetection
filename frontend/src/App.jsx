import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoDetection from "./pages/VideoDetection";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/video-detection" element={<VideoDetection />} />

        <Route path="/detect" element={<VideoDetection />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;