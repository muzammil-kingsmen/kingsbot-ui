import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Gmail from "../icons/icons8-gmail-48.png";
import { BackgroundBeams } from "./background-beams"; // Import the BackgroundBeams component
import "../ButtonGradient/Button.css";

const EmailVerificationPage = () => {
  let [checkOTP, setCheckOTP] = useState("");
  let [message, setMessage] = useState("");
  let navigate = useNavigate();

  let OTP = JSON.parse(localStorage.getItem("signupOTP"));

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      verifyOTP();
    }
  };

  const verifyOTP = () => {
    if (checkOTP != OTP) {
      setMessage("OTP is not matching");
    } else {
      setMessage("OTP verified successfully!");
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative h-screen w-full bg-[#0A1325] flex items-center justify-center px-4 overflow-hidden">
      <BackgroundBeams />
      
      <div className="relative w-full max-w-md p-[3px] rounded-lg z-30">
        {/* Inner Card */}
        <div className="relative bg-[#192b4bc5] p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <img src={Gmail} alt="Gmail Logo" className="w-12 h-12 mb-4 bg-black rounded-2xl p-2" />
          <h2 className="text-lg font-semibold text-white">Check your email for validation</h2>
          <h2 className="text-lg font-semibold text-white">OTP: {OTP}</h2>
          
          {message && (
            <h2 className="text-lg font-semibold text-white">{message}</h2>
          )}
          
          <input
            type="tel"
            placeholder="Enter code"
            className="w-full mt-4 p-2 bg-[#1F2D4A] border border-gray-500 rounded-md text-gray-300 text-center focus:outline-none focus:border-white"
            onChange={(e) => {
              setCheckOTP(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />

          <button 
            className="w-full mt-4 bg-white text-black py-2 rounded-md border border-gray-400 hover:bg-gray-200" 
            onClick={verifyOTP}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;