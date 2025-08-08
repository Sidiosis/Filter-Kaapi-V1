Filter Kaapi — PWA-ready package
Files included:
- index.pwa.html  (copy this to index.html when publishing)
- manifest.webmanifest
- service-worker.pwa.js
- icon-192.png, icon-512.png (generated from uploaded icon.png)
- screenshot1.png (if provided)

Instructions:
1. Rename index.pwa.html to index.html (or replace your existing index.html with relevant custom changes).
2. Deploy all files to your GitHub Pages branch (usually gh-pages or main).
3. Ensure manifest.webmanifest and icons are at the repo root (same folder as index.html).
4. Test installability at: https://pwabuilder.com/ or in Chrome DevTools > Application > Manifest.
5. If you separate CSS/JS into external files, add them to OFFLINE_URLS in service-worker.pwa.js.
