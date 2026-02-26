import HeroSection from "@/features/home/components/HeroSection";
import FeaturesBar from "@/features/home/components/FeaturesBar";
import CategorySection from "@/features/home/components/CategorySection";
import DealsSection from "@/features/home/components/DealsSection";
import PromoBanners from "@/features/home/components/PromoBanners";
import PopularProducts from "@/features/home/components/PopularProducts";
import NewsletterSection from "@/features/home/components/NewsletterSection";

export default function HomeScreen() {
  return (
    <div className="space-y-20">
      <HeroSection />
      <FeaturesBar />
      <CategorySection />
      <DealsSection />
      <PromoBanners />
      <PopularProducts />
      <NewsletterSection />
    </div>
  );
}