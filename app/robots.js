const SITE_URL = "https://akashdp-cali-3d-portfolio.vercel.app";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },

    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
