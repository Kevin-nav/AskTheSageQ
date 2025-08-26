"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/form-field"
import { useFormValidation } from "@/hooks/use-form-validation"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Lock, User, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { loginUser } from "@/lib/api"
import { useRouter } from "next/navigation"

const validationSchema = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  password: {
    required: true,
    minLength: 6,
  },
}

export default function AdminLogin() {
  console.log("[LoginPage] Rendering login page.");
  const [showPassword, setShowPassword] = useState(false)
  const { success, error } = useToast()
  const router = useRouter()

  const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormValidation(
    { username: "", password: "" },
    validationSchema,
  )

  const onSubmit = async (formValues: typeof values) => {
    try {
      const response = await loginUser({
        username: formValues.username,
        password: formValues.password,
      });

      localStorage.setItem("access_token", response.access_token);
      success("Login Successful", "Welcome back to the admin dashboard!");
      router.push("/admin");
    } catch (err: any) {
      error("Login Failed", err.message || "Invalid username or password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="text-sm font-medium">Back to Dashboard</span>
      </Link>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8 fade-in-up">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Access</h1>
          <p className="text-muted-foreground">Sign in to access the UMaT Analytics admin dashboard</p>
        </div>

        <Card className="glass-card border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 fade-in-up">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(onSubmit)
              }}
              className="space-y-6"
            >
              <FormField
                label="Username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={values.username}
                error={errors.username}
                touched={touched.username}
                required
                onChange={handleChange}
                onBlur={handleBlur}
                icon={<User className="w-4 h-4" />}
              />

              <FormField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={values.password}
                error={errors.password}
                touched={touched.password}
                required
                onChange={handleChange}
                onBlur={handleBlur}
                icon={<Lock className="w-4 h-4" />}
              />

              <div className="relative -mt-12 mb-4">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/e transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !values.username || !values.password}
                className="w-full h-12 bg-primary"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
