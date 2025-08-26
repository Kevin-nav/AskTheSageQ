"use client"

import { useState, useEffect, useCallback } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAsyncOperation } from "@/hooks/use-async-operation";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/loading-states";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LogsPage() {
  const [selectedLogContent, setSelectedLogContent] = useState<string | null>(null);
  const [isViewLogModalOpen, setIsViewLogModalOpen] = useState(false);
  const { toast } = useToast();

  const { execute: fetchLogFiles, data: logFiles, loading: loadingLogFiles, error: logFilesError } = useAsyncOperation<string[]>(
    useCallback(async () => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");
      return api.get<string[]>("/logs/", { token });
    }, [])
  );

  const { execute: fetchLogContent, data: logContent, loading: loadingLogContent, error: logContentError } = useAsyncOperation<string>(
    useCallback(async (logFileName: string) => {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");
      // The API returns text/plain, so we need to handle the response directly
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logs/${logFileName}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to fetch log content for ${logFileName}`);
      }
      return response.text();
    }, [])
  );

  useEffect(() => {
    fetchLogFiles();
  }, [fetchLogFiles]);

  useEffect(() => {
    if (logContent) {
      setSelectedLogContent(logContent);
      setIsViewLogModalOpen(true);
    }
  }, [logContent]);

  const handleViewLog = async (logFileName: string) => {
    try {
      await fetchLogContent(logFileName);
    } catch (err: any) {
      toast({
        title: "Error viewing log",
        description: err.message || "Failed to fetch log content.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadLog = async (logFileName: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found.");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logs/${logFileName}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to download log file ${logFileName}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = logFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Download Started",
        description: `Downloading ${logFileName}...`,
      });
    } catch (err: any) {
      toast({
        title: "Download Failed",
        description: err.message || "Failed to download log file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
      <main className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Bot Logs</h2>
            <p className="text-slate-600">View and download system logs for the bot.</p>
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Available Log Files</span>
              </CardTitle>
              <CardDescription>Select a log file to view its content or download it.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingLogFiles ? (
                <LoadingSpinner />
              ) : logFilesError ? (
                <div className="text-red-500">Error: {logFilesError.message}</div>
              ) : logFiles && logFiles.length > 0 ? (
                <ul className="space-y-2">
                  {logFiles.map((fileName) => (
                    <li key={fileName} className="flex items-center justify-between p-2 rounded-md hover:bg-emerald-50/50 transition-colors">
                      <span className="font-medium text-slate-800">{fileName}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewLog(fileName)} disabled={loadingLogContent}>
                          {loadingLogContent ? "Loading..." : <><Eye className="w-4 h-4 mr-2" /> View</>}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadLog(fileName)}>
                          <Download className="w-4 h-4 mr-2" /> Download
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600">No log files found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isViewLogModalOpen} onOpenChange={setIsViewLogModalOpen}>
        <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Log File Content</DialogTitle>
            <DialogDescription>Content of the selected log file.</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {loadingLogContent ? (
              <LoadingSpinner />
            ) : logContentError ? (
              <div className="text-red-500">Error: {logContentError.message}</div>
            ) : (
              <ScrollArea className="h-full w-full rounded-md border p-4 font-mono text-sm bg-slate-50">
                <pre className="whitespace-pre-wrap break-all">{selectedLogContent}</pre>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
