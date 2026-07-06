module.exports = {
  apps: [
    {
      name: "JALKIMAKU-SERVER",
      script: ".output/server/index.mjs",
      interpreter: "node",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: 3000,
        NITRO_HOST: "127.0.0.1",
        NITRO_PORT: 3000,
        ADMIN_USERNAME: "jalkimaku_admin",
        ADMIN_PASSWORD: "Jalkimaku2026!",
        SESSION_SECRET:
          "50f2090cf42b4f6d02ec2a857a3192f76bd738e154dde367c0ac0342a3fc1d62",
        ODOO_WEBHOOK_SECRET:
          "92b8c47b02572303c54692202630b8fc0150966ec139026f107e800541a8efa8",
        COUPON_EXPIRY_DAYS: 30,
        DB_USER: "jalkimakufi_db_user",
        DB_PASSWORD: "gjJixNLgcBtS4oPT",
        MONGO_URI:
          "mongodb+srv://jalkimakufi_db_user:gjJixNLgcBtS4oPT@jalkimaku.atsghiz.mongodb.net/jalkimaku?appName=jalkimaku",
      },
    },
  ],
};
