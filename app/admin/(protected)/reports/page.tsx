"use client"

import { useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { useAsyncOperation } from "@/hooks/use-async-operation";
import { api } from "@/lib/api";
import { StatCardSkeleton } from "@/components/loading-states";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MostReportedQuestion {
  question_id: number;
  question_text: string;
  course_name: string;
  report_count: number;
}

interface ReportStats {
  total_reports: number;
  open_reports: number;
  closed_reports: number;
  most_reported_questions: MostReportedQuestion[];
}

interface QuestionReportDetails {
  id: number;
  question_id: number;
  user_id: number;
  username: string | null;
  reason: string;
  status: string;
  reported_at: string; // Assuming ISO string for datetime
  question_text: string;
  course_name: string;
}

interface ReportPage {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: QuestionReportDetails[];
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const { success, error } = useToast();

  const { execute: fetchReportStats, data: reportStats, loading: statsLoading, error: statsError } = useAsyncOperation<ReportStats>(
    useCallback(async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");
      return api.get<ReportStats>("/admin/reports/stats", { token });
    }, [])
  );

  const { execute: fetchReports, data: reportsPage, loading: reportsLoading, error: reportsError } = useAsyncOperation<ReportPage>(
    useCallback(async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");

      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("size", "10");
      if (statusFilter !== "all") {
        params.append("status_filter", statusFilter);
      }
      if (sortConfig) {
        params.append("sort_by", sortConfig.key);
        params.append("sort_dir", sortConfig.direction);
      }
      // if (searchQuery) { params.append("search", searchQuery); }

      return api.get<ReportPage>(`/admin/reports?${params.toString()}`, { token });
    }, [currentPage, sortConfig, statusFilter])
  );

  const { execute: updateReportStatus } = useAsyncOperation(
    useCallback(async (reportId: number, status: string) => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");
      return api.put(`/admin/reports/${reportId}`, { status }, { token });
    }, [])
  );

  useEffect(() => {
    fetchReportStats();
  }, [fetchReportStats]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports, currentPage, sortConfig, statusFilter]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleStatusUpdate = async (reportId: number, status: string) => {
    try {
      await updateReportStatus(reportId, status);
      success({
        title: "Status Updated",
        description: `Report #${reportId} has been marked as ${status}.`,
      });
      fetchReports(); // Refresh the table
    } catch (err: any) {
      error("Update Failed", err.message || "Could not update the report status.");
    }
  };

  const columns = [
    {
      key: "question_text",
      label: "Reported Question",
      render: (report: QuestionReportDetails) => (
        <div className="max-w-xs">
          <div className="font-medium text-slate-800 truncate">{report.question_text}</div>
          <div className="text-sm text-slate-500">{report.course_name}</div>
        </div>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      render: (report: QuestionReportDetails) => <div className="text-sm text-slate-600">{report.reason}</div>,
    },
    {
      key: "username",
      label: "Reported By",
      render: (report: QuestionReportDetails) => (
        <div className="text-sm font-medium text-slate-800">{report.username || "Anonymous"}</div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (report: QuestionReportDetails) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            report.status === "open" ? "bg-yellow-100 text-yellow-800" : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {report.status}
        </span>
      ),
    },
    {
      key: "reported_at",
      label: "Date Reported",
      render: (report: QuestionReportDetails) => (
        <span className="text-sm text-slate-500">{new Date(report.reported_at).toLocaleString()}</span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (report: QuestionReportDetails) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-emerald-50">
              <Eye className="h-4 w-4 text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusUpdate(report.id, "resolved")}>
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Mark as Resolved</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusUpdate(report.id, "dismissed")}>
              <XCircle className="mr-2 h-4 w-4" />
              <span>Dismiss Report</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      <main className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Question Reports Management</h2>
            <p className="text-slate-600">Review and manage user-submitted reports on question accuracy and relevance.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {statsLoading ? (
              Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
            ) : statsError ? (
              <div className="col-span-3 text-red-500">Failed to load stats: {statsError.message}</div>
            ) : (
              <>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Total Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{reportStats?.total_reports}</div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Open Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{reportStats?.open_reports}</div>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Closed Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{reportStats?.closed_reports}</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <Card className="glass-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span>Most Reported Questions</span>
              </CardTitle>
              <CardDescription>Questions with the highest number of user reports.</CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <p>Loading...</p>
              ) : (
                <ul className="space-y-3">
                  {reportStats?.most_reported_questions.map((q) => (
                    <li key={q.question_id} className="flex justify-between items-center">
                      <div className="max-w-xs">
                        <p className="font-medium text-slate-800 truncate">{q.question_text}</p>
                        <p className="text-sm text-slate-500">{q.course_name}</p>
                      </div>
                      <div className="text-sm font-bold text-red-500">{q.report_count} reports</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-emerald-600" />
                <span>All Reports</span>
              </CardTitle>
              <CardDescription>Detailed list of all user-submitted question reports.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <AdminDataTable
                data={reportsPage?.items || []}
                columns={columns}
                searchQuery={searchQuery}
                searchKeys={["question_text", "reason", "username"]}
                loading={reportsLoading}
                error={reportsError?.message}
                totalItems={reportsPage?.total || 0}
                itemsPerPage={reportsPage?.size || 10}
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
  );
}