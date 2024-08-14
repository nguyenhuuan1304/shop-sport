// Import necessary modules if using validation libraries
// import { validate } from 'class-validator';

class GetProductsDto {
  constructor(query) {
    this.page = parseInt(query.page) || 1;
    this.pageSize = parseInt(query.pageSize) || 3;
    this.orderBy = query.orderBy ? query.orderBy : undefined;
    this.isHot = query.hot ? query.hot === "true" : undefined;
    this.isSale = query.sale ? query.sale === "true" : undefined;
    this.brand = query.brand ? query.brand : undefined;
    this.category = query.category ? query.category : undefined;
  }
}

class AddProductDto {
  constructor(body, files) {
    this.productDetails = body;
    this.files = files; // Handling files for upload
  }
}

class SearchProductDto {
  constructor(query) {
    this.page = parseInt(query.page) || 1;
    this.pageSize = parseInt(query.pageSize) || 3;
    this.searchQuery = query.q;
  }
}

// You may also define classes for other DTOs as needed, such as for updating products

export { GetProductsDto, AddProductDto, SearchProductDto };
