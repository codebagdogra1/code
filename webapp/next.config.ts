import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this folder. The parent repo still has the old static
  // site (and its own lockfile), which would otherwise confuse Turbopack's inference.
  turbopack: {
    root: path.join(__dirname),
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
};

export default nextConfig;
