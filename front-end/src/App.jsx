import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SearchPage from "./pages/SearchPage";
import ContactPage from "./pages/ContactPage";
import CartPage from "./pages/CartPage";
import Layout from "./layout/Layout";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import UserProfilePage from "./pages/UserProfilePage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        <Route path="login" element={<LoginPage />}></Route>
        <Route path="cart" element={<CartPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
