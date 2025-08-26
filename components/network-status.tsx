"use client"

import { useNetworkStatus } from "@/hooks/use-async-operation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff } from "lucide-react"

export function NetworkStatus() {
  const isOnline = useNetworkStatus()

  if (isOnline) return null

  return (
    <Alert className="fixed top-4 right-4 z-50 w-auto border-destructive/20 bg-destructive/10">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center gap-2">
        <span>No internet connection</span>
        <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
      </AlertDescription>
    </Alert>
  )
}
