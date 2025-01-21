import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";
import ScheduledPosts from "./ScheduledPosts";
import "./App.css";

function App() {
  const [postType, setPostType] = useState("image");
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [media, setMedia] = useState(null);
  const [message, setMessage] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [fileError, setFileError] = useState("");
  const mediaInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleMediaValidation(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleMediaValidation(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleMediaValidation = (file) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedVideoTypes = ["video/mp4"];
    const fileType = file?.type;

    if (postType === "image" && !allowedImageTypes.includes(fileType)) {
      setFileError("Only JPG, JPEG, PNG, or WEBP files are allowed for images.");
      setMedia(null);
    } else if (postType === "video" && !allowedVideoTypes.includes(fileType)) {
      setFileError("Only MP4 files are allowed for videos.");
      setMedia(null);
    } else {
      setFileError("");
      setMedia(file);
    }
  };

  const resetForm = () => {
    setTimeout(() => {
      setPostType("image");
      setCaption("");
      setHashtags("");
      setMedia(null);
      setMessage("");
      if (mediaInputRef.current) {
        mediaInputRef.current.value = "";
      }
      setScheduledTime("");
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media) {
      setMessage("Please select a media file.");
      return;
    }

    const formData = new FormData();
    formData.append("post_type", postType);
    formData.append("caption", caption);
    formData.append("hashtags", hashtags);
    formData.append("media", media);
    formData.append("scheduled_time", scheduledTime);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Router>
      <div className="App">
        <h1>Instagram Post</h1>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="postType">Post Type:</label>
                    <select
                      id="postType"
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="caption">Caption:</label>
                    <textarea
                      id="caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="hashtags">Hashtags:</label>
                    <input
                      type="text"
                      id="hashtags"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      placeholder="#example #hashtag"
                    />
                  </div>
                  <div>
                    <label htmlFor="scheduledTime">Scheduled Time (optional):</label>
                    <input
                      type="datetime-local"
                      id="scheduledTime"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="media">Media File:</label>
                    <input
                      type="file"
                      id="media"
                      ref={mediaInputRef}
                      onChange={handleFileChange}
                    />
                    {fileError && <p style={{ color: "red" }}>{fileError}</p>}
                  </div>

                  {/* Drag-and-Drop Box */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="dropzone"
                  >
                    {media ? (
                      <div className="image-preview">
                        {media.type.startsWith("image/") ? (
                          <img
                            src={URL.createObjectURL(media)}
                            alt={media.name}
                            className="preview-img"
                          />
                        ) : null}
                        <span className="image-name">{media.name}</span>
                      </div>
                    ) : (
                      <div className="drag-box">
                        Drag & Drop media file here or select
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={!!fileError}>
                    Upload Post
                  </button>
                </form>
                {message && <p style={{ textAlign: "center" }}>{message}</p>}
                <Link to="scheduled_posts" className="view-scheduled-posts">
                  View Scheduled Posts
                </Link>
              </div>
            }
          />
          <Route path="/scheduled_posts" element={<ScheduledPosts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;