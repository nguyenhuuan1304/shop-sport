import { productModel } from "../models/index.js";

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

export {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  searchProduct,
};
