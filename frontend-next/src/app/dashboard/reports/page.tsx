"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet, Download, BarChart } from "lucide-react";
import { apiClient } from "@/services/api/client";
import { toast } from "sonner";

export default function ReportsPage() {
  const downloadReport = async (endpoint: string, type: 'excel' | 'pdf') => {
    try {
      toast.info(`Preparing ${type.toUpperCase()} report...`);
      const response = await apiClient.get(`report/${endpoint}`, {
        searchParams: { export: type }
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${endpoint}-${new Date().toISOString().split('T')[0]}.${type === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download report");
    }
  };

  const reportItems = [
    {
      title: "Order Summary",
      description: "Detailed list of all orders including items, prices, and status.",
      endpoint: "order-summary",
      icon: FileText
    },
    {
      title: "Revenue Analysis",
      description: "Financial breakdown of paid and delivered orders by date.",
      endpoint: "revenue-summary",
      icon: BarChart
    },
    {
      title: "Student Orders",
      description: "Report on order frequency and totals per student.",
      endpoint: "student-order",
      icon: FileText
    }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">System Reports</h1>
        <p className="text-muted-foreground">Export system data to Excel or PDF for offline analysis.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportItems.map((report) => (
          <Card key={report.endpoint}>
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <report.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" onClick={() => downloadReport(report.endpoint, 'excel')}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadReport(report.endpoint, 'pdf')}>
                <FileText className="mr-2 h-4 w-4" /> PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
