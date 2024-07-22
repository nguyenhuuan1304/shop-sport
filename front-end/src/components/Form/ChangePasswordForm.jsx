import React from "react";

export default function ChangPasswordForm() {
  return (
    <>
      <div className="flex flex-col p-4 w-1/3">
        <h1 className="text-xl font-semibold mb-4">ĐỔI MẬT KHẨU</h1>

        <div className="flex flex-col mb-4">
          <label htmlFor="oldPassword" className="mb-2 font-semibold text-sm">
            Mật khẩu cũ
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            className="border p-2 font-semibold text-sm rounded "
            placeholder="Nhập lại mật khẩu cũ"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="newPassword" className="mb-2 font-semibold text-sm">
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className="border p-2 font-semibold text-sm rounded "
            placeholder="Mật khẩu từ 6 đến 32 ký tự"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="confirmPassword" className="mb-2 font-semibold text-sm">
            Nhập lại mật khẩu mới
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="border p-2 font-semibold text-sm rounded "
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        <button className="flex items-center justify-center align-self bg-blue-500 text-white w-32 h-11 rounded -xl p-3 border-2 font-semibold text-sm border-blue-500 hover:bg-white hover:text-blue-600 duration-300">
          Cập nhật
        </button>
      </div>
    </>
  );
}
