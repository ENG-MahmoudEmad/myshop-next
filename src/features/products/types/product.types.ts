export type Product = {
  _id: string;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;

  // ✅ add this
  quantity?: number;
};

export type ProductsResponse = {
  results: number;
  metadata?: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
  };
  data: Product[];
};

export type ProductDetailsResponse = {
  data: Product;
};