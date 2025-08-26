"use client"

import { SecurityUtils } from "./security"

// Data validation utilities
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface StudentData {
  id: string
  name: string
  email: string
  course: string
  year: string
  progress: number
  lastActive: string
  status: string
  gpa: number
}

export interface CourseData {
  id: string
  name: string
  instructor: string
  students: number
  progress: number
  difficulty: string
  status: string
}

// Generic data validator
export function validateData<T>(data: any, schema: Record<string, (value: any) => boolean>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  console.log("[v0] Validating data:", data)

  if (!data || typeof data !== "object") {
    errors.push("Data must be a valid object")
    return { isValid: false, errors, warnings }
  }

  for (const [field, validator] of Object.entries(schema)) {
    if (!data.hasOwnProperty(field)) {
      errors.push(`Missing required field: ${field}`)
      continue
    }

    if (!validator(data[field])) {
      errors.push(`Invalid value for field: ${field}`)
    }
  }

  const isValid = errors.length === 0
  console.log(`[v0] Validation result: ${isValid ? "valid" : "invalid"}, errors: ${errors.length}`)

  return { isValid, errors, warnings }
}

// Student data validation
export function validateStudentData(student: any): ValidationResult {
  const schema = {
    id: (value: any) => typeof value === "string" && value.length > 0,
    name: (value: any) => typeof value === "string" && value.length >= 2,
    email: (value: any) => typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    course: (value: any) => typeof value === "string" && value.length > 0,
    year: (value: any) => typeof value === "string" && value.length > 0,
    progress: (value: any) => typeof value === "number" && value >= 0 && value <= 100,
    status: (value: any) => typeof value === "string" && ["Active", "Inactive"].includes(value),
    gpa: (value: any) => typeof value === "number" && value >= 0 && value <= 4.0,
  }

  const result = validateData(student, schema)

  // Add warnings for edge cases
  if (student.progress < 20) {
    result.warnings.push("Student progress is very low")
  }
  if (student.gpa < 2.0) {
    result.warnings.push("Student GPA is below acceptable threshold")
  }

  return result
}

// Course data validation
export function validateCourseData(course: any): ValidationResult {
  const schema = {
    id: (value: any) => typeof value === "string" && value.length > 0,
    name: (value: any) => typeof value === "string" && value.length >= 3,
    instructor: (value: any) => typeof value === "string" && value.length >= 2,
    students: (value: any) => typeof value === "number" && value >= 0,
    progress: (value: any) => typeof value === "number" && value >= 0 && value <= 100,
    difficulty: (value: any) => typeof value === "string" && ["Beginner", "Intermediate", "Advanced"].includes(value),
    status: (value: any) => typeof value === "string" && ["Active", "Inactive", "Draft"].includes(value),
  }

  const result = validateData(course, schema)

  // Add warnings for edge cases
  if (course.students === 0) {
    result.warnings.push("Course has no enrolled students")
  }
  if (course.progress < 10) {
    result.warnings.push("Course progress is very low")
  }

  return result
}

// API response validation
export function validateApiResponse(response: any, expectedFields: string[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  console.log("[v0] Validating API response:", response)

  if (!response) {
    errors.push("Response is null or undefined")
    return { isValid: false, errors, warnings }
  }

  if (response.error) {
    errors.push(`API Error: ${response.error}`)
  }

  if (Array.isArray(response.data)) {
    if (response.data.length === 0) {
      warnings.push("Response contains no data")
    }
  } else if (response.data && typeof response.data === "object") {
    for (const field of expectedFields) {
      if (!response.data.hasOwnProperty(field)) {
        warnings.push(`Missing expected field: ${field}`)
      }
    }
  }

  const isValid = errors.length === 0
  console.log(`[v0] API validation result: ${isValid ? "valid" : "invalid"}`)

  return { isValid, errors, warnings }
}

// Batch data validation
export function validateBatchData<T>(
  dataArray: any[],
  validator: (item: any) => ValidationResult,
): {
  validItems: T[]
  invalidItems: { item: any; errors: string[] }[]
  totalWarnings: string[]
} {
  const validItems: T[] = []
  const invalidItems: { item: any; errors: string[] }[] = []
  const totalWarnings: string[] = []

  console.log(`[v0] Validating batch of ${dataArray.length} items`)

  dataArray.forEach((item, index) => {
    const result = validator(item)

    if (result.isValid) {
      validItems.push(item as T)
    } else {
      invalidItems.push({ item, errors: result.errors })
      console.log(`[v0] Invalid item at index ${index}:`, result.errors)
    }

    totalWarnings.push(...result.warnings)
  })

  console.log(`[v0] Batch validation complete: ${validItems.length} valid, ${invalidItems.length} invalid`)

  return { validItems, invalidItems, totalWarnings }
}

export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== "string") return ""

  console.log("[v0] Sanitizing search query with security checks")

  // First apply security sanitization
  let sanitized = SecurityUtils.sanitizeHtml(query)

  // Then apply SQL injection protection
  sanitized = SecurityUtils.sanitizeSql(sanitized)

  // Remove potentially harmful characters and limit length
  sanitized = sanitized
    .replace(/[<>"'&]/g, "") // Remove HTML/script injection characters
    .trim()
    .slice(0, 100) // Limit to 100 characters

  // Additional security: remove script tags and event handlers
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/javascript:/gi, "")

  return sanitized
}

export function filterDataSafely<T>(data: T[], searchQuery: string, searchKeys: (keyof T)[]): T[] {
  if (!searchQuery.trim()) return data

  const sanitizedQuery = sanitizeSearchQuery(searchQuery).toLowerCase()

  // Security check: reject if query is too short after sanitization
  if (sanitizedQuery.length < 1) {
    console.log("[v0] Search query rejected after sanitization")
    return data
  }

  return data.filter((item) =>
    searchKeys.some((key) => {
      const value = item[key]
      if (!value) return false

      // Sanitize the data value as well for comparison
      const sanitizedValue = SecurityUtils.sanitizeHtml(value.toString()).toLowerCase()
      return sanitizedValue.includes(sanitizedQuery)
    }),
  )
}
