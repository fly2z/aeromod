import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  CircleAlert,
  Download,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { GetAllMods } from "@wailsjs/go/main/App";
import { installMod } from "@/lib/install";
import { QUERY_KEYS } from "@/constants";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import ModList from "@/components/mod-list";

export default function HomePage() {
  const {
    isPending,
    error,
    data: mods,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.getAllMods],
    queryFn: () => GetAllMods(),
    retry: false,
  });

  const installMutation = useMutation({
    mutationFn: () => installMod(),
    onSuccess: () => refetch(),
  });

  const [search, setSearch] = useState<string>("");

  const contentTypes = useMemo(
    () => [...new Set(mods?.map((mod) => mod.type))],
    [mods]
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    "enabled" | "disabled" | null
  >(null);

  const filteredMods = useMemo(
    () =>
      mods?.filter(
        ({ name, type, enabled }) =>
          name.toLowerCase().trim().includes(search.toLowerCase().trim()) &&
          (selectedTypes.length === 0 || selectedTypes.includes(type)) &&
          (selectedStatus === null ||
            (enabled
              ? selectedStatus === "enabled"
              : selectedStatus === "disabled"))
      ),
    [mods, search, selectedTypes, selectedStatus]
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
    <div className="flex h-full flex-col gap-y-2 px-6 py-4">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-semibold">All Mods</h1>
        <div className="flex items-center gap-x-4">
          <Hint label="Reload Mods" side="bottom">
            <Button variant="ghost" size="icon" onClick={() => refetch()}>
              <RefreshCw className="size-5 stroke-muted-foreground" />
            </Button>
          </Hint>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px]"
            placeholder="Search mods..."
          />
          <Button
            onClick={() => installMutation.mutate()}
            disabled={installMutation.isPending}
            className="gap-x-2"
          >
            {installMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            {installMutation.isPending ? "Installing..." : "Install"}
          </Button>
        </div>
      </div>
      {!isPending && (
        <div className="flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-x-2">
                Filter by Type
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {contentTypes.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={selectedTypes.includes(t)}
                  onCheckedChange={(c) => {
                    if (c) {
                      setSelectedTypes((prevTypes) => [...prevTypes, t]);
                    } else {
                      setSelectedTypes((prevTypes) =>
                        prevTypes.filter((type) => type !== t)
                      );
                    }
                  }}
                >
                  {t}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-x-2">
                Filter by Status
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuCheckboxItem
                checked={selectedStatus === "enabled"}
                onCheckedChange={(c) => {
                  if (c) {
                    setSelectedStatus("enabled");
                  } else {
                    setSelectedStatus(null);
                  }
                }}
              >
                Enabled
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedStatus === "disabled"}
                onCheckedChange={(c) => {
                  if (c) {
                    setSelectedStatus("disabled");
                  } else {
                    setSelectedStatus(null);
                  }
                }}
              >
                Disabled
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <ModList mods={filteredMods} loading={isPending} onReload={refetch} />
    </div>
  );
}
