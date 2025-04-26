import { useState } from "react";
import { FaTimes, FaPen } from "react-icons/fa";

export default function EditProfileModal({ onClose }) {
  const [name, setName] = useState("Kingsmen Realty");
  const [email, setEmail] = useState("kingsmen@gmail.com");
  const [password, setPassword] = useState("");
  const [upassword, setUPassword] = useState("");

  return (
    
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#181D2A] p-6 rounded-lg w-96 shadow-lg relative">
        {/* Close Button */}
        <div 
          className="absolute top-3 right-3 text-white text-xl hover:text-gray-400 transition"
          onClick={onClose}
        >
          <FaTimes />
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold mb-4 text-white">Edit Profile</h2>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div className="relative">
            <label className="block text-sm text-gray-300">Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <FaPen className="absolute right-3 top-8 text-gray-400 cursor-pointer" />
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm text-gray-300">Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <FaPen className="absolute right-3 top-8 text-gray-400 cursor-pointer" />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm text-gray-300">Current Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Current password"
              className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <FaPen className="absolute right-3 top-8 text-gray-400 cursor-pointer" />
          </div>


          <div className="relative">
            <label className="block text-sm text-gray-300">Update Password:</label>
            <input 
              type="password" 
              value={upassword} 
              onChange={(e) => setUPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
            <FaPen className="absolute right-3 top-8 text-gray-400 cursor-pointer" />
          </div>

          {/* Continue Button */}
          <button className="w-full bg-white text-black py-2 rounded mt-2 font-semibold hover:bg-gray-200">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
