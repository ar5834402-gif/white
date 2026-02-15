import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FindGift() {
  const [_, setLocation] = useLocation();
  const form = useForm({
    defaultValues: { username: "" },
    resolver: zodResolver(z.object({ username: z.string().min(1) }))
  });

  const onSubmit = (data: { username: string }) => {
    setLocation(`/view/${data.username}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-panel border-none">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-rose-600 font-serif">
            Find Your Gift
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>His Username</Label>
              <Input 
                {...form.register("username")} 
                placeholder="Enter his username" 
                className="bg-white/50 border-rose-200 focus:border-rose-400 focus:ring-rose-200" 
              />
            </div>

            <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200">
              Go to Gift Page
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
