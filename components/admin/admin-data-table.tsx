"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState, NoSearchResults, NoDataAvailable } from "@/components/empty-states"
import { filterDataSafely, sanitizeSearchQuery } from "@/utils/data-validation"

interface Column {
  key: string
  label: string
  render?: (item: any) => React.ReactNode
  sortable?: boolean
}

interface AdminDataTableProps {
  data: any[]
  columns: Column[]
  searchQuery?: string
  searchKeys?: string[]
  itemsPerPage?: number
  onAddNew?: () => void
  onClearFilters?: () => void
  emptyStateTitle?: string
  emptyStateDescription?: string
  loading?: boolean
  error?: string
}

export function AdminDataTable({
  data,
  columns,
  searchQuery = "",
  searchKeys = [],
  itemsPerPage = 10,
  onAddNew,
  onClearFilters,
  emptyStateTitle = "No data available",
  emptyStateDescription = "There's no data to display at the moment.",
  loading = false,
  error,
}: AdminDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data
    return filterDataSafely(data, searchQuery, searchKeys)
  }, [data, searchQuery, searchKeys])

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  if (error) {
    return <NoDataAvailable onRefresh={() => window.location.reload()} onRetry={() => window.location.reload()} />
  }

  if (searchQuery.trim() && filteredData.length === 0 && data.length > 0) {
    return <NoSearchResults searchTerm={sanitizeSearchQuery(searchQuery)} onClearSearch={() => onClearFilters?.()} />
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyStateTitle}
        description={emptyStateDescription}
        action={onAddNew ? { label: "Add New", onClick: onAddNew } : undefined}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-semibold text-foreground ${
                    column.sortable ? "cursor-pointer hover:text-primary transition-colors" : ""
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-primary">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-b border-border/30 hover:bg-muted/50 transition-colors duration-200"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-foreground">
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length}{" "}
            results
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-primary/20 hover:bg-primary/10 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + Math.max(1, currentPage - 2)
              if (page > totalPages) return null

              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={
                    currentPage === page
                      ? "bg-primary hover:bg-primary/90"
                      : "border-primary/20 hover:bg-primary/10 bg-transparent"
                  }
                >
                  {page}
                </Button>
              )
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-primary/20 hover:bg-primary/10 bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDataTable
