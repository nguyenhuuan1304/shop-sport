import { productService } from "../services/index.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";

async function getProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 3;
    const orderBy = req.query.orderBy ? req.query.orderBy : undefined;
    const isHot = req.query.hot ? req.query.hot === "true" : undefined;
    const isSale = req.query.sale ? req.query.sale === "true" : undefined;
    const result = await productService.getProducts(
      page,
      pageSize,
      orderBy,
      isHot,
      isSale
    );
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getProductById(req, res) {
  try {
    const product_id = req.params.id;
    const result = await productService.getProductById(product_id);
    if (result) {
      return res.status(200).json(result);
    } else return res.status(404).json({ message: "not found product!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteProduct(req, res) {
  try {
    const product_id = req.params.id;
    const result = await deleteProduct(product_id);
    if (result) {
      return res.status(200).json({ message: "delete successfull!" });
    } else return res.status(404).json({ message: "not found product id!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function addProduct(req, res) {
  try {
    //handle upload image to cloudinary
    const uploadedImages = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        uploadedImages.push(result.secure_url);
        // Xóa tệp tạm
        fs.unlinkSync(file.path);
      }
    }
    if (req.body.size_list) {
      req.body.size_list = JSON.parse(req.body.size_list);
    }
    const product = { ...req.body, images: uploadedImages };
    const new_product = await productService.addProduct(product);
    console.log(new_product);
    res.status(200).json(new_product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function updateProduct(req, res) {
  try {
    const product_id = req.params.id;
    const product = req.body;
    console.log(product);
    if (!req.files) {
      const updated_product = await productService.updateProduct(
        product_id,
        product
      );
      if (updated_product) {
        return res
          .status(200)
          .json({ message: "updated product successfully!" });
      } else return res.status(404).json({ message: "not found product" });
    } else
      return res.status(404).json({ message: "the feature is coming soon!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function searchProduct(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 3;
    const search_query = req.query.q;
    if (!search_query) {
      return res.status(400).json({ message: "Missing search query" });
    }
    const result = await productService.searchProduct(
      search_query,
      page,
      pageSize
    );
    return res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
export {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  searchProduct,
};
