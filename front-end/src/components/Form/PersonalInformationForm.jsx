import { Alert, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpdateUser } from "../../features/userSlice";

export default function PersonalInformationForm() {
  const isSuccessUpdate = useSelector((state) => state.user?.success);
  const isLoadingUpdate = useSelector((state) => state.user?.loading);
  const isErrorUpdate = useSelector((state) => state.user?.error);
  const dispatch = useDispatch();
  const currenUser = useSelector((state) => state.auth?.currentUser);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    birthday: "",
    address: "",
  });
  console.log(currenUser);
  useEffect(() => {
    if (currenUser) {
      setFormData({
        id: currenUser.id || "",
        firstname: currenUser.firstname || "",
        lastname: currenUser.lastname || "",
        phone: currenUser.phone || "",
        email: currenUser.email || "",
        birthday: currenUser.birthday || "",
        address: currenUser.address || "",
      });
    }
  }, [currenUser]);

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
      <form className="flex flex-col p-4 w-3/5" onSubmit={handleSubmit}>
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
        <div className="flex flex-row space-x-4 mb-4">
          <div className="flex flex-col">
            <label htmlFor="firstname" className="mb-2 font-semibold text-sm">
              Họ và chữ lót
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              className="border p-2 font-semibold text-sm rounded"
              value={formData.firstname}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastname" className="mb-2 font-semibold text-sm">
              Tên
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              className="border p-2 font-semibold text-sm rounded"
              value={formData.lastname}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="phone" className="mb-2 font-semibold text-sm">
            Số điện thoại
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            className="border p-2 font-semibold text-sm rounded"
            value={formData.phone}
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
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="birthday" className="mb-2 font-semibold text-sm">
            Ngày sinh
          </label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            className="border p-2 rounded"
            value={formData.birthday}
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
