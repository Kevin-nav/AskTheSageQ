"use client"

import { useState, useCallback } from "react"

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

interface AsyncOperationOptions {
  retryAttempts?: number
  retryDelay?: number
  onError?: (error: Error) => void
}

export function useAsyncOperation<T, Args extends any[]>(operation: (...args: Args) => Promise<T>, options: AsyncOperationOptions = {}) {
  const { retryAttempts = 3, retryDelay = 1000, onError } = options

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(
    async (attempt: number = 1, ...args: Args): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        console.log(`[v0] Executing async operation, attempt ${attempt}`)
        const result = await operation(...args)
        setState({ data: result, loading: false, error: null })
        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Unknown error")
        console.error(`[v0] Async operation failed, attempt ${attempt}:`, err)

        if (attempt < retryAttempts) {
          console.log(`[v0] Retrying in ${retryDelay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, retryDelay))
          return execute(attempt + 1, ...args)
        }

        setState({ data: null, loading: false, error: err })
        onError?.(err)
        return null
      }
    },
    [operation, retryAttempts, retryDelay, onError],
  )

  const retry = useCallback(() => execute(), [execute])

  return {
    ...state,
    execute,
    retry,
  }
}

// Network connectivity hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true)

  useState(() => {
    const handleOnline = () => {
      console.log("[v0] Network connection restored")
      setIsOnline(true)
    }
    const handleOffline = () => {
      console.log("[v0] Network connection lost")
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  })

  return isOnline
}
