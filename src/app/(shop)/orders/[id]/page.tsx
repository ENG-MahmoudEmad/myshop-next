import OrderDetailsScreen from "@/features/orders/screens/OrderDetailsScreen";

type Props = { params: { id: string } };

export default function Page({ params }: Props) {
  return <OrderDetailsScreen id={params.id} />;
}