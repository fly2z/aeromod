import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { IsSetupComplete } from "@wailsjs/go/main/App";

import Header from "@/components/header";
import SetupDialog from "@/components/setup-modal";

type SetupStatus = "LOADING" | "COMPLETE" | "NOTCOMPLETE";

export default function RootLayout() {
  const [setupStatus, setSetupStatus] = useState<SetupStatus>("LOADING");

  useEffect(() => {
    const checkSetup = async () => {
      const isSetupComplete = await IsSetupComplete();
      setSetupStatus(isSetupComplete ? "COMPLETE" : "NOTCOMPLETE");
    };

    checkSetup();
  }, []);

  if (setupStatus === "LOADING") {
    return <></>;
  }

  if (setupStatus === "NOTCOMPLETE") {
    return (
      <>
        <SetupDialog />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="h-screen pt-14">
        <Outlet />
      </main>
    </>
  );
}
