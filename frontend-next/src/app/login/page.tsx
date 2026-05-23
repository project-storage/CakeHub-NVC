"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, LoginDto } from "@/types/auth";
import { authService } from "@/services/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { motion } from "motion/react";
import { Cake, ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      setLoading(true);
      const result = await authService.login(data);
      
      setAuth(result.user, result.accessToken, result.refreshToken);
      
      toast.success("Welcome back");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 md:p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[80px] rounded-full -ml-20 -mb-20 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl blue-sky-premium-gradient text-white shadow-lg shadow-primary/20 mb-4">
            <Cake className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">CakeHub</h1>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Management Suite</p>
        </div>

        <Card className="border-border/50 shadow-xl shadow-primary/5 rounded-2xl bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pt-8 pb-4 text-center">
            <CardTitle className="text-xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-sm">
              Enter your details to access your account
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 px-6 md:px-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            placeholder="name@example.com"
                            type="email"
                            className="pl-10 h-11 bg-background border-border/50 rounded-xl focus-visible:ring-primary/10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input 
                            placeholder="••••••••" 
                            type="password" 
                            className="pl-10 h-11 bg-background border-border/50 rounded-xl focus-visible:ring-primary/10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 p-8 pt-4">
                <Button 
                  variant="premium" 
                  className="w-full h-11 rounded-xl font-bold gap-2 group" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
                <div className="text-center text-xs font-semibold text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-primary hover:underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        <p className="text-center mt-8 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          &copy; 2026 CakeHub Systems
        </p>
      </motion.div>
    </div>
  );
}
