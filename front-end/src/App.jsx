import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { fetchUserDetail } from "./redux/slices/authSlice";
import { fetchCartData } from "./redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

// import AddresForm from "./components/Form/AddressForm";
// import ChangPasswordForm from "./components/Form/ChangePasswordForm";
// import OdersForm from "./components/Form/OdersForm";
// import PersonalInformationForm from "./components/Form/PersonalInformationForm";
// import CartLayout from "./layout/CartLayout";
import Layout from "./layout/Layout";
// import ScrollToTop from "./components/ScrollToTop";
// import CartPage from "./pages/CartPage";
// import ContactPage from "./pages/ContactPage";
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import NotFoundPage from "./pages/NotFoundPage";
// import ProductDetailPage from "./pages/ProductDetailPage";
// import ProductListPage from "./pages/ProductListPage";
// import SearchPage from "./pages/SearchPage";
// import UserProfilePage from "./pages/UserProfilePage";
// import CategoryPage from "./pages/CategoryPage";
// import RequireAuth from "./utils/requireAuth";
// import PaymentSuccessPage from "./pages/PaymentSuccessPage";
// import PaymentCancelPage from "./pages/PaymentCancelPage";
import Loading from "./components/Loading";
// Lazy load components
const AddressForm = lazy(() => import("./components/Form/AddressForm"));
const ChangePasswordForm = lazy(() =>
  import("./components/Form/ChangePasswordForm")
);
const OrdersForm = lazy(() => import("./components/Form/OdersForm"));
const PersonalInformationForm = lazy(() =>
  import("./components/Form/PersonalInformationForm")
);
const CartLayout = lazy(() => import("./layout/CartLayout"));
// const Layout = lazy(() => import("./layout/Layout"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const CartPage = lazy(() => import("./pages/CartPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const ProductListPage = lazy(() => import("./pages/ProductListPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const UserProfilePage = lazy(() => import("./pages/UserProfilePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const RequireAuth = lazy(() => import("./utils/requireAuth"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentCancelPage = lazy(() => import("./pages/PaymentCancelPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

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
  }, [dispatch, currentUser?._id]);
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route
              path="product/:productId"
              element={
                <ScrollToTop>
                  <ProductDetailPage />
                </ScrollToTop>
              }
            />
            <Route path="categories" element={<CategoryPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route element={<RequireAuth />}>
              <Route path="profile" element={<UserProfilePage />}>
                <Route index element={<Navigate to="account-info" replace />} />
                <Route
                  path="account-info"
                  element={<PersonalInformationForm />}
                />
                <Route path="address-book" element={<AddressForm />} />
                <Route
                  path="change-password"
                  element={<ChangePasswordForm />}
                />
                <Route path="orders" element={<OrdersForm />} />
              </Route>
            </Route>
          </Route>
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="payment-cancel" element={<PaymentCancelPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage/>}/>
          <Route path="cart" element={<CartLayout />}>
            <Route index element={<CartPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
