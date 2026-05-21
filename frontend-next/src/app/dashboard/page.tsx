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
    return <div className="text-destructive p-10 bg-rose-50 rounded-2xl border border-rose-100 font-bold">Error loading dashboard statistics. Please try again.</div>;
  }

  const metrics = [
    { 
      title: "Gross Revenue", 
      value: `$${stats?.totalRevenue?.toLocaleString() || "0"}`, 
      trend: "+12.5%", 
      isUp: true,
      icon: CreditCard,
      bg: "bg-blue-50 dark:bg-blue-900/20",
      accent: "text-blue-600",
      label: "vs last month"
    },
    { 
      title: "New Orders", 
      value: stats?.totalOrders?.toString() || "0", 
      trend: "+5.2%", 
      isUp: true,
      icon: ShoppingBag,
      bg: "bg-sky-50 dark:bg-sky-900/20",
      accent: "text-sky-600",
      label: "vs last month"
    },
    { 
      title: "Customer Growth", 
      value: "142", 
      trend: "+8.1%", 
      isUp: true,
      icon: Users,
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      accent: "text-indigo-600",
      label: "new students"
    },
    { 
      title: "Average Sale", 
      value: `$${(stats?.totalRevenue && stats?.totalOrders) ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : "0"}`, 
      trend: "-2.4%", 
      isUp: false,
      icon: TrendingUp,
      bg: "bg-slate-50 dark:bg-slate-900/20",
      accent: "text-slate-600",
      label: "per order"
    },
  ];

  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
      borderColor: '#E2E8F0',
      textStyle: { color: '#0F172A', fontWeight: 'bold' },
      borderRadius: 12,
      padding: 12,
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.05)'
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: stats?.topSellingCakes?.map(c => c.cakeName) || [],
      axisLabel: { color: '#94A3B8', fontSize: 12, fontWeight: 500, interval: 0, rotate: 25 },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: { 
      type: 'value',
      axisLabel: { color: '#94A3B8', fontSize: 12 },
      splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } },
      axisLine: { show: false },
      axisTick: { show: false }
    },
    series: [
      { 
        data: stats?.topSellingCakes?.map(c => c.quantitySold) || [], 
        type: 'bar', 
        barWidth: '35%',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#1D4ED8' },
              { offset: 1, color: '#38BDF8' }
            ]
          }
        },
        showBackground: true,
        backgroundStyle: { color: '#F8FAFC', borderRadius: 8 }
      },
    ]
  };

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <span className="w-8 h-[2px] bg-primary" />
            Overview
          </div>
          <h1 className="text-[48px] font-bold tracking-tight text-slate-900 dark:text-white">Good Morning, Admin</h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl">Welcome back to your workspace. Here is an overview of your cake business performance today.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-14 px-8 font-bold rounded-2xl border-slate-200">
            Download Report
          </Button>
          <Button variant="premium" className="h-14 px-8 font-bold rounded-2xl shadow-xl shadow-primary/20">
            Create Order
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="border-none shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-8">
                  <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300", metric.bg)}>
                    <metric.icon className={cn("h-7 w-7", metric.accent)} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full",
                    metric.isUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                  )}>
                    {metric.isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {metric.trend}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{metric.title}</p>
                  <div className="text-[32px] font-bold text-slate-900 dark:text-white leading-tight">{metric.value}</div>
                  <p className="text-xs text-slate-400 font-bold">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="border-none shadow-sm h-full flex flex-col">
            <CardHeader className="p-10 pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold">Revenue Analytics</CardTitle>
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Top Performing Categories</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-600">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Sales
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 pt-6 flex-1">
              <div className="h-[420px] w-full">
                {stats?.topSellingCakes && stats.topSellingCakes.length > 0 ? (
                  <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-6">
                    <div className="p-8 rounded-full bg-slate-50">
                      <TrendingUp className="h-16 w-16 opacity-30" />
                    </div>
                    <p className="font-black uppercase tracking-widest text-sm">No data recorded for this period</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="border-none shadow-2xl shadow-primary/5 bg-slate-900 text-white h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-125" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 blur-[80px] rounded-full -ml-40 -mb-40" />
            
            <CardHeader className="relative z-10 p-10">
              <div className="space-y-2">
                <div className="text-sky-400 font-black uppercase tracking-[0.2em] text-[10px]">Real-time Updates</div>
                <CardTitle className="text-2xl font-bold">Recent Orders</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-10 pb-10 relative z-10 flex flex-col h-[calc(100%-140px)]">
              <div className="space-y-6 flex-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-5 p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/item">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-sky-400 group-hover/item:scale-110 transition-transform">
                      #{100 + i}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate text-base group-hover/item:text-sky-300 transition-colors">Strawberry Shortcake</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">2 mins ago</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sky-400">$45.00</p>
                      <div className="h-1.5 w-1.5 rounded-full bg-sky-400 ml-auto mt-2 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full h-14 bg-white text-slate-900 font-black rounded-2xl shadow-xl hover:bg-slate-50 mt-10 text-base uppercase tracking-widest">
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-12">
      <div className="space-y-4">
        <div className="h-4 w-32 bg-slate-200 animate-pulse rounded-full" />
        <div className="h-16 w-96 bg-slate-200 animate-pulse rounded-2xl" />
        <div className="h-4 w-128 bg-slate-200 animate-pulse rounded-full" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="h-48 rounded-2xl border-none bg-slate-100 animate-pulse" />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 h-[600px] rounded-2xl border-none bg-slate-100 animate-pulse" />
        <Card className="h-[600px] rounded-2xl border-none bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}
