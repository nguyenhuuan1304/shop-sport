import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
export default function Layout() {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      <Header></Header>
      <div className="p-5">
        <Outlet />
      </div>
      <Footer></Footer>
    </div>
  );
}
