"use client"

import React, { memo, useMemo, useRef } from "react"
import { ResponsiveContainer } from "recharts"
import { useSampleData, useIntersectionObserver } from "@/hooks/use-performance"

interface OptimizedChartProps {
  data: any[]
  children: React.ReactNode
  maxDataPoints?: number
  height?: number
  className?: string
}

const OptimizedChart = memo(function OptimizedChart({
  data,
  children,
  maxDataPoints = 100,
  height = 320,
  className = "",
}: OptimizedChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const isVisible = useIntersectionObserver(chartRef, {
    threshold: 0.1,
    rootMargin: "50px",
  })

  // Sample data for performance
  const sampledData = useSampleData(data, maxDataPoints)

  // Memoize chart configuration
  const chartConfig = useMemo(() => {
    console.log(`[v0] Chart config updated with ${sampledData.length} data points`)
    return {
      data: sampledData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    }
  }, [sampledData])

  // Only render chart when visible
  if (!isVisible) {
    return (
      <div
        ref={chartRef}
        className={`flex items-center justify-center bg-muted/20 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-sm text-muted-foreground">Loading chart...</div>
      </div>
    )
  }

  return (
    <div ref={chartRef} className={className} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        {React.cloneElement(children as React.ReactElement, chartConfig)}
      </ResponsiveContainer>
    </div>
  )
})

export default OptimizedChart
