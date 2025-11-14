module.exports = {
  apps: [{
    name: 'ishk-platform',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/ishk-platform',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/ishk/error.log',
    out_file: '/var/log/ishk/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};





