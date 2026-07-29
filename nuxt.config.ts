export default defineNuxtConfig({
  compatibilityDate: "2025-01-01",
  future: { compatibilityVersion: 4 },
  routeRules: {
    "/restaurant/**": { ssr: false },
  },
  runtimeConfig: {
    webhookSecret: process.env.ODOO_WEBHOOK_SECRET,
    couponExpiryDays: process.env.COUPON_EXPIRY_DAYS || "30",
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET,
    brevoApiKey: process.env.BREVO_API_KEY,
    emailFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@jalkimaku.fi',
    emailFromName: process.env.EMAIL_FROM_NAME || 'Jälkimaku',
    siteUrl: process.env.SITE_URL || 'https://jalkimaku.fi',
  },
});
