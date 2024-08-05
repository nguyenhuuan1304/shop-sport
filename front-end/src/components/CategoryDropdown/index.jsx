import { Dropdown, List, Menu } from "antd";
import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
const data = [
  {
    title: "QUẦN ÁO BÓNG ĐÁ THƯƠNG HIỆU",
    to: "quan-ao-bong-da-thuong-hieu",
    children: [
      {
        title: "ADIDAS",
        to: "products?title=brand&sort=adidas",
      },
      {
        title: "NIKE",
        to: "products?title=brand&sort=nike",
      },
    ],
  },
  {
    title: "QUẦN ÁO BÓNG ĐÁ CÂU LẠC BỘ, ĐỘI TUYỂN",
    to: "quan-ao-bong-da-cau-lac-bo-doi-tuyen",
    children: [
      {
        title: "MANCHESTER UNITED",
        to: "quan-ao-clb-me-hd-kl",
      },
      {
        title: "REAL MARID",
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
        const menuItems = item.children.map((subItem, index) => ({
          key: subItem.to,
          label: (
            <>
              <Link to={`/${subItem.to}`}>{subItem.title}</Link>
            </>
          ),
        }));
        return (
          <List.Item key={item.to}>
            <Dropdown
              dropdownRender={() => <Menu items={menuItems} />}
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
