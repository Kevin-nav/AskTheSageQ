"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Database, AlertCircle, FileX, UserX, BookX, Brain } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline"
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon = Database, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <Card className="glass-card border-0 shadow-lg">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        <CardTitle className="text-xl font-semibold text-foreground mb-2">{title}</CardTitle>
        <CardDescription className="text-muted-foreground mb-6 max-w-md">{description}</CardDescription>
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
              className={
                action.variant === "outline"
                  ? "border-primary/20 hover:bg-primary/10 bg-transparent"
                  : "bg-primary hover:bg-primary/90"
              }
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              className="border-primary/20 hover:bg-primary/10 bg-transparent"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Specific empty states for different scenarios
export function NoStudentsFound({
  onAddStudent,
  onClearFilters,
}: { onAddStudent?: () => void; onClearFilters?: () => void }) {
  return (
    <EmptyState
      icon={UserX}
      title="No students found"
      description="There are no students matching your current search criteria. Try adjusting your filters or add a new student."
      action={onAddStudent ? { label: "Add Student", onClick: onAddStudent } : undefined}
      secondaryAction={onClearFilters ? { label: "Clear Filters", onClick: onClearFilters } : undefined}
    />
  )
}

export function NoCoursesFound({
  onAddCourse,
  onClearFilters,
}: { onAddCourse?: () => void; onClearFilters?: () => void }) {
  return (
    <EmptyState
      icon={BookX}
      title="No courses found"
      description="There are no courses matching your search. Try different keywords or create a new course."
      action={onAddCourse ? { label: "Add Course", onClick: onAddCourse } : undefined}
      secondaryAction={onClearFilters ? { label: "Clear Search", onClick: onClearFilters } : undefined}
    />
  )
}

export function NoSearchResults({ searchTerm, onClearSearch }: { searchTerm: string; onClearSearch: () => void }) {
  return (
    <EmptyState
      icon={Search}
      title={`No results for "${searchTerm}"`}
      description="We couldn't find anything matching your search. Try different keywords or check your spelling."
      action={{ label: "Clear Search", onClick: onClearSearch, variant: "outline" }}
    />
  )
}

export function NoDataAvailable({ onRefresh, onRetry }: { onRefresh?: () => void; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={FileX}
      title="No data available"
      description="There's no data to display at the moment. This could be due to a connection issue or the data hasn't been loaded yet."
      action={onRefresh ? { label: "Refresh", onClick: onRefresh } : undefined}
      secondaryAction={onRetry ? { label: "Try Again", onClick: onRetry } : undefined}
    />
  )
}

export function NoBotInteractions({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      icon={Brain}
      title="No bot interactions yet"
      description="No AI interactions have been recorded. Bot analytics will appear here once students start using the learning assistant."
      action={onRefresh ? { label: "Refresh", onClick: onRefresh, variant: "outline" } : undefined}
    />
  )
}

export function ConnectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Connection Error"
      description="Unable to load data due to a network issue. Please check your connection and try again."
      action={{ label: "Try Again", onClick: onRetry }}
    />
  )
}
