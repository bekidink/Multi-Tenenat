
import { Card } from "@/components/ui/card";

interface Props {
  name: string;
  slug: string;
  stats: { totalMembers: number; totalOutlines: number };
}

export default function TeamHeader({ name, slug, stats }: Props) {
  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-muted-foreground">@{slug}</p>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.totalMembers}</div>
            <div className="text-sm text-muted-foreground">Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.totalOutlines}</div>
            <div className="text-sm text-muted-foreground">Outlines</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
