/**
 * Email utility functions using Brevo SMTP
 * Centralized email sending functionality
 */

import nodemailer from "nodemailer";
import { sanitizeString } from "./validation";

// Brevo SMTP configuration
const smtpConfig = {
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_USER || "9cc0b2001@smtp-brevo.com",
    pass: process.env.BREVO_SMTP_PASSWORD || "",
  },
  // Add connection timeout and other options
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
  logger: process.env.NODE_ENV === "development",
};

// Create transporter only if password is configured
let transporter: nodemailer.Transporter | null = null;

// Initialize transporter - check both pass and that it's not empty string
if (smtpConfig.auth.pass && smtpConfig.auth.pass.trim().length > 0) {
  try {
    transporter = nodemailer.createTransport(smtpConfig);
    
    // Verify connection
    transporter.verify(function (error, success) {
      if (error) {
        console.error("❌ SMTP connection verification failed:", error);
      } else if (process.env.NODE_ENV === "development") {
        console.log("✅ Brevo SMTP transporter initialized and verified");
        console.log("   Host:", smtpConfig.host);
        console.log("   Port:", smtpConfig.port);
        console.log("   User:", smtpConfig.auth.user);
      }
    });
    
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Brevo SMTP transporter initialized");
      console.log("   Host:", smtpConfig.host);
      console.log("   Port:", smtpConfig.port);
      console.log("   User:", smtpConfig.auth.user);
      console.log("   Password:", smtpConfig.auth.pass ? "***SET***" : "NOT SET");
    }
  } catch (error) {
    console.error("❌ Failed to create SMTP transporter:", error);
    transporter = null;
  }
} else {
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
    console.error("❌ Brevo SMTP password not configured. Emails will not be sent.");
    console.error("   Please set BREVO_SMTP_PASSWORD in your .env file");
    console.error("   Current value:", process.env.BREVO_SMTP_PASSWORD ? "EXISTS BUT EMPTY" : "NOT SET");
  }
}

/**
 * Get sender information from environment variables
 */
function getSender() {
  return {
    email: process.env.BREVO_SENDER_EMAIL || "noreply@ishk.com",
    name: process.env.BREVO_SENDER_NAME || "Ishk",
  };
}

/**
 * Send an email using Brevo SMTP
 * Returns true if email was sent successfully
 */
export async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: { email: string; name: string };
}): Promise<boolean> {
  if (!transporter) {
    if (process.env.NODE_ENV === "development") {
      console.error("❌ Brevo SMTP not configured. Emails will not be sent.");
      console.error("   Missing BREVO_SMTP_PASSWORD in .env file");
      console.error("   Current BREVO_SMTP_USER:", process.env.BREVO_SMTP_USER || "not set");
    }
    return false;
  }

  try {
    const sender = options.from || getSender();
    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    if (process.env.NODE_ENV === "development") {
      console.log("📧 Attempting to send email:");
      console.log("   From:", `${sender.name} <${sender.email}>`);
      console.log("   To:", recipients.join(", "));
      console.log("   Subject:", options.subject);
    }

    const mailOptions = {
      from: `"${sender.name}" <${sender.email}>`,
      to: recipients.map((email) => email.trim().toLowerCase()).join(", "),
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""), // Fallback to plain text from HTML
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === "development") {
      console.log("✅ Email sent successfully!");
      console.log("   Message ID:", info.messageId);
      console.log("   Response:", info.response);
      if (info.accepted && info.accepted.length > 0) {
        console.log("   Accepted:", info.accepted);
      }
      if (info.rejected && info.rejected.length > 0) {
        console.log("   Rejected:", info.rejected);
      }
    }

    return true;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("❌ Error sending email:");
      if (error instanceof Error) {
        console.error("   Message:", error.message);
        console.error("   Code:", (error as any).code);
        console.error("   Command:", (error as any).command);
        if (error.stack) {
          console.error("   Stack:", error.stack);
        }
      } else {
        console.error("   Error:", error);
      }
    }
    return false;
  }
}

/**
 * Check if Brevo SMTP is configured
 */
export function isEmailConfigured(): boolean {
  const hasPassword = !!(smtpConfig.auth.pass && smtpConfig.auth.pass.trim().length > 0);
  const hasTransporter = transporter !== null;
  
  if (process.env.NODE_ENV === "development") {
    if (!hasPassword) {
      console.error("❌ isEmailConfigured: No password");
    }
    if (!hasTransporter) {
      console.error("❌ isEmailConfigured: No transporter");
    }
  }
  
  return hasTransporter && hasPassword;
}

