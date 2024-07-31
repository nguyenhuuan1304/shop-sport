const API_ENDPOINTS = {
  //product endpoint
  GET_LIST_PRODUCTS: (currentPage, pageSize) =>
    `/products?populate=*&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
  SEARCH_FIVE_PRODUCTS: (keyWord) =>
    `/products?populate=*&filters[name][$containsi]=${keyWord.toUpperCase()}&pagination[limit]=5&sort[0]=createdAt:asc`,
  SEARCH_LIST_PRODUCTS: (keyWord, currentPage, pageSize) =>
    `/products?populate=*&filters[name][$containsi]=${keyWord.toUpperCase()}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
  LIST_SORT: (sort, currentPage, pageSize) =>
    `/products?populate=*&sort=${sort}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
  LIST_FILLTER: (title, sort, currentPage, pageSize) =>
    `/products?populate=*&filters[${title}][$eq]=${sort}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
  LIST_SALE: `/products?populate=*&is_discount_active=true`,
  PRODUCT_DETAIL: (productId) => `/products/${productId}?populate=*`,
  
  //user
  USER_DETAIL: (userId) => `/users/${userId}?populate=*`,
  UPDATE_USER: (id) => `/users/${id}`,

  //authentication
  LOGIN: `auth/local`,
  CHANGE_PASSWORD: `/auth/change-password`,

  //order address
  CREATE_ORDER_ADDRESS: `/order-addresses`,

  // cart
  GET_CART_BY_ID_USER: (userId) => `/users/${userId}?fields[0]=cart`,
  ADD_TO_CART: (userId) => `/users/${userId}?fields[0]=cart`,
  UPDATE_CART: (userId) => `/users/${userId}?fields[0]=cart`,
  REMOVE_FROM_CART: (userId) => `/users/${userId}?fields[0]=cart`,
};

export default API_ENDPOINTS;
