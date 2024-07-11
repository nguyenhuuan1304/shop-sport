import { Breadcrumb } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function _Breadcrumb({ title }) {
  const location = useLocation();
  // console.log(location);
  //   let matches = useMatches();
  return (
    <div className="bg-gray-500 flex flex-col items-center justify-center w-full h-40 gap-5">
      <motion.span
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl text-white font-bold"
      >
        {title}
      </motion.span>
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Breadcrumb
          items={[
            {
              title: (
                <Link to="/" className="text-white hover:text-white">
                  Trang chủ
                </Link>
              ),
            },
            {
              title: <Link to={location?.pathname}>{title}</Link>,
            },
          ]}
        />
      </motion.div>
    </div>
  );
}
