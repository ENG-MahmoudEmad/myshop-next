export type WishlistProduct = {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  ratingsAverage: number;
  ratingsQuantity?: number;

  category?: { name: string };
  brand?: { name: string };
};

export type WishlistResponse = {
  status: string;
  count: number;
  data: WishlistProduct[];
};