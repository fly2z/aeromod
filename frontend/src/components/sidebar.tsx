import { useLocation, Link } from "react-router-dom";
import { ListIcon, SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const routes = [
  {
    href: "/",
    icon: ListIcon,
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="fixed left-0 top-10 flex h-[calc(100vh-40px)] w-16 flex-col justify-between border-r bg-background py-4">
      <nav className="flex flex-col items-center gap-y-3">
        {routes.map((r) => (
          <Link
            to={r.href}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-md transition-colors",
              pathname === r.href
                ? "bg-accent text-foreground hover:bg-accent/80"
                : "bg-transparent text-muted-foreground hover:bg-accent"
            )}
          >
            <r.icon className="size-5" />
          </Link>
        ))}
      </nav>
      <div className="flex w-full items-center justify-center">
        <Button
          variant={pathname === "/settings" ? "secondary" : "ghost"}
          size="icon"
          asChild
        >
          <Link to="/settings">
            <SettingsIcon
              className={cn(
                "size-5",
                pathname !== "/settings" && "stroke-muted-foreground"
              )}
            />
          </Link>
        </Button>
      </div>
    </div>
  );
}
