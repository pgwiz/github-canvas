import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandMenuProvider } from "@/components/layout/command-menu-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Generator from "./pages/Generator";
import Themes from "./pages/Themes";
import ProfileCustomizer from "./pages/ProfileCustomizer";
import Docs from "./pages/Docs";
import Setup from "./pages/Setup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CommandMenuProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/themes" element={<Themes />} />
            <Route path="/profile-customizer" element={<ProfileCustomizer />} />
            <Route path="/ai" element={<ProfileCustomizer />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/setup" element={<Setup />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CommandMenuProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
