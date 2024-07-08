import React from "react";
import { Breadcrumb } from "antd";
import { Link, useMatches, useMatch, useLocation } from "react-router-dom";

export default function _Breadcrumb({ title }) {
  const location = useLocation();
  // console.log(location);
  //   let matches = useMatches();
  return (
    <div className="bg-gray-500 flex flex-col items-center justify-center w-full h-40 gap-5">
      <span className="text-4xl text-white font-bold">{title}</span>
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
    </div>
  );
}
