import MainLayout from "@/components/layout/MainLayout";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ToastProvider from "@/providers/ToastProvider";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <MainLayout>
        {children}
        <ToastProvider />
      </MainLayout>
    </ReactQueryProvider>
  );
}