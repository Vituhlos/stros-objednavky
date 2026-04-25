import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  serverExternalPackages: ["better-sqlite3", "pdf-parse", "nodemailer", "pdfkit"],
};

export default nextConfig;
