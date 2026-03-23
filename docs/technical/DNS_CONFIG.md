# DNS Configuration for GitHub Pages Verification

## Required TXT Record for Domain Verification

### GitHub Pages Challenge Record
- **Type**: TXT
- **Hostname**: `_github-pages-challenge-sintomario.sintomario.org`
- **Value**: `916cadce3fd23817bdc5ce2093a251`
- **TTL**: 3600 (1 hour) or default

## Complete DNS Configuration for SINTOMARIO.ORG

### A Records (GitHub Pages IPs)
```
Type: A
Name: @ (root)
Value: 185.199.108.153
TTL: 3600

Type: A  
Name: @ (root)
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @ (root)  
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @ (root)
Value: 185.199.111.153
TTL: 3600
```

### CNAME Record (WWW)
```
Type: CNAME
Name: www
Value: sintomario.github.io
TTL: 3600
```

### TXT Record (Verification)
```
Type: TXT
Name: _github-pages-challenge-sintomario
Value: 916cadce3fd23817bdc5ce2093a251
TTL: 3600
```

## Cloudflare Setup Instructions

### 1. Login to Cloudflare Dashboard
- Go to: https://dash.cloudflare.com
- Select domain: sintomario.org

### 2. Add DNS Records
1. Click **DNS** → **Records**
2. Add the 4 A records above
3. Add the CNAME record for www
4. Add the TXT verification record

### 3. Important: Disable Cloudflare Proxy
- For A records: **Click orange cloud** to make it **gray** ☁️
- For CNAME record: **Click orange cloud** to make it **gray** ☁️
- For TXT record: Keep **gray** (DNS-only)

**Why?** GitHub Pages needs direct DNS access for domain verification.

### 4. SSL/TLS Configuration
1. Go to **SSL/TLS** → **Overview**
2. Select **Full (Strict)**
3. Enable **Always Use HTTPS**

### 5. Wait for Propagation
- DNS changes: 5-30 minutes
- TXT verification: Up to 24 hours (usually 1-2 hours)

## Verification Steps

### 1. Check DNS Propagation
```bash
# Check A records
dig sintomario.org

# Check TXT record  
dig TXT _github-pages-challenge-sintomario.sintomario.org

# Windows alternative
nslookup -type=TXT _github-pages-challenge-sintomario.sintomario.org
```

### 2. Verify in GitHub Pages
1. Go to **Settings → Pages**
2. Click **Verify** next to the domain
3. GitHub will check the TXT record

### 3. Enable GitHub Actions
Once domain is verified:
1. **Settings → Pages → Source**
2. Change to **"GitHub Actions"**
3. Workflow will trigger automatically

## Troubleshooting

### If verification fails:
1. Check TXT record value exactly (no extra spaces)
2. Ensure hostname is correct
3. Wait longer for DNS propagation
4. Check Cloudflare proxy is disabled (gray cloud)

### If site doesn't load after verification:
1. Check A records are correct
2. Ensure CNAME points to sintomario.github.io
3. Clear browser cache
4. Check SSL certificate is issued

## Timeline

- **DNS Records**: 5-30 minutes
- **TXT Verification**: 1-24 hours  
- **SSL Certificate**: 1-2 hours after verification
- **First Deploy**: Immediate after GitHub Actions activation

## Final Result

After completion:
- ✅ Domain verified: `https://sintomario.org`
- ✅ HTTPS enabled with valid certificate
- ✅ Automatic deploys from GitHub Actions
- ✅ WWW subdomain redirects to main domain
