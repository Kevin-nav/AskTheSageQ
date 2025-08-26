"use client"

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  BookOpen,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { useAsyncOperation } from "@/hooks/use-async-operation";
import { api } from "@/lib/api";
import { StatCardSkeleton } from "@/components/loading-states";

interface StudentStats {
  total_students: number;
  active_students: number;
  completion_rate: number;
  avg_gpa: number;
}

interface StudentDetail {
  id: number;
  name: string;
  email: string;
  last_active: string; // Assuming ISO string for datetime
  status: string;
  courses_taken: number;
  total_quizzes: number;
  avg_score: number;
}

interface StudentPage {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: StudentDetail[];
}

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const { execute: fetchStudentStats, data: studentStats, loading: statsLoading, error: statsError } = useAsyncOperation<StudentStats>(
    useCallback(async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");
      return api.get<StudentStats>("/admin/students/stats", { token });
    }, [])
  );

  const { execute: fetchStudents, data: studentsPage, loading: studentsLoading, error: studentsError } = useAsyncOperation<StudentPage>(
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

      return api.get<StudentPage>(`/admin/students?${params.toString()}`, { token });
    }, [currentPage, sortConfig])
  );

  useEffect(() => {
    fetchStudentStats();
  }, [fetchStudentStats]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, currentPage, sortConfig]);

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
      key: "name",
      label: "Student",
      render: (student: StudentDetail) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">{student.name[0]}</span>
          </div>
          <div>
            <div className="font-medium text-slate-800">{student.name}</div>
            <div className="text-sm text-slate-500">{student.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "courses_taken",
      label: "Courses Taken",
      render: (student: StudentDetail) => (
        <div className="font-medium text-slate-800">{student.courses_taken}</div>
      ),
    },
    {
      key: "total_quizzes",
      label: "Total Quizzes",
      render: (student: StudentDetail) => (
        <div className="font-medium text-slate-800">{student.total_quizzes}</div>
      ),
    },
    {
      key: "avg_score",
      label: "Avg Score",
      render: (student: StudentDetail) => (
        <span
          className={`font-medium ${student.avg_score >= 70 ? "text-emerald-600" : student.avg_score >= 50 ? "text-yellow-600" : "text-red-600"}`}
        >
          {student.avg_score.toFixed(1)}%
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (student: StudentDetail) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            student.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"
          }`}
        >
          {student.status}
        </span>
      ),
    },
    {
      key: "last_active",
      label: "Last Active",
      render: (student: StudentDetail) => <span className="text-sm text-slate-500">{new Date(student.last_active).toLocaleString()}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      render: (student: StudentDetail) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-emerald-50">
            <Eye className="h-4 w-4 text-slate-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-emerald-50">
            <Edit className="h-4 w-4 text-slate-500" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
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
              <h1 className="text-xl font-semibold text-slate-800">Students Management</h1>
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
            {/* Header section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Students Overview</h2>
              <p className="text-slate-600">Manage and monitor student progress across all courses.</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
              ) : statsError ? (
                <div className="col-span-4 text-red-500">Failed to load student stats: {statsError.message}</div>
              ) : (
                <>
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `0ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Total Students</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{studentStats?.total_students}</div>
                    </CardContent>
                  </Card>
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `100ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Active Students</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{studentStats?.active_students}</div>
                    </CardContent>
                  </Card>
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `200ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Completion Rate</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{studentStats?.completion_rate}%</div>
                    </CardContent>
                  </Card>
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `300ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Average GPA</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{studentStats?.avg_gpa?.toFixed(1)}</div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Actions bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
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
                  <Plus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>

            {/* Students table */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <span>All Students</span>
                </CardTitle>
                <CardDescription>Complete list of registered students</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminDataTable
                  data={studentsPage?.items || []}
                  columns={columns}
                  searchQuery={searchQuery}
                  searchKeys={["name", "email"]}
                  loading={studentsLoading}
                  error={studentsError?.message}
                  // Pagination props
                  totalItems={studentsPage?.total || 0}
                  itemsPerPage={studentsPage?.size || 10}
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
