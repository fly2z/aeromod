import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="fixed left-0 top-0 z-50 h-14 w-full border-b bg-muted/80 backdrop-blur-sm">
      <div className="flex h-full w-full items-center justify-between px-6">
        <Link to="/">
          <h1 className="text-xl font-semibold">Mod Manager</h1>
        </Link>
        <Button variant="outline" size="icon" asChild>
          <Link to="/settings">
            <Settings className="size-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
