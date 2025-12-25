import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Server, Database, Key, Github } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const envTemplate = `# ==========================================
# GitHub Stats Card Generator - Production Environment
# ==========================================

# Required for setup endpoint (optional - only if you want admin access)
SETPP=true
SETPP_KEY=your_secure_random_key_here

# ==========================================
# Supabase Configuration
# ==========================================
# Option 1: Use your own Supabase project
CUSTOM_SUPABASE_URL=https://your-project.supabase.co
CUSTOM_SUPABASE_ANON_KEY=your_anon_key_here

# Option 2: Keep using default (comment out above and use these)
# SUPABASE_URL=https://sbyckljjjfxwmugmmbrl.supabase.co
# SUPABASE_ANON_KEY=your_key_here

# ==========================================
# GitHub Configuration (Recommended)
# ==========================================
# Personal Access Token for higher rate limits (5000/hr vs 60/hr)
GITHUB_TOKEN=ghp_your_token_here

# ==========================================
# Cache Configuration
# ==========================================
CACHE_TTL_MINUTES=60

# ==========================================
# Frontend Configuration (for Vite build)
# ==========================================
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_SUPABASE_PROJECT_ID=your_project_id`;

const Setup = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Environment template copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Production Setup Guide</h1>
          <p className="text-muted-foreground text-lg">
            Configure your own instance of GitHub Stats Card Generator
          </p>
        </div>

        <div className="space-y-8">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Get up and running in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Fork or clone the repository</li>
                <li>Copy the environment template below</li>
                <li>Fill in your own values</li>
                <li>Deploy to your preferred platform (Vercel, Netlify, etc.)</li>
              </ol>
            </CardContent>
          </Card>

          {/* Environment Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Combined .env Template
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </CardTitle>
              <CardDescription>
                Save this as <code className="bg-muted px-1 rounded">.env</code> in your project root
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{envTemplate}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Database Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Setup (Supabase)
              </CardTitle>
              <CardDescription>
                Required tables for caching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Run these SQL commands in your Supabase SQL Editor:
              </p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`-- GitHub Stats Cache Table
CREATE TABLE public.github_stats_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  stats_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour')
);

-- Quotes Cache Table
CREATE TABLE public.quotes_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS (optional but recommended)
ALTER TABLE public.github_stats_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for caching
CREATE POLICY "Allow public access" ON public.github_stats_cache
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public access" ON public.quotes_cache
  FOR ALL USING (true) WITH CHECK (true);

-- Cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  DELETE FROM public.github_stats_cache WHERE expires_at < now();
END;
$$;`}</code>
              </pre>
            </CardContent>
          </Card>

          {/* GitHub Token */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub Token (Recommended)
              </CardTitle>
              <CardDescription>
                Increase API rate limits from 60/hr to 5000/hr
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary underline">GitHub Settings → Tokens</a></li>
                <li>Generate a new token (classic) with <code className="bg-muted px-1 rounded">public_repo</code> scope</li>
                <li>Add it to your environment as <code className="bg-muted px-1 rounded">GITHUB_TOKEN</code></li>
              </ol>
            </CardContent>
          </Card>

          {/* Admin Endpoint */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Admin Setup Endpoint
              </CardTitle>
              <CardDescription>
                Optional: Test and validate your configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                When <code className="bg-muted px-1 rounded">SETPP=true</code> is set, you can access the admin endpoint:
              </p>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`# Get configuration status
curl -H "x-setpp-key: YOUR_SETPP_KEY" \\
  https://your-domain/functions/v1/setpp

# Test connections
curl -X POST -H "x-setpp-key: YOUR_SETPP_KEY" \\
  "https://your-domain/functions/v1/setpp?action=test"

# Validate custom config
curl -X POST -H "x-setpp-key: YOUR_SETPP_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"supabase_url":"...","supabase_key":"..."}' \\
  "https://your-domain/functions/v1/setpp?action=validate"`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Setup;
