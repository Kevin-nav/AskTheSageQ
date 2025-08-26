"use client"

import { useEffect, useCallback } from "react";
import {
  Users,
  BookOpen,
  Brain,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAsyncOperation } from "@/hooks/use-async-operation";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/loading-states";
import { StatCardSkeleton, ActivityListSkeleton } from "@/components/loading-states";

interface DashboardStat {
  title: string;
  value: string;
  change?: string;
  trend?: string;
  description?: string;
}

interface UserActivity {
  name: string;
  avatar_initial: string;
}

interface RecentActivity {
  id: string;
  user: UserActivity;
  action: string;
  timestamp: string; // Assuming ISO string for datetime
}

export default function AdminDashboard() {
  const { execute: fetchStats, data: stats, loading: statsLoading, error: statsError } = useAsyncOperation<DashboardStat[]>(
    useCallback(async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");
      return api.get<DashboardStat[]>("/admin/dashboard/stats", { token });
    }, [])
  );

  const { execute: fetchRecentActivity, data: recentActivity, loading: activityLoading, error: activityError } = useAsyncOperation<RecentActivity[]>(
    useCallback(async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");
      return api.get<RecentActivity[]>("/admin/dashboard/recent-activity", { token });
    }, [])
  );

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, [fetchStats, fetchRecentActivity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      {/* Main content */}
      <div className="lg:pl-0">
        {/* Top bar - kept for consistency, but sidebar is now in layout */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-emerald-100/50 bg-white/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-slate-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Welcome section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome back, Admin</h2>
              <p className="text-slate-600">Here's what's happening with your learning platform today.</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
              ) : statsError ? (
                <div className="col-span-4 text-red-500">Failed to load stats: {statsError.message}</div>
              ) : (
                stats?.map((stat, index) => {
                  const Icon = stat.title.includes("Students") ? Users : stat.title.includes("Course") ? BookOpen : stat.title.includes("Bot") ? Brain : Activity;

                  const TrendIcon = ({ trend }: { trend?: string }) => {
                    if (trend === "up") {
                      return <TrendingUp className="w-3 h-3 text-emerald-500" />;
                    } else if (trend === "down") {
                      return <TrendingDown className="w-3 h-3 text-red-500" />;
                    }
                    return null;
                  };

                  return (
                    <Card
                      key={stat.title}
                      className={`
                      glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0
                      animate-fade-in-up
                    `}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</div>
                        {stat.change && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-emerald-600 font-medium">{stat.change}</span>
                            <TrendIcon trend={stat.trend} />
                          </div>
                        )}
                        {stat.description && <p className="text-xs text-slate-500 mt-1">{stat.description}</p>}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>Latest platform interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  {activityLoading ? (
                    <ActivityListSkeleton />
                  ) : activityError ? (
                    <div className="text-red-500">Failed to load recent activity: {activityError.message}</div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivity?.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-emerald-50/50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <span className="text-xs font-medium text-white">{activity.user.avatar_initial}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {activity.user.name} {activity.action}
                            </p>
                            <p className="text-xs text-slate-500">{new Date(activity.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    <span>Quick Actions</span>
                  </CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "View Reports", icon: PieChart, color: "from-blue-500 to-blue-600" },
                      { name: "Manage Users", icon: Users, color: "from-emerald-500 to-emerald-600" },
                      { name: "Course Analytics", icon: BookOpen, color: "from-purple-500 to-purple-600" },
                      { name: "Bot Settings", icon: Brain, color: "from-orange-500 to-orange-600" },
                    ].map((action) => {
                      const Icon = action.icon
                      return (
                        <Button
                          key={action.name}
                          variant="outline"
                          className="h-20 flex-col space-y-2 border-emerald-200/50 hover:bg-emerald-50/50 hover:border-emerald-300/50 transition-all duration-200 hover:scale-105 bg-transparent"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}
                          >
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-medium">{action.name}</span>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
