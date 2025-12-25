import { Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-destructive fill-destructive" />
            <span>by</span>
            <a 
              href="https://github.com/pgwiz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              pgwiz
            </a>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="/docs" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentation
            </a>
            <a 
              href="https://github.com/pgwiz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
