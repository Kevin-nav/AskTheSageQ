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
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { useAsyncOperation } from "@/hooks/use-async-operation";
import { api } from "@/lib/api";
import { StatCardSkeleton } from "@/components/loading-states";

interface CourseStats {
  total_courses: number;
  active_courses: number;
  total_enrollment: number;
  avg_completion_rate: number;
}

interface CourseDetail {
  id: number;
  name: string;
  level: string;
  students_enrolled: number;
  total_questions: number;
  avg_difficulty: number;
}

interface CoursePage {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: CourseDetail[];
}

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const { execute: fetchCourseStats, data: courseStats, loading: statsLoading, error: statsError } = useAsyncOperation<CourseStats>(
    useCallback(async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");
      return api.get<CourseStats>("/admin/courses/stats", { token });
    }, [])
  );

  const { execute: fetchCourses, data: coursesPage, loading: coursesLoading, error: coursesError } = useAsyncOperation<CoursePage>(
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

      return api.get<CoursePage>(`/admin/courses?${params.toString()}`, { token });
    }, [currentPage, sortConfig])
  );

  useEffect(() => {
    fetchCourseStats();
  }, [fetchCourseStats]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, currentPage, sortConfig]);

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
      label: "Course",
      render: (course: CourseDetail) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-slate-800">{course.name}</div>
            <div className="text-sm text-slate-500">{course.level}</div>
          </div>
        </div>
      ),
    },
    {
      key: "students_enrolled",
      label: "Students Enrolled",
      render: (course: CourseDetail) => (
        <div className="font-medium text-slate-800">{course.students_enrolled}</div>
      ),
    },
    {
      key: "total_questions",
      label: "Total Questions",
      render: (course: CourseDetail) => (
        <div className="font-medium text-slate-800">{course.total_questions}</div>
      ),
    },
    {
      key: "avg_difficulty",
      label: "Avg Difficulty",
      render: (course: CourseDetail) => (
        <span
          className={`font-medium ${course.avg_difficulty >= 7 ? "text-red-600" : course.avg_difficulty >= 4 ? "text-yellow-600" : "text-emerald-600"}`}
        >
          {course.avg_difficulty.toFixed(1)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (course: CourseDetail) => (
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
              <h1 className="text-xl font-semibold text-slate-800">Courses Management</h1>
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
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Courses Overview</h2>
              <p className="text-slate-600">Manage course offerings, track enrollment, and monitor completion rates.</p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              {statsLoading ? (
                Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
              ) : statsError ? (
                <div className="col-span-4 text-red-500">Failed to load course stats: {statsError.message}</div>
              ) : (
                <>
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `0ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Total Courses</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{courseStats?.total_courses}</div>
                    </CardContent>
                  </Card>
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `100ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Active Courses</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{courseStats?.active_courses}</div>
                    </CardContent>
                  </Card>
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `200ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Total Enrollment</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{courseStats?.total_enrollment}</div>
                    </CardContent>
                  </Card>
                  <Card
                    className="glass-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 animate-fade-in-up"
                    style={{ animationDelay: `300ms` }}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">Avg Completion</CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-800">{courseStats?.avg_completion_rate}%</div>
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
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/80 border-emerald-200/50 focus:border-emerald-300 focus:ring-emerald-200"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-emerald-200/50 hover:bg-emerald-50/50 hover:text-slate-700 hover:border-emerald-300/50 bg-transparent transition-all duration-200 text-slate-600"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  className="border-emerald-200/50 hover:bg-emerald-50/50 hover:text-slate-700 hover:border-emerald-300/50 bg-transparent transition-all duration-200 text-slate-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </div>
            </div>

            {/* Courses table */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <span>All Courses</span>
                </CardTitle>
                <CardDescription>Complete list of course offerings</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AdminDataTable
                  data={coursesPage?.items || []}
                  columns={columns}
                  searchQuery={searchQuery}
                  searchKeys={["name", "level"]}
                  loading={coursesLoading}
                  error={coursesError?.message}
                  totalItems={coursesPage?.total || 0}
                  itemsPerPage={coursesPage?.size || 10}
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
