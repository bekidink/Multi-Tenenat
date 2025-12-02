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


const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1,"Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[a-z]/, "Must contain one lowercase letter")
    .regex(/[0-9]/, "Must contain one number")
    .regex(/[^A-Za-z0-9]/, "Must contain one special character"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setLoading(true);
    try {
      await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      router.push("/create-organization");
    } catch (err: any) {
      form.setError("root", {
        message: err.message || "Failed to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-8">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Create your account
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Start building winning proposals with your team
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        disabled={loading}
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="john@company.com"
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
                        placeholder="Create a strong password"
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
                disabled={
                  loading 
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          {/* Sign In Link */}
          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <a
              href="/sign-in"
              className="font-semibold text-primary hover:underline transition-all"
            >
              Sign in here
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
