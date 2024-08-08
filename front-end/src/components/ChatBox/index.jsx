import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPaperclip,
  FaRegSmileBeam,
  FaPaperPlane,
  FaCommentSlash,
  FaUserCircle,
} from "react-icons/fa";
import { IoLogoSnapchat } from "react-icons/io";
import { BsChatRightHeart } from "react-icons/bs";
import { GoHubot } from "react-icons/go";
import { FaRobot } from "react-icons/fa";


export default function ChatBox() {
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);

  const toggleChatBox = () => {
    console.log("object");
    setIsChatBoxVisible(!isChatBoxVisible);
  };

  return (
    <div className="z-50 fixed flex flex-col">
      <AnimatePresence>
        {isChatBoxVisible && (
          <>
            {/* Overlay mờ nền */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={toggleChatBox}
            />

            {/* Chatbox */}
            <motion.div
              className="flex flex-col h-[550px] max-w-md fixed bottom-28 right-16 m-4 rounded-2xl bg-gray-100 shadow-xl z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col h-full border rounded-2xl shadow-lg w-full">
                <div className="flex justify-between items-center p-3 border-b rounded-t-2xl">
                  <h5 className="text-lg font-semibold">Chat</h5>
                  <button type="button" className="btn btn-primary btn-sm">
                    Let's Chat App
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-2">
                  <div className="flex items-start mb-4">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                      alt="avatar 1"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <p className="p-2 mb-1 rounded-lg bg-gray-200">Hi</p>
                      <p className="text-sm text-gray-500">23:58</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <div className="flex-grow border-b border-gray-300 mx-3"></div>
                    <span className="text-gray-400">Today</span>
                    <div className="flex-grow border-b border-gray-300 mx-3"></div>
                  </div>

                  <div className="flex items-start mb-4">
                    <div className="mr-3 text-left">
                      <p className="p-2 mb-1 rounded-lg text-white bg-blue-400">
                        Long time no see! Tomorrow office. will be free on
                        Sunday.
                      </p>
                      <p className="text-sm text-gray-500 text-right">00:06</p>
                    </div>
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"
                      alt="avatar 1"
                      className="w-10 h-10 rounded-full"
                    />
                  </div>

                  {/* Các tin nhắn khác */}
                  {/* Lặp lại các khối tin nhắn như trên với các dữ liệu khác */}
                </div>
                <div className="flex items-center p-3 border-t border-gray-200 bg-gray-100 rounded-b-2xl">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"
                    alt="avatar 3"
                    className="w-10 h-10 rounded-full flex-shrink-0"
                  />
                  <input
                    type="text"
                    className="form-control flex-grow p-2 mx-2 border-none rounded-lg focus:ring-0"
                    placeholder="Type message"
                  />
                  <a className="ml-2 text-gray-500 flex-shrink-0" href="#!">
                    <FaPaperclip />
                  </a>
                  <a className="ml-2 text-gray-500 flex-shrink-0" href="#!">
                    <FaRegSmileBeam />
                  </a>
                  <a className="ml-2 text-gray-500 flex-shrink-0" href="#!">
                    <FaPaperPlane />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 p-3 rounded-xl cursor-pointer border-neutral-600"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
        onClick={toggleChatBox}
        style={{ width: "80px", height: "80px" }} 
      >
        {!isChatBoxVisible && (
          <BsChatRightHeart
            size={50}
            style={{
              position: "absolute",
              bottom: "90",
              right: "70",
              zIndex: 1,
            }}
          />
        )}
        <FaRobot
          size={80}
          style={{ position: "absolute", bottom: "30", right: "10" }}
        />
      </motion.div>
    </div>
  );
}
