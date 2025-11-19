/**
 * PM2 Ecosystem Configuration for VPS Deployment
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 * 
 * Environment variables should be set in .env file or system environment
 * PM2 will automatically load .env from the project root
 */

module.exports = {
  apps: [{
    name: 'ishk-platform',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: process.cwd(), // Use current working directory (works for any path)
    instances: 2, // Use 2 instances for load balancing (adjust based on CPU cores)
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logging configuration
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // Auto-restart configuration
    autorestart: true,
    watch: false, // Disable file watching in production
    max_memory_restart: '1G', // Restart if memory exceeds 1GB
    // Advanced options
    min_uptime: '10s', // Minimum uptime before considering app stable
    max_restarts: 10, // Maximum restarts within min_uptime
    restart_delay: 4000, // Delay between restarts
    // Graceful shutdown
    kill_timeout: 5000, // Time to wait for graceful shutdown
    listen_timeout: 10000, // Time to wait for app to start listening
  }]
};








