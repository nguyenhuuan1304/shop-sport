import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AddresForm from "./components/Form/AddressForm";
import ChangPasswordForm from "./components/Form/ChangePasswordForm";
import OdersForm from "./components/Form/OdersForm";
import PersonalInformationForm from "./components/Form/PersonalInformationForm";
import CartLayout from "./layout/CartLayout";
import Layout from "./layout/Layout";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";
import SearchPage from "./pages/SearchPage";
import UserProfilePage from "./pages/UserProfilePage";

import { useDispatch, useSelector } from "react-redux";
import CategoryPage from "./pages/CategoryPage";
import { fetchUserDetail } from "./redux/slices/authSlice";
import { fetchCartData } from "./redux/slices/cartSlice";
import RequireAuth from "./utils/requireAuth";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  //số lượng sản phẩm có trong giỏ hàng
  const products = useSelector((state) => state.cart.products);
  useEffect(() => {
    dispatch(fetchUserDetail());
    if (currentUser) {
      dispatch(fetchCartData(currentUser?.id));
    }
  }, [dispatch, currentUser?.id]);
  return (
    // <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route
            path="product/:productId"
            element={<ProductDetailPage />}
          />{" "}
          <Route path="categories" element={<CategoryPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="payment-cancel" element={<PaymentCancelPage />} />
          <Route element={<RequireAuth />}>
            <Route path="profile" element={<UserProfilePage />}>
              <Route index element={<Navigate to="account-info" replace />} />
              <Route
                path="account-info"
                element={<PersonalInformationForm />}
              />
              <Route path="address-book" element={<AddresForm />} />
              <Route path="change-password" element={<ChangPasswordForm />} />
              <Route path="orders" element={<OdersForm />} />

              <Route />
            </Route>
          </Route>
        </Route>
        <Route path="login" element={<LoginPage />}></Route>
        <Route path="cart" element={<CartLayout />}>
          <Route index element={<CartPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
    // </Provider>
  );
}

export default App;
