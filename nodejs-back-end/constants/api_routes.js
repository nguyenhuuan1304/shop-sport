const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  CHANGE_PASSWORD: "/change-password",
};
const CART_ROUTES = {
  GET: "/",
  UPDATE: "/update",
};

const ORDER_ADDRESS_ROUTES = {
  GET: "/",
  ADD: "/",
  SET_DEFAULT: "/set-default/:id",
  DELETE: "/:id",
  UPDATE: "/:id",
};

const ORDER_ROUTES = {
  GET_BY_USER_ID: "/",
  ADD: "/",
  DELETE: "/:id",
  UPDATE_ORDER_STATUS: "/update-order-status/:id",
};

const PRODUCT_ROUTES = {
  GET: "/",
  GET_BY_ID: "/:id",
  UPDATE: "/:id",
  DELETE: "/:id",
  ADD: "/",
  SEARCH: "/search",
};

const USER_ROUTES = {
  PROFILE: "/profile",
  UPDATE: "/update",
};

export {
  AUTH_ROUTES,
  CART_ROUTES,
  ORDER_ADDRESS_ROUTES,
  ORDER_ROUTES,
  PRODUCT_ROUTES,
  USER_ROUTES,
};
