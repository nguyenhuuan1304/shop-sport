const API_ENDPOINTS = {
  //product endpoint
  GET_LIST_PRODUCTS: (currentPage, pageSize) =>
    `/products?page=${currentPage}&pageSize=${pageSize}`,
  SEARCH_FIVE_PRODUCTS: (keyWord) =>
    `/products?populate=*&filters[name][$containsi]=${keyWord.toUpperCase()}&pagination[limit]=5&sort[0]=createdAt:asc`,
  SEARCH_LIST_PRODUCTS: (keyWord, currentPage, pageSize) =>
    `/products?populate=*&filters[name][$containsi]=${keyWord.toUpperCase()}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
  LIST_SORT: (sort, currentPage, pageSize) =>
    `products?page=${currentPage}&pageSize=${pageSize}&orderBy=${sort}`,
  LIST_FILLTER: (title, sort, currentPage, pageSize) =>
    `/products?page=${currentPage}&pageSize=${pageSize}&${title}=${sort}`,
  LIST_SALE: `/products?populate=*&is_discount_active=true`,
  PRODUCT_DETAIL: (productId) => `/products/${productId}`,

  //user
  USER_DETAIL: (userId) => `/users/profile`,
  UPDATE_USER: (id) => `/users/update`,

  //authentication
  LOGIN: `auth/login`,
  CHANGE_PASSWORD: `/auth/change-password`,

  //order address
  CREATE_ORDER_ADDRESS: `/order-address`,
  GET_ORDER_ADDRESS: `/order-address`,
  SET_DEFAULT_ORDER_ADDRESS: (order_address_id) =>
    `/set-default/${order_address_id}`,

  // cart
  GET_CART_BY_ID_USER: () => `/cart`,
  ADD_TO_CART: () => `/cart/update`,
  UPDATE_CART: () => `/cart/update`,
  REMOVE_FROM_CART: () => `/cart/update`,

  //order
  GET_ORDERS: `/order`,
};

export default API_ENDPOINTS;
