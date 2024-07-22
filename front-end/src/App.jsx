import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import store from "../src/redux/store";
import AddresForm from "./components/Form/AddressForm";
import ChangPasswordForm from "./components/Form/ChangePasswordForm";
import OdersForm from "./components/Form/OdersForm";
import PersonalInformationForm from "./components/Form/PersonalInformationForm";
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

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductListPage />} />
            <Route path="product/:productId" element={<ProductDetailPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="profile" element={<UserProfilePage />} >
              <Route path="account-info" element={<PersonalInformationForm />}/>
              <Route path="address-book" element={<AddresForm />}/>
              <Route path="change-password" element={<ChangPasswordForm />}/>
              <Route path="orders" element={<OdersForm />}/>
            </Route>
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
