"use client"

import type React from "react"
import { memo } from "react"
import { useVirtualScrolling } from "@/hooks/use-performance"

interface VirtualTableProps<T> {
  data: T[]
  columns: Array<{
    key: string
    label: string
    render?: (item: T) => React.ReactNode
  }>
  itemHeight?: number
  containerHeight?: number
  className?: string
}

const VirtualTable = memo(function VirtualTable<T extends Record<string, any>>({
  data,
  columns,
  itemHeight = 60,
  containerHeight = 400,
  className = "",
}: VirtualTableProps<T>) {
  const { items, totalHeight, offsetY, handleScroll } = useVirtualScrolling(data, itemHeight, containerHeight)

  return (
    <div className={`border border-border/50 rounded-lg overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="flex">
          {columns.map((column) => (
            <div key={column.key} className="flex-1 px-4 py-3 text-sm font-semibold text-foreground">
              {column.label}
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Scrolling Container */}
      <div className="overflow-auto" style={{ height: containerHeight }} onScroll={handleScroll}>
        <div style={{ height: totalHeight, position: "relative" }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="flex border-b border-border/30 hover:bg-muted/50 transition-colors duration-200"
                style={{ height: itemHeight }}
              >
                {columns.map((column) => (
                  <div key={column.key} className="flex-1 px-4 py-3 text-sm text-foreground flex items-center">
                    {column.render ? column.render(item) : item[column.key]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with item count */}
      <div className="bg-muted/20 border-t border-border/50 px-4 py-2">
        <div className="text-xs text-muted-foreground">
          Showing {items.length} of {data.length} items
        </div>
      </div>
    </div>
  )
})

export default VirtualTable
