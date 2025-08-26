"use client"

import { useState, useEffect, useCallback } from "react"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Brain,
  Settings,
  Menu,
  X,
  Save,
  Shield,
  Bell,
  Globe,
  Database,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/form-field"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormValidation } from "@/hooks/use-form-validation"
import { useToast } from "@/hooks/use-toast"
import { useAsyncOperation } from "@/hooks/use-async-operation"
import { api } from "@/lib/api"

interface SystemStatus {
  database_status: string;
  api_status: string;
}

const navigationItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, current: false },
  { name: "Students", href: "/admin/students", icon: Users, current: false },
  { name: "Courses", href: "/admin/courses", icon: BookOpen, current: false },
  { name: "Bot Intelligence", href: "/admin/bot-intelligence", icon: Brain, current: false },
  { name: "Settings", href: "/admin/settings", icon: Settings, current: true },
]

const settingsValidationSchema = {
  siteName: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  siteDescription: {
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  botAccuracyThreshold: {
    required: true,
    min: 50,
    max: 100,
  },
  alertThreshold: {
    required: true,
    min: 0,
    max: 100,
  },
  sessionTimeout: {
    required: true,
    min: 5,
    max: 480,
  },
  passwordMinLength: {
    required: true,
    min: 6,
    max: 32,
  },
  maxLoginAttempts: {
    required: true,
    min: 3,
    max: 10,
  },
}

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { success, error, warning } = useToast()

  const initialSettings = {
    // General Settings
    siteName: "UMaT Adaptive Learning Platform",
    siteDescription: "Advanced AI-powered learning analytics platform",
    maintenanceMode: false,
    allowRegistration: true,

    // Bot Settings
    botResponseTime: "fast",
    botAccuracyThreshold: 85,
    enableBotLearning: true,
    botPersonality: "professional",

    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    alertThreshold: 90,

    // Security Settings
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireTwoFactor: false,
    maxLoginAttempts: 5,
  }

  const { execute: fetchSystemStatus, data: systemStatus, loading: systemStatusLoading, error: systemStatusError } = useAsyncOperation<SystemStatus>(
    useCallback(async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");
      return api.get<SystemStatus>("/admin/system/status", { token });
    }, [])
  );

  useEffect(() => {
    fetchSystemStatus();
  }, [fetchSystemStatus]);

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormValidation(
    initialSettings,
    settingsValidationSchema,
  )

  const onSubmit = async (formValues: typeof values) => {
    try {
      console.log("[v0] Saving settings:", formValues)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Validate critical settings
      if (formValues.sessionTimeout < 10) {
        warning("Security Warning", "Session timeout is very short. Consider increasing for better security.")
      }

      if (formValues.passwordMinLength < 8) {
        warning("Security Warning", "Password minimum length is below recommended 8 characters.")
      }

      success("Settings Saved", "All platform settings have been updated successfully.")
    } catch (err) {
      error("Save Failed", "Unable to save settings. Please try again.")
      throw err
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    handleChange(name, checked)
  }

  const handleSelectChange = (name: string, value: string) => {
    handleChange(name, value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex h-full flex-col bg-white/80 backdrop-blur-xl border-r border-emerald-100/50 shadow-xl">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-emerald-100/50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-800">UMaT Admin</span>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                    ${
                      item.current
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                        : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50"
                    }
                  `}
                >
                  <Icon
                    className={`
                    mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110
                    ${item.current ? "text-white" : "text-slate-400 group-hover:text-emerald-500"}
                  `}
                  />
                  {item.name}
                </a>
              )
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-emerald-100/50">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-sage-50">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@umat.edu.gh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-emerald-100/50 bg-white/80 backdrop-blur-xl px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-slate-800">Platform Settings</h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Button
                onClick={() => handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">System Configuration</h2>
              <p className="text-slate-600">Manage platform settings, security, and AI configuration.</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(onSubmit)
              }}
            >
              {/* Settings grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-emerald-600" />
                      <span>General Settings</span>
                    </CardTitle>
                    <CardDescription>Basic platform configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      label="Site Name"
                      name="siteName"
                      type="text"
                      placeholder="Enter site name"
                      value={values.siteName}
                      error={errors.siteName}
                      touched={touched.siteName}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <FormField
                      label="Site Description"
                      name="siteDescription"
                      type="textarea"
                      placeholder="Enter site description"
                      value={values.siteDescription}
                      error={errors.siteDescription}
                      touched={touched.siteDescription}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Maintenance Mode</Label>
                        <p className="text-sm text-slate-500">Temporarily disable public access</p>
                      </div>
                      <Switch
                        checked={values.maintenanceMode}
                        onCheckedChange={(checked) => handleSwitchChange("maintenanceMode", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Allow Registration</Label>
                        <p className="text-sm text-slate-500">Enable new user registration</p>
                      </div>
                      <Switch
                        checked={values.allowRegistration}
                        onCheckedChange={(checked) => handleSwitchChange("allowRegistration", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Bot Settings */}
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-emerald-600" />
                      <span>AI Bot Configuration</span>
                    </CardTitle>
                    <CardDescription>Configure AI assistant behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="botResponseTime">Response Speed</Label>
                      <Select
                        value={values.botResponseTime}
                        onValueChange={(value) => handleSelectChange("botResponseTime", value)}
                      >
                        <SelectTrigger className="bg-white/80 border-emerald-200/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fast">Fast (&lt; 1 second)</SelectItem>
                          <SelectItem value="balanced">Balanced (1-2 seconds)</SelectItem>
                          <SelectItem value="accurate">Accurate (2-3 seconds)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <FormField
                      label="Accuracy Threshold (%)"
                      name="botAccuracyThreshold"
                      type="number"
                      placeholder="Enter accuracy threshold"
                      value={values.botAccuracyThreshold}
                      error={errors.botAccuracyThreshold}
                      touched={touched.botAccuracyThreshold}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <div className="space-y-2">
                      <Label htmlFor="botPersonality">Bot Personality</Label>
                      <Select
                        value={values.botPersonality}
                        onValueChange={(value) => handleSelectChange("botPersonality", value)}
                      >
                        <SelectTrigger className="bg-white/80 border-emerald-200/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Bot Learning</Label>
                        <p className="text-sm text-slate-500">Allow AI to learn from interactions</p>
                      </div>
                      <Switch
                        checked={values.enableBotLearning}
                        onCheckedChange={(checked) => handleSwitchChange("enableBotLearning", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-emerald-600" />
                      <span>Notifications</span>
                    </CardTitle>
                    <CardDescription>Configure alert and notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-slate-500">Send alerts via email</p>
                      </div>
                      <Switch
                        checked={values.emailNotifications}
                        onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-slate-500">Browser push notifications</p>
                      </div>
                      <Switch
                        checked={values.pushNotifications}
                        onCheckedChange={(checked) => handleSwitchChange("pushNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Reports</Label>
                        <p className="text-sm text-slate-500">Automated weekly analytics</p>
                      </div>
                      <Switch
                        checked={values.weeklyReports}
                        onCheckedChange={(checked) => handleSwitchChange("weeklyReports", checked)}
                      />
                    </div>

                    <FormField
                      label="Alert Threshold (%)"
                      name="alertThreshold"
                      type="number"
                      placeholder="Enter alert threshold"
                      value={values.alertThreshold}
                      error={errors.alertThreshold}
                      touched={touched.alertThreshold}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      <span>Security Settings</span>
                    </CardTitle>
                    <CardDescription>Configure security and authentication</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      label="Session Timeout (minutes)"
                      name="sessionTimeout"
                      type="number"
                      placeholder="Enter session timeout"
                      value={values.sessionTimeout}
                      error={errors.sessionTimeout}
                      touched={touched.sessionTimeout}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <FormField
                      label="Minimum Password Length"
                      name="passwordMinLength"
                      type="number"
                      placeholder="Enter minimum password length"
                      value={values.passwordMinLength}
                      error={errors.passwordMinLength}
                      touched={touched.passwordMinLength}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <FormField
                      label="Max Login Attempts"
                      name="maxLoginAttempts"
                      type="number"
                      placeholder="Enter max login attempts"
                      value={values.maxLoginAttempts}
                      error={errors.maxLoginAttempts}
                      touched={touched.maxLoginAttempts}
                      required
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Require Two-Factor Auth</Label>
                        <p className="text-sm text-slate-500">Mandatory 2FA for all users</p>
                      </div>
                      <Switch
                        checked={values.requireTwoFactor}
                        onCheckedChange={(checked) => handleSwitchChange("requireTwoFactor", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </form>

            {/* System Status */}
            <Card className="glass-card border-0 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>System Status</span>
                </CardTitle>
                <CardDescription>Current system health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {systemStatusLoading ? (
                    <div className="col-span-3 text-center text-slate-500">Loading system status...</div>
                  ) : systemStatusError ? (
                    <div className="col-span-3 text-red-500">Failed to load system status: {systemStatusError.message}</div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-emerald-50/50">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Database className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">Database</p>
                          <p className="text-xs text-emerald-600">{systemStatus?.database_status}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-emerald-50/50">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">AI Service</p>
                          <p className="text-xs text-emerald-600">{systemStatus?.api_status}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50/50">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">Storage</p>
                          <p className="text-xs text-yellow-600">85% Full</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
