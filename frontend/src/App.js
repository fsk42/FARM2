import React from "react";
import "./App.css";
//import UploadForm from "./components/UploadForm";
import LoginMask from "./components/loginMask";

function App() {
  return (
    <div className="App">
      <main>
        <LoginMask /> {/* Render the LoginMask component */}
      </main>
    </div>
  );
}

export default App;