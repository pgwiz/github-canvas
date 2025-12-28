
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Copy, Check } from "lucide-react";

export default function AiTest() {
  const [username, setUsername] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!portfolio) {
      toast({
        title: "Missing Information",
        description: "Please enter your portfolio URL or content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setGeneratedMarkdown("");

    try {
      // Since this is a Vercel function, we use the local /api route or the deployed URL
      // But for local dev with 'vite', /api/ai isn't automatically proxied to the api/ folder unless configured.
      // However, usually Vercel dev handles this.
      // If we are just running 'npm run dev' (vite), we might not have the API running at /api/ai unless we use 'vercel dev'.
      // The user instruction said "put it on an invisible endpoint /ai for test purposes".
      // Assuming the backend is reachable at /api/ai relative to root.

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, portfolio }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      setGeneratedMarkdown(data.markdown);
      toast({
        title: "Profile Generated!",
        description: "Your AI-crafted profile is ready.",
      });

    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Markdown copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">AI Profile Architect</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Generate a professional GitHub README using your portfolio and our stats cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <GlassPanel accent="purple">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">GitHub Username</Label>
                    <Input
                      id="username"
                      placeholder="e.g. octocat"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-background/30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio">Portfolio URL or Content</Label>
                    <Textarea
                      id="portfolio"
                      placeholder="Paste your portfolio text, bio, or skills here..."
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      className="min-h-[200px] bg-background/30"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Gemini will analyze this to build your profile.
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Profile
                      </>
                    )}
                  </Button>
                </div>
              </GlassPanel>
            </div>

            <div className="space-y-6">
              <GlassPanel accent="blue" className="h-full min-h-[400px]">
                <div className="flex justify-between items-center mb-4">
                  <Label>Generated Markdown</Label>
                  {generatedMarkdown && (
                    <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
                {generatedMarkdown ? (
                  <div className="bg-black/50 p-4 rounded-md overflow-auto max-h-[500px] font-mono text-xs whitespace-pre-wrap">
                    {generatedMarkdown}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                    <Sparkles className="w-12 h-12 mb-4" />
                    <p>Ready to generate magic</p>
                  </div>
                )}
              </GlassPanel>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
