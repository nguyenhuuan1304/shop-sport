import { useState } from "react";
import { motion } from "framer-motion";
import { SlArrowRight } from "react-icons/sl";
import { Button } from "antd";
import { TiMicrophoneOutline } from "react-icons/ti";
import { AiOutlineMessage } from "react-icons/ai";

export default function FloatMenuButton() {
  const [isShowed, setIsShowed] = useState(false);

  const handleClick = () => {
    setIsShowed(!isShowed);
    console.log("enter");
  };

  return (
    <div>
      <motion.div
        onClick={handleClick}
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
        <motion.div
          animate={{
            scale: isShowed ? [1.4, 1.3, 1.2, 1] : 1,
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
          animate={{
            scale: isShowed ? [1.4, 1.3, 1.2, 1] : 1,
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
      </motion.div>
    </div>
  );
}
