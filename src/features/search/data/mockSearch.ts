export type SearchProduct = {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number; // 0..5
  reviewsCount: number;
  badge?: string; // "Organic"...
  image: string;
  inStock: boolean;
  brand: string;
  tags?: string[];
};

export const mockProducts: SearchProduct[] = [
  {
    id: "p1",
    title: "Organic Fresh Broccoli (1pc)",
    category: "Vegetables",
    price: 1.99,
    rating: 4.2,
    reviewsCount: 86,
    badge: "Organic",
    image:
      "https://images.unsplash.com/photo-1584270354949-1d75c7b7d4c6?auto=format&fit=crop&w=800&q=60",
    inStock: true,
    brand: "Organic Farms",
    tags: ["100% Organic"],
  },
  {
    id: "p2",
    title: "Organic Baby Spinach (250g)",
    category: "Vegetables",
    price: 2.49,
    rating: 4.5,
    reviewsCount: 92,
    badge: "Organic",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=60",
    inStock: true,
    brand: "Fresh Harvest",
    tags: ["Vegan"],
  },
  {
    id: "p3",
    title: "Organic Bell Peppers Mix (3pcs)",
    category: "Vegetables",
    price: 4.99,
    rating: 4.1,
    reviewsCount: 74,
    badge: "Organic",
    image:
      "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=60",
    inStock: true,
    brand: "Nature's Basket",
  },
  {
    id: "p4",
    title: "Organic Carrots (500g)",
    category: "Vegetables",
    price: 2.29,
    rating: 5.0,
    reviewsCount: 63,
    badge: "Organic",
    image:
      "https://images.unsplash.com/photo-1598030343246-7e7b6d9a8bb7?auto=format&fit=crop&w=800&q=60",
    inStock: false,
    brand: "Green Valley",
    tags: ["Gluten-Free"],
  },
];

export const recentlyViewed: SearchProduct[] = [
  {
    id: "rv1",
    title: "Artisan Sourdough Bread",
    category: "Bakery",
    price: 3.99,
    rating: 5,
    reviewsCount: 42,
    image:
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=60",
    inStock: true,
    brand: "Earth Grown",
  },
  {
    id: "rv2",
    title: "Organic Whole Milk (1 gallon)",
    category: "Dairy",
    price: 4.29,
    rating: 4.5,
    reviewsCount: 87,
    image:
      "https://images.unsplash.com/photo-1585238342028-4a3d6a5d5bb1?auto=format&fit=crop&w=800&q=60",
    inStock: true,
    brand: "Fresh Harvest",
  },
  {
    id: "rv3",
    title: "Fresh Atlantic Salmon (1lb)",
    category: "Seafood",
    price: 9.99,
    rating: 4.2,
    reviewsCount: 36,
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=60",
    inStock: true,
    brand: "Nature's Basket",
  },
  {
    id: "rv4",
    title: "Organic Brown Eggs (12pcs)",
    category: "Dairy & Eggs",
    price: 3.99,
    rating: 4.2,
    reviewsCount: 78,
    image:
      "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=800&q=60",
    inStock: true,
    brand: "Organic Farms",
  },
];