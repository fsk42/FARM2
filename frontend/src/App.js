import React from "react";
import "./App.css";
import UploadForm from "./components/UploadForm";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Instagram Media Uploader</h1>
      </header>
      <main>
        <UploadForm />
      </main>
    </div>
  );
}

export default App;
