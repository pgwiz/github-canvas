import { Github, Twitter, Linkedin, Heart, Mail, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MagneticButton } from "@/components/ui/MagneticButton";

const SUBSCRIBE_DELAY = 1500;
const SUBSCRIBE_SUCCESS_TIMEOUT = 3000;

const socialLinks = [
  { icon: Github, href: "https://github.com/pgwiz", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Generator", href: "/generator" },
      { label: "Features", href: "/#features" },
      { label: "Card Types", href: "/#card-types" },
      { label: "API Docs", href: "/docs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub API", href: "https://docs.github.com/en/rest" },
      { label: "Themes", href: "/docs#themes" },
      { label: "Animations", href: "/docs#animations" },
      { label: "Examples", href: "/docs#examples" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "License", href: "#" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), SUBSCRIBE_SUCCESS_TIMEOUT);
    }, SUBSCRIBE_DELAY);
  };

  return (
    <footer className="relative border-t border-border/40 bg-background/50 backdrop-blur-xl pt-16 pb-8 mt-auto overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(12,247,9,0.3)] transition-all duration-500">
                  <Github className="w-5 h-5 text-primary transition-transform group-hover:scale-110 group-hover:rotate-12" />
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:from-primary group-hover:to-secondary transition-all duration-500">
                  GitStats
                </span>
              </div>
            </Link>

            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Create beautiful, animated GitHub statistics for your profile.
              Showcase your achievements with style.
            </p>

            <div className="max-w-md">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary" />
                <span>Stay Updated</span>
              </h4>
              <form onSubmit={handleSubscribe} className="relative">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading || subscribed}
                      className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors"
                    />
                    <Button
                      type="submit"
                      disabled={loading || subscribed}
                      className={`relative min-w-[100px] overflow-hidden transition-all duration-300 ${subscribed ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {loading ? (
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : subscribed ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="hidden sm:inline">Joined</span>
                          </>
                        ) : (
                          <>
                            <span>Join</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                </div>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Join 5,000+ developers building their portfolio.
              </p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((column, idx) => (
              <div key={idx} className="space-y-4">
                <h4 className="font-bold text-sm tracking-wider uppercase text-muted-foreground/80">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-sm"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} GitStats.</span>
            <span className="hidden md:inline">Made with</span>
            <motion.div
              whileHover={{ scale: 1.2, color: "#ef4444" }}
              className="inline-block"
            >
              <Heart className="w-4 h-4 text-destructive fill-destructive/20" />
            </motion.div>
            <span className="hidden md:inline">by</span>
            <a
              href="https://github.com/pgwiz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors font-medium relative group"
            >
              pgwiz
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, idx) => {
              const Icon = social.icon;
              return (
                <MagneticButton key={idx} strength={0.2} asChild>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-foreground hover:border-white/20 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                </MagneticButton>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
