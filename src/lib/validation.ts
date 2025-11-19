/**
 * Input validation and sanitization utilities
 */

/**
 * Sanitize string to prevent XSS attacks
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

/**
 * Validate and sanitize email
 */
export function validateAndSanitizeEmail(email: unknown): string | null {
  if (typeof email !== "string") return null;
  const trimmed = email.trim().toLowerCase();
  return isValidEmail(trimmed) ? trimmed : null;
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (typeof password !== "string") {
    return { valid: false, error: "Password must be a string" };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }
  if (password.length > 128) {
    return { valid: false, error: "Password must be less than 128 characters" };
  }
  return { valid: true };
}

/**
 * Validate and parse numeric value
 */
export function validateNumber(
  value: unknown,
  options: { min?: number; max?: number; required?: boolean } = {}
): number | null {
  if (value === null || value === undefined) {
    return options.required ? null : 0;
  }
  
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  
  if (isNaN(num)) {
    return options.required ? null : 0;
  }
  
  if (options.min !== undefined && num < options.min) {
    return null;
  }
  
  if (options.max !== undefined && num > options.max) {
    return null;
  }
  
  return num;
}

/**
 * Validate and parse integer
 */
export function validateInteger(
  value: unknown,
  options: { min?: number; max?: number; required?: boolean } = {}
): number | null {
  const num = validateNumber(value, options);
  if (num === null) return null;
  return Number.isInteger(num) ? num : Math.floor(num);
}

/**
 * Validate required fields
 */
export function validateRequired<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[]
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const field of fields) {
    const value = data[field];
    if (value === null || value === undefined || value === "") {
      missing.push(String(field));
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Sanitize HTML content for safe display
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== "string") return "";
  // Basic HTML sanitization - for production, consider using a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (typeof url !== "string") return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validate phone number (basic validation)
 */
export function isValidPhone(phone: string): boolean {
  if (typeof phone !== "string") return false;
  // Basic phone validation - allows international format
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.trim());
}


