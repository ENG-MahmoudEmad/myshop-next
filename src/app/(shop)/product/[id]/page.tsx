import ProductDetailsClient from "./ProductDetailsClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <ProductDetailsClient id={id} />;
}