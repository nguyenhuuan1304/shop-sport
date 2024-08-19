import { FaYoutube, FaFacebook } from "react-icons/fa";
import React from "react";
import _Breadcrumb from "../components/Breadcrumb";

export default function ContactPage() {
  return (
    <div>
      <div>
        <_Breadcrumb title={"Liên hệ"} />
      </div>
      <div className="bg-gray-300 w-full h-full p-4">
        <div className="bg-white rounded-xl p-2 mx-4">
          <h1 className="text-xl font-semibold mb-4">Thông tin liên hệ</h1>
          <hr className="ml-0 border-t border-gray-300 my-4 w-16 mx-auto" />
          <p>
            Địa chỉ: 638/45/4 Lê Trọng Tấn - Bình Hưng Hoà - Bình Tân - TPHCM
          </p>
          <p>
            Điện thoại: 0985639992
            {/* <FaYoutube size={40} /> */}
          </p>
          <p>
            E-mail:{" "}
            <a href="mailto:voxuanvuloc@gmail.com">voxuanvuloc@gmail.com</a>
          </p>
          <a
            href="https://www.facebook.com/trung.han.2506/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={40} />
          </a>
          <a
            href="https://www.youtube.com/@hanquoctrung3343"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube size={40} />
          </a>
          <h1 className="text-xl font-semibold mb-4">Liên hệ với chúng tôi</h1>
          <hr className="ml-0 border-t border-gray-300 my-4 w-16 mx-auto" />{" "}
          <div className="flex flex-col p-4 w-3/5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <input
                  type="text"
                  id="surnName"
                  name="surnName"
                  className="border p-2 font-semibold text-sm rounded"
                  placeholder="Họ tên của bạn"
                />
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="border p-2 font-semibold text-sm rounded"
                  placeholder="Email của bạn"
                />
              </div>
            </div>
            <div className="flex flex-col mb-4">
              <input
                type="text"
                id="phone"
                name="phone"
                className="border p-2 font-semibold text-sm rounded"
                placeholder="Điện thoại của bạn"
              />
            </div>
            <div className="flex flex-col mb-4">
              <textarea
                type="text"
                id="email"
                name="email"
                className="border p-2 font-semibold text-sm rounded h-60"
                placeholder="Ghi chú"
              />
            </div>
            <button className="flex items-center justify-center align-self bg-blue-500 text-white w-32 h-11 rounded-xl p-3 border-2 font-semibold text-sm border-blue-500 hover:bg-white hover:text-blue-600 duration-300">
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
