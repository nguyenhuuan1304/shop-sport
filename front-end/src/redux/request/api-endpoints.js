const API_ENDPOINTS = {
    //product endpoint
    GET_LISTPRODUCTS: (currentPage, pageSize) => `/products?populate=*&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
    SEARCH_FIVEPRODUCTS: (keyWord) => `/products?populate=*&filters[name][$containsi]=${keyWord.toUpperCase()}&pagination[limit]=5&sort[0]=createdAt:asc`,
    SEARCH_LISTPRODUCTS: (keyWord,currentPage, pageSize) => `/products?populate=*&filters[name][$containsi]=${keyWord.toUpperCase()}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
    LIST_SORT: (sort,currentPage, pageSize)=>`/products?populate=*&sort=${sort}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
    LIST_FILLTER: (title, sort, currentPage, pageSize) => `/products?populate=*&filters[${title}][$eq]=${sort}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`,
    LIST_SALE: `/products?populate=*&is_discount_active=true`,
    PRODUCT_DETAIL: (productId) => `/products/${productId}?populate=*`,
    //user
    USER_DETAIL: (userId) => `/users/${userId}?populate=*`,

}

export default API_ENDPOINTS;