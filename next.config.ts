import { withPayload } from "@payloadcms/next/withPayload"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // `next dev` refuses its own scripts to any host but localhost. This lets a
  // Cloudflare quick tunnel (`cloudflared tunnel --url http://127.0.0.1:3010`)
  // show the site to a phone or a colleague. Dev only; production ignores it.
  allowedDevOrigins: ["*.trycloudflare.com"],
  images: {
    // Media is served straight from the Vercel Blob store, not through Payload.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
