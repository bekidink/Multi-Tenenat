

import TeamManagement from "@/components/shared/team/team-management";

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground mt-2">
          Manage members of your organization. Only owners can invite or remove
          members.
        </p>
      </div>

      <TeamManagement />
    </div>
  );
}
