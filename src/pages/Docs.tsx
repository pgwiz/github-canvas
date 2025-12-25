import { Layout } from "@/components/layout/Layout";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const endpoints = [
  {
    id: "stats",
    name: "User Statistics",
    method: "GET",
    path: "/api/card/stats",
    description: "Generate a stats card showing user's GitHub statistics",
    params: [
      { name: "username", type: "string", required: true, description: "GitHub username" },
      { name: "theme", type: "string", required: false, description: "Theme name (neon, tokyo-night, dracula, etc.)" },
      { name: "animation", type: "string", required: false, description: "Animation type (fadeIn, scaleIn, wave, glow, blink, typing, slideInLeft, slideInRight, slideInUp, bounce)" },
      { name: "bg", type: "string", required: false, description: "Background color (hex)" },
      { name: "primary", type: "string", required: false, description: "Primary color (hex)" },
      { name: "secondary", type: "string", required: false, description: "Secondary color (hex)" },
      { name: "text", type: "string", required: false, description: "Text color (hex)" },
      { name: "border", type: "string", required: false, description: "Border color (hex)" },
      { name: "radius", type: "number", required: false, description: "Border radius in pixels" },
      { name: "showBorder", type: "boolean", required: false, description: "Show/hide border" },
      { name: "width", type: "number", required: false, description: "Card width in pixels" },
      { name: "height", type: "number", required: false, description: "Card height in pixels" },
    ],
    example: "/api/card/stats?username=octocat&theme=neon&animation=fadeIn",
  },
  {
    id: "languages",
    name: "Language Breakdown",
    method: "GET",
    path: "/api/card/languages",
    description: "Generate a card showing user's most used programming languages",
    params: [
      { name: "username", type: "string", required: true, description: "GitHub username" },
      { name: "count", type: "number", required: false, description: "Number of languages to display (default: 5)" },
      { name: "theme", type: "string", required: false, description: "Theme name" },
    ],
    example: "/api/card/languages?username=octocat&count=8",
  },
  {
    id: "streak",
    name: "Contribution Streak",
    method: "GET",
    path: "/api/card/streak",
    description: "Generate a card showing contribution streak statistics",
    params: [
      { name: "username", type: "string", required: true, description: "GitHub username" },
      { name: "theme", type: "string", required: false, description: "Theme name" },
    ],
    example: "/api/card/streak?username=octocat",
  },
  {
    id: "activity",
    name: "Activity Graph",
    method: "GET",
    path: "/api/card/activity",
    description: "Generate an activity graph showing contributions over time",
    params: [
      { name: "username", type: "string", required: true, description: "GitHub username" },
      { name: "days", type: "number", required: false, description: "Number of days to display (default: 30)" },
      { name: "theme", type: "string", required: false, description: "Theme name" },
    ],
    example: "/api/card/activity?username=octocat&days=90",
  },
  {
    id: "quote",
    name: "Dev Quote",
    method: "GET",
    path: "/api/card/quote",
    description: "Generate a card with a random developer quote",
    params: [
      { name: "theme", type: "string", required: false, description: "Theme name" },
      { name: "category", type: "string", required: false, description: "Quote category (motivation, coding, wisdom)" },
    ],
    example: "/api/card/quote?theme=tokyo-night",
  },
  {
    id: "custom",
    name: "Custom Image",
    method: "GET",
    path: "/api/card/custom",
    description: "Generate a fully customizable image with your own text and styling",
    params: [
      { name: "text", type: "string", required: true, description: "Text to display on the card" },
      { name: "theme", type: "string", required: false, description: "Theme name" },
      { name: "fontSize", type: "number", required: false, description: "Font size in pixels" },
      { name: "width", type: "number", required: false, description: "Image width" },
      { name: "height", type: "number", required: false, description: "Image height" },
    ],
    example: "/api/card/custom?text=Hello%20World&theme=neon",
  },
];

const themes = [
  { name: "neon", description: "Neon green and cyan on dark background" },
  { name: "tokyo-night", description: "Purple and blue Tokyo Night theme" },
  { name: "dracula", description: "Pink and purple Dracula theme" },
  { name: "github-dark", description: "Official GitHub dark theme" },
  { name: "ocean", description: "Teal and blue ocean theme" },
  { name: "sunset", description: "Red and yellow sunset theme" },
  { name: "forest", description: "Green nature-inspired theme" },
  { name: "midnight", description: "Yellow text on dark purple" },
];

const animationsList = [
  { name: "fadeIn", description: "Fade in with upward motion" },
  { name: "scaleIn", description: "Scale up from center" },
  { name: "wave", description: "Continuous wave motion" },
  { name: "glow", description: "Pulsing glow effect" },
  { name: "blink", description: "Subtle blinking effect" },
  { name: "typing", description: "Typewriter text effect" },
  { name: "slideInLeft", description: "Slide in from left" },
  { name: "slideInRight", description: "Slide in from right" },
  { name: "slideInUp", description: "Slide in from bottom" },
  { name: "bounce", description: "Bouncing animation" },
];

