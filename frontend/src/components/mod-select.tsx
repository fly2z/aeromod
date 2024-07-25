import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { CommandList } from "cmdk";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { msfs } from "@wailsjs/go/models";

type ModSelectProps = {
  mods?: msfs.Mod[];
  onSelect: (value: string) => void;
};

export default function ModSelect({ mods, onSelect }: ModSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const list = useMemo(() => mods?.map((m) => m.name), [mods]);

  if (!list) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? list.find((l) => l === value) : "Select mod..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] overflow-y-auto p-0">
        <Command>
          <CommandInput placeholder="Search mod..." />
          <CommandEmpty>No mod found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {list.map((name) => (
                <CommandItem
                  key={name}
                  value={name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    onSelect(currentValue);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
