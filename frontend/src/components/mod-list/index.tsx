import { Link } from "react-router-dom";
import { Loader2, MoreHorizontal } from "lucide-react";
import { msfs } from "@wailsjs/go/models";

import { Button } from "@/components/ui/button";
import ModToggle from "./toggle";
import ModActions from "./actions";

type ModListProps = {
  mods?: msfs.Mod[];
  loading?: boolean;
};

export default function ModList({ mods = [], loading = false }: ModListProps) {
  if (loading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  if (mods.length < 1) {
    return (
      <div className="flex h-full w-full items-center justify-center text-2xl font-semibold">
        No mod found
      </div>
    );
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
          <ModActions>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </ModActions>
        </div>
      ))}
    </div>
  );
}
