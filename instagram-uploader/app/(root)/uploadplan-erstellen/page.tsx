"use client";

import React, { useState } from "react";

const UploadplanErstellen = () => {
  const [caption, setCaption] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Caption:", caption);
    console.log("Upload Date:", uploadDate);
    console.log("Image saved");
    setImage(null); // Vorschau entfernen
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
      console.log("Image uploaded:", e.dataTransfer.files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="page-header divide-y-2">Neuer Uploadplan erstellen</div>
      <hr className="my-4 mx-4 bg-black-1 h-1 rounded border-0" />
      <div className="page-content">
        <form onSubmit={handleSubmit} className="upload-form space-y-4">
          <div>
            <label htmlFor="caption" className="block font-bold">Bildbeschreibung:</label>
            <input
              type="text"
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Bildbeschreibung eingeben"
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="uploadDate" className="block font-bold">Upload-Datum:</label>
            <input
              type="date"
              id="uploadDate"
              value={uploadDate}
              onChange={(e) => setUploadDate(e.target.value)}
              className="block w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-dashed border-2 border-gray-300 rounded p-4 text-center bg-gray-50"
          >
            {image ? (
              <div className="flex flex-col items-center">
                {image.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt={image.name}
                    className="max-w-full max-h-40 mb-2"
                  />
                ) : null}
                <span className="text-sm text-gray-600">{image.name}</span>
              </div>
            ) : (
              "Bild per Drag & Drop hierhin ziehen"
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Speichern
          </button>
        </form>
      </div>
    </>
  );
};

export default UploadplanErstellen;
