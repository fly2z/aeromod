import useSettings from "@/hooks/use-settings";
import SettingsItem from "@/components/settings-item";
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  const { settings, set } = useSettings();

  if (!settings)
    return (
      <div className="flex h-full flex-col px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>
      </div>
    );

  return (
    <div className="flex h-full flex-col gap-y-6 px-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>
      <div className="flex h-full w-full flex-col gap-y-6">
        <div className="flex w-full items-center justify-between space-y-2">
          <div>
            <p className="font-medium">Theme</p>
            <span className="text-sm text-muted-foreground">
              Choose the color scheme for the application interface.
            </span>
          </div>
          <ThemeToggle />
        </div>
        <SettingsItem
          key="enable_on_install"
          name="Enable Mods Automatically"
          description="Automatically enable mods after installation."
          type="checkbox"
          value={settings.enable_on_install}
          onChange={(v) => set("enable_on_install", v)}
        />
        <SettingsItem
          key="show_mod_details"
          name="Show Mod Details"
          description="Display extra mod info such as creator name and version in the home page."
          type="checkbox"
          value={settings.show_mod_details}
          onChange={(v) => set("show_mod_details", v)}
        />
        <SettingsItem
          key="mod_folder"
          name="Mod Folder"
          description="The directory where downloaded mods will be stored."
          type="input"
          value={settings.mod_folder}
          onChange={(v) => set("mod_folder", v)}
        />
        <SettingsItem
          key="community_folder"
          name="Community Folder"
          description="The MSFS community folder."
          type="input"
          value={settings.community_folder}
          onChange={(v) => set("community_folder", v)}
        />
      </div>
    </div>
  );
}
