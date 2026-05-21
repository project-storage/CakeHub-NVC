"use client";

import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboardService } from '@/services/api/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import ECharts to reduce initial bundle size
const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStatistics(),
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div className="text-destructive">Error loading dashboard stats</div>;
  }

  const metrics = [
    { title: "Total Orders", value: stats?.totalOrders?.toString() || "0", trend: "Lifetime" },
    { title: "Revenue", value: `$${stats?.totalRevenue?.toLocaleString() || "0"}`, trend: "Lifetime" },
    { title: "Cakes Sold", value: stats?.totalCakesSold?.toString() || "0", trend: "Lifetime" },
    { title: "Pending Payment", value: `$${stats?.totalPendingPayment?.toLocaleString() || "0"}`, trend: "Current" },
  ];

  const chartOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { 
      type: 'category', 
      data: stats?.topSellingCakes?.map(c => c.cakeName) || [],
      axisLabel: { interval: 0, rotate: 30 }
    },
    yAxis: { type: 'value' },
    series: [
      { 
        data: stats?.topSellingCakes?.map(c => c.quantitySold) || [], 
        type: 'bar', 
        color: 'hsl(var(--primary))' 
      },
    ]
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Cakes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {stats?.topSellingCakes && stats.topSellingCakes.length > 0 ? (
                <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No sales data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground flex items-center justify-center h-[300px]">
              No recent activity recorded
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-9 w-48 bg-muted animate-pulse rounded" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-28" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-[400px]" />
        <Card className="h-[400px]" />
      </div>
    </div>
  );
}
