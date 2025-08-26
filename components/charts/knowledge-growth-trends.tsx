"use client"

import { useState, useEffect, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { TrendingUp } from "lucide-react"
import OptimizedChart from "./optimized-chart"

// Mock data for knowledge growth trends
const mockData = [
  { month: "Jan", engineering: 65, geology: 58, environmental: 72, processing: 61 },
  { month: "Feb", engineering: 68, geology: 62, environmental: 75, processing: 64 },
  { month: "Mar", engineering: 72, geology: 65, environmental: 78, processing: 68 },
  { month: "Apr", engineering: 75, geology: 69, environmental: 81, processing: 71 },
  { month: "May", engineering: 78, geology: 73, environmental: 84, processing: 75 },
  { month: "Jun", engineering: 82, geology: 76, environmental: 87, processing: 78 },
  { month: "Jul", engineering: 85, geology: 80, environmental: 89, processing: 82 },
  { month: "Aug", engineering: 88, geology: 83, environmental: 92, processing: 85 },
]

const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card border-0 shadow-lg p-3 rounded-lg">
        <p className="text-sm font-medium text-foreground mb-2">{`Month: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}% mastery`}
          </p>
        ))}
      </div>
    )
  }
  return null
})

CustomTooltip.displayName = "CustomTooltip"

const KnowledgeGrowthTrends = memo(() => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
              Knowledge Growth Trends
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              Anonymous subject mastery progression over time
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">+12.3% avg</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <OptimizedChart data={mockData} height={320} maxDataPoints={50}>
          <AreaChart>
            <defs>
              <linearGradient id="engineering" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0D4F3C" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0D4F3C" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="geology" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="environmental" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6EE7B7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6EE7B7" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="processing" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[50, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="engineering"
              name="Mining Engineering"
              stroke="#0D4F3C"
              strokeWidth={2}
              fill="url(#engineering)"
              animationBegin={0}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="geology"
              name="Geological Survey"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#geology)"
              animationBegin={200}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="environmental"
              name="Environmental Impact"
              stroke="#6EE7B7"
              strokeWidth={2}
              fill="url(#environmental)"
              animationBegin={400}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="processing"
              name="Mineral Processing"
              stroke="#34D399"
              strokeWidth={2}
              fill="url(#processing)"
              animationBegin={600}
              animationDuration={1500}
            />
          </AreaChart>
        </OptimizedChart>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {[
            { name: "Mining Engineering", color: "#0D4F3C" },
            { name: "Geological Survey", color: "#10B981" },
            { name: "Environmental Impact", color: "#6EE7B7" },
            { name: "Mineral Processing", color: "#34D399" },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

KnowledgeGrowthTrends.displayName = "KnowledgeGrowthTrends"

export { KnowledgeGrowthTrends }
export default KnowledgeGrowthTrends
