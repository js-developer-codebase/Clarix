"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Loader2, ShieldCheck, Sparkle } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        toast.error("Invalid credentials", {
          description: "Please check your email and password.",
        });
        return;
      }

      toast.success("Login successful", {
        description: "Redirecting you...",
      });
      
      // Simply refresh and the middleware will handle the correct destination
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0a] relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#f5c84205,transparent_50%)]" />
      
      <div className="w-full max-w-md z-10 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-12 w-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(245,200,66,0.1)]">
            <Sparkle className="h-6 w-6 text-gold-500 stroke-[2.5px]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans italic">
            Clarix<span className="text-gold-500">.</span>
          </h1>
          <p className="text-sm text-zinc-500 max-w-[280px]">
            The intelligent subscription stack for modern companies.
          </p>
        </div>

        <Card className="bg-[#0f0f0f] border-[#1a1a1a] shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-white uppercase tracking-wider text-[11px]">
              Access Control
            </CardTitle>
            <CardDescription className="text-zinc-500 text-xs">
              Securely enter your administrative credentials.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@company.in" 
                          {...field} 
                          className="bg-[#0a0a0a] border-[#1a1a1a] h-11 text-sm focus-visible:ring-gold-500"
                        />
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
                      <FormLabel className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Master Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="bg-[#0a0a0a] border-[#1a1a1a] h-11 text-sm focus-visible:ring-gold-500"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gold-500 text-black hover:bg-gold-600 h-11 transition-all rounded font-bold uppercase tracking-widest text-xs mt-2"
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Authorize Access"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t border-[#1a1a1a] pt-4">
            <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3.5 h-3.5" />
              AES-256 Bit Encryption Active
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-[10px] text-zinc-600 font-medium tracking-wide">
          Enterprise Security Standard · 2026 Clarix India
        </p>
      </div>
    </div>
  );
}
