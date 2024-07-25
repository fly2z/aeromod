import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { CompleteSetup, OpenDirectoryDialog } from "@wailsjs/go/main/App";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SetupDialog() {
  const navigate = useNavigate();

  const [modDir, setModDir] = useState<string>();
  const selected = modDir && modDir !== "";

  const selectModDir = async () => {
    try {
      const path = await OpenDirectoryDialog("Select Mod Folder");
      if (path != "") {
        setModDir(path);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const complete = async () => {
    if (!selected) return;

    try {
      await CompleteSetup(modDir);
      toast.success("Setup complete!");
      navigate(0);
    } catch (error) {
      toast.error("Failed to complete setup. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen w-full items-center">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-y-6 px-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome to AeroMod</h1>
          <p className="text-muted-foreground">
            Please select the folder where your mods will be stored.
          </p>
        </div>
        <div className="flex flex-col gap-y-3">
          {!modDir ? (
            <div
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-x-3 rounded-md bg-blue-500 transition-colors hover:bg-blue-600"
              onClick={selectModDir}
            >
              <FolderOpen className="h-6 w-6" />
              <span className="text-sm font-semibold">Select Folder</span>
            </div>
          ) : (
            <div
              className="flex h-12 w-full cursor-pointer items-center justify-center gap-x-3 rounded-md bg-blue-500 transition-colors hover:bg-blue-600"
              onClick={selectModDir}
            >
              <FolderOpen className="h-6 w-6" />
              <span className="text-sm font-semibold">Change Folder</span>
            </div>
          )}
          <div className="flex w-full">
            <Button
              className="h-12 w-full rounded-md"
              variant="outline"
              disabled={!selected}
              onClick={complete}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
