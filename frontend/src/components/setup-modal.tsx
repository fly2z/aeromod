import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CompleteSetup,
  FindSimCommunityFolder,
  OpenDirectoryDialog,
} from "@wailsjs/go/main/App";
import { ArrowLeft, CheckCircle2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SetupDialog() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);

  const [communityDir, setCommumityDir] = useState<string | null>(null);
  const [autoDetected, setAutoDetected] = useState(false);
  const [modDir, setModDir] = useState<string | null>(null);

  useEffect(() => {
    const autoDetectCommunityFolder = async () => {
      try {
        const path = await FindSimCommunityFolder();
        setCommumityDir(path);
        setAutoDetected(true);
      } catch (error) {
        console.log(error);
      }
    };

    autoDetectCommunityFolder();
  }, []);

  const selectCommunityDir = async () => {
    try {
      const path = await OpenDirectoryDialog("Select Community Folder");
      if (path !== "") {
        setCommumityDir(path);
        setAutoDetected(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectModDir = async () => {
    try {
      const path = await OpenDirectoryDialog("Select Mod Folder");
      if (path !== "") {
        setModDir(path);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const complete = async () => {
    if (!communityDir || !modDir) return;

    try {
      await CompleteSetup(communityDir, modDir);
      toast.success("Setup complete!");
      navigate(0);
    } catch (error) {
      toast.error(`Error: ${error}`);
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen w-full items-center">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-y-6 px-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome to AeroMod</h1>
          <p className="text-muted-foreground">
            {step === 0
              ? "Please select the MSFS community folder."
              : "Please select the folder where your mods will be stored."}
          </p>
        </div>
        {step === 0 ? (
          <div className="flex flex-col gap-y-3">
            {!communityDir ? (
              <div
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-x-3 rounded-md bg-blue-500 transition-colors hover:bg-blue-600"
                onClick={selectCommunityDir}
              >
                <FolderOpen className="h-6 w-6" />
                <span className="text-sm font-semibold">Select Folder</span>
              </div>
            ) : (
              <div
                className="flex h-12 w-full cursor-pointer items-center justify-center gap-x-3 rounded-md bg-blue-500 transition-colors hover:bg-blue-600"
                onClick={selectCommunityDir}
              >
                <FolderOpen className="h-6 w-6" />
                <span className="text-sm font-semibold">
                  Change Folder {autoDetected && "(Auto Detected)"}
                </span>
              </div>
            )}
            <div className="flex w-full">
              <Button
                className="h-12 w-full rounded-md"
                variant="outline"
                disabled={!communityDir}
                onClick={() => setStep(1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
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
            <div className="flex w-full gap-x-2">
              <Button
                className="h-12 w-full gap-x-2"
                variant="ghost"
                onClick={() => setStep(0)}
              >
                <ArrowLeft className="size-5" />
                Back
              </Button>
              <Button
                className="h-12 w-full gap-x-2"
                variant="default"
                disabled={!modDir}
                onClick={complete}
              >
                <CheckCircle2 className="size-5" />
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
