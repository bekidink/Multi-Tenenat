
"use client";

import { useEffect, useState } from "react";
import TeamHeader from "./team-header";
import TeamTable from "./team-table";
import { toast } from "sonner";
import api from "@/lib/api";
import TeamTableSkeleton from "./team-table-skeleton";

interface TeamData {
  organization: {
    id: string;
    name: string;
    slug: string;
    statistics: {
      totalMembers: number;
      owners: number;
      members: number;
      totalOutlines: number;
    };
    owner: { id: string; name: string; email: string };
  };
  members: Array<{
    id: string;
    userId: string;
    organizationId: string;
    role: "owner" | "member";
    createdAt: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      createdAt: string;
      isCurrentUser: boolean;
    };
  }>;
  currentUserRole: "owner" | "member";
}

export default function TeamManagement() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const response = await api.get("/team");
      setTeamData(response.data);
    } catch (err) {
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);
if (loading) {
  return <TeamTableSkeleton />;
}
  if (!teamData) return null;

  const isOwner = teamData.currentUserRole === "owner";
  const currentUserId = teamData.members.find(m => m.user.isCurrentUser)?.userId || "";

  return (
    <div className="space-y-8">
      <TeamHeader
        name={teamData.organization.name}
        slug={teamData.organization.slug}
        stats={teamData.organization.statistics}
      />

      <TeamTable
        members={teamData.members}
        isOwner={isOwner}
        currentUserId={currentUserId}
        loading={loading}
        onRefresh={fetchTeam}
      />
    </div>
  );
}