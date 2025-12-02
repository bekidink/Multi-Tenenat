
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";
import { SectionType, StatusType, ReviewerType } from "@/types/enums";
import { authClient } from "@/lib/auth";
import api from "@/lib/api";


const formSchema = z.object({
  header: z
    .string()
    .min(1, "Header is required")
    .max(100, "Header must be less than 100 characters"),
  sectionType: z.enum([
    SectionType.Table_of_Contents,
    SectionType.Executive_Summary,
    SectionType.Technical_Approach,
    SectionType.Design,
    SectionType.Capabilities,
    SectionType.Focus_Document,
    SectionType.Narrative,
  ]),
  status: z.enum([
    StatusType.Pending,
    StatusType.In_Progress,
    StatusType.Completed,
  ]),
  target: z
    .number()
    .int("Must be a whole number")
    .min(0, "Target cannot be negative")
    .max(1000, "Target cannot exceed 1000"),

  limit: z
    .number()
    .int("Must be a whole number")
    .min(0, "Limit cannot be negative")
    .max(1000, "Limit cannot exceed 1000"),
  reviewer: z.enum([ReviewerType.Assim, ReviewerType.Bini, ReviewerType.Mami]),
});

type FormValues = z.infer<typeof formSchema>;

interface OutlineFormProps {
  outline?: FormValues & { id: string };
  onSuccess: () => void;
  onCancel?: () => void;
  organizationId?: string;
}

export default function OutlineForm({
  outline,
  onSuccess,
  onCancel,
  organizationId,
}: OutlineFormProps) {
  const [loading, setLoading] = useState(false);
  const [orgId, setOrgId] = useState(organizationId || "");

  // Initialize form
  const form = useForm<FormValues>({
   resolver: zodResolver(formSchema),
    defaultValues: outline
      ? {
          header: outline.header,
          sectionType: outline.sectionType,
          status: outline.status,
          target: outline.target,
          limit: outline.limit,
          reviewer: outline.reviewer,
        }
      : {
          header: "",
          sectionType: SectionType.Table_of_Contents,
          status: StatusType.Pending,
          target: 0,
          limit: 0,
          reviewer: ReviewerType.Assim,
        },
  });

  // Load organization ID if not provided
  useEffect(() => {
    if (!organizationId) {
      authClient
        .getSession()
        .then((session) => {
          const activeOrgId = session.data?.session?.activeOrganizationId;
          if (activeOrgId) {
            setOrgId(activeOrgId);
          }
        })
        .catch(() => {
          toast.error("Failed to load organization");
        });
    }
  }, [organizationId]);

  // Format section type for display
  const formatSectionType = (type: string) => {
    return type
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!orgId) {
      toast.error("No organization selected");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...values,
        organizationId: orgId,
      };

      if (outline?.id) {
        // Update existing outline
        await api.patch(`/outlines/${outline.id}`, payload);
        toast.success("Outline updated successfully");
      } else {
        // Create new outline
        await api.post("/outlines", payload);
        toast.success("Outline created successfully");
      }

      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error("Form submission error:", error);

      // Handle validation errors from server
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: any) => {
          if (err.path && err.message) {
            form.setError(err.path, {
              type: "server",
              message: err.message,
            });
          }
        });
        toast.error("Please check the form for errors");
      } else {
        toast.error(error.response?.data?.message || "Failed to save outline");
        
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    form.reset();
    if (onCancel) {
      onCancel();
    }
  };

 

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 mx-auto"
      >
        {/* Header Field */}
        <FormField
          control={form.control}
          name="header"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Header</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter section header"
                  {...field}
                  className="h-11"
                  disabled={loading}
                />
              </FormControl>
              <FormDescription className="text-xs">
                The main title for this section
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section Type */}
          <FormField
            control={form.control}
            name="sectionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Section Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select section type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(SectionType).map((type) => (
                      <SelectItem key={type} value={type} className="py-3">
                        {formatSectionType(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={StatusType.Pending} className="py-3">
                      Pending
                    </SelectItem>
                    <SelectItem value={StatusType.In_Progress} className="py-3">
                      In Progress
                    </SelectItem>
                    <SelectItem value={StatusType.Completed} className="py-3">
                      Completed
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target */}
          <FormField
            control={form.control}
            name="target"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Target</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-11"
                    min={0}
                    disabled={loading}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      field.onChange(value);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Limit */}
          <FormField
            control={form.control}
            name="limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Limit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    className="h-11"
                    min={0}
                    disabled={loading}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      field.onChange(value);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

       
        <FormField
          control={form.control}
          name="reviewer"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Reviewer</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ReviewerType).map((reviewer) => (
                    <SelectItem
                      key={reviewer}
                      value={reviewer}
                      className="py-3"
                    >
                      {reviewer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

       
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading || !form.formState.isValid}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {outline ? "Update Outline" : "Create Outline"}
              </>
            )}
          </Button>
        </div>

        {/* Form Status */}
        {form.formState.errors.root && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200">
            <p className="text-sm text-red-800">
              {form.formState.errors.root.message}
            </p>
          </div>
        )}
      </form>
    </Form>
  );
}
