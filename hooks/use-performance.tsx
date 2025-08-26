"use client"

import type React from "react"

import { useState } from "react"

import { useCallback, useMemo, useRef, useEffect } from "react"

// Data sampling for large datasets
export function useSampleData<T>(data: T[], maxPoints = 100): T[] {
  return useMemo(() => {
    if (data.length <= maxPoints) return data

    console.log(`[v0] Sampling ${data.length} data points to ${maxPoints}`)

    const step = Math.ceil(data.length / maxPoints)
    const sampled = data.filter((_, index) => index % step === 0)

    // Always include the last data point
    if (sampled[sampled.length - 1] !== data[data.length - 1]) {
      sampled.push(data[data.length - 1])
    }

    console.log(`[v0] Sampled data reduced to ${sampled.length} points`)
    return sampled
  }, [data, maxPoints])
}

// Debounced value hook for search and filtering
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Memory leak prevention for animations
export function useAnimationFrame(callback: () => void, deps: any[] = []) {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      callback()
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }, deps)

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animate])
}

// Intersection Observer for lazy loading
export function useIntersectionObserver(elementRef: React.RefObject<Element>, options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])

  return isIntersecting
}

// Virtual scrolling hook
export function useVirtualScrolling<T>(items: T[], itemHeight: number, containerHeight: number) {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, items.length)

    console.log(`[v0] Virtual scroll: showing items ${startIndex} to ${endIndex} of ${items.length}`)

    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    }
  }, [items, itemHeight, containerHeight, scrollTop])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  return {
    ...visibleItems,
    handleScroll,
  }
}
