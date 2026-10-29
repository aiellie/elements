import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/ui", destination: "/design", permanent: true },
      { source: "/ui/:name", destination: "/design/:name", permanent: true },
      // Moved to the design page once they stopped counting as AI components.
      {
        source:
          "/components/:name(menu|meter|status|toast|toolbar|tooltip-icon-button)",
        destination: "/design/:name",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
