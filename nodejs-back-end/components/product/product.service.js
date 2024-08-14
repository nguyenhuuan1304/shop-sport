import productModel from "../product/product.model.js"; // Assuming productModel is a named export
import { getCartByUserId } from "../cart/cart.service.js"; // Assuming cartService is a named export
import cloudinary from "../../config/cloudinary.config.js";
import fs from "fs";

const getProducts = async (dto) => {
  try {
    let objOrderBy;
    if (dto.orderBy) {
      const [key, value] = dto.orderBy.split(":");
      objOrderBy = { [key]: parseInt(value, 10) };
    }

    const filter = { is_deleted: false };
    if (dto.isHot !== undefined) filter.is_hot = dto.isHot;
    if (dto.isSale !== undefined) filter.is_sale = dto.isSale;
    if (dto.brand !== undefined) filter.brand = dto.brand;
    if (dto.category !== undefined) filter.category = dto.category;

    const total = await productModel.countDocuments(filter);
    const skip = (dto.page - 1) * dto.pageSize;
    const products = await productModel
      .find(filter)
      .skip(skip)
      .limit(dto.pageSize)
      .sort(objOrderBy);

    const totalPage = Math.ceil(total / dto.pageSize);
    return {
      data: products,
      meta: {
        pagination: {
          page: dto.page,
          pageSize: dto.pageSize,
          total: total,
          totalPage: totalPage,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

const getProductById = async (product_id) => {
  try {
    const product = await productModel.findById(product_id);
    return product;
  } catch (error) {
    throw error;
  }
};

const addProduct = async (dto) => {
  try {
    const uploadedImages = [];
    if (dto.files) {
      for (const file of dto.files) {
        const result = await cloudinary.uploader.upload(file.path);
        uploadedImages.push(result.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const productDetails = { ...dto.productDetails, images: uploadedImages };
    const newProduct = new productModel(productDetails);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (product_id) => {
  try {
    const product = await productModel.findById(product_id);
    if (product) product.is_deleted = true;
    await product.save();
    return product;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (product_id, productDetails) => {
  try {
    productDetails.updated_at = Date.now();
    const updatedProduct = await productModel.findByIdAndUpdate(
      product_id,
      productDetails
    );
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const searchProduct = async (dto) => {
  try {
    const totalDocuments = await productModel.countDocuments({
      $text: { $search: dto.searchQuery },
    });
    const skip = (dto.page - 1) * dto.pageSize;
    const products = await productModel
      .find({ $text: { $search: dto.searchQuery } })
      .skip(skip)
      .limit(dto.pageSize);

    const totalPage = Math.ceil(totalDocuments / dto.pageSize);
    return {
      data: products,
      meta: {
        pagination: {
          page: dto.page,
          pageSize: dto.pageSize,
          total: totalDocuments,
          totalPage: totalPage,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

const updateProductSizeListFromCart = async (user_id) => {
  try {
    const cart = await getCartByUserId(user_id);
    if (!cart) throw new Error("Cart not found");
    const cartItems = cart.items;
    for (const item of cartItems) {
      let product = await getProductById(item.product);
      let size_list = product.size_list;
      size_list.forEach((size) => {
        if (item.size === size.size_name) {
          size.quantity -= item.count;
        }
      });
      await product.save();
    }
  } catch (error) {
    console.error("Error updating product size list from cart:", error);
    throw error;
  }
};

export const productService = {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  searchProduct,
  updateProductSizeListFromCart,
};
