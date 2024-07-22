import { Provider } from "react-redux";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductListPage from "./pages/ProductListPage";
import SearchPage from "./pages/SearchPage";
import CartLayout from "./layout/CartLayout";
import UserProfilePage from "./pages/UserProfilePage";
import store from "../src/redux/store";
import ProductDetailPage from "./pages/ProductDetailPage";
import { fetchUserDetail, logout } from "./features/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartData } from "./features/cartSlice";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";
function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  //số lượng sản phẩm có trong giỏ hàng
  const products = useSelector((state) => state.cart.products);
  useEffect(() => {
    dispatch(fetchUserDetail());
    dispatch(fetchCartData(currentUser?.id));
  }, [dispatch, currentUser?.id]);
  return (
    // <Provider store={store}>
    <BrowserRouter>
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="product/:productId" element={<ProductDetailPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="profile" element={<UserProfilePage />}></Route>
          </Route>
          <Route path="login" element={<LoginPage />}></Route>
          <Route path="cart" element={<CartLayout />}>
            <Route index element={<CartPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
    // </Provider>
  );
}

export default App;
