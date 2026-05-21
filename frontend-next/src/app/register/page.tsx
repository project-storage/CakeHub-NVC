"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerSchema, RegisterDto } from "@/types/auth";
import { authService } from "@/services/api/auth";
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
import { Cake, ArrowRight, Mail, Lock, User as UserIcon } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: RegisterDto) => {
    try {
      setLoading(true);
      await authService.register(data);
      toast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center background-gradient p-6 relative overflow-hidden">
      {/* Decorative premium elements */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -ml-40 -mt-40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 blur-[100px] rounded-full -mr-40 -mb-40 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl blue-sky-premium-gradient text-white shadow-2xl shadow-primary/30 mb-8"
          >
            <Cake className="h-10 w-10" />
          </motion.div>
          <div className="text-center space-y-2">
            <h1 className="text-[40px] font-bold tracking-tight text-slate-900 leading-tight">Create Account</h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Join the CakeHub Community</p>
          </div>
        </div>

        <Card className="border-none shadow-2xl shadow-primary/5 rounded-[24px] overflow-hidden bg-white/70 backdrop-blur-xl border border-white/20">
          <CardHeader className="space-y-2 p-10 pb-6 text-center">
            <CardTitle className="text-2xl font-bold">Get Started</CardTitle>
            <CardDescription className="text-base font-medium">
              Join thousands of students managing their orders today
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6 px-10">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="ml-1">First Name</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input placeholder="John" className="pl-10 h-14 bg-slate-50 border-transparent focus-visible:bg-white focus-visible:border-primary/20 rounded-2xl" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="ml-1">Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" className="h-14 bg-slate-50 border-transparent focus-visible:bg-white focus-visible:border-primary/20 rounded-2xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-1">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <Input
                            placeholder="name@example.com"
                            type="email"
                            className="pl-12 h-14 bg-slate-50 border-transparent focus-visible:bg-white focus-visible:border-primary/20 rounded-2xl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="ml-1">Password</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <Input 
                            placeholder="••••••••" 
                            type="password" 
                            className="pl-12 h-14 bg-slate-50 border-transparent focus-visible:bg-white focus-visible:border-primary/20 rounded-2xl"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col space-y-8 px-10 pb-10 pt-6">
                <Button 
                  variant="premium" 
                  className="w-full h-14 rounded-2xl font-black text-base uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 group" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="text-center text-sm font-bold text-slate-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline underline-offset-4 decoration-2">
                    Sign in here
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
}
