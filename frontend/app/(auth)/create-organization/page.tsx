"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {  Loader2 } from "lucide-react";
import { toast } from "sonner";


const formSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(100, "Name must be less than 100 characters"),
  slug: z
    .string()
    .min(1, "URL slug is required")
    .max(50, "Slug must be less than 50 characters")
    ,
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateOrg() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    

    try {
   const res=   await authClient.organization.create({
        name: values.name,
        slug: values.slug,
      });
      if (res?.error) {
        toast.error(res?.error.message || "Invalid email or password");
      } else {
        router.push("/dashboard");
        toast.success("Your Organization created sussfully");
      }
      
    } catch (err: any) {
      toast.error("An error occurred while creating the organization");
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Only update slug if user hasn't manually modified it
    if (
      !form.getValues("slug") ||
      form.getValues("slug") ===
        form.getValues("name")
          
          .replace(/\s+/g, "-")
    ) {
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Organization
          </CardTitle>
          <CardDescription className="text-center">
            Create a new organization to get started with your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Acme Inc."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleNameChange(e);
                        }}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>URL Slug</FormLabel>
                      
                    </div>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          /
                        </span>
                        <Input
                          placeholder="acme-inc"
                          className="pl-8"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.toLowerCase();
                            field.onChange(value);
                          }}
                          disabled={loading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                   
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Organization"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>You can invite team members after creating the organization.</p>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