export default function Docs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();
  const baseUrl = window.location.origin;

  const copyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast({ title: "Copied!", description: "Code copied to clipboard" });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">API Documentation</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete reference for the GitHub Stats API endpoints
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <GlassPanel className="sticky top-24">
                <h3 className="font-semibold mb-4 text-primary">Quick Links</h3>
                <nav className="space-y-2">
                  <a href="#overview" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Overview
                  </a>
                  <a href="#endpoints" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Endpoints
                  </a>
                  <a href="#themes" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Themes
                  </a>
                  <a href="#animations" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Animations
                  </a>
                  <a href="#examples" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Examples
                  </a>
                </nav>
              </GlassPanel>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Overview */}
              <section id="overview">
                <GlassPanel>
                  <h2 className="text-2xl font-bold mb-4">Overview</h2>
                  <p className="text-muted-foreground mb-4">
                    The GitHub Stats API allows you to generate beautiful, customizable statistics cards 
                    for your GitHub profile. All endpoints return PNG images that can be embedded directly 
                    in your README or website.
                  </p>
                  
                  <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
                    <span className="text-primary">Base URL:</span> {baseUrl}/api
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-semibold text-primary mb-2">No Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        All endpoints are publicly accessible without API keys
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <h4 className="font-semibold text-secondary mb-2">Cached Responses</h4>
                      <p className="text-sm text-muted-foreground">
                        Cards are cached for optimal performance
                      </p>
                    </div>
                  </div>
                </GlassPanel>
              </section>

              {/* Endpoints */}
              <section id="endpoints">
                <h2 className="text-2xl font-bold mb-6">Endpoints</h2>
                
                <Tabs defaultValue="stats" className="w-full">
                  <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full h-auto mb-6">
                    {endpoints.map((ep) => (
                      <TabsTrigger key={ep.id} value={ep.id} className="text-xs py-2">
                        {ep.name.split(" ")[0]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {endpoints.map((endpoint) => (
                    <TabsContent key={endpoint.id} value={endpoint.id}>
                      <GlassPanel>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{endpoint.name}</h3>
                            <p className="text-muted-foreground mt-1">{endpoint.description}</p>
                          </div>
                          <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-mono rounded">
                            {endpoint.method}
                          </span>
                        </div>
                        
                        <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm mb-6">
                          <span className="text-muted-foreground">{baseUrl}</span>
                          <span className="text-primary">{endpoint.path}</span>
                        </div>
                        
                        <h4 className="font-semibold mb-3">Parameters</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border">
                                <th className="text-left py-2 px-3">Name</th>
                                <th className="text-left py-2 px-3">Type</th>
                                <th className="text-left py-2 px-3">Required</th>
                                <th className="text-left py-2 px-3">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {endpoint.params.map((param) => (
                                <tr key={param.name} className="border-b border-border/50">
                                  <td className="py-2 px-3 font-mono text-primary">{param.name}</td>
                                  <td className="py-2 px-3 text-muted-foreground">{param.type}</td>
                                  <td className="py-2 px-3">
                                    {param.required ? (
                                      <span className="text-destructive">Yes</span>
                                    ) : (
                                      <span className="text-muted-foreground">No</span>
                                    )}
                                  </td>
                                  <td className="py-2 px-3 text-muted-foreground">{param.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <h4 className="font-semibold mt-6 mb-3">Example</h4>
                        <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-between">
                          <code className="font-mono text-sm text-foreground break-all">
                            {baseUrl}{endpoint.example}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyCode(`${baseUrl}${endpoint.example}`, endpoint.id)}
                          >
                            {copiedCode === endpoint.id ? (
                              <Check className="w-4 h-4 text-primary" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </GlassPanel>
                    </TabsContent>
                  ))}
                </Tabs>
              </section>

              {/* Themes */}
              <section id="themes">
                <GlassPanel>
                  <h2 className="text-2xl font-bold mb-6">Available Themes</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {themes.map((theme) => (
                      <div key={theme.name} className="p-4 border border-border rounded-lg">
                        <code className="text-primary font-mono">{theme.name}</code>
                        <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </section>

              {/* Animations */}
              <section id="animations">
                <GlassPanel>
                  <h2 className="text-2xl font-bold mb-6">Available Animations</h2>
                  <p className="text-muted-foreground mb-4">
                    Add beautiful SVG animations to your cards using the <code className="text-primary">animation</code> parameter.
                    Animations work like capsule-render and display in GitHub READMEs.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {animationsList.map((anim) => (
                      <div key={anim.name} className="p-4 border border-border rounded-lg">
                        <code className="text-secondary font-mono">{anim.name}</code>
                        <p className="text-xs text-muted-foreground mt-1">{anim.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 bg-muted/30 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Example Usage</h4>
                    <code className="font-mono text-sm text-foreground">
                      ?username=octocat&animation=slideInUp
                    </code>
                  </div>
                </GlassPanel>
              </section>

              {/* Examples */}
              <section id="examples">
                <GlassPanel>
                  <h2 className="text-2xl font-bold mb-6">Usage Examples</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">Markdown (README.md)</h4>
                      <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
                        <code>![GitHub Stats]({baseUrl}/api/card/stats?username=octocat)</code>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">HTML</h4>
                      <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
                        <code>&lt;img src="{baseUrl}/api/card/stats?username=octocat" alt="GitHub Stats" /&gt;</code>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Side by Side Cards</h4>
                      <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <pre>{`<p align="center">
  <img src="${baseUrl}/api/card/stats?username=octocat" />
  <img src="${baseUrl}/api/card/languages?username=octocat" />
</p>`}</pre>
                      </div>
                    </div>
                  </div>
                </GlassPanel>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
