import { useEffect, useState } from "react";
import { IsSetupComplete } from "@wailsjs/go/main/App";

export type SetupStatus = "LOADING" | "COMPLETE" | "NOTCOMPLETE";

export default function useSetup() {
  const [status, setStatus] = useState<SetupStatus>("LOADING");

  useEffect(() => {
    const checkSetup = async () => {
      const isComplete = await IsSetupComplete();
      setStatus(isComplete ? "COMPLETE" : "NOTCOMPLETE");
    };

    checkSetup().catch(console.error);
  }, []);

  return { status };
}
