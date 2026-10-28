import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/card': {
        target: 'https://edxiyetfcnugrmxhmvpq.supabase.co/functions/v1',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/card/, '/generate-card'),
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "api-ai-dev-middleware",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith("/api/ai") && req.method === "POST") {
            try {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });
              req.on("end", async () => {
                try {
                  const parsed = JSON.parse(body || "{}");
                  const prompt = `Generate a markdown GitHub Profile README for ${parsed.username || "developer"}. Focus on skills, stats cards, and project highlights.\n\nContext:\n${parsed.cvText || parsed.portfolio || ""}`;
                  
                  const aiRes = await fetch("https://cr.pgwiz.cloud/api/chat", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "x-api-key": "pgwiz2026!",
                    },
                    body: JSON.stringify({ message: prompt }),
                  });

                  if (aiRes.ok) {
                    const aiData = await aiRes.json();
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ markdown: aiData.message || "", success: true }));
                    return;
                  }
                  throw new Error(`AI service status ${aiRes.status}`);
                } catch (_e) {
                  res.statusCode = 200; // Return fallback
                  res.setHeader("Content-Type", "application/json");
                  res.end(
                    JSON.stringify({
                      markdown: `# Hi there, I'm ${parsed.username || "Developer"}\n\nSoftware engineer building performant web apps and developer tools.`,
                      success: true,
                    })
                  );
                }
              });
              return;
            } catch (err) {
              next();
            }
          } else {
            next();
          }
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
