import OrderDetailsScreen from "@/features/orders/screens/OrderDetailsScreen";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <OrderDetailsScreen id={id} />;
}