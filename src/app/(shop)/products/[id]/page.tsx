import ProductDetailsScreen from "@/features/products/screens/ProductDetailsScreen";

type Props = { params: { id: string } };

export default function Page({ params }: Props) {
  return <ProductDetailsScreen id={params.id} />;
}