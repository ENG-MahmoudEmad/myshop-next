import MainLayout from "@/components/layout/MainLayout";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ScrollRestorer from "@/components/ui/ScrollRestorer";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ScrollRestorer />
      <MainLayout>{children}</MainLayout>
    </ReactQueryProvider>
  );
}