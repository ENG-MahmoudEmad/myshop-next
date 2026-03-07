import BrandDetailsScreen from "@/features/brands/screens/BrandDetailsScreen";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return <BrandDetailsScreen id={id} />;
}