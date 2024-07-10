import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductListPage from "./pages/ProductListPage";
import ProductPage from "./pages/ProductListPage";
import SearchPage from "./pages/SearchPage";
import UserProfilePage from "./pages/UserProfilePage";
import { Provider } from "react-redux";
import store from "../src/redux/store";
import ProductDetailPage from "./pages/ProductDetailPage";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="product" element={<ProductDetailPage />} />

            <Route path="search" element={<SearchPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="profile" element={<UserProfilePage />} />
          </Route>
          <Route path="login" element={<LoginPage />}></Route>
          <Route path="cart" element={<CartPage />}></Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
