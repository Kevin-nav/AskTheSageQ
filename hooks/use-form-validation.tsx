"use client"

import { useState, useCallback } from "react"

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  min?: number
  max?: number
}

export interface ValidationSchema {
  [key: string]: ValidationRule
}

export interface FormErrors {
  [key: string]: string
}

export interface FormTouched {
  [key: string]: boolean
}

export function useFormValidation<T extends Record<string, any>>(initialValues: T, validationSchema: ValidationSchema) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<FormTouched>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback(
    (name: string, value: any): string => {
      const rule = validationSchema[name]
      if (!rule) return ""

      console.log(`[v0] Validating field ${name} with value:`, value)

      // Required validation
      if (rule.required && (!value || (typeof value === "string" && !value.trim()))) {
        return `${name} is required`
      }

      // Skip other validations if field is empty and not required
      if (!value && !rule.required) return ""

      // String validations
      if (typeof value === "string") {
        if (rule.minLength && value.length < rule.minLength) {
          return `${name} must be at least ${rule.minLength} characters`
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          return `${name} must be no more than ${rule.maxLength} characters`
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          return `${name} format is invalid`
        }
      }

      // Number validations
      if (typeof value === "number") {
        if (rule.min !== undefined && value < rule.min) {
          return `${name} must be at least ${rule.min}`
        }
        if (rule.max !== undefined && value > rule.max) {
          return `${name} must be no more than ${rule.max}`
        }
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(value)
        if (customError) return customError
      }

      return ""
    },
    [validationSchema],
  )

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    console.log("[v0] Validating entire form")

    for (const [name, value] of Object.entries(values)) {
      const error = validateField(name, value)
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    }

    setErrors(newErrors)
    console.log(`[v0] Form validation result: ${isValid ? "valid" : "invalid"}`)
    return isValid
  }, [values, validateField])

  const handleChange = useCallback(
    (name: string, value: any) => {
      setValues((prev) => ({ ...prev, [name]: value }))

      // Validate field if it's been touched
      if (touched[name]) {
        const error = validateField(name, value)
        setErrors((prev) => ({ ...prev, [name]: error }))
      }
    },
    [touched, validateField],
  )

  const handleBlur = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }))
      const error = validateField(name, values[name])
      setErrors((prev) => ({ ...prev, [name]: error }))
    },
    [values, validateField],
  )

  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void> | void) => {
      console.log("[v0] Form submission started")
      setIsSubmitting(true)

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {} as FormTouched)
      setTouched(allTouched)

      if (validateForm()) {
        try {
          await onSubmit(values)
          console.log("[v0] Form submitted successfully")
        } catch (error) {
          console.error("[v0] Form submission error:", error)
          throw error
        }
      } else {
        console.log("[v0] Form submission blocked due to validation errors")
      }

      setIsSubmitting(false)
    },
    [values, validateForm],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const isValid = Object.keys(errors).length === 0 && Object.keys(touched).length > 0

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    validateForm,
    reset,
  }
}
