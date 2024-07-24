import { Outlet } from "react-router-dom";
import useSetup from "@/hooks/use-setup";
import SetupDialog from "@/components/setup-modal";
import Sidebar from "@/components/sidebar";

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
      <Sidebar />
      <main className="h-screen pl-16 pt-10">
        <Outlet />
      </main>
    </>
  );
}
