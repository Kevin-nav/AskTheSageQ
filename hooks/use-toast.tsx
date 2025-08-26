"use client"

import { useState, useCallback } from "react"

export interface ToastData {
  id: string
  title?: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }

    console.log("[v0] Adding toast:", newToast)
    setToasts((prev) => [...prev, newToast])

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    console.log("[v0] Removing toast:", id)
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (title: string, description?: string) => {
      return addToast({ title, description, type: "success" })
    },
    [addToast],
  )

  const error = useCallback(
    (title: string, description?: string) => {
      return addToast({ title, description, type: "error" })
    },
    [addToast],
  )

  const warning = useCallback(
    (title: string, description?: string) => {
      return addToast({ title, description, type: "warning" })
    },
    [addToast],
  )

  const info = useCallback(
    (title: string, description?: string) => {
      return addToast({ title, description, type: "info" })
    },
    [addToast],
  )

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
