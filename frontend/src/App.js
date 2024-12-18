import React from "react";
import "./App.css";
//import UploadForm from "./components/UploadForm";
import LoginMask from "./components/loginMask";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CodeInput from "./components/codeInput";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginMask />} />
        <Route path="/enter-code" element={<CodeInput />} />
      </Routes>
    </Router>
  );
}

export default App;