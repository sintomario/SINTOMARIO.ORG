# Deployment Guide - SINTOMARIO.ORG

## 🚀 Production Deployment

### GitHub Pages (Current Setup)

#### 1. Repository Configuration
```bash
# Repository structure
SINTOMARIO.ORG/
├── main branch     # Production
├── gh-pages        # (Optional) Documentation
└── .nojekyll      # Disable Jekyll processing
```

#### 2. Domain Setup
- **Domain**: sintomario.org
- **DNS**: A record to GitHub Pages IP
- **SSL**: Automatic HTTPS via GitHub
- **CNAME**: Configured in repository root

#### 3. Build Process
```bash
# No build required - static files
git add .
git commit -m "Deploy: Atlas improvements"
git push origin main
```

### Local Development Server

#### Python HTTP Server
```bash
cd SINTOMARIO.ORG
python -m http.server 8000
# Access: http://localhost:8000
```

#### Alternative: Node.js serve
```bash
npx serve . -p 8000
# Access: http://localhost:8000
```

## 📁 File Structure for Deployment

### Required Files
```
SINTOMARIO.ORG/
├── index.html              # Homepage
├── api/
│   ├── counter.php         # Counter API
│   └── counter.json        # Database (auto-created)
├── cuerpo/
│   ├── index.html          # Atlas
│   ├── sistema/            # System hubs
│   └── [63-zonas]/         # Zone articles
├── faq/index.html         # FAQ
├── sobre/index.html       # About
├── layers/PNG/            # Atlas images
├── search.js              # Search functionality
├── 404.html               # Error page
├── robots.txt             # SEO directives
├── sitemap.xml            # Site map
├── CNAME                  # Domain configuration
└── .nojekyll              # Disable Jekyll
```

### Optional Files
```
├── docs/                  # Documentation
├── assets/                # Additional resources
└── README.md              # Project info
```

## ⚙️ Configuration Files

### CNAME
```
sintomario.org
```

### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://sintomario.org/sitemap.xml
```

### .nojekyll
```
# Empty file to disable Jekyll processing
```

## 🔧 Environment Setup

### PHP Requirements (Counter API)
- **PHP Version**: 7.4+ (GitHub Pages supports via external API)
- **Extensions**: `json`, `file system`
- **Permissions**: Write access to `counter.json`

### Static File Serving
- **HTML5**: Modern browser features
- **CSS3**: Flexbox, Grid, Custom properties
- **JavaScript**: ES6+ (async/await, fetch API)

## 🚀 Deployment Steps

### 1. Pre-Deployment Checklist
```bash
# ✅ Test all links work
find . -name "*.html" -exec grep -l "href=" {} \;

# ✅ Validate HTML
npx html-validate .

# ✅ Check image optimization
du -sh layers/PNG/*.png

# ✅ Test API locally
curl "http://localhost:8000/api/counter.php?action=get"
```

### 2. GitHub Pages Deployment
```bash
# Stage changes
git status
git add .

# Commit with semantic message
git commit -m "feat: Improve atlas UI and fix navigation"

# Push to production
git push origin main

# Verify deployment
curl -I "https://sintomario.org"
```

### 3. Post-Deployment Verification
```bash
# Check site accessibility
curl -s "https://sintomario.org" | grep -i "sintomario"

# Test API endpoint
curl "https://sintomario.org/api/counter.php?action=get"

# Verify sitemap
curl "https://sintomario.org/sitemap.xml"
```

## 📊 Monitoring & Analytics

### GitHub Pages Analytics
- **Built-in**: GitHub traffic analytics
- **Google Analytics**: Optional GA4 integration
- **Search Console**: SEO performance tracking

### Custom Monitoring
```javascript
// Add to index.html for uptime monitoring
fetch('/api/counter.php?action=heartbeat')
  .then(() => console.log('API healthy'))
  .catch(() => console.error('API down'));
```

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 🐛 Troubleshooting

### Common Issues

**404 Errors**
```bash
# Check file exists
ls -la cuerpo/sistema/nervioso/index.html

# Verify case sensitivity
grep -r "nervioso" cuerpo/
```

**API Not Working**
```bash
# Test PHP endpoint
curl -v "https://sintomario.org/api/counter.php"

# Check JSON permissions
ls -la api/counter.json
```

**Images Not Loading**
```bash
# Verify image paths
find . -name "*.png" | head -5

# Check file sizes
du -h layers/PNG/*.png
```

**Performance Issues**
```bash
# Check file sizes
find . -type f -size +1M | head -10

# Optimize images
# Use tools like ImageOptim or TinyPNG
```

## 🔒 Security Considerations

### Current Security
- ✅ HTTPS enforced
- ✅ No sensitive data in frontend
- ✅ API rate limited by design
- ✅ No user authentication required

### Recommendations
- 🔄 Content Security Policy (CSP)
- 🔄 Subresource Integrity (SRI)
- 🔄 X-Frame-Options header
- 🔄 Regular dependency updates

## 📈 Performance Optimization

### Image Optimization
```bash
# Optimize PNG files
# Use tools: ImageOptim, TinyPNG, or squoosh CLI
squoosh-cli layers/PNG/*.png --output layers/PNG/optimized/
```

### Caching Strategy
```html
<!-- Add to HTML headers -->
<meta http-equiv="Cache-Control" content="max-age=31536000">
```

### Compression
```bash
# Enable gzip compression (server configuration)
# GitHub Pages automatically compresses static files
```

## 🚀 Rollback Procedure

### Quick Rollback
```bash
# Reset to previous commit
git log --oneline -5
git reset --hard <previous-commit-hash>
git push --force-with-lease origin main
```

### Full Restore
```bash
# Clone fresh repository
git clone git@github.com:sintomario/SINTOMARIO.ORG.git backup
cd backup

# Restore from backup if needed
cp -r ../backup/* .
git add .
git commit -m "restore: Rollback to stable version"
git push origin main
```

---

**Version**: 1.0  
**Last Updated**: 6 Abr 2026  
**Environment**: Production (GitHub Pages)
