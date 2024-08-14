import { Dropdown, List, Menu } from "antd";
import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
const data = [
  {
    title: "QUẦN ÁO THƯƠNG HIỆU",
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
    title: "CẦU LÔNG",
    to: "quan-ao-bong-da-cau-lac-bo-doi-tuyen",
    children: [
      {
        title: "VỢT CẦU LÔNG",
        to: "products?title=category&sort=vợt cầu lông",
      },
      {
        title: "GIÀY CẦU LÔNG",
        to: "products?title=category&sort=giày cầu lông",
      },
    ],
  },
  {
    title: "KHUYẾN MÃI",
    to: "khuyen-mai-giam-gia-xa-hang",
    children: [
      // {
      //   title: "HÀNG ĐANG GIẢM GIÁ",
      //   to: "hang-dang-giam-gia",
      // },
      // {
      //   title: "HÀNG ĐANG XẢ GIÁ SHOCK",
      //   to: "hang-dang-xa-gia-shock",
      // },
      {
        title: "HÀNG ĐANG KHUYẾN MÃI",
        to: "products?title=Sale&sort=true",
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
