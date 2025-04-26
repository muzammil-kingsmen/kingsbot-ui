import React from "react";
import SignUpPage from "./components/Signup/signup";
import EmailVerificationPage from "./components/EmailVerification/emailVerificationPage";
import ChatPage from "./components/ChatPage/chatPage";
import { Routes, Route } from "react-router-dom";
import './index.css'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/verify-otp" element={<EmailVerificationPage />} />
        <Route path="/dashboard" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;