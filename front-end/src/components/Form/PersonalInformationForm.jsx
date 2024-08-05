import { Alert, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpdateUser } from "../../redux/slices/userSlice";

export default function PersonalInformationForm() {
  const isSuccessUpdate = useSelector((state) => state.user?.success);
  const isLoadingUpdate = useSelector((state) => state.user?.loading);
  const isErrorUpdate = useSelector((state) => state.user?.error);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth?.currentUser);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    number_phone: "",
    email: "",
    dob: "",
    address: "",
  });
  useEffect(() => {
    if (currentUser) {
      const dob = currentUser.dob
        ? new Date(currentUser.dob).toISOString().split("T")[0]
        : "";
      setFormData({
        id: currentUser._id || "",
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        number_phone: currentUser.number_phone || "",
        email: currentUser.email || "",
        dob: dob,
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
    dispatch(fetchUpdateUser({ data: formData }));
  };

  return (
    <>
      <form
        className="flex flex-col p-4 sm:w-3/5 w-full"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-semibold mb-4">THÔNG TIN TÀI KHOẢN</h1>
        {isLoadingUpdate ? (
          <>
            <Button type="primary" loading className="ml-2">
              Đang cập nhật tài khoản.
            </Button>
          </>
        ) : (
          <>
            {" "}
            {isSuccessUpdate ? (
              <Alert
                message="Cập nhật tài khoản thành công"
                description="tài khoản của bạn đã được thay đổi thành công vui lòng kiểm tra thông tin tài khoản."
                type="success"
                showIcon
              />
            ) : (
              <>
                {isErrorUpdate ? (
                  <Alert
                    message="Cập nhật tài khoản thất bại"
                    description="vui lòng thao tác cập nhật lại tài khoản."
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
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
          <div className="flex flex-col">
            <label htmlFor="first_name" className="mb-2 font-semibold text-sm">
              Họ và chữ lót
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              className="border p-2 font-semibold text-sm rounded"
              placeholder={formData.first_name}
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col sm:mt-0 mt-4">
            <label htmlFor="last_name" className="mb-2 font-semibold text-sm">
              Tên
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              className="border p-2 font-semibold text-sm rounded"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="number_phone" className="mb-2 font-semibold text-sm">
            Số điện thoại
          </label>
          <input
            type="text"
            id="number_phone"
            name="number_phone"
            className="border p-2 font-semibold text-sm rounded"
            value={formData.number_phone}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="email" className="mb-2 font-semibold text-sm">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            className="border p-2 font-semibold text-sm rounded"
            value={formData.email}
            onChange={handleChange}
            disabled={true}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="birthday" className="mb-2 font-semibold text-sm">
            Ngày sinh
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            className="border p-2 rounded"
            value={formData.dob}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="address" className="mb-2 font-semibold text-sm">
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="border p-2 font-semibold text-sm rounded"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center align-self bg-blue-500 text-white w-32 h-11 rounded-xl p-3 border-2 font-semibold text-sm border-blue-500 hover:bg-white hover:text-blue-600 duration-300"
        >
          Cập nhật
        </button>
      </form>
    </>
  );
}
