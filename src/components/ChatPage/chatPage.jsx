import { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes, FaMoon, FaSun, FaUserCircle, FaPlus } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { BsFillSunFill } from "react-icons/bs";
import chatLogo from "../icons/image_hd.png";
import OpenAI from "openai";
import Setting from "../Setting/setting";

const Sidebar = ({ isOpen, toggleSidebar, darkMode, toggleDarkMode, chatHistory, setMessages, setDisplay, loadMoreChats, newChat }) => {
  let empty = [];

  return (
    <div className={`fixed top-0 left-0 h-full w-64 p-4 flex flex-col transition-transform duration-300 
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} z-50 shadow-lg`}>
      <button onClick={toggleSidebar} className="self-end text-xl cursor-pointer">
        <FaTimes />
      </button>
      <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
        KingsBot 1.0.0
      </h2>
      <button onClick={newChat} className="w-full bg-gray-500 text-white py-2 rounded-2xl mb-4 cursor-pointer">+ New Chat</button>

      <div className="mb-4 flex flex-col flex-grow overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
        <h3 className="text-sm font-semibold">Recent</h3>
        <ul className="mt-2 rounded-2xl">
          {Array.isArray(chatHistory) && chatHistory.length > 0 ? (
            [...chatHistory].map((chat, index) => (
              <li
                key={index}
                className={`py-2 px-3 mb-1 cursor-pointer flex items-center rounded-4xl ${darkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
                onClick={() => {
                  setMessages(chat.messages);
                  toggleSidebar();
                  setDisplay(empty);
                }}
              >
                <FaBars className="mr-3 border-0 rounded-b-sm w-5 h-5 p-0.5 flex-shrink-0" />
                <span className="truncate">{chat.messages[0].text}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-400 text-sm">No recent chats</li>
          )}
        </ul>
      </div>

      <button onClick={loadMoreChats} className="text-blue-400 underline mb-30">More</button>
      <button onClick={toggleDarkMode} className="mt-auto mb-5 flex items-center px-4 py-2 rounded-2xl bg-gray-700 text-white cursor-pointer">
        {darkMode ? <FaSun className="ml-3" /> : <FaMoon className="mr-2" />} {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};

export default function KingsbotUI() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [offset, setOffset] = useState(0);
  const [display, setDisplay] = useState([]);
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY; 

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(storedChats.slice(0, 5));
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMoreChats = () => {
    const storedChats = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const newOffset = offset + 10;
    setChatHistory(storedChats.slice(0, newOffset));
    setOffset(newOffset);
  };

  const newChat = () => {
    setMessages([]);
    setInput("");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-gray-900");
    document.body.classList.toggle("bg-gray-100");
  };

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: newMessages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
      });
      const botMessage = response.choices[0].message.content;
      let currentText = "";
      setMessages([...newMessages, { sender: "bot", text: "..." }]);

      for (let i = 0; i < botMessage.length; i++) {
        setTimeout(() => {
          currentText += botMessage[i];
          setMessages([...newMessages, { sender: "bot", text: currentText }]);
        }, i * 7);
      }

      const newChatEntry = { title: input, messages: [...newMessages, { sender: "bot", text: botMessage }] };
      const updatedChats = [newChatEntry, ...chatHistory];
      setChatHistory(updatedChats.slice(0, 5));
      localStorage.setItem("chatHistory", JSON.stringify(updatedChats));
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { sender: "bot", text: "Sorry, something went wrong. Try again!" }]);
    }
  };

  const renderMessageText = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={lastIndex}>{text.slice(lastIndex, match.index)}</span>);
      }
      const language = match[1] || "text";
      const codeContent = match[2].trim();
      parts.push(
        <div key={match.index} className="bg-[#343541] text-white rounded-md my-2 relative w-full max-w-full overflow-hidden">
          <div className="bg-[#40414f] text-gray-300 text-xs px-2 py-1 rounded-t-md flex justify-between items-center">
            {language}
            <button
              className="text-gray-300 hover:text-white text-xs bg-[#40414f] px-2 py-1 rounded"
              onClick={() => navigator.clipboard.writeText(codeContent)}
            >
              Copy
            </button>
          </div>
          <pre className="p-2 text-sm font-mono whitespace-pre-wrap break-words word-break break-all overflow-x-hidden">
            <code>{codeContent}</code>
          </pre>
        </div>
      );
      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`h-screen w-full ${darkMode ? "dark" : ""} ${darkMode ? "bg-[#0E1628] text-white" : "bg-gray-100 text-black"} flex flex-col overflow-x-hidden`}>      {!isSidebarOpen && (
      <div className="fixed top-4 left-4 z-40 text-xl cursor-pointer p-2 rounded" onClick={() => setIsSidebarOpen(true)}>
        <FaBars className={darkMode ? "text-white" : "text-black"} />
      </div>
    )}

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(false)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        chatHistory={chatHistory}
        loadMoreChats={loadMoreChats}
        newChat={newChat}
        setMessages={setMessages}
        setDisplay={setDisplay}
      />

      <div className={`fixed left-0 top-0 h-full flex flex-col items-center py-6 gap-6 w-14 sm:w-16 md:w-20 ${darkMode ? 'bg-[#181D2A]' : 'bg-white'}`}>
        <FaBars className={`text-xl cursor-pointer ${darkMode ? 'text-white' : 'text-black'}`} />
        <FaPlus
          className={`text-sm cursor-pointer p-1 mr-1 rounded-full hover:bg-gray-500 w-6 h-6 border-2 ${darkMode ? 'text-white' : 'text-black'}`}
          onClick={newChat}
        />
      </div>

      <div className="flex items-center justify-between p-4 pl-20">
        <div>
          <h1 className="text-lg font-bold ml-3">Kingsbot</h1>
          <span className="text-sm text-gray-400 ml-2.5">Version 1.0.0</span>
        </div>
        <div className="relative">
          <FaUserCircle className="text-3xl cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-[#181D2A] shadow-md rounded-md p-2">
              <button className="flex items-center gap-2 w-full text-white py-1 px-2 hover:bg-[#1F263A] rounded" onClick={() => { setShowModal(true); setShowMenu(false); }}>
                <FiSettings /> Settings
              </button>
              <button
                className="flex items-center justify-center sm:justify-start gap-2 w-full text-white py-2 px-4 sm:px-6 hover:bg-[#1F263A] rounded transition-all duration-200"
                onClick={() => handleLogout}
              >
                <IoLogOutOutline />
                <span className="text-sm sm:text-base md:text-sm">Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={`flex-grow flex flex-col items-center justify-center px-2 sm:px-6 w-full ${darkMode ? "bg-[#0E1628] text-white" : "bg-gray-100 text-black"} overflow-x-hidden`}>
      <div
  ref={chatContainerRef}
  className={`chat-container w-full max-w-[95%] sm:max-w-7xl p-4 rounded-xl overflow-y-auto overflow-x-hidden flex-grow ${darkMode ? "bg-[#0E1628] text-white" : "bg-gray-100 text-black"}`}
>
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                <span className="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
                  Hello, Welcome to
                </span>
                <br />
                <span className="font-bold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
                  KINGSBOT
                </span>
                <br />
                <span className="font-semibold bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
                  How can I help you?
                </span>
              </h1>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-2 md:pl-4 ml-5`}>
              <div className="flex items-start gap-2 max-w-[80%] sm:max-w-[70%] md:max-w-[60%]">
                {msg.sender !== "user" && (
                  <img src={chatLogo} alt="KingsBot" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mt-1 ml-2 sm:ml-8 flex-shrink-0" />
                )}
                <div className={`p-2 rounded-xl flex items-center w-full ${msg.sender === "user" ? "bg-blue-600 text-white" : darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"} overflow-hidden`}>
                  <div className="text-sm ml-2 mr-2 w-full break-words">{renderMessageText(msg.text)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`sticky bottom-0 pb-6 flex justify-center px-4 ${darkMode
        ? "bg-[#0A1325] text-white"
        : "bg-white text-black border-t border-gray-200"
        }`}>
        <div className="fixed bottom-9.5 left-3 cursor-pointer" onClick={toggleDarkMode}>
          {darkMode ? (
            <BsFillSunFill className="text-white text-2xl" />
          ) : (
            <FaMoon className="text-black text-2xl" />
          )}
        </div>

        <div
          className={`mt-5 ml-10 flex items-center 
    ${darkMode ? "bg-[#1F263A] border-2 border-[#EEB609]" : "bg-gray-100 border border-gray-800"}
    px-4 py-2 rounded-full w-full max-w-xs sm:w-full md:max-w-md lg:max-w-lg xl:max-w-2xl`}
        >
          <input
            type="text"
            placeholder="Ask Kingsbot..!"
            className={`bg-transparent flex-grow outline-none text-sm placeholder-gray-400 ${darkMode ? "text vost-white" : "text-black"} px-2`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            className={`text-lg p-2 rounded-full ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-blue-500 text-white hover:bg-blue-600"}`}
            onClick={handleSendMessage}
          >
            <IoMdSend />
          </button>
        </div>
      </div>

      {showModal && <Setting onClose={() => setShowModal(false)} />}
    </div>
  );
}