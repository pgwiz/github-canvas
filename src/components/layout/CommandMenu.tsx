import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCommandMenu } from "./command-menu-context";
import {
  Sparkles,
  Home,
  FileCode,
  BookOpen,
  Moon,
  Sun,
  Github,
  Copy,
  Monitor
} from "lucide-react";
import { useTheme } from "next-themes";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function CommandMenu() {
  const { open, setOpen } = useCommandMenu();
  const navigate = useNavigate();
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Copied!",
      description: "Current URL copied to clipboard.",
    });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="pb-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => runCommand(() => navigate("/"))} className="group">
                <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Home</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/generator"))} className="group">
                <FileCode className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Generator</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/docs"))} className="group">
                <BookOpen className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>API Documentation</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => runCommand(triggerConfetti)} className="group">
                <Sparkles className="mr-2 h-4 w-4 text-yellow-500 transition-transform group-hover:scale-110 group-hover:rotate-12" />
                <span>Celebrate!</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(copyUrl)} className="group">
                <Copy className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Copy Current URL</span>
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Theme">
              <CommandItem onSelect={() => runCommand(() => setTheme("light"))} className="group">
                <Sun className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Light Mode</span>
                {theme === "light" && <span className="ml-auto text-xs text-muted-foreground">Active</span>}
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme("dark"))} className="group">
                <Moon className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>Dark Mode</span>
                {theme === "dark" && <span className="ml-auto text-xs text-muted-foreground">Active</span>}
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme("system"))} className="group">
                <Monitor className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>System</span>
                {theme === "system" && <span className="ml-auto text-xs text-muted-foreground">Active</span>}
              </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Links">
              <CommandItem onSelect={() => runCommand(() => window.open("https://github.com", "_blank"))} className="group">
                <Github className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                <span>GitHub</span>
              </CommandItem>
            </CommandGroup>
          </motion.div>
        </CommandList>
      </div>
    </CommandDialog>
  );
}
