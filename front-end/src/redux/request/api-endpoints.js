const API_ENDPOINTS = {
  //product endpoint
  GET_LIST_PRODUCTS: (currentPage, pageSize) =>
    `/products?page=${currentPage}&pageSize=${pageSize}`,
  SEARCH_FIVE_PRODUCTS: (keyWord) =>
    `/products/search?q=${keyWord}&pageSize=5&page=1`,
  SEARCH_LIST_PRODUCTS: (keyWord, currentPage, pageSize) =>
    `/products/search?q=${keyWord}&pageSize=${pageSize}&page=${currentPage}`,
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
  CREATE_ORDER_ADDRESS: `/order-addresses`,

  // cart
  GET_CART_BY_ID_USER: () => `/cart`,
  ADD_TO_CART: () => `/cart/update`,
  UPDATE_CART: () => `/cart/update`,
  REMOVE_FROM_CART: () => `/cart/update`,
};

export default API_ENDPOINTS;
