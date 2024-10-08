import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { msfs } from "@wailsjs/go/models";
import { RevealMod, UninsallMod } from "@wailsjs/go/main/App";
import useSettings from "@/hooks/use-settings";

import { Button } from "@/components/ui/button";
import ModToggle from "./toggle";
import ModActions from "./actions";
import ConfirmDialog from "./confirm";

type ModListProps = {
  mods?: msfs.Mod[];
  loading?: boolean;
  onReload: () => void;
};

type ConfirmPrompt = {
  title?: string;
  description?: string;
  onConfirm: () => void;
};

export default function ModList({
  mods = [],
  loading = false,
  onReload,
}: ModListProps) {
  const { settings } = useSettings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmPrompt, setConfirmPrompt] = useState<ConfirmPrompt>({
    title: "",
    description: "",
    onConfirm: () => {},
  });

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

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setConfirmPrompt({ title: "", description: "", onConfirm: () => {} });
  };

  const uninstallMod = async (name: string) => {
    if (name === "") {
      handleDialogClose();
      return;
    }

    const onConfirm = () => {
      UninsallMod(name)
        .then(() => {
          toast.success("Mod uninstalled successfully");
          onReload();
        })
        .catch((err) => {
          toast.error("Failed to uninstall mod");
          console.error(err);
        });
      handleDialogClose();
    };

    setConfirmPrompt({
      title: `Are you sure you want to delete ${name}`,
      description:
        "This action cannot be undone. This will permanently delete the selected mod.",
      onConfirm: onConfirm,
    });
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-y-2 overflow-y-auto py-2">
        {mods.map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between rounded border bg-muted px-4 py-1"
          >
            <div className="flex items-center gap-x-4">
              <ModToggle modId={m.name} enabled={m.enabled} />
              {settings?.show_mod_details ? (
                <div>
                  <Link to={`/mod/${m.name}`}>
                    <p className="underline">{m.name}</p>
                  </Link>
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm text-muted-foreground">
                      {m.creator}
                    </span>
                    <span className="text-sm">v{m.version}</span>
                  </div>
                </div>
              ) : (
                <Link to={`/mod/${m.name}`}>
                  <p className="underline">{m.name}</p>
                </Link>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              <div className="px-3 py-2 text-sm">
                <span className="text-muted-foreground">{m.type}</span>
              </div>
              <ModActions
                onUninstall={() => uninstallMod(m.name)}
                onReveal={() => RevealMod(m.name)}
              >
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </ModActions>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog
        title={confirmPrompt.title}
        description={confirmPrompt.description}
        onOpenChange={handleDialogClose}
        isOpen={isDialogOpen}
        onConfirm={confirmPrompt.onConfirm}
      />
    </>
  );
}
