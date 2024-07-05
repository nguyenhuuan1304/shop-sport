import React from "react";
import { Carousel } from "antd";
import carousel1 from "../../assets/carousel1.jpg";
import carousel2 from "../../assets/carousel2.jpg";
import carousel3 from "../../assets/carousel3.jpg";
import carousel4 from "../../assets/carousel4.jpg";
import { Link } from "react-router-dom";

function CustomArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        background: "red",
        borderRadius: "10px",
        padding: "5px",
      }}
      onClick={onClick}
    />
  );
}

export default function _Carousel() {
  return (
    <Carousel
      className="max-w-screen-sm h-auto"
      arrows
      autoplay
      pauseOnHover
      nextArrow={<CustomArrow />}
      prevArrow={<CustomArrow />}
      fade
      customPaging={(i) => {
        return (
          <Link>
            <img src={`/src/assets/carousel${i + 1}.jpg`} />
          </Link>
        );
      }}
    >
      <div key="1" className="bg-red-100 flex items-center justify-center">
        <img
          src={carousel1}
          alt=""
          className="h-96 w-full rounded-lg object-cover"
        />
      </div>
      <div key="2" className="bg-red-100 flex items-center justify-center">
        <img
          src={carousel2}
          alt=""
          className="h-96 w-full rounded-lg object-none"
        />
      </div>
      <div key="3" className="bg-red-100 flex items-center justify-center">
        <img
          src={carousel3}
          alt=""
          className="h-96 w-full rounded-lg object-none"
        />
      </div>
      <div key="4" className="bg-red-100 flex items-center justify-center">
        <img
          src={carousel4}
          alt=""
          className="h-96 w-full rounded-lg object-none"
        />
      </div>
    </Carousel>
  );
}
