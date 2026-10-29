import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CommandMenu } from "./CommandMenu";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollProgress />
      <CustomCursor />
      <NoiseOverlay />
      <CommandMenu />
      <Header />
      <main className="flex-1 pt-16 flex flex-col min-h-0">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <ScrollToTop />
    </div>
  );
}
