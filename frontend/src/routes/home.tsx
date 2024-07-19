import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircleAlert, RefreshCw } from "lucide-react";
import { GetMods } from "@wailsjs/go/main/App";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ModList from "@/components/mod-list";

export default function HomePage() {
  const {
    isPending,
    error,
    data: mods,
    refetch,
  } = useQuery({
    queryKey: ["getMods"],
    queryFn: async () => GetMods(),
    retry: false,
  });

  const [search, setSearch] = useState<string>("");
  const filteredMods = useMemo(
    () =>
      mods?.filter(({ name }) =>
        name.toLowerCase().trim().includes(search.toLowerCase().trim())
      ),
    [mods, search]
  );

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-4">
        <div className="flex flex-col items-center gap-y-2">
          <CircleAlert className="size-10 stroke-red-500" />
          <span className="text-xl text-red-500">Failed to fetch mods</span>
        </div>
        <Button onClick={() => refetch()} className="gap-x-2" variant="ghost">
          <RefreshCw className="size-5" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-y-2 px-4 py-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="px-2 text-2xl font-medium">All Mods</h1>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[300px]"
          placeholder="Search mods..."
        />
      </div>
      <ModList mods={filteredMods} loading={isPending} />
    </div>
  );
}
