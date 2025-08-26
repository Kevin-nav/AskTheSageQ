"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "email" | "password" | "number" | "textarea"
  placeholder?: string
  value: any
  error?: string
  touched?: boolean
  required?: boolean
  disabled?: boolean
  onChange: (name: string, value: any) => void
  onBlur: (name: string) => void
  className?: string
  icon?: React.ReactNode
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  error,
  touched,
  required,
  disabled,
  onChange,
  onBlur,
  className,
  icon,
}: FormFieldProps) {
  const hasError = touched && error

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = type === "number" ? Number(e.target.value) : e.target.value
    onChange(name, newValue)
  }

  const handleBlur = () => {
    onBlur(name)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">{icon}</div>}

        {type === "textarea" ? (
          <Textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={cn(
              "bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300",
              hasError && "border-destructive focus:border-destructive focus:ring-destructive/20",
              icon && "pl-10",
            )}
            rows={3}
          />
        ) : (
          <Input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={cn(
              "h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300",
              hasError && "border-destructive focus:border-destructive focus:ring-destructive/20",
              icon && "pl-10",
            )}
          />
        )}

        {hasError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
        )}
      </div>

      {hasError && (
        <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  )
}
