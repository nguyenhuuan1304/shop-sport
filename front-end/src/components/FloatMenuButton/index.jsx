import { useState } from "react";
import { motion } from "framer-motion";
import { SlArrowRight } from "react-icons/sl";
import { Button } from "antd";
import { TiMicrophoneOutline } from "react-icons/ti";
import { AiOutlineMessage } from "react-icons/ai";

export default function FloatMenuButton() {
  const [isShowed, setIsShowed] = useState(false);
  const [isHoveringMic, setIsHoveringMic] = useState(false);
  const [isHoveringMsg, setIsHoveringMsg] = useState(false);

  const handleClickEnter = () => {
    setIsShowed(true);
    console.log("enter");
  };

  const handleClickLeave = () => {
    setIsShowed(false);
    console.log("leave");
  };

  const handleMicEnter = () => {
    setIsHoveringMic(true);
  };

  const handleMicLeave = () => {
    setIsHoveringMic(false);
  };

  const handleMsgEnter = () => {
    setIsHoveringMsg(true);
  };

  const handleMsgLeave = () => {
    setIsHoveringMsg(false);
  };

  return (
    <div
      className="relative"
      onMouseLeave={handleClickLeave}
      onMouseEnter={handleClickEnter}
    >
      <motion.div
        className={`cursor-pointer fixed top-1/2 -left-1 duration-200 opacity-20 hover:opacity-100 ${
          isShowed ? "rotate-180" : "rotate-0"
        }`}
      >
        <SlArrowRight size={25} />
      </motion.div>

      <motion.div
      
        initial={false} // Prevent initial animation when component mounts
        animate={{
          x: isShowed ? 0 : -50, // Animate x position based on isShowed
          opacity: isShowed ? 1 : 0, // Fade out when hidden
        }}
        transition={{ duration: 0.3 }} // Duration of the animation
        className="fixed top-1/2 bottom-1/2 left-6 flex justify-center gap-2 flex-col"
      >
        <div
          className="flex flex-col gap-2"
          onMouseEnter={handleClickEnter}
          onMouseLeave={handleClickLeave}
        >
          <motion.div
            onMouseEnter={handleMicEnter}
            onMouseLeave={handleMicLeave}
            animate={{
              scale: isHoveringMic ? [1.4, 1.3, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Button
              shape="circle"
              type="primary"
              icon={<TiMicrophoneOutline />}
              size="large"
            />
          </motion.div>

          <motion.div
            className="-mb-6"
            onMouseEnter={handleMsgEnter}
            onMouseLeave={handleMsgLeave}
            animate={{
              scale: isHoveringMsg ? [1.4, 1.3, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Button
              shape="circle"
              type="primary"
              icon={<AiOutlineMessage />}
              size="large"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
