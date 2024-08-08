import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import _Menu from "../components/Menu";
import Footer from "../components/Footer";
import BottomNavigation from "../components/BottomNavigation";
import ResponsiveHeader from "../components/ResponsiveHeader";
import ChatBox from "../components/ChatBox";

export default function Layout() {
  return (
    <div className="h-full w-full flex flex-col scroll-smooth">
      <Header />
      <ResponsiveHeader />
      <_Menu />
      <div className="p-2">
        <Outlet />
      </div>
      <BottomNavigation />
      <ChatBox />
      <Footer />
    </div>
  );
}
