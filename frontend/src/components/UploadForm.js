import React, { useState } from "react";
import "../styles/UploadForm.css";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }
    // Logic to upload file to Instagram API will go here
    console.log("Uploading:", file, "with caption:", caption);
  };

  return (
    <div className="upload-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-upload">Choose a photo or video:</label>
        <input
          type="file"
          id="file-upload"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        {file && <p>Selected file: {file.name}</p>}

        <label htmlFor="caption">Caption:</label>
        <textarea
          id="caption"
          value={caption}
          onChange={handleCaptionChange}
          placeholder="Write a caption..."
        ></textarea>

        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadForm;
