import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import { OnFileDrop, OnFileDropOff } from "@wailsjs/runtime/runtime";
import { QUERY_KEYS } from "@/constants";
import { installMod } from "@/lib/install";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InstallPanelProps {
  children: React.ReactNode;
}

export default function InstallPanel({ children }: InstallPanelProps) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: installMod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getAllMods] });
    },
  });

  useEffect(() => {
    OnFileDrop((_x, _y, paths) => {
      if (paths.length < 1) return;

      mutate(paths[0]);
    }, true);

    return () => {
      OnFileDropOff();
    };
  }, []);

  const preventDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.detail === 2) {
      e.stopPropagation();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        onClick={preventDoubleClick}
        className="flex w-[400px] flex-col gap-y-4"
      >
        <h1 className="font-bold">Install Mods</h1>
        <div
          onClick={() => mutate("")}
          className={cn(
            "relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-y-3 rounded border border-dashed data-[wails-drop-target-active]:bg-red-500",
            isPending && "animate-pulse"
          )}
          style={{ "--wails-drop-target": "drop" } as React.CSSProperties}
        >
          <DownloadIcon className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Install mods by dropping or clicking here.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
