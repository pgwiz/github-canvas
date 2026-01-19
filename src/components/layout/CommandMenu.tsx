import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
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
  Monitor,
  Search
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
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        <CommandInput
          placeholder="Type a command or search..."
          className="border-none bg-transparent focus:ring-0 text-lg py-6"
        />

        <CommandList className="max-h-[60vh] overflow-y-auto pb-2 scrollbar-hide">
          <CommandEmpty className="py-12 text-center text-muted-foreground">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <Search className="w-12 h-12 opacity-20" />
              <p>No results found.</p>
            </motion.div>
          </CommandEmpty>

          <CommandGroup heading="Navigation" className="text-muted-foreground/70">
            <CommandItem onSelect={() => runCommand(() => navigate("/"))} className="aria-selected:bg-primary/10 aria-selected:text-primary">
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
              <CommandShortcut>G H</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/generator"))} className="aria-selected:bg-primary/10 aria-selected:text-primary">
              <FileCode className="mr-2 h-4 w-4" />
              <span>Generator</span>
              <CommandShortcut>G G</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/docs"))} className="aria-selected:bg-primary/10 aria-selected:text-primary">
              <BookOpen className="mr-2 h-4 w-4" />
              <span>API Documentation</span>
              <CommandShortcut>G D</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="bg-white/5" />

          <CommandGroup heading="Actions" className="text-muted-foreground/70">
            <CommandItem onSelect={() => runCommand(triggerConfetti)} className="aria-selected:bg-yellow-500/10 aria-selected:text-yellow-500">
              <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Celebrate!</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(copyUrl)} className="aria-selected:bg-blue-500/10 aria-selected:text-blue-500">
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Current URL</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="bg-white/5" />

          <CommandGroup heading="Theme" className="text-muted-foreground/70">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))} className="aria-selected:bg-white/10">
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
              {theme === "light" && <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded text-foreground">Active</span>}
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))} className="aria-selected:bg-white/10">
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
              {theme === "dark" && <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded text-foreground">Active</span>}
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))} className="aria-selected:bg-white/10">
              <Monitor className="mr-2 h-4 w-4" />
              <span>System</span>
              {theme === "system" && <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded text-foreground">Active</span>}
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="bg-white/5" />

          <CommandGroup heading="Links" className="text-muted-foreground/70">
            <CommandItem onSelect={() => runCommand(() => window.open("https://github.com", "_blank"))} className="aria-selected:bg-white/10">
              <Github className="mr-2 h-4 w-4" />
              <span>GitHub</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </div>
    </CommandDialog>
  );
}
