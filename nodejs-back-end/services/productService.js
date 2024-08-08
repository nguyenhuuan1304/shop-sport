import { productModel } from "../models/index.js";
import { cartService } from "./index.js";

async function getProducts(page, page_size, order_by, is_hot, is_sale, brand) {
  try {
    //convert string to object
    let objOrderBy;
    if (order_by) {
      const [key, value] = order_by.split(":");
      objOrderBy = { [key]: parseInt(value, 10) };
    }

    const filter = { is_deleted: false };
    if (is_hot !== undefined) {
      filter.is_hot = is_hot;
    }
    if (is_sale !== undefined) {
      filter.is_sale = is_sale;
    }
    if (brand !== undefined) {
      filter.brand = brand;
    }
    const total = await productModel.countDocuments(filter);
    const skip = (page - 1) * page_size;
    const products = await productModel
      .find(filter)
      .skip(skip)
      .limit(page_size)
      .sort(objOrderBy);
    const total_page = Math.ceil(total / page_size);
    return {
      data: products,
      meta: {
        pagination: {
          page: page,
          pageSize: page_size,
          total: total,
          totalPage: total_page,
        },
      },
    };
  } catch (error) {
    throw error;
  }
}

async function getProductById(product_id) {
  try {
    const product = await productModel.findById(product_id);
    return product;
  } catch (error) {
    throw error;
  }
}

async function addProduct(product) {
  try {
    const new_product = new productModel(product);
    await new_product.save();
    return new_product;
  } catch (error) {
    throw error;
  }
}

async function deleteProduct(product_id) {
  try {
    const product = await productModel.findById(product_id);
    if (product) product.is_deleted = true;
    await product.save();
    return product;
  } catch (error) {
    throw error;
  }
}

async function updateProduct(product_id, product) {
  try {
    product.updated_at = Date.now();
    const update_product = await productModel.findByIdAndUpdate(
      product_id,
      product
    );
    return update_product;
  } catch (error) {
    throw error;
  }
}

async function searchProduct(search_query, page, pageSize) {
  try {
    const totalDocuments = await productModel.countDocuments({
      $text: { $search: search_query },
    });
    const skip = (page - 1) * pageSize;
    const products = await productModel
      .find({
        $text: { $search: search_query },
      })
      .skip(skip)
      .limit(pageSize);
    const totalPage = Math.ceil(totalDocuments / pageSize);

    return {
      data: products,
      meta: {
        pagination: {
          page: page,
          pageSize: pageSize,
          total: totalDocuments,
          totalPage: totalPage,
        },
      },
    };
  } catch (error) {
    throw error;
  }
}
//cập nhật lại số lượng size_list từ giỏ hàng của người dùng đã thanh toán
async function updateProductSizeListFromCart(user_id) {
  try {
    // console.log("user id", user_id);
    // console.log("update product size lize from cart service");
    const cart = await cartService.getCartByUserId(user_id);

    if (!cart) throw new Error("Cart not found");
    const cartItems = cart.items;
    // console.log("cart ", cart);
    for (const item of cartItems) {
      // Lấy thông tin sản phẩm
      let product = await getProductById(item.product);
      let size_list = product.size_list;

      // Duyệt qua size_list của sản phẩm và kiểm tra size trong giỏ hàng === size_name trong size_list của sản phẩm
      size_list.forEach((size) => {
        if (item.size === size.size_name) {
          size.quantity -= item.count;
        }
      });

      // Lưu sản phẩm đã được cập nhật
      await product.save();
    }
  } catch (error) {
    console.error("Error updating product size list from cart:", error);
    throw error;
  }
}

export {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  searchProduct,
  updateProductSizeListFromCart,
};
