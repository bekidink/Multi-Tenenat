"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";


const signInSchema = z.object({
  email: z.string().min(1,"Email is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setLoading(true);
    try {
      await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });
toast.success("Logged in successfully")
      // Refresh session + redirect
      router.refresh();
      setTimeout(() => router.push("/dashboard"), 100);
    } catch (err: any) {
      form.setError("root", {
        message: err.message || "Invalid email or password",
      });
      toast.error(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sign in to continue to your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-5">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@company.com"
                          disabled={loading}
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          disabled={loading}
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Server Error */}
                {form.formState.errors.root && (
                  <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm text-center border border-destructive/20">
                    {form.formState.errors.root.message}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base font-semibold"
                  disabled={loading || !form.formState.isDirty}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <a
              href="/sign-up"
              className="font-semibold text-primary hover:underline transition-all"
            >
              Sign up here
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
