import React from "react";
import { Divider, List, Typography } from "antd";
import { Dropdown, Space } from "antd";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
const data = [
  "QUẦN ÁO BÓNG ĐÁ THƯƠNG HIỆU",
  "QUẦN ÁO BÓNG ĐÁ CÂU LẠC BỘ, ĐỘI TUYỂN",
  "KHUYẾN MÃI, GIẢM GIÁ, XẢ HÀNG",
];
export default function CategoryDropdown() {
  return (
    <List
      size="small"
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Link className="flex flex-row items-center">
            {item} <MdOutlineKeyboardArrowRight size={30} />
          </Link>
        </List.Item>
      )}
    />
  );
}
