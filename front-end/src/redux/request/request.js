import axiosInstance from "../../axios/axios";
import API_ENDPOINTS from "./api-endpoints";
import errorHandler from "./errorHandler";
import successHandler from "./successHandler";
const request = {
  List: async (currentPage, pageSize) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.GET_LIST_PRODUCTS(currentPage, pageSize)
      );
      // console.log("Response data:", response);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  searchFiveProduct: async (keyWord) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.SEARCH_FIVE_PRODUCTS(keyWord)
      );
      console.log(response);
      return response.data.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  listProductSearch: async ({ keyWord, currentPage, pageSize }) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.SEARCH_LIST_PRODUCTS(keyWord, currentPage, pageSize)
      );
      console.log("Response data:", response.data.data);
      return response.data.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  ListSort: async ({ sort, title, currentPage, pageSize }) => {
    console.log("listsort ", sort);
    try {
      let url = "";
      if (sort != "true" && sort != "false") {
        url += API_ENDPOINTS.LIST_SORT(sort, currentPage, pageSize);
      } else {
        if (title == "Hot") {
          title = "hot";
        } else {
          title = "sale";
        }
        url += API_ENDPOINTS.LIST_FILLTER(title, sort, currentPage, pageSize);
        console.log("api: ", url);
      }
      const response = await axiosInstance.get(url);
      // console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  ListSaleProduct: async () => {
    // console.log("listsort ", sort);
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.LIST_SALE);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  ProductDetail: async (productId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.PRODUCT_DETAIL(productId)
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product detail data:", error);
      throw error;
    }
  },
  UserDetail: async (userId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.USER_DETAIL(userId)
      );
      return response;
    } catch (error) {
      console.error("Error fetching user detail data:", error);
      throw error;
    }
  },
  loginService: async (payload) => {
    try {
      const reponse = await axiosInstance.post(API_ENDPOINTS.LOGIN, payload);
      console.log("login: ", reponse);
      return reponse;
    } catch (error) {
      console.error("Error fetching login:", error);
      throw error;
    }
  },
  fetchOrderAddress: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_ORDER_ADDRESS);
      console.log(response);
      return response;
    } catch (error) {
      return errorHandler(error);
    }
  },
  createOrderAddress: async (order_address) => {
    try {
      console.log("request ", order_address);
      const response = await axiosInstance.post(
        API_ENDPOINTS.CREATE_ORDER_ADDRESS,
        { order_address: order_address }
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  Cart: async (userId) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER(userId)
      );
      return response;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      throw error;
    }
  },
  updateUser: async ({ data }) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_USER(data.id),
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      throw error;
    }
  },
  updateRelationUser: async ({ userId, oderAddressId }) => {
    try {
      const data = {
        order_addresses: {
          connect: [oderAddressId],
        },
      };
      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_USER(userId),
        data
      );
      return response;
    } catch (error) {
      console.error("Error fetching user detail data:", error);
      throw error;
    }
  },
  changePassword: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.CHANGE_PASSWORD,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  //add a product to cart
  AddToCart: async (userId, cartItem) => {
    try {
      // console.log("request add to cart", cartItem);
      //get current user cart
      const userCart = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER(userId)
      );

      // console.log("cartItem ", cartItem);
      //check product is in cart (size === size and id === id)
      let existingProduct = userCart?.data?.items.find((item) => {
        return (
          item.product?._id === cartItem?.product?._id &&
          item?._id === cartItem?._id &&
          item.product?.size_list?.some(
            (sizeItem) => sizeItem.size_name === cartItem?.size
          )
        );
      });
      let updatedProducts;
      // console.log("existing product", existingProduct);
      //if exist
      if (existingProduct) {
        existingProduct = {
          ...existingProduct,
          count: existingProduct.count + 1,
        };
        updatedProducts = userCart.data.items.map((item) =>
          item.product._id === existingProduct.product._id &&
          item._id === existingProduct._id
            ? existingProduct
            : item
        );
      } else {
        updatedProducts = [...userCart.data.items, cartItem];
      }
      //updated total value
      const updatedTotal =
        userCart?.data?.total_of_price + cartItem?.product?.price;
      //number of product
      const numberOfProduct = updatedProducts.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);
      //updated cart
      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_CART(userId),
        {
          items: updatedProducts,
          total_of_price: updatedTotal,
          total_of_product: numberOfProduct,
        }
      );
      // console.log("updated products", updatedProducts);
      // console.log("updated total", updatedTotal);
      return response.data;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  },

  RemoveFromCart: async (userId, cartItem) => {
    try {
      console.log("request remove from cart", cartItem);
      //get current user cart
      const userCart = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER()
      );
      // console.log("request get user cart", userCart.data);
      //check product is in cart (size === size and id === id)
      let existingProduct = userCart?.data?.items.find((item) => {
        return (
          item.product?._id === cartItem?.product?._id &&
          item?._id === cartItem?._id &&
          item.product?.size_list?.some(
            (sizeItem) => sizeItem.size_name === cartItem?.size
          )
        );
      });
      let updatedProducts;
      // console.log("existing product", existingProduct);
      //if exist
      if (existingProduct) {
        existingProduct = {
          ...existingProduct,
          count: existingProduct.count - 1,
        };
        updatedProducts = userCart.data.items.map((item) =>
          item.product._id === existingProduct.product._id &&
          item._id === existingProduct._id
            ? existingProduct
            : item
        );
      } else {
        updatedProducts = [...userCart.data.items, cartItem];
      }
      //updated total value
      const updatedTotal =
        userCart?.data?.total_of_price - cartItem?.product?.price;

      const numberOfProduct = updatedProducts.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);
      //updated cart
      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_CART(userId),
        {
          items: updatedProducts,
          total_of_price: updatedTotal,
          total_of_product: numberOfProduct,
        }
      );
      // console.log("updated products", updatedProducts);
      // console.log("updated total", updatedTotal);
      return response.data;
    } catch (error) {
      console.error("Failed to remove cart:", error);
      throw error;
    }
  },
  AddManyToCart: async (userId, products) => {
    try {
      // Get total in products
      const productsTotal = products.reduce((total, item) => {
        const price = item.product?.price;
        const count = item.count;
        return total + price * count;
      }, 0);
      // Get current user cart
      const userCartResponse = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER()
      );

      // console.log("user cart response", userCartResponse.data);
      let userCart = userCartResponse?.data || { products: [], total: 0 };
      // Create a copy of the current cart products
      const updatedCartProducts = [...userCart.items];

      // Check if product exists in cart (key === key)
      products.forEach((productItem) => {
        const existingItemIndex = updatedCartProducts.findIndex(
          (cartItem) => cartItem.key === productItem.key
        );
        if (existingItemIndex !== -1) {
          updatedCartProducts[existingItemIndex].count += productItem.count;
        } else {
          updatedCartProducts.push(productItem);
        }
      });

      // Calculate the updated cart total
      const updatedCartTotal = userCart.total_of_price + productsTotal;
      const numberOfProduct = updatedCartProducts.reduce(
        (accumulator, product) => {
          return accumulator + product.count;
        },
        0
      );
      // Update cart on the strapi
      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_CART(userId),
        {
          items: updatedCartProducts,
          total_of_product: numberOfProduct,
          total_of_price: updatedCartTotal,
        }
      );
      console.log("updated cart products", updatedCartProducts);
      return response.data;
    } catch (error) {
      console.error("Failed to add many to cart:", error);
      throw error;
    }
  },
  // Delete cart item in cart
  DeleteFromCart: async (userId, cartItem) => {
    try {
      // console.log("request delete from cart", cartItem);
      //get current user cart
      const userCart = await axiosInstance.get(
        API_ENDPOINTS.GET_CART_BY_ID_USER()
      );
      console.log("request get user cart", userCart.data);
      //check the product
      let existingProduct = userCart?.data?.items.find((item) => {
        return (
          item.product?._id === cartItem?.product?._id &&
          item?._id === cartItem?._id &&
          item.product?.size_list?.some(
            (sizeItem) => sizeItem.size_name === cartItem?.size
          )
        );
      });
      let updatedProducts;
      // console.log("existing product", existingProduct);
      //if exist
      if (existingProduct) {
        //delete product from cart
        updatedProducts = userCart.data.items.filter(
          (cartItem) =>
            !(
              cartItem.product._id === existingProduct.product._id &&
              cartItem._id === existingProduct._id
            )
        );
      }
      const productPrice = cartItem.product.price;
      const productCount = existingProduct.count;
      const productTotalPrice = productPrice * productCount;
      //updated total value
      const updatedTotal = userCart?.data?.total_of_price - productTotalPrice;
      const numberOfProduct = updatedProducts.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);
      //updated cart
      const response = await axiosInstance.put(
        API_ENDPOINTS.UPDATE_CART(userId),
        {
          items: updatedProducts,
          total_of_product: numberOfProduct,
          total_of_price: updatedTotal,
        }
      );
      // console.log("updated products", updatedProducts);
      // console.log("updated total", updatedTotal);
      return response.data;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  },
  GetOrders: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.GET_ORDERS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default request;
