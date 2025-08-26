"use client"

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  BookOpen,
  Search,
  Filter,
  Download,
  TrendingUp,
  Zap,
  MessageSquare,
  Clock,
  Target,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { KnowledgeGrowthTrends } from "@/components/charts/knowledge-growth-trends";
import { BotIntelligenceMetrics } from "@/components/charts/bot-intelligence-metrics";
import { useAsyncOperation } from "@/hooks/use-async-operation";
import { api } from "@/lib/api";
import { StatCardSkeleton } from "@/components/loading-states";

interface BotStats {
  avg_response_time: number;
  accuracy_rate: number;
}

interface InteractionDetail {
  id: number;
  user_name: string;
  question_text: string;
  course_name: string;
  is_correct: boolean;
  time_taken: number;
  timestamp: string; // Assuming ISO string for datetime
}

interface InteractionPage {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: InteractionDetail[];
}

export default function BotIntelligencePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const { execute: fetchBotStats, data: botStats, loading: statsLoading, error: statsError } = useAsyncOperation<BotStats>(
    useCallback(async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");
      return api.get<BotStats>("/admin/bot/stats", { token });
    }, [])
  );

  const { execute: fetchInteractions, data: interactionsPage, loading: interactionsLoading, error: interactionsError } = useAsyncOperation<InteractionPage>(
    useCallback(async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");

      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("size", "10"); // Assuming 10 items per page for now
      if (sortConfig) {
        params.append("sort_by", sortConfig.key);
        params.append("sort_dir", sortConfig.direction);
      }
      // Add search query if needed by backend
      // if (searchQuery) { params.append("search", searchQuery); }

      return api.get<InteractionPage>(`/admin/bot/interactions?${params.toString()}`, { token });
    }, [currentPage, sortConfig])
  );

  useEffect(() => {
    fetchBotStats();
  }, [fetchBotStats]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions, currentPage, sortConfig]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const columns = [
    {
      key: "question_text",
      label: "Query",
      render: (interaction: InteractionDetail) => (
        <div className="max-w-xs">
          <div className="font-medium text-slate-800 truncate">{interaction.question_text}</div>
          <div className="text-sm text-slate-500">{interaction.course_name}</div>
        </div>
      ),
    },
    {
      key: "user_name",
      label: "Student",
      render: (interaction: InteractionDetail) => (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-xs font-medium text-white">{interaction.user_name[0]}</span>
          </div>
          <span className="text-sm font-medium text-slate-800">{interaction.user_name}</span>
        </div>
      ),
    },
    {
      key: "time_taken",
      label: "Response Time",
      render: (interaction: InteractionDetail) => (
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-800">{interaction.time_taken}s</span>
        </div>
      ),
    },
    {
      key: "is_correct",
      label: "Correctness",
      render: (interaction: InteractionDetail) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            interaction.is_correct ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
          }`}
        >
          {interaction.is_correct ? "Correct" : "Incorrect"}
        </span>
      ),
    },
    {
      key: "timestamp",
      label: "Time",
      render: (interaction: InteractionDetail) => <span className="text-sm text-slate-500">{new Date(interaction.timestamp).toLocaleString()}</span>,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      {/* Main content */}
      <div className="lg:pl-0">
        {/* Top bar - kept for consistency, but sidebar is now in layout */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-emerald-100/50 bg-white/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-slate-800">Bot Intelligence Dashboard</h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>AI System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">AI Performance Analytics</h2>
              <p className="text-slate-600">Monitor bot intelligence, response quality, and learning effectiveness.</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
              ) : statsError ? (
                <div className="col-span-4 text-red-500">Failed to load bot stats: {statsError.message}</div>
              ) : (
                <>
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `0ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Avg Response Time</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{botStats?.avg_response_time}s</div>
                    </CardContent>
                  </Card>
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `100ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Accuracy Rate</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Target className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{botStats?.accuracy_rate}%</div>
                    </CardContent>
                  </Card>
                  {/* Placeholder for other bot stats not yet in API */}
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `200ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Total Interactions</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">N/A</div>
                    </CardContent>
                  </Card>
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `300ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">User Satisfaction</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">N/A</div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <KnowledgeGrowthTrends />
              <BotIntelligenceMetrics botStats={botStats} />
            </div>

            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search interactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/80 border-emerald-200/50 focus:border-emerald-300 focus:ring-emerald-200"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-emerald-200/50 hover:bg-emerald-50/50 bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" className="border-emerald-200/50 hover:bg-emerald-50/50 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                  <Brain className="w-4 h-4 mr-2" />
                  Train Model
                </Button>
              </div>
            </div>

            {/* Bot interactions table */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-emerald-600" />
                  <span>Recent Bot Interactions</span>
                </CardTitle>
                <CardDescription>Latest AI assistance requests and performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminDataTable
                  data={interactionsPage?.items || []}
                  columns={columns}
                  searchQuery={searchQuery}
                  searchKeys={["question_text", "user_name", "course_name"]}
                  loading={interactionsLoading}
                  error={interactionsError?.message}
                  totalItems={interactionsPage?.total || 0}
                  itemsPerPage={interactionsPage?.size || 10}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
