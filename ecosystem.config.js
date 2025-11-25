/**
 * PM2 Ecosystem Configuration for VPS Deployment
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 * 
 * Environment variables are loaded from .env file using dotenv
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  apps: [{
    name: 'ishk-platform',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: __dirname, // Use absolute path to project directory
    instances: 2, // Use 2 instances for load balancing (adjust based on CPU cores)
    exec_mode: 'cluster',
    env_file: '.env', // Explicitly specify .env file
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // Load environment variables from process.env (loaded by dotenv above)
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      DATABASE_URL: process.env.DATABASE_URL,
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








