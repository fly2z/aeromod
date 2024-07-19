import { Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ModActionsProps = {
  children: React.ReactNode;
};

export default function ModActions({ children }: ModActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Mod Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* TODO: Implement confirm modal and uninstall */}
        <DropdownMenuItem>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Uninstall</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
