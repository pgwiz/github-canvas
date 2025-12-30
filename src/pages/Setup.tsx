import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Server, Database, Key, Github, Shield, Play, Loader2, Info, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

// Edge function secrets only - no frontend URLs exposed
const envTemplate = `# ==========================================
# GitHub Stats Card Generator - Edge Function Secrets
# ==========================================

# Required for setup endpoint (optional - only if you want admin access)
SETPP=true
SETPP_KEY=your_secure_random_key_here

# ==========================================
# GitHub Configuration (Recommended)
# ==========================================
GITHUB_TOKEN=ghp_your_token_here

# ==========================================
# Cache Configuration
# ==========================================
CACHE_TTL_MINUTES=60`;

const dbSetupSQL = `-- GitHub Stats Cache Table
CREATE TABLE IF NOT EXISTS public.github_stats_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  stats_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour')
);

-- Quotes Cache Table  
CREATE TABLE IF NOT EXISTS public.quotes_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
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
$$;`;

const Setup = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [setupConfig, setSetupConfig] = useState({
    setppKey: '',
    serviceRoleKey: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, string> | null>(null);
  const [healthStatus, setHealthStatus] = useState<Record<string, unknown> | null>(null);

  // Auto-detect base URL for setpp endpoint
  const getSetppEndpoint = () => {
    const baseUrl = window.location.origin;
    // For Supabase edge functions, use the VITE_SUPABASE_URL
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      return `${supabaseUrl}/functions/v1/setpp`;
    }
    return `${baseUrl}/functions/v1/setpp`;
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTestConnection = async () => {
    if (!setupConfig.setppKey) {
      toast({
        title: "Missing SETPP Key",
        description: "Please enter your SETPP key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${getSetppEndpoint()}?action=test`, {
        method: 'POST',
        headers: {
          'x-setpp-key': setupConfig.setppKey,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.status === 429) {
        toast({
          title: "Rate Limited",
          description: `Too many requests. Try again in ${data.retry_after} seconds.`,
          variant: "destructive"
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Test failed');
      }

      setTestResults(data);
      toast({
        title: "Test Complete",
        description: "Connection test finished successfully",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: error instanceof Error ? error.message : "Connection failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHealthCheck = async () => {
    if (!setupConfig.setppKey) {
      toast({
        title: "Missing SETPP Key",
        description: "Please enter your SETPP key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${getSetppEndpoint()}?action=health`, {
        method: 'POST',
        headers: {
          'x-setpp-key': setupConfig.setppKey,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setHealthStatus(data);
      toast({
        title: data.status === 'healthy' ? "All Services Healthy" : "Issues Detected",
        description: `Status: ${data.status}`,
        variant: data.status === 'healthy' ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Health Check Failed",
        description: error instanceof Error ? error.message : "Check failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupDatabase = async () => {
    if (!setupConfig.setppKey) {
      toast({
        title: "Missing SETPP Key",
        description: "Please enter your SETPP key",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const body: Record<string, string> = {};
      if (setupConfig.serviceRoleKey) body.supabase_service_role = setupConfig.serviceRoleKey;

      const response = await fetch(`${getSetppEndpoint()}?action=setup-db`, {
        method: 'POST',
        headers: {
          'x-setpp-key': setupConfig.setppKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (response.status === 429) {
        toast({
          title: "Rate Limited",
          description: `Too many requests. Try again in ${data.retry_after} seconds.`,
          variant: "destructive"
        });
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Setup failed');
      }

      const hasManual = data.results?.some((r: { status: string }) => r.status === 'manual_required');
      
      toast({
        title: hasManual ? "Manual Setup Required" : "Database Setup Complete",
        description: hasManual 
          ? "Please run the SQL manually in your Supabase dashboard" 
          : "Tables have been verified successfully",
      });

      setTestResults({ ...data.results?.reduce((acc: Record<string, string>, r: { step: string; status: string }) => {
        acc[r.step] = r.status;
        return acc;
      }, {}), note: data.note });
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: error instanceof Error ? error.message : "Database setup failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
                <li>Set up your edge function secrets (see template below)</li>
                <li>Deploy to your preferred platform (Vercel, Netlify, Lovable, etc.)</li>
                <li>Use the setup tools below to initialize your database</li>
              </ol>
            </CardContent>
          </Card>

          {/* Where to find credentials */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Where to Get Your Credentials
              </CardTitle>
              <CardDescription>
                Find your keys in these locations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-l-2 border-primary pl-4">
                  <h4 className="font-medium">Using Lovable Cloud?</h4>
                  <p className="text-sm text-muted-foreground">
                    Your backend is pre-configured! The <code className="bg-muted px-1 rounded">VITE_SUPABASE_URL</code> and 
                    <code className="bg-muted px-1 rounded">VITE_SUPABASE_PUBLISHABLE_KEY</code> are already set in your <code className="bg-muted px-1 rounded">.env</code> file.
                    You just need to add secrets like <code className="bg-muted px-1 rounded">SETPP_KEY</code> and <code className="bg-muted px-1 rounded">GITHUB_TOKEN</code> via 
                    the Cloud secrets manager.
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <h4 className="font-medium">Self-Hosting with Supabase?</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to your Supabase project → Settings → API to find:
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                    <li><strong>Project URL</strong> → use for <code className="bg-muted px-1 rounded">VITE_SUPABASE_URL</code></li>
                    <li><strong>anon/public key</strong> → use for <code className="bg-muted px-1 rounded">VITE_SUPABASE_PUBLISHABLE_KEY</code></li>
                    <li><strong>service_role key</strong> → use for database initialization only (never expose!)</li>
                  </ul>
                </div>
              </div>
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
                  onClick={() => handleCopy(envTemplate, 'env')}
                  className="gap-2"
                >
                  {copied === 'env' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'env' ? "Copied!" : "Copy"}
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

          {/* Interactive Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Interactive Setup
              </CardTitle>
              <CardDescription>
                Test connections and initialize your database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-4 rounded-lg border">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Endpoint Auto-Detected</p>
                    <code className="text-xs bg-background px-2 py-1 rounded">{getSetppEndpoint()}</code>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="setppKey">SETPP Key</Label>
                  <Input
                    id="setppKey"
                    type="password"
                    placeholder="Your SETPP_KEY value"
                    value={setupConfig.setppKey}
                    onChange={(e) => setSetupConfig(prev => ({ ...prev, setppKey: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="serviceRoleKey">Service Role Key (for DB setup)</Label>
                  <Input
                    id="serviceRoleKey"
                    type="password"
                    placeholder="Your Supabase service_role key"
                    value={setupConfig.serviceRoleKey}
                    onChange={(e) => setSetupConfig(prev => ({ ...prev, serviceRoleKey: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    ⚠️ Keep this secret! Only used for initial database setup.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleTestConnection} disabled={isLoading} variant="outline">
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Test Connection
                </Button>
                <Button onClick={handleHealthCheck} disabled={isLoading} variant="outline">
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Heart className="h-4 w-4 mr-2" />}
                  Health Check
                </Button>
                <Button onClick={handleSetupDatabase} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
                  Initialize Database
                </Button>
              </div>

              {(testResults || healthStatus) && (
                <div className="space-y-4">
                  {healthStatus && (
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Health Status: 
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          (healthStatus as { status: string }).status === 'healthy' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-destructive/20 text-destructive'
                        }`}>
                          {(healthStatus as { status: string }).status}
                        </span>
                      </h4>
                      <div className="grid gap-2 text-sm">
                        {(healthStatus as { services?: Record<string, { status: string; latency_ms?: number }> }).services && 
                          Object.entries((healthStatus as { services: Record<string, { status: string; latency_ms?: number }> }).services).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-2 bg-background rounded">
                              <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                value.status === 'healthy' 
                                  ? 'bg-green-500/20 text-green-500' 
                                  : value.status === 'not configured'
                                  ? 'bg-muted text-muted-foreground'
                                  : 'bg-destructive/20 text-destructive'
                              }`}>
                                {value.status} {value.latency_ms ? `(${value.latency_ms}ms)` : ''}
                              </span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                  {testResults && (
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Test Results:</h4>
                      <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(testResults, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Database SQL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Setup SQL
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(dbSetupSQL, 'sql')}
                  className="gap-2"
                >
                  {copied === 'sql' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'sql' ? "Copied!" : "Copy"}
                </Button>
              </CardTitle>
              <CardDescription>
                Run in Supabase SQL Editor if auto-setup doesn't work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                <code>{dbSetupSQL}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Rate Limiting Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Features
              </CardTitle>
              <CardDescription>
                Built-in protection for your setup endpoint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Rate Limiting</h4>
                <p className="text-sm text-muted-foreground">
                  The setup endpoint is protected with rate limiting: <strong>10 requests per minute</strong> per IP address.
                  This prevents brute-force attacks on your SETPP_KEY.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  All requests require both <code className="bg-muted px-1 rounded">SETPP=true</code> environment variable 
                  and a valid <code className="bg-muted px-1 rounded">x-setpp-key</code> header matching your secret.
                </p>
              </div>
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
        </div>
      </div>
    </Layout>
  );
};

export default Setup;
