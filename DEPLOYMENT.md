# GitHub Stats Card - Deployment Guide

## 🚀 Quick Deploy to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

### Manual Deployment

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO
   ```

2. **Run setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure environment variables**
   Edit `.env.local` with your values:
   ```env
   GITHUB_TOKEN=ghp_your_token_here  # Optional but recommended
   ```

4. **Deploy to Vercel**
   ```bash
   ./scripts/deploy.sh --prod
   ```

---

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Optional | GitHub Personal Access Token for higher rate limits (60 → 5000 req/hr) |
| `VITE_APP_URL` | Auto | Set automatically by Vercel |

### Getting a GitHub Token
1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo` (for public repos only)
4. Copy the token and add to Vercel environment variables

---

## 🔧 Vercel Configuration

### Add Environment Variables in Vercel Dashboard

1. Go to your project on [vercel.com](https://vercel.com)
2. Navigate to **Settings** → **Environment Variables**
3. Add your variables:
   - `GITHUB_TOKEN`: Your GitHub PAT (optional)

### Custom Domain

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

---

## 📊 API Endpoints

Once deployed, your API will be available at:

```
https://your-app.vercel.app/api/card?type=stats&username=YOUR_USERNAME
```

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `type` | `stats` | Card type: `stats`, `languages`, `streak`, `activity`, `quote`, `custom` |
| `username` | - | GitHub username |
| `theme` | `neon` | Color theme |
| `animation` | `fadeIn` | Animation: `fadeIn`, `scaleIn`, `wave`, `glow`, `blink`, `typing`, `slideInLeft`, `slideInRight`, `slideInUp`, `bounce` |
| `speed` | `normal` | Animation speed: `slow`, `normal`, `fast` |
| `gradient` | `false` | Enable gradient background |
| `gradientType` | `linear` | Gradient type: `linear`, `radial` |
| `gradientAngle` | `135` | Linear gradient angle (0-360) |
| `gradientStart` | `#667eea` | Gradient start color (hex, URL encoded) |
| `gradientEnd` | `#764ba2` | Gradient end color (hex, URL encoded) |
| `bg` | - | Background color (hex) |
| `primary` | - | Primary color (hex) |
| `secondary` | - | Secondary color (hex) |
| `text` | - | Text color (hex) |
| `border` | - | Border color (hex) |
| `radius` | `12` | Border radius |
| `showBorder` | `true` | Show/hide border |
| `width` | `495` | Card width |
| `height` | `195` | Card height |

### Example Usage

**Markdown (for GitHub README):**
```markdown
![GitHub Stats](https://your-app.vercel.app/api/card?type=stats&username=octocat&theme=dracula&animation=fadeIn)
```

**With Gradient:**
```markdown
![GitHub Stats](https://your-app.vercel.app/api/card?type=stats&username=octocat&gradient=true&gradientStart=%23667eea&gradientEnd=%23764ba2)
```

**HTML:**
```html
<img src="https://your-app.vercel.app/api/card?type=stats&username=octocat&animation=slideInUp&speed=fast" alt="GitHub Stats" />
```

---

## 🎨 Available Themes

- `neon` (default)
- `dracula`
- `nord`
- `tokyonight`
- `gruvbox`
- `catppuccin`
- `synthwave`
- `cobalt`
- `monokai`
- `solarized`
- `onedark`
- `ayu`
- `palenight`
- `material`
- `ocean`

---

## 🔄 Self-Hosting Alternatives

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Other Platforms
- **Netlify**: Add `netlify.toml` with functions configuration
- **Railway**: Connect GitHub repo and deploy
- **Render**: Create web service from repo

---

## 📈 Rate Limits

| Without Token | With Token |
|---------------|------------|
| 60 req/hour | 5,000 req/hour |

**Recommendation**: Always use a `GITHUB_TOKEN` for production deployments.

---

## 🛠 Troubleshooting

### "Rate limit exceeded"
- Add a `GITHUB_TOKEN` to increase limits
- The token only needs `public_repo` scope

### "User not found"
- Check the username spelling
- Ensure the GitHub profile is public

### Cards not updating
- Cards are cached for 1 hour
- Add `&cache=false` to bypass (not recommended for production)

---

## 📄 License

MIT License - Feel free to use, modify, and distribute.
