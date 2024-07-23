import axiosInstance from "../../axios/axios";
import errorHandler from "./errorHandler";
import successHandler from "./successHandler";
const request = {
  List: async (currentPage, pageSize) => {
    try {
      const response = await axiosInstance.get(
        `/products?populate=*&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`
      );
      console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  searchFiveProduct: async (keyWord) => {
    try {
      const response = await axiosInstance.get(
        `/products?populate=*&filters[name][$containsi]=${keyWord.toUpperCase()}&pagination[limit]=5&sort[0]=createdAt:asc`
      );
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  listProductSearch: async ({ keyWord, currentPage, pageSize }) => {
    try {
      const response = await axiosInstance.get(
        `/products?populate=*&filters[name][$containsi]=${keyWord.toUpperCase()}&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`
      );
      // console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  ListSort: async ({ sort, title, currentPage, pageSize }) => {
    console.log("listsort ", sort);
    try {
      let url = "/products?populate=*";
      if (sort != "true" && sort != "false") {
        url += `&sort=${sort}`;
      } else {
        console.log("title  ", title);
        if (title == "Hot") {
          title = "isHot";
        } else {
          title = "is_discount_active";
        }
        url += `&filters[${title}][$eq]=${sort}`;
      }
      const response = await axiosInstance.get(
        url +
          `&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}`
      );
      console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  ListSaleProduct: async () => {
    // console.log("listsort ", sort);
    try {
      const response = await axiosInstance.get(
        `/products?populate=*&is_discount_active=true`
      );
      console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  ProductDetail: async (productId) => {
    try {
      const response = await axiosInstance.get(
        `/products/${productId}?populate=*`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product detail data:", error);
      throw error;
    }
  },
  UserDetail: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}?populate=*`);
      return response;
    } catch (error) {
      console.error("Error fetching user detail data:", error);
      throw error;
    }
  },
  createOderAddress: async ({ data }) => {
    try {
      const newOrderAddressData = {
        data,
      };
      console.log("request", newOrderAddressData);
      const response = await axiosInstance.post(
        `/order-addresses`,
        newOrderAddressData
      );
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  Cart: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/users/${userId}?fields[0]=cart`
      );
      return response;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      throw error;
    }
  },
  updateUser: async ({ data }) => {
    try {
      const response = await axiosInstance.put(`/users/${data.id}`, data);
      return response;
    } catch (error) {
      console.error("Error fetching cart data:", error);
      throw error;    }
  },
  updateRelationUser: async ({ userId, oderAddressId }) => {
    try {
      const data = {
        order_addresses: {
          connect: [oderAddressId],
        },
      };
      const response = await axiosInstance.put(`/users/${userId}`, data);
      return response;
    } catch (error) {
      console.error("Error fetching user detail data:", error);
      throw error;
    }
  },
  changePassword: async ({data})=>{
    try {
      const reponse = await axiosInstance.post(`/auth/change-password`, data);
      return reponse;
    } catch (error) {
      console.error("error change password");
      throw error;
    }
  },
  //add a product to cart
  AddToCart: async (userId, cartItem) => {
    try {
      console.log("request add to cart", cartItem);
      //get current user cart
      const userCart = await axiosInstance.get(
        `/users/${userId}?fields[0]=cart`
      );

      console.log("request get user cart", userCart.data);
      //check product is in cart (size === size and id === id)
      let existingProduct = userCart?.data?.cart?.products.find((item) => {
        return (
          item.product?.id === cartItem?.product?.id &&
          item.key === cartItem.key &&
          item.product?.attributes?.size_list?.some(
            (sizeItem) => sizeItem.size === item.size
          )
        );
      });
      let updatedProducts;
      console.log("existing product", existingProduct);
      //if exist
      if (existingProduct) {
        existingProduct = {
          ...existingProduct,
          count: existingProduct.count + 1,
        };
        updatedProducts = userCart.data.cart.products.map((item) =>
          item.product.id === existingProduct.product.id &&
          item.key === existingProduct.key
            ? existingProduct
            : item
        );
      } else {
        updatedProducts = [...userCart.data.cart.products, product];
      }
      //updated total value
      const updatedTotal =
        userCart?.data?.cart?.total + cartItem?.product?.attributes?.price;
      //number of product
      const numberOfProduct = updatedProducts.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);
      //updated cart
      const response = await axiosInstance.put(
        `/users/${userId}?fields[0]=cart`,
        {
          cart: {
            products: updatedProducts,
            total: updatedTotal,
            number_of_product: numberOfProduct,
          },
        }
      );
      console.log("updated products", updatedProducts);
      console.log("updated total", updatedTotal);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  RemoveFromCart: async (userId, cartItem) => {
    try {
      console.log("request remove from cart", cartItem);
      //get current user cart
      const userCart = await axiosInstance.get(
        `/users/${userId}?fields[0]=cart`
      );
      console.log("request get user cart", userCart.data);
      //check product is in cart (size === size and id === id)
      let existingProduct = userCart?.data?.cart?.products.find((item) => {
        return (
          item.product?.id === cartItem?.product?.id &&
          item.key === cartItem.key &&
          item.product?.attributes?.size_list?.some(
            (sizeItem) => sizeItem.size === item.size
          )
        );
      });
      let updatedProducts;
      console.log("existing product", existingProduct);
      //if exist
      if (existingProduct) {
        existingProduct = {
          ...existingProduct,
          count: existingProduct.count - 1,
        };
        updatedProducts = userCart.data.cart.products.map((item) =>
          item.product.id === existingProduct.product.id &&
          item.key === existingProduct.key
            ? existingProduct
            : item
        );
      } else {
        updatedProducts = [...userCart.data.cart.products, product];
      }
      //updated total value
      const updatedTotal =
        userCart?.data?.cart?.total - cartItem?.product?.attributes?.price;

      const numberOfProduct = updatedProducts.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);
      //updated cart
      const response = await axiosInstance.put(
        `/users/${userId}?fields[0]=cart`,
        {
          cart: {
            products: updatedProducts,
            total: updatedTotal,
            number_of_product: numberOfProduct,
          },
        }
      );
      console.log("updated products", updatedProducts);
      console.log("updated total", updatedTotal);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  AddManyToCart: async (userId, products) => {
    try {
      // Get total in products
      const productsTotal = products.reduce((total, item) => {
        const price = item.product.attributes.price;
        const count = item.count;
        return total + price * count;
      }, 0);
      // Get current user cart
      const userCartResponse = await axiosInstance.get(
        `/users/${userId}?fields[0]=cart`
      );
      console.log("user cart response", userCartResponse.data);
      let userCart = userCartResponse?.data?.cart || { products: [], total: 0 };

      // Create a copy of the current cart products
      const updatedCartProducts = [...userCart.products];
      console.log("updated cart products", updatedCartProducts);

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
      const updatedCartTotal = userCart.total + productsTotal;
      const numberOfProduct = updatedCartProducts.reduce(
        (accumulator, product) => {
          return accumulator + product.count;
        },
        0
      );
      // Update cart on the strapi
      const response = await axiosInstance.put(
        `/users/${userId}?fields[0]=cart`,
        {
          cart: {
            products: updatedCartProducts,
            total: updatedCartTotal,
            number_of_product: numberOfProduct,
          },
        }
      );

      console.log(updatedCartProducts);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Delete cart item in cart
  DeleteFromCart: async (userId, cartItem) => {
    try {
      console.log("request delete from cart", cartItem);
      //get current user cart
      const userCart = await axiosInstance.get(
        `/users/${userId}?fields[0]=cart`
      );
      console.log("request get user cart", userCart.data);
      //check the product
      let existingProduct = userCart?.data?.cart?.products.find((item) => {
        return (
          item.product?.id === cartItem?.product?.id &&
          item.key === cartItem.key &&
          item.product?.attributes?.size_list?.some(
            (sizeItem) => sizeItem.size === item.size
          )
        );
      });
      let updatedProducts;
      console.log("existing product", existingProduct);
      //if exist
      if (existingProduct) {
        //delete product from cart
        updatedProducts = userCart.data.cart.products.filter(
          (cartItem) =>
            !(
              cartItem.product.id === existingProduct.product.id &&
              cartItem.key === existingProduct.key
            )
        );
      }
      const productPrice = cartItem.product.attributes.price;
      const productCount = existingProduct.count;
      const productTotalPrice = productPrice * productCount;
      //updated total value
      const updatedTotal = userCart?.data?.cart?.total - productTotalPrice;
      const numberOfProduct = updatedProducts.reduce((accumulator, product) => {
        return accumulator + product.count;
      }, 0);
      //updated cart
      const response = await axiosInstance.put(
        `/users/${userId}?fields[0]=cart`,
        {
          cart: {
            products: updatedProducts,
            total: updatedTotal,
            number_of_product: numberOfProduct,
          },
        }
      );
      console.log("updated products", updatedProducts);
      console.log("updated total", updatedTotal);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default request;
