import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CommandMenu } from "./CommandMenu";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { CustomCursor } from "@/components/ui/CustomCursor";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NoiseOverlay />
      <CustomCursor />
      <CommandMenu />
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
