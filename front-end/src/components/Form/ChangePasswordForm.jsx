import { Alert, Button, Input } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../features/authSlice";

export default function ChangPasswordForm() {
  const isLoadingChangePassword = useSelector((state) => state.auth?.isLoading);
  const isErrorChangePassword = useSelector(
    (state) => state.auth?.errorMessages
  );
  const isSuccessChangePassword = useSelector((state) => state.auth?.success);

  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    passwordConfirmation: "",
  });
  const dispatch = useDispatch();
  const handleChangePassword = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form submission
    console.log("object", formData);
    dispatch(changePassword({ data: formData }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <>
      <div className="flex flex-col p-4 w-1/3">
        <h1 className="text-xl font-semibold mb-4">ĐỔI MẬT KHẨU</h1>
        {isLoadingChangePassword ? (
          <Button type="primary" loading className="ml-2">
            Đang đổi mật khẩu.
          </Button>
        ) : (
          <>
            {" "}
            {isSuccessChangePassword ? (
              <Alert
                message="Đổi mật khẩu thành công"
                description="Mật khẩu của bạn đã được thay đổi."
                type="success"
                showIcon
              />
            ) : (
              <>
                {isErrorChangePassword ? (
                  <Alert
                    message="Đổi mật khẩu thất bại"
                    description="Vui lòng thao tác lại để tiếp tục đổi mật khẩu"
                    type="error"
                    showIcon
                  />
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}

        <br />

        <div className="flex flex-col mb-4">
          <label htmlFor="oldPassword" className="mb-2 font-semibold text-sm">
            Mật khẩu cũ
          </label>
          <Input.Password
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu cũ"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="newPassword" className="mb-2 font-semibold text-sm">
            Mật khẩu mới
          </label>
          <Input.Password
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu cũ"
          />
        </div>

        <div className="flex flex-col mb-4">
          <label
            htmlFor="confirmPassword"
            className="mb-2 font-semibold text-sm"
          >
            Nhập lại mật khẩu mới
          </label>
          <Input.Password
            id="passwordConfirmation"
            name="passwordConfirmation"
            value={formData.passwordConfirmation}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu cũ"
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="flex items-center justify-center align-self bg-blue-500 text-white w-32 h-11 rounded -xl p-3 border-2 font-semibold text-sm border-blue-500 hover:bg-white hover:text-blue-600 duration-300"
        >
          Cập nhật
        </button>
      </div>
    </>
  );
}
