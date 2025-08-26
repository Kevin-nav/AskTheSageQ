"use client"

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import KnowledgeGrowthTrends from "@/components/charts/knowledge-growth-trends"
import BotIntelligenceMetrics from "@/components/charts/bot-intelligence-metrics"
import {
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  MessageSquare,
  Activity,
  Target,
  Menu,
  X,
  ExternalLink,
  Github,
  Mail,
} from "lucide-react"
import { useAsyncOperation } from "@/hooks/use-async-operation"
import { api } from "@/lib/api"
import { StatCardSkeleton } from "@/components/loading-states"

interface PublicStats {
  total_students: number
  active_courses: number
  completion_rate_percent: number
  avg_session_minutes: number
  total_interactions: number
  success_rate_percent: number
}

interface PublicRecentActivityItem {
  course_name: string
  active_students: number
  trend_percent: string
}

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const {
    execute: fetchPublicStats,
    data: stats,
    loading: statsLoading,
    error: statsError,
  } = useAsyncOperation<PublicStats>(useCallback(() => api.get("/public/stats"), []));

  const {
    execute: fetchRecentActivity,
    data: recentActivity,
    loading: activityLoading,
    error: activityError,
  } = useAsyncOperation<PublicRecentActivityItem[]>(useCallback(() => api.get("/public/recent-activity"), []));

  useEffect(() => {
    setIsLoaded(true)
    fetchPublicStats()
    fetchRecentActivity()
  }, [fetchPublicStats, fetchRecentActivity])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-lg text-foreground">AskTheSageQuizzer</h1>
                  <p className="text-xs text-muted-foreground -mt-1">UMaT Analytics</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <a href="#dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Dashboard
              </a>
              <a
                href="#analytics"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Analytics
              </a>
              <a
                href="#reports"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Reports
              </a>
              <Button asChild variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10 bg-transparent">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border/50">
              <div className="flex flex-col space-y-3">
                <a
                  href="#dashboard"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </a>
                <a
                  href="#analytics"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Analytics
                </a>
                <a
                  href="#reports"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Reports
                </a>
                <Button asChild
                  variant="outline"
                  size="sm"
                  className="border-primary/20 hover:bg-primary/10 w-fit bg-transparent"
                >
                  <Link href="/contact">Contact</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden" id="dashboard">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
        {/* Floating background elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className={`text-center space-y-6 ${isLoaded ? "fade-in-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all duration-300 cursor-pointer">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">Live Analytics Dashboard</span>
              <div className="w-2 h-2 bg-primary rounded-full pulse-glow" />
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              AskTheSageQuizzer UMaT Learning
              <span className="block text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
                Analytics Platform
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Real-time insights into adaptive learning performance at the University of Mines and Technology.
              Empowering educators with data-driven decisions.
            </p>

            {/* Enhanced hero stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto">
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
              ) : statsError ? (
                <div className="col-span-4 text-red-500">Failed to load stats: {statsError.message}</div>
              ) : (
                [
                  { value: stats?.total_students.toLocaleString(), label: "Active Students", icon: Users },
                  { value: stats?.active_courses, label: "Live Courses", icon: BookOpen },
                  { value: `${stats?.completion_rate_percent}%`, label: "Completion Rate", icon: Target },
                  { value: `${stats?.avg_session_minutes}m`, label: "Avg Session", icon: Clock },
                ].map((stat, index) => (
                  <Card
                    key={index}
                    className="glass-card-green grow-organic border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group cursor-pointer"
                  >
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-2">
                        <stat.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-primary group-hover:text-accent transition-colors duration-300">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Added CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Explore Analytics
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary/20 hover:bg-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-transparent"
              >
                View Documentation
              </Button>
              <Button asChild
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <a href="https://t.me/AskTheSageQ_bot" target="_blank" rel="noopener noreferrer">
                  Chat with Bot
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Cards Section */}
      <section className="container mx-auto px-4 py-16" id="analytics">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Key Performance Indicators</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive metrics tracking student engagement and learning outcomes across all programs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statsLoading ? (
            Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : statsError ? (
            <div className="col-span-full text-red-500">Failed to load stats: {statsError.message}</div>
          ) : (
            <>
              {/* Total Students Card */}
              <Card
                className={`glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group ${isLoaded ? "fade-in-up" : "opacity-0"}`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                  <Users className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {stats?.total_students.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-colors duration-300"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12.5% this month
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Active Courses Card */}
              <Card
                className={`glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group ${isLoaded ? "fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: "0.1s" }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Courses</CardTitle>
                  <BookOpen className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {stats?.active_courses}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-colors duration-300"
                    >
                      <Target className="w-3 h-3 mr-1" />3 new this week
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Success Rate Card */}
              <Card
                className={`glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group ${isLoaded ? "fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: "0.2s" }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
                  <Award className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {stats?.success_rate_percent}%
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-colors duration-300"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +2.1% improvement
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Average Session Time Card */}
              <Card
                className={`glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group ${isLoaded ? "fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: "0.3s" }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Session Time</CardTitle>
                  <Clock className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {stats?.avg_session_minutes} min
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-colors duration-300"
                    >
                      <Activity className="w-3 h-3 mr-1" />
                      Optimal range
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Total Interactions Card */}
              <Card
                className={`glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group ${isLoaded ? "fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: "0.4s" }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Interactions</CardTitle>
                  <MessageSquare className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {stats?.total_interactions.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent-foreground hover:bg-accent/20 transition-colors duration-300"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +847 today
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Completion Rate Card */}
              <Card
                className={`glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group ${isLoaded ? "fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: "0.5s" }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
                  <Target className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {stats?.completion_rate_percent}%
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent-foreground group-hover:bg-accent/20 transition-colors duration-300"
                    >
                      <Award className="w-3 h-3 mr-1" />
                      Above target
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          {/* BotIntelligenceMetrics removed as per user request */}
        </div>

        {/* Recent Activity Section */}
        <Card className="glass-card border-0 shadow-lg hover:shadow-xl transition-all duration-500" id="reports">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Recent Course Activity</CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest engagement metrics across active courses with real-time updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary/50" />
                      <div>
                        <div className="h-4 bg-primary/20 rounded w-48 mb-2" />
                        <div className="h-3 bg-primary/10 rounded w-32" />
                      </div>
                    </div>
                    <div className="h-4 bg-primary/10 rounded w-16" />
                  </div>
                ))}
              </div>
            ) : activityError ? (
              <div className="text-red-500">Failed to load recent activity: {activityError.message}</div>
            ) : (
              <div className="space-y-4">
                {recentActivity?.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
                      <div>
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                          {activity.course_name}
                        </div>
                        <div className="text-sm text-muted-foreground">{activity.active_students} active students</div>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent-foreground group-hover:bg-accent/20 transition-colors duration-300"
                    >
                      {activity.trend_percent}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA Section removed as per user request */}
      </section>

      {/* Footer Section */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">AskTheSageQuizzer</h3>
                  <p className="text-xs text-muted-foreground -mt-1">UMaT Analytics Platform</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering educational institutions with advanced learning analytics and data-driven insights.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Analytics
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Reports
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="mailto:askthe.online" className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 AskTheSageQuizzer. Built for University of Mines and Technology. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Powered by HCX Technologies, an initiative of HCX Industries.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Contact HCX Technologies: <a href="mailto:admin@askthe.online" className="hover:text-primary transition-colors">admin@askthe.online</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
