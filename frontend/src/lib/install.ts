import { toast } from "sonner";
import { InstallMod } from "@wailsjs/go/main/App";

export async function installMod() {
  try {
    const installed = await InstallMod();
    if (!installed) return;

    toast.success("Mod installed successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to install mod. Please try again.");
  }
}
