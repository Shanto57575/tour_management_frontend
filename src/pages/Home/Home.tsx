import FeaturedDestinations from "@/components/modules/Home/FeaturedDestinations";
import HeroSection from "@/components/modules/Home/HeroSection";
import HowItWorks from "@/components/modules/Home/HowItWorks";
import SeasonalTours from "@/components/modules/Home/SeasonalTours";
import Testimonials from "@/components/modules/Home/Testimonials";
import TourPackages from "@/components/modules/Home/TourPackages";
import WhyChooseUs from "@/components/modules/Home/WhyChooseUs";
import TravelBlog from "@/components/modules/Home/TravelBlog";
import Newsletter from "@/components/modules/Home/Newsletter";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturedDestinations />
      <TourPackages />
      <SeasonalTours />
      <TravelBlog />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
