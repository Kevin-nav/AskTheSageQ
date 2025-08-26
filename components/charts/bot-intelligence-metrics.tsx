"use client"

import { useState, useEffect, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"
import { Brain, Zap } from "lucide-react"
import OptimizedChart from "./optimized-chart"

// Mock data for bot intelligence metrics
const mockData = [
  { metric: "Adaptation Success", value: 94.2, target: 90 },
  { metric: "Learning Velocity", value: 87.8, target: 85 },
  { metric: "Content Relevance", value: 91.5, target: 88 },
  { metric: "Response Accuracy", value: 96.1, target: 92 },
  { metric: "Engagement Rate", value: 89.3, target: 85 },
  { metric: "Knowledge Retention", value: 93.7, target: 90 },
]

const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="glass-card border-0 shadow-lg p-3 rounded-lg">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        <p className="text-sm text-accent">Current: {data.value}%</p>
        <p className="text-sm text-muted-foreground">Target: {data.target}%</p>
        <p className="text-xs text-accent mt-1">{data.value >= data.target ? "✓ Above target" : "⚠ Below target"}</p>
      </div>
    )
  }
  return null
})

CustomTooltip.displayName = "CustomTooltip"

const BotIntelligenceMetrics = memo(() => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const getBarColor = (value: number, target: number) => {
    return value >= target ? "#10B981" : "#6EE7B7"
  }

  return (
    <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              Bot Intelligence Metrics
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Algorithm performance and adaptation capabilities
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Powered</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <OptimizedChart data={mockData} height={320} maxDataPoints={20}>
          <BarChart barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="metric"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[75, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1200}>
              {mockData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.value, entry.target)}
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    animationDelay: `${index * 100}ms`,
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </OptimizedChart>

        {/* Performance Summary */}
        <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Performance Summary</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Metrics Above Target:</span>
              <span className="ml-2 font-medium text-accent">
                {mockData.filter((item) => item.value >= item.target).length}/{mockData.length}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Average Performance:</span>
              <span className="ml-2 font-medium text-accent">
                {(mockData.reduce((acc, item) => acc + item.value, 0) / mockData.length).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

BotIntelligenceMetrics.displayName = "BotIntelligenceMetrics"

export { BotIntelligenceMetrics }
export default BotIntelligenceMetrics
