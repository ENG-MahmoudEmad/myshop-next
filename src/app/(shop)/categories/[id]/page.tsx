import CategoryDetailsScreen from "@/features/categories/screens/CategoryDetailsScreen";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <CategoryDetailsScreen id={id} />;
}