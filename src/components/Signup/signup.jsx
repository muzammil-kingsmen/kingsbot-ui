import React, { useState } from "react";
import Gmail from "../icons/icons8-gmail-48.png";
import { useNavigate, Link } from "react-router-dom";
import { Boxes } from "./background-boxes";
import { cn } from "../utils/utils";

const SignupPage = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = (otp, email) => {
    console.log(`Sending OTP ${otp} to ${email}`);
    // Here, integrate an email API like SendGrid, Nodemailer, etc.
  };

  const handleContinueWithEmail = () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");

    const otp = generateOTP();
    localStorage.setItem("signupEmail", email);
    localStorage.setItem("signupOTP", otp);
    sendOTP(otp, email);

    alert("OTP has been sent to your email.");
    navigate("/verify-otp"); // Navigate to OTP verification page
  };

  // New method to handle key press
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleContinueWithEmail();
    }
  };

  return (
    <div className="h-screen relative w-full overflow-hidden bg-[#0A1325] flex items-center justify-center">
      <div className="absolute inset-0 w-full h-full bg-[#0A1325] z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      
      <div className="w-full max-w-md text-center text-white relative z-30">
        <h2 className="text-lg font-light text-gray-300">
          Sign up below to <span className="font-semibold">unlock</span> the full potential of Kingsbot
        </h2>

        <Link to="https://mail.google.com/" target="_blank">
          <button className="w-full mt-6 flex items-center justify-center gap-2 bg-white text-black py-2 rounded-md shadow-md hover:bg-gray-200 border border-gray-400">
            <img src={Gmail} alt="Google logo" className="w-8 h-8" />
            Continue with Google
          </button>
        </Link>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full mt-4 p-2 bg-[#15223B] border border-gray-500 rounded-md text-gray-300 text-center focus:outline-none focus:border-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown} // Add this line to handle Enter key
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <button
          className="w-full mt-4 bg-[#1F2D4A] text-white py-2 rounded-md border border-gray-500 hover:bg-[#253554]"
          onClick={handleContinueWithEmail}
        >
          Continue with email
        </button>
      </div>
    </div>
  );
};

export default SignupPage;