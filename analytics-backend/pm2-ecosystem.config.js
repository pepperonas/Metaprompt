// PM2 Ecosystem Config für Metaprompt Analytics
// Usage: pm2 start pm2-ecosystem.config.js

module.exports = {
  apps: [{
    name: 'metaprompt-analytics',
    script: 'server.js',
    cwd: '/var/www/html/api/metaprompt',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3030,
    },
    error_file: '/var/log/pm2/metaprompt-analytics-error.log',
    out_file: '/var/log/pm2/metaprompt-analytics-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false,
    max_memory_restart: '500M',
  }]
};
