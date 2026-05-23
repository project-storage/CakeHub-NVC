"use client";

import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboardService } from '@/services/api/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from "motion/react";
import { TrendingUp, Users, ShoppingBag, CreditCard, ArrowUpRight, ArrowDownRight, Cake as CakeIcon } from "lucide-react";
import { cn } from "@/utils/utils";

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
    return (
      <div className="text-destructive p-8 bg-destructive/5 rounded-xl border border-destructive/10 font-bold">
        Error loading dashboard statistics. Please try again.
      </div>
    );
  }

  const metrics = [
    { 
      title: "Revenue", 
      value: `$${stats?.totalRevenue?.toLocaleString() || "0"}`, 
      trend: "+12.5%", 
      isUp: true,
      icon: CreditCard,
      color: "bg-blue-500",
      label: "vs last month"
    },
    { 
      title: "Orders", 
      value: stats?.totalOrders?.toString() || "0", 
      trend: "+5.2%", 
      isUp: true,
      icon: ShoppingBag,
      color: "bg-sky-500",
      label: "vs last month"
    },
    { 
      title: "Customers", 
      value: "142", 
      trend: "+8.1%", 
      isUp: true,
      icon: Users,
      color: "bg-indigo-500",
      label: "new students"
    },
    { 
      title: "Avg Sale", 
      value: `$${(stats?.totalRevenue && stats?.totalOrders) ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : "0"}`, 
      trend: "-2.4%", 
      isUp: false,
      icon: TrendingUp,
      color: "bg-slate-500",
      label: "per order"
    },
  ];

  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#E2E8F0',
      textStyle: { color: '#0F172A', fontWeight: 'bold' },
      borderRadius: 12,
      padding: 12,
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: stats?.topSellingCakes?.map(c => c.cakeName) || [],
      axisLabel: { color: '#94A3B8', fontSize: 10, fontWeight: 500, interval: 0, rotate: 25 },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: { 
      type: 'value',
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      { 
        data: stats?.topSellingCakes?.map(c => c.quantitySold) || [], 
        type: 'bar', 
        barWidth: '40%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: '#2563EB'
        },
      },
    ]
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time overview of your cake business.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg h-10 px-4 font-semibold">
            Export
          </Button>
          <Button variant="premium" size="sm" className="rounded-lg h-10 px-4 font-semibold">
            New Order
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{metric.title}</p>
                    <div className="text-2xl font-bold leading-tight">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded",
                        metric.isUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                      )}>
                        {metric.trend}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tighter">{metric.label}</span>
                    </div>
                  </div>
                  <div className={cn("p-2.5 rounded-xl text-white", metric.color)}>
                    <metric.icon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 shadow-sm h-full">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Revenue Analytics</CardTitle>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Top Selling Cakes</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-lg h-8 w-8">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-[300px] w-full mt-4">
                {stats?.topSellingCakes && stats.topSellingCakes.length > 0 ? (
                  <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground/30 gap-4">
                    <TrendingUp className="h-12 w-12" />
                    <p className="font-bold uppercase tracking-widest text-[10px]">No data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Card className="border-border/50 shadow-sm h-full overflow-hidden">
            <CardHeader className="p-6 border-b border-border/50 bg-accent/30">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
                <div className="text-primary font-black uppercase tracking-[0.1em] text-[10px]">Real-time Updates</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors cursor-pointer group">
                    <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center font-bold text-xs text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      #{100 + i}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">Strawberry Cake</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">2 mins ago</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">$45.00</p>
                      <div className="h-1.5 w-1.5 rounded-full bg-primary ml-auto mt-2" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-accent/20">
                <Button variant="outline" className="w-full h-10 rounded-lg font-bold text-xs uppercase tracking-widest border-border/50">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </div>
  );
}
