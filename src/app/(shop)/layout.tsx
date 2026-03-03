import MainLayout from "@/components/layout/MainLayout";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <MainLayout>{children}</MainLayout>
    </ReactQueryProvider>
  );
}