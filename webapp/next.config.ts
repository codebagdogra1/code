import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this folder. The parent repo still has the old static
  // site (and its own lockfile), which would otherwise confuse Turbopack's inference.
  turbopack: {
    root: path.join(__dirname),
  },

  // This app has two root layouts (route groups (edu) and (main)), so there is no
  // single layout to compose a 404 from. `global-not-found` handles unmatched URLs
  // app-wide with its own <html>/<body> — we render the EduSmart 404 mirror there.
  experimental: {
    globalNotFound: true,
  },

  // The old site was a set of static .html pages at the root. Keep any existing
  // bookmarks / external links working by mapping them to the new app routes.
  // (Works on Netlify and Vercel alike — no _redirects file needed.)
  async redirects() {
    return [
      { source: "/admin.html", destination: "/admin", permanent: true },
      { source: "/login.html", destination: "/admin/login", permanent: true },
      // The public site no longer self-registers students (admin-only now) — send
      // the old registration URL to the course listing instead.
      { source: "/course-registration.html", destination: "/courses", permanent: true },
      { source: "/brochure.html", destination: "/brochure", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/old-index.html", destination: "/", permanent: true },
    ];
  },

  // The homepage is now a real React route (src/app/(edu)/page.tsx): the
  // EduSmart page ported into components/snippets, with its CSS/JS/image/font
  // asset graph still served from /home/assets/... The old static-mirror rewrite
  // (/, -> /home/index.html) has been removed so "/" is rendered by the app.
};

export default nextConfig;
