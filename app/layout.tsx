import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { ErrorBoundary } from "@/components/error-boundary"
import { SecurityWrapper } from "@/components/security-wrapper"
import { Toaster } from "@/components/ui/sonner";
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "UMaT Analytics | askthe.dev",
  description: "University of Mines and Technology Adaptive Learning Analytics Platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        <SecurityWrapper>
          <ErrorBoundary>
            {children}
            <Toaster />
          </ErrorBoundary>
        </SecurityWrapper>
      </body>
    </html>
  );
}
