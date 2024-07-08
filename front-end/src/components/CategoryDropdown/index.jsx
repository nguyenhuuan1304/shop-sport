import React from "react";
import { Divider, List, Typography, Menu } from "antd";
import { Dropdown, Space } from "antd";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
const data = [
  {
    title: "QUẦN ÁO BÓNG ĐÁ THƯƠNG HIỆU",
    to: "quan-ao-bong-da-thuong-hieu",
    children: [
      {
        title: "BULBAL - HD",
        to: "bulbal-hd",
      },
      {
        title: "RIKI - CV",
        to: "riki-cv",
      },
    ],
  },
  {
    title: "QUẦN ÁO BÓNG ĐÁ CÂU LẠC BỘ, ĐỘI TUYỂN",
    to: "quan-ao-bong-da-cau-lac-bo-doi-tuyen",
    children: [
      {
        title: "QUẦN ÁO CLB MÈ HD-KL",
        to: "quan-ao-clb-me-hd-kl",
      },
      {
        title: "QUẦN ÁO CLB JUSTPLAY",
        to: "quan-ao-clb-justplay",
      },
    ],
  },
  {
    title: "KHUYẾN MÃI, GIẢM GIÁ, XẢ HÀNG",
    to: "khuyen-mai-giam-gia-xa-hang",
    children: [
      {
        title: "HÀNG ĐANG GIẢM GIÁ",
        to: "hang-dang-giam-gia",
      },
      {
        title: "HÀNG ĐANG XẢ GIÁ SHOCK",
        to: "hang-dang-xa-gia-shock",
      },
      {
        title: "HÀNG ĐANG KHUYẾN MÃI",
        to: "hang-dang-khuyen-mai",
      },
    ],
  },
];
export default function CategoryDropdown({ isbordered }) {
  return (
    <List
      bordered={isbordered !== undefined ? isbordered : false}
      size="small"
      dataSource={data}
      renderItem={(item) => {
        const menuItems = item.children.map((subItem) => ({
          key: subItem.to,
          label: (
            <>
              <Link to={`/${subItem.to}`}>{subItem.title}</Link>
            </>
          ),
        }));

        const menu = <Menu items={menuItems} />;
        return (
          <List.Item>
            <Dropdown
              dropdownRender={() => menu}
              trigger={["hover"]}
              placement="right"
              autoAdjustOverflow
            >
              <Link className="flex flex-row items-center" to={`/${item.to}`}>
                {item.title} <MdOutlineKeyboardArrowRight size={30} />
              </Link>
            </Dropdown>
          </List.Item>
        );
      }}
    />
  );
}
