"use client"

import { useState, useEffect, useCallback } from "react"
import { SecurityUtils } from "@/utils/security"

// Security context hook
export function useSecurity() {
  const [sessionId, setSessionId] = useState<string>("")

  useEffect(() => {
    // Generate session ID
    const session = SecurityUtils.generateSessionId();
    setSessionId(session);

    console.log("[v0] Security context initialized");
  }, []);

  const validateInput = useCallback((input: string, type: "html" | "sql" | "path" = "html") => {
    switch (type) {
      case "html":
        return SecurityUtils.sanitizeHtml(input)
      case "sql":
        return SecurityUtils.sanitizeSql(input)
      case "path":
        return SecurityUtils.sanitizePath(input)
      default:
        return SecurityUtils.sanitizeHtml(input)
    }
  }, [])

  const validateEmail = useCallback((email: string) => {
    return SecurityUtils.validateEmail(email)
  }, [])

  const validatePassword = useCallback((password: string) => {
    return SecurityUtils.validatePassword(password)
  }, [])

  const checkRateLimit = useCallback((identifier: string, limiter: any) => {
    return limiter.isAllowed(identifier)
  }, [])

  return {
    sessionId,
    validateInput,
    validateEmail,
    validatePassword,
    checkRateLimit,
  }
}

// Session management hook
export function useSession(maxAge: number = 30 * 60 * 1000) {
  // 30 minutes default
  const [sessionStart] = useState(Date.now())
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const checkExpiration = () => {
      const expired = SecurityUtils.isSessionExpired(sessionStart, maxAge)
      setIsExpired(expired)
    }

    const interval = setInterval(checkExpiration, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [sessionStart, maxAge])

  const extendSession = useCallback(() => {
    // In a real app, this would make an API call to extend the session
    console.log("[v0] Session extension requested")
  }, [])

  return {
    isExpired,
    extendSession,
    timeRemaining: Math.max(0, maxAge - (Date.now() - sessionStart)),
  }
}
