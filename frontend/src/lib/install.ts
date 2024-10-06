import { toast } from "sonner";
import { InstallMod } from "@wailsjs/go/main/App";

export async function installMod(path?: string) {
  try {
    const installed = await InstallMod(path || "");
    if (!installed) return;

    toast.success("Mod installed successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to install mod. Please try again.");
  }
}
