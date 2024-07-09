import React from 'react';
import { NavLink } from 'react-router-dom';
import _Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';

const className = "hover:text-blue-500 duration-150 border-b-2 hover:border-blue-500 border-transparent p-4";

const FilterOption = [{
  title: 'Mới nhất',
  to: "products",
}, {
  title: 'New',
  to: "products",
}, {
  title: 'Sale',
  to: "products",
}, {
  title: 'Hot',
  to: "products",
}, {
  title: 'Giá Thấp',
  to: "products",
}, {
  title: 'Giá CAO',
  to: "products",
}]

export default function ProductPage() {
  return (
    <div>
      <_Breadcrumb title={"a"}></_Breadcrumb>
      <div className='flex gap-10 border-b'>
        <span className='p-4'>Sắp xếp theo</span>
        {FilterOption.map((item,index)=> {
          return <NavLink key={index} to={item?.to} className={className}>{item?.title}</NavLink>
        })}
      </div>      
      <ProductCard></ProductCard>
    </div>
  );
}
