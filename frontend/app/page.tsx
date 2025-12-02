// app/page.tsx
import { authClient } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  FileText,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const session = await authClient.getSession();

  
  if (session.data?.user) {
    redirect("/dashboard");
  }

  return (
    <>
     
      <section className="relative overflow-hidden  from-purple-50 via-white to-pink-50 px-6 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-purple-600 to-pink-600 text-4xl font-bold text-white shadow-2xl">
              A
            </div>
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Build Winning Proposals
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Faster Than Ever
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-600">
            A multi-tenant workspace for teams to create, collaborate, and
            manage proposal outlines with role-based access.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="rounded-full px-8 shadow-lg">
              <Link href="/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900">
              Everything your team needs
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2 hover:border-purple-300 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle>Outline Management</CardTitle>
                <CardDescription>
                  Structure proposals with sections, headers, and rich content
                  using a beautiful sheet editor.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-300 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Invite members with Owner or Member roles. Only owners can
                  manage the team.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-300 transition-colors">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <CardTitle>Multi-Tenant Ready</CardTitle>
                <CardDescription>
                  Work across multiple organizations with seamless switching and
                  data isolation.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

    

      {/* Final CTA */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-4xl font-bold">Ready to get started?</h2>
          <p className="mb-10 text-xl text-gray-600">
            Join thousands of teams building better proposals.
          </p>
          <Button asChild size="lg" className="rounded-full px-10 shadow-xl">
            <Link href="/sign-up">
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
