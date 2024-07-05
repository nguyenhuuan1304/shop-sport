import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, địa chỉ bạn truy cập không tồn tại."
      extra={
        <Link
          to="/"
          type="primary"
          className="bg-blue-600 text-white rounded-lg p-2"
        >
          Trở về trang chủ
        </Link>
      }
    />
  );
}
