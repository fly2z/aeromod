import { Link } from "react-router-dom";
import { msfs } from "@wailsjs/go/models";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import ModToggle from "@/components/mod-toggle";

type ModListProps = {
  mods?: msfs.Mod[];
};

export default function ModList({ mods }: ModListProps) {
  if (!mods) {
    return <div>No mod found.</div>;
  }

  return (
    <div className="flex flex-col gap-y-2 overflow-y-auto py-2">
      {mods.map((m) => (
        <div
          key={m.name}
          className="flex items-center justify-between rounded border bg-muted px-4 py-1"
        >
          <div className="flex items-center gap-x-4">
            <ModToggle modId={m.name} enabled={m.enabled} />
            <Link to={`/mod/${m.name}`}>
              <p className="underline">{m.name}</p>
            </Link>
          </div>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
