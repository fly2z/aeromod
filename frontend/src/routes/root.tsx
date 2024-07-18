import { Outlet } from "react-router-dom";
import useSetup from "@/hooks/use-setup";
import Header from "@/components/header";
import SetupDialog from "@/components/setup-modal";

export default function RootLayout() {
  const { status } = useSetup();

  if (status === "LOADING") {
    return <></>;
  }

  if (status === "NOTCOMPLETE") {
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
