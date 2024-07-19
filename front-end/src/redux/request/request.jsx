import axios from "axios";
import axiosInstance from "../../axios/axios";
import errorHandler from "../request/errorHandler";
import successHandler from "./successHandler";
const request = {
  List: async () => {
    try {
      const response = await axiosInstance.get("/products?populate=*");
      console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  ListSort: async ({ sort, title }) => {
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
      const response = await axiosInstance.get(url);
      console.log("Response data:", response.data);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  ListSaleProduct: async () => {
    console.log("listsort ", sort);
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
      const response = await axiosInstance.get(`/users/${userId}`);
      return response;
    } catch (error) {
      console.error("Error fetching user detail data:", error);
      throw error;
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

      //updated cart
      const response = await axiosInstance.put(
        `/users/${userId}?fields[0]=cart`,
        {
          cart: {
            products: updatedProducts,
            total: updatedTotal,
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

      //updated cart
      const response = await axiosInstance.put(
        `/users/${userId}?fields[0]=cart`,
        {
          cart: {
            products: updatedProducts,
            total: updatedTotal,
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

      // Update cart on the strapi
      const response = await axiosInstance.put(
        `/users/${userId}?fields[0]=cart`,
        {
          cart: {
            products: updatedCartProducts,
            total: updatedCartTotal,
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

      //updated cart
      const response = await axiosInstance.put(
        `/users/${userId}?fields[0]=cart`,
        {
          cart: {
            products: updatedProducts,
            total: updatedTotal,
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
