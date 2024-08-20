import { FoldersIcon, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ModActionsProps = {
  onReveal: () => void;
  onUninstall: () => void;
  children: React.ReactNode;
};

export default function ModActions({
  onReveal,
  onUninstall,
  children,
}: ModActionsProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem className="cursor-pointer" onClick={onReveal}>
          <FoldersIcon className="mr-3 h-4 w-4" />
          <span>Open</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={onUninstall}>
          <Trash2 className="mr-3 h-4 w-4" />
          <span>Uninstall</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
