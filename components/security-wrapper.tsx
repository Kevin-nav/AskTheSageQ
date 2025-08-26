"use client"

import type React from "react"
import { useEffect } from "react"

interface SecurityWrapperProps {
  children: React.ReactNode
}

export function SecurityWrapper({ children }: SecurityWrapperProps) {
  useEffect(() => {
    console.log("[v0] Security wrapper initialized")
  }, [])

  return <>{children}</>
}
