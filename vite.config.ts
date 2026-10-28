import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { generateCardSVG, CardParams } from "./src/lib/cardRenderer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "api-dev-middleware",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // Dev handler for /api/card
          if (req.url?.startsWith("/api/card")) {
            try {
              const url = new URL(req.url, `http://${req.headers.host || "localhost:8080"}`);
              const q = Object.fromEntries(url.searchParams.entries());
              const format = q.format || "svg";

              const cardParams: CardParams = {
                type: q.type || "stats",
                username: q.username || "",
                theme: q.theme || "electric-blue",
                bgColor: q.bg ? decodeURIComponent(q.bg) : undefined,
                primaryColor: q.primary ? decodeURIComponent(q.primary) : undefined,
                secondaryColor: q.secondary ? decodeURIComponent(q.secondary) : undefined,
                textColor: q.text ? decodeURIComponent(q.text) : undefined,
                borderColor: q.border ? decodeURIComponent(q.border) : undefined,
                borderRadius: q.radius ? parseInt(q.radius, 10) : 12,
                showBorder: q.showBorder !== "false",
                width: q.width ? parseInt(q.width, 10) : undefined,
                height: q.height ? parseInt(q.height, 10) : undefined,
                customText: q.customText || "",
                animate: q.animate !== "false",
                animation: q.animation || "fadeIn",
                speed: q.speed || "normal",
                gradient: q.gradient === "true",
                gradientType: q.gradientType || "linear",
                gradientAngle: q.gradientAngle ? parseInt(q.gradientAngle, 10) : 135,
                gradientStart: q.gradientStart ? decodeURIComponent(q.gradientStart) : undefined,
                gradientEnd: q.gradientEnd ? decodeURIComponent(q.gradientEnd) : undefined,
                bannerName: q.bannerName ? decodeURIComponent(q.bannerName) : undefined,
                bannerDescription: q.bannerDescription ? decodeURIComponent(q.bannerDescription) : undefined,
                waveStyle: q.waveStyle || "wave",
                quoteTopic: q.quoteTopic || undefined,
              };

              const svg = generateCardSVG(cardParams);

              if (format === "base64") {
                const base64 = Buffer.from(svg, "utf-8").toString("base64");
                const dataUrl = `data:image/svg+xml;base64,${base64}`;
                res.setHeader("Content-Type", "text/plain; charset=utf-8");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end(dataUrl);
                return;
              }

              res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.end(svg);
              return;
            } catch (err) {
              console.error("Dev card middleware error:", err);
              next();
              return;
            }
          }

          // Dev handler for /api/ai
          if (req.url?.startsWith("/api/ai") && req.method === "POST") {
            let parsedUsername = "Developer";
            try {
              let body = "";
              req.on("data", (chunk) => {
                body += chunk;
              });
              req.on("end", async () => {
                try {
                  const parsed = JSON.parse(body || "{}");
                  parsedUsername = parsed.username || "Developer";
                  const prompt = `Generate a markdown GitHub Profile README for ${parsedUsername}. Focus on skills, stats cards, and project highlights.\n\nContext:\n${parsed.cvText || parsed.portfolio || ""}`;

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
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.end(
                    JSON.stringify({
                      markdown: `# Hi there, I'm ${parsedUsername}\n\nSoftware engineer building performant web apps and developer tools.`,
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
