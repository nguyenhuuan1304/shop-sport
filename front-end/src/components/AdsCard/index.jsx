import React from "react";
import { motion } from "framer-motion";

export default function AdsCard({ Icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: -100, y: -100 }}
      // animate={{ opacity: 1, scale: 1, x: 1 }}
      whileInView={{ opacity: [0.2, 0.4, 0.6, 1], scale: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-red-100 p-3 rounded-lg w-80 h-auto"
    >
      <div className="flex flex-row gap-2 items-center">
        <div>
          <Icon
            size={30}
            className="bg-red-500 p-1 rounded-full overflow-hidden text-white"
          />
        </div>
        <span className="text-lg font-semibold text-neutral-700">{title}</span>
      </div>
      <p className="text-sm mt-2 pb-5 text-neutral-500">{description}</p>
    </motion.div>
  );
}
