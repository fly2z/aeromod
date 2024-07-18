import { useState } from "react";
import { toast } from "sonner";
import { EnableMod, DisableMod } from "@wailsjs/go/main/App";
import { Checkbox } from "@/components/ui/checkbox";

type ModToggleProps = {
  modId: string;
  enabled?: boolean;
};

export default function ModToggle({ modId, enabled = true }: ModToggleProps) {
  const [checked, setChecked] = useState<boolean>(enabled);

  const onChange = async (event: boolean | "indeterminate") => {
    if (event === "indeterminate") return;

    if (event) {
      EnableMod(modId)
        .catch(() => toast.error("Failed to enable mod."))
        .then(() => {
          toast.success("Mod enabled successfully.");
          setChecked(true);
        });
    } else {
      DisableMod(modId)
        .catch(() => toast.error("Failed to disable mod."))
        .then(() => {
          toast.success("Mod disabled successfully.");
          setChecked(false);
        });
    }
  };

  return <Checkbox checked={checked} onCheckedChange={onChange} />;
}
