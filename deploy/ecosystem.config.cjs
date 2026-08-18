// PM2 process definition for greighstudios.com.
// Runtime secrets (SMTP, etc.) come from .env.production, which Next.js loads
// automatically in production — they are intentionally NOT listed here.
module.exports = {
  apps: [
    {
      name: "greigh-studios",
      cwd: "/var/www/greighstudios.com",
      script: "node_modules/next/dist/bin/next",
      // -H is load-bearing: `next start` reads HOSTNAME, not HOST, so the env
      // block below was never binding this to loopback — ss showed it on
      // *:3010. Only ufw's default-deny was keeping it off the internet.
      args: "start -p 3010 -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3010,
        HOSTNAME: "127.0.0.1",
        TZ: "America/New_York",
      },
      error_file: "/var/www/greighstudios.com/logs/err.log",
      out_file: "/var/www/greighstudios.com/logs/out.log",
      merge_logs: true,
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      kill_timeout: 5000,
      max_restarts: 10,
      min_uptime: "20s",
    },
  ],
};
