import React, { useState } from "react";
import axios from "axios";
import "./VideoDetection.css";

function VideoDetection() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Select video
  const handleVideoChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedVideo(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  // Detect deepfake
  const handleDetect = async () => {
    console.log("Detect button clicked");

    if (!selectedVideo) {
      alert("Please select a video first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();

      // Must match Flask: request.files["video"]
      formData.append("video", selectedVideo);

      console.log("Sending video to Flask...");

      const response = await axios.post(
        "http://127.0.0.1:5000/api/detect/video",
        formData
      );

      console.log("Flask response:", response.data);

      setResult(response.data);
    } catch (error) {
      console.error("Detection error:", error);

      if (error.response) {
        console.error("Backend response:", error.response.data);

        setResult({
          status: "error",
          message:
            error.response.data.message ||
            "Video analysis failed.",
          error: error.response.data.error || ""
        });
      } else {
        setResult({
          status: "error",
          message:
            "Unable to connect to Flask backend. Make sure Flask is running."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-detection-page">

      <div className="video-card">

        <div className="logo">
          ◆ DEEPFAKE AI
        </div>

        <h1>Video Deepfake Detection</h1>

        <p className="subtitle">
          Upload a video and analyze it using AI-powered
          deepfake detection.
        </p>

        {/* Upload */}
        <div className="upload-section">

          <label className="upload-box">

            <span>🎥</span>

            <strong>Choose Video</strong>

            <small>
              MP4, AVI, MOV, MKV or WEBM
            </small>

            <input
              type="file"
              accept="video/mp4,video/avi,video/quicktime,video/x-matroska,video/webm"
              onChange={handleVideoChange}
              hidden
            />

          </label>

        </div>

        {/* Selected video */}
        {selectedVideo && (
          <div className="selected-video">

            <p>
              <strong>Selected:</strong>{" "}
              {selectedVideo.name}
            </p>

            {preview && (
              <video
                className="video-preview"
                src={preview}
                controls
              />
            )}

          </div>
        )}

        {/* Detect button */}
        <button
          type="button"
          className="detect-button"
          onClick={handleDetect}
          disabled={loading || !selectedVideo}
        >
          {loading
            ? "Analyzing Video..."
            : "Detect Deepfake"}
        </button>

        {/* Result */}
        {result && (
          <div className="result-section">

            <h2>Detection Result</h2>

            {result.status === "success" ? (
              <>
                <div className="result-box">

                  <h3>
                    {result.result || "Analysis Complete"}
                  </h3>

                  {result.confidence !== undefined && (
                    <p>
                      Confidence:{" "}
                      <strong>
                        {result.confidence}%
                      </strong>
                    </p>
                  )}

                  <p>
                    {result.message ||
                      "Video analyzed successfully."}
                  </p>

                </div>
                
                {result.frames && result.frames.length > 0 && (
    <div className="frames-section">
        <h2>Analyzed Frames</h2>

        <p className="frames-subtitle">
            Key frames extracted and analyzed from the video
        </p>

        <div className="frames-grid">
            {result.frames.map((frame, index) => (
                <div className="frame-card" key={index}>
                    <img
                        src={`data:image/jpeg;base64,${frame}`}
                        alt={`Frame ${index + 1}`}
                    />

                    <span>Frame {index + 1}</span>
                </div>
            ))}
        </div>
    </div>
)}
              </>
            ) : (
              <div className="result-box error">

                <h3>Analysis Failed</h3>

                <p>
                  {result.message ||
                    "Unable to analyze the video."}
                </p>

                {result.error && (
                  <p>
                    <strong>Error:</strong>{" "}
                    {result.error}
                  </p>
                )}

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default VideoDetection;