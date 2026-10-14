import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this folder (the repo root has its own lockfile).
  turbopack: {
    root: path.join(__dirname),
  },

  // Admin image uploads (offers, events, gallery) go through server actions as
  // multipart form data. Images are resized in the browser first, so a single
  // request stays well under this ceiling.
  experimental: {
    serverActions: { bodySizeLimit: "6mb" },
  },

  // The old site was a set of static .html pages. Keep old bookmarks / search
  // results working by mapping them to the new routes (host-agnostic).
  async redirects() {
    return [
      { source: "/admin.html", destination: "/admin", permanent: true },
      { source: "/login.html", destination: "/admin", permanent: true },
      { source: "/course-registration.html", destination: "/courses", permanent: true },
      { source: "/brochure.html", destination: "/brochure", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/old-index.html", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:path*", destination: "/", permanent: true },
      { source: "/coming-soon", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
