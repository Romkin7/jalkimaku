export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },
  routeRules: {
    '/restaurant/**': { ssr: false },
  },
  runtimeConfig: {
    webhookSecret: process.env.ODOO_WEBHOOK_SECRET,
    couponExpiryDays: process.env.COUPON_EXPIRY_DAYS || '30',
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET,
  },
  nitro: {
    rollupConfig: {
      plugins: [
        {
          name: 'stub-native-node-addons',
          resolveId(id: string) {
            const MONGODB_OPTIONAL_DEPS = new Set([
              'socks', 'aws4', 'kerberos', 'snappy',
              'gcp-metadata', 'mongodb-client-encryption', '@mongodb-js/zstd',
            ])
            if (id.endsWith('.node') || MONGODB_OPTIONAL_DEPS.has(id)) return '\0node-native-stub'
          },
          load(id: string) {
            if (id === '\0node-native-stub') return 'module.exports = {}'
          },
        },
      ],
    },
  },
})
