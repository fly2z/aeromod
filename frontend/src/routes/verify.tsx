import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetModNames, VerifyMod } from "@wailsjs/go/main/App";
import { QUERY_KEYS } from "@/constants";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import ModSelect from "@/components/mod-select";
import { humanFileSize } from "@/lib/utils";

export default function VerifyPage() {
  const [selectedModName, setSelectedModName] = useState<string>();

  const { data: mods } = useQuery({
    queryKey: [QUERY_KEYS.getModNames],
    queryFn: async () => GetModNames(),
  });

  const {
    data: results,
    isSuccess,
    isPending,
    mutate,
  } = useMutation({
    mutationFn: (modName: string) => {
      return VerifyMod(modName);
    },
    onError: () => toast.error("Failed to verify mod."),
  });

  const sortedResults = useMemo(() => {
    if (!results) return [];

    return results.slice().sort((a, b) => {
      // sort by 'found' property, placing found items before unfound items
      if (!a.found && b.found) {
        return -1;
      } else if (a.found && !b.found) {
        return 1;
      }

      // if both items have the same 'found' status, sort by 'size_ok' status
      if (!a.size_ok && b.size_ok) {
        return -1;
      } else if (a.size_ok && !b.size_ok) {
        return 1;
      }

      // sort by file size if no problems found
      if (a.size > b.size) {
        return -1;
      } else if (a.size < b.size) {
        return 1;
      }

      return 0;
    });
  }, [results]);

  const handleClick = () => {
    if (!selectedModName || selectedModName === "") return;

    mutate(selectedModName);
  };

  return (
    <div className="flex h-full flex-col gap-y-6 px-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold">Verify Mods</h1>
      </div>
      <div className="flex w-full items-center justify-between gap-x-4">
        <ModSelect mods={mods} onSelect={(v) => setSelectedModName(v)} />
        <div>
          <Button
            onClick={handleClick}
            disabled={isPending}
            className="gap-x-2"
            type="submit"
          >
            <CheckCircle2 className="size-4" /> Verify
          </Button>
        </div>
      </div>
      {isSuccess && (
        <div className="flex h-full flex-col gap-y-3 overflow-y-auto">
          {sortedResults?.map((r) => {
            const hasErrors = r.error.length > 0;

            return (
              <div
                key={r.path}
                className="flex w-full items-center justify-between rounded-md bg-muted px-2 py-1"
              >
                <div className="flex items-center gap-x-2">
                  {hasErrors ? (
                    <div className="size-4 rounded-full bg-destructive"></div>
                  ) : (
                    <div className="size-4 rounded-full bg-green-500"></div>
                  )}
                  <div>
                    <span className="w-full text-sm">{r.path}</span>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <span className="text-sm text-muted-foreground">
                    {humanFileSize(r.size)}
                  </span>
                  {hasErrors && (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger>
                        <div className="flex items-center gap-x-1 px-2 text-destructive">
                          <CircleAlert className="size-4" />
                          <span className="text-sm">
                            {r.found ? "Has Problems" : "Not Found"}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-[600px]">
                        <h1 className="text-lg font-semibold">Problems</h1>
                        <p className="py-1 text-muted-foreground">{r.error}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
