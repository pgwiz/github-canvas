import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CardTypesSection } from "@/components/home/CardTypesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <CardTypesSection />
      <HowItWorksSection />
    </Layout>
  );
};

export default Index;
