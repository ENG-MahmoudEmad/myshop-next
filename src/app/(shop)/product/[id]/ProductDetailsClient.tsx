"use client";

import dynamic from "next/dynamic";

const ProductDetailsScreen = dynamic(
  () => import("@/features/products/screens/ProductDetailsScreen"),
  { ssr: false }
);

export default function ProductDetailsClient({ id }: { id: string }) {
  return <ProductDetailsScreen id={id} />;
}