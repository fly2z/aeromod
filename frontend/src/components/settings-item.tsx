import { ChangeEvent, useState } from "react";
import type { Settings } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type SettingsItemProps<T extends keyof Settings> = {
  key: T;
  name: string;
  description: string;
  type: "input" | "checkbox";
  value: Settings[T];
  onChange: (value: Settings[T]) => void;
};

export default function SettingsItem<T extends keyof Settings>({
  name,
  description,
  type,
  value,
  onChange,
}: SettingsItemProps<T>) {
  const [localValue, setLocalValue] = useState(value);

  const handleSave = () => {
    onChange(localValue as Settings[T]);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value as Settings[T]);
  };

  const handleCheckboxChange = (checked: boolean) => {
    onChange(checked as Settings[T]);
  };

  return (
    <div
      className={cn(
        "flex w-full space-y-2",
        type === "input" && "flex-col",
        type === "checkbox" && "items-center justify-between"
      )}
    >
      <div>
        <p className="font-medium">{name}</p>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
      {type === "input" ? (
        <div className="flex items-center gap-x-2">
          <Input
            value={localValue as string}
            placeholder="Path"
            onChange={handleInputChange}
          />
          <Button onClick={handleSave}>Save</Button>
        </div>
      ) : (
        <Checkbox
          checked={value as boolean}
          onCheckedChange={handleCheckboxChange}
        />
      )}
    </div>
  );
}
