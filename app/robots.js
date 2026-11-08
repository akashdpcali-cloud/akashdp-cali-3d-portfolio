const SITE_URL = "https://akashdp.dev";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },

    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
