"use client"

import { useState, useEffect } from "react"
import { CheckIcon } from "@heroicons/react/24/solid"

interface SuccessFeedbackProps {
  show: boolean
  message?: string
  onComplete?: () => void
}

export default function SuccessFeedback({ show, message = "Success!", onComplete }: SuccessFeedbackProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="success-animation bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
        <div className="checkmark-grow">
          <CheckIcon className="h-6 w-6" />
        </div>
        <span className="font-medium">{message}</span>
      </div>

      {/* Confetti Effect */}
      <div className="confetti-container">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              backgroundColor: ["#10B981", "#059669", "#047857", "#065F46"][Math.floor(Math.random() * 4)],
            }}
          />
        ))}
      </div>
    </div>
  )
}
