"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider } from "@/components/ui/sidebar";
import { User, LayoutDashboard, Book, Bot, Settings, LogOut, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();

  console.log("[AdminLayout] Rendering. Auth state:", { isAuthenticated, loading });

  useEffect(() => {
    // We only want to redirect if loading is finished and the user is not authenticated.
    if (!loading && !isAuthenticated) {
      console.log("[AdminLayout] Not authenticated, redirecting to login.");
      router.push("/admin/login");
    }
  }, [isAuthenticated, loading, router]);

  // While the AuthProvider is checking the token, AuthProvider shows a global spinner.
  // If it's done and there's no user, it means we are about to redirect.
  // We render null to avoid a flash of the empty layout.
  if (loading || !user) {
    console.log("[AdminLayout] Loading or no user, rendering null.");
    return null;
  }

  console.log("[AdminLayout] User is authenticated, rendering layout.");

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <div>
          <SidebarHeader className="flex items-center gap-2 p-4 border-b border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
              {user.avatar_initial}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{user.full_name}</span>
              <span className="text-sm text-muted-foreground">Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/admin" passHref>
                  <SidebarMenuButton asChild>
                    <div>
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/students" passHref>
                  <SidebarMenuButton asChild>
                    <div>
                      <User className="w-4 h-4" />
                      <span>Students</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/courses" passHref>
                  <SidebarMenuButton asChild>
                    <div>
                      <Book className="w-4 h-4" />
                      <span>Courses</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/bot-intelligence" passHref>
                  <SidebarMenuButton asChild>
                    <div>
                      <Bot className="w-4 h-4" />
                      <span>Bot Intelligence</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/reports" passHref>
                  <SidebarMenuButton asChild>
                    <div>
                      <AlertCircle className="w-4 h-4" />
                      <span>Reports</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/logs" passHref>
                  <SidebarMenuButton asChild>
                    <div>
                      <FileText className="w-4 h-4" />
                      <span>Bot Logs</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/settings" passHref>
                  <SidebarMenuButton asChild>
                    <div>
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <div className="p-4 border-t border-border/50">
            <SidebarMenuButton onClick={logout}>
              <div>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </div>
            </SidebarMenuButton>
          </div>
        </div>
      </Sidebar>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </SidebarProvider>
    </AuthProvider>
  );
}
