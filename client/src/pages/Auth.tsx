import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema } from "@shared/schema";

interface AuthProps {
  mode: "login" | "register";
}

export default function Auth({ mode }: AuthProps) {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  
  const form = useForm({
    resolver: zodResolver(
      mode === "register" 
        ? insertUserSchema 
        : z.object({ username: z.string(), password: z.string() })
    ),
  });

  const onSubmit = async (data: any) => {
    try {
      if (mode === "login") {
        await loginMutation.mutateAsync(data);
      } else {
        await registerMutation.mutateAsync(data);
        toast({ title: "Welcome!", description: "Account created successfully. Please log in." });
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive",
        title: "Error", 
        description: error.message 
      });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-panel border-none">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-rose-600 font-serif">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input {...form.register("username")} className="bg-white/50 border-rose-200 focus:border-rose-400 focus:ring-rose-200" />
              {form.formState.errors.username && (
                <p className="text-xs text-red-500">{String(form.formState.errors.username.message)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" {...form.register("password")} className="bg-white/50 border-rose-200 focus:border-rose-400 focus:ring-rose-200" />
            </div>

            {mode === "register" && (
              <>
                <div className="space-y-2">
                  <Label>Her Name</Label>
                  <Input {...form.register("girlfriendName")} placeholder="e.g. Alice" className="bg-white/50 border-rose-200" />
                </div>
                <div className="space-y-2">
                  <Label>Secret Password for Her</Label>
                  <Input {...form.register("girlfriendPassword")} placeholder="Something only she knows" className="bg-white/50 border-rose-200" />
                  <p className="text-xs text-muted-foreground">She will use this to unlock your gift.</p>
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200"
              disabled={isPending}
            >
              {isPending ? "Please wait..." : (mode === "login" ? "Log In" : "Sign Up")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button variant="link" onClick={() => setLocation(mode === "login" ? "/register" : "/login")} className="text-rose-500">
              {mode === "login" ? "Need an account? Register" : "Have an account? Login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
