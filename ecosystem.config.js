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
const fs = require('fs');

// Load .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Read .env file and parse all variables
const envPath = path.join(__dirname, '.env');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    // Skip comments and empty lines
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const equalIndex = trimmedLine.indexOf('=');
      if (equalIndex > 0) {
        const key = trimmedLine.substring(0, equalIndex).trim();
        const value = trimmedLine.substring(equalIndex + 1).trim();
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, '');
        envVars[key] = cleanValue;
      }
    }
  });
}

// Merge with process.env (process.env takes precedence)
const finalEnv = { ...envVars, ...process.env };

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
      // Load all environment variables from .env file
      ...finalEnv,
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








