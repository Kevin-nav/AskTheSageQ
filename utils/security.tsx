"use client"

// Security utilities for input sanitization and protection
export class SecurityUtils {
  // XSS Protection - HTML sanitization
  static sanitizeHtml(input: string): string {
    if (!input || typeof input !== "string") return ""

    console.log("[v0] Sanitizing HTML input")

    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
  }

  // Helper to escape characters for RegExp
  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  // SQL Injection Protection - Basic sanitization
  static sanitizeSql(input: string): string {
    if (!input || typeof input !== "string") return ""

    console.log("[v0] Sanitizing SQL input")

    const dangerous = [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE",
      "DROP",
      "CREATE",
      "ALTER",
      "EXEC",
      "EXECUTE",
      "UNION",
      "SCRIPT",
      "JAVASCRIPT",
      "VBSCRIPT",
      "--",
      "/*",
      "*/",
      ";",
      "'",
      '"',
      "=",
      "<",
      ">",
      "OR",
      "AND",
    ]

    let sanitized = input
    dangerous.forEach((keyword) => {
      const regex = new RegExp(this.escapeRegExp(keyword), "gi")
      sanitized = sanitized.replace(regex, "")
    })

    return sanitized.trim()
  }

  // Path Traversal Protection
  static sanitizePath(input: string): string {
    if (!input || typeof input !== "string") return ""

    console.log("[v0] Sanitizing file path")

    return input
      .replace(/\.\./g, "")
      .replace(/\\/g, "")
      .replace(/\//g, "")
      .replace(/:/g, "")
      .replace(/\*/g, "")
      .replace(/\?/g, "")
      .replace(/"/g, "")
      .replace(/</g, "")
      .replace(/>/g, "")
      .replace(/\|/g, "")
  }

  // Email validation with security checks
  static validateEmail(email: string): { isValid: boolean; sanitized: string; errors: string[] } {
    const errors: string[] = []

    if (!email || typeof email !== "string") {
      errors.push("Email is required")
      return { isValid: false, sanitized: "", errors }
    }

    // Basic sanitization
    const sanitized = email.toLowerCase().trim()

    // Length check
    if (sanitized.length > 254) {
      errors.push("Email is too long")
    }

    // Format validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    if (!emailRegex.test(sanitized)) {
      errors.push("Invalid email format")
    }

    // Security checks
    if (sanitized.includes("..")) {
      errors.push("Email contains invalid characters")
    }

    console.log(`[v0] Email validation: ${errors.length === 0 ? "valid" : "invalid"}`)

    return {
      isValid: errors.length === 0,
      sanitized,
      errors,
    }
  }

  // Password strength validation
  static validatePassword(password: string): {
    isValid: boolean
    strength: "weak" | "medium" | "strong"
    errors: string[]
    suggestions: string[]
  } {
    const errors: string[] = []
    const suggestions: string[] = []

    if (!password || typeof password !== "string") {
      errors.push("Password is required")
      return { isValid: false, strength: "weak", errors, suggestions }
    }

    let score = 0

    // Length check
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    } else if (password.length >= 12) {
      score += 2
    } else {
      score += 1
    }

    // Character variety checks
    if (!/[a-z]/.test(password)) {
      suggestions.push("Add lowercase letters")
    } else {
      score += 1
    }

    if (!/[A-Z]/.test(password)) {
      suggestions.push("Add uppercase letters")
    } else {
      score += 1
    }

    if (!/[0-9]/.test(password)) {
      suggestions.push("Add numbers")
    } else {
      score += 1
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      suggestions.push("Add special characters")
    } else {
      score += 1
    }

    // Common password check
    const commonPasswords = [
      "password",
      "123456",
      "password123",
      "admin",
      "qwerty",
      "letmein",
      "welcome",
      "monkey",
      "dragon",
    ]
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common")
      score = 0
    }

    const strength = score >= 5 ? "strong" : score >= 3 ? "medium" : "weak"

    console.log(`[v0] Password validation: strength=${strength}, score=${score}`)

    return {
      isValid: errors.length === 0 && score >= 3,
      strength,
      errors,
      suggestions,
    }
  }

  // Rate limiting utility
  static createRateLimiter(maxRequests: number, windowMs: number) {
    const requests = new Map<string, number[]>()

    return {
      isAllowed: (identifier: string): boolean => {
        const now = Date.now()
        const windowStart = now - windowMs

        // Get existing requests for this identifier
        const userRequests = requests.get(identifier) || []

        // Filter out old requests
        const recentRequests = userRequests.filter((time) => time > windowStart)

        // Check if limit exceeded
        if (recentRequests.length >= maxRequests) {
          console.log(`[v0] Rate limit exceeded for ${identifier}`)
          return false
        }

        // Add current request
        recentRequests.push(now)
        requests.set(identifier, recentRequests)

        console.log(`[v0] Rate limit check: ${recentRequests.length}/${maxRequests} for ${identifier}`)
        return true
      },

      getRemainingRequests: (identifier: string): number => {
        const now = Date.now()
        const windowStart = now - windowMs
        const userRequests = requests.get(identifier) || []
        const recentRequests = userRequests.filter((time) => time > windowStart)
        return Math.max(0, maxRequests - recentRequests.length)
      },
    }
  }

  

  // Content Security Policy helpers
  static generateNonce(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  }

  // Secure headers configuration
  static getSecurityHeaders(): Record<string, string> {
    const nonce = this.generateNonce()

    return {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Content-Security-Policy": `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        font-src 'self';
        connect-src 'self';
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
      `
        .replace(/\s+/g, " ")
        .trim(),
    }
  }

  // Session security utilities
  static generateSessionId(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  static isSessionExpired(sessionStart: number, maxAge: number): boolean {
    const now = Date.now()
    const expired = now - sessionStart > maxAge

    if (expired) {
      console.log("[v0] Session expired")
    }

    return expired
  }

  // Input length validation
  static validateInputLength(
    input: string,
    maxLength: number,
    fieldName: string,
  ): { isValid: boolean; error?: string } {
    if (!input || typeof input !== "string") {
      return { isValid: true } // Allow empty inputs, handle required validation elsewhere
    }

    if (input.length > maxLength) {
      console.log(`[v0] Input too long: ${fieldName} (${input.length}/${maxLength})`)
      return {
        isValid: false,
        error: `${fieldName} must be no more than ${maxLength} characters`,
      }
    }

    return { isValid: true }
  }

  // File upload security
  static validateFileUpload(
    file: File,
    allowedTypes: string[],
    maxSize: number,
  ): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    // File type validation
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`)
    }

    // File size validation
    if (file.size > maxSize) {
      errors.push(`File size ${file.size} exceeds maximum ${maxSize} bytes`)
    }

    // File name validation
    const sanitizedName = this.sanitizePath(file.name)
    if (sanitizedName !== file.name) {
      errors.push("File name contains invalid characters")
    }

    console.log(`[v0] File upload validation: ${errors.length === 0 ? "valid" : "invalid"}`)

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

// Rate limiters for different operations
export const loginRateLimiter = SecurityUtils.createRateLimiter(5, 15 * 60 * 1000) // 5 attempts per 15 minutes
export const apiRateLimiter = SecurityUtils.createRateLimiter(100, 60 * 1000) // 100 requests per minute
export const searchRateLimiter = SecurityUtils.createRateLimiter(30, 60 * 1000) // 30 searches per minute