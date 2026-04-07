export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },
  runtimeConfig: {
    webhookSecret: process.env.ODOO_WEBHOOK_SECRET,
    couponExpiryDays: process.env.COUPON_EXPIRY_DAYS || '30',
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET,
  },
})
