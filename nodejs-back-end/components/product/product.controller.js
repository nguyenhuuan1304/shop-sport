import { productService } from "../product/product.service.js";
import {
  GetProductsDto,
  AddProductDto,
  SearchProductDto,
} from "../product/product.dto.js";

async function getProducts(req, res) {
  try {
    const dto = new GetProductsDto(req.query);
    const result = await productService.getProducts(dto);
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProductById(req, res) {
  try {
    const product_id = req.params.id;
    const result = await productService.getProductById(product_id);
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Product not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const product_id = req.params.id;
    const result = await productService.deleteProduct(product_id);
    if (result) {
      return res.status(200).json({ message: "Delete successful!" });
    } else {
      return res.status(404).json({ message: "Product ID not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addProduct(req, res) {
  try {
    const dto = new AddProductDto(req.body, req.files);
    const newProduct = await productService.addProduct(dto);
    return res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const product_id = req.params.id;
    const product = req.body;
    const updated_product = await productService.updateProduct(
      product_id,
      product
    );
    if (updated_product) {
      return res.status(200).json({ message: "Product updated successfully!" });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function searchProduct(req, res) {
  try {
    const dto = new SearchProductDto(req.query);
    const result = await productService.searchProduct(dto);
    return res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
