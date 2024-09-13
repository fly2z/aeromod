import { createContext, useEffect, useState } from "react";
import { GetSettings, SetSetting } from "@wailsjs/go/main/App";
import { config } from "@wailsjs/go/models";

type Settings = config.AppConfig;

type SettingsContextType = {
  settings: Settings | null;
  set: <T extends keyof Settings>(key: T, value: Settings[T]) => void;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await GetSettings();
        setSettings(res);
      } catch (e) {
        console.error("Failed to fetch settings:", e);
      }
    };

    fetchSettings();
  }, []);

  const set = <T extends keyof Settings>(key: T, value: Settings[T]) => {
    SetSetting(key, value)
      .then(() => {
        setSettings((prevSettings) => {
          if (!prevSettings) return null;
          return { ...prevSettings, [key]: value };
        });
      })
      .catch(console.error);
  };

  return (
    <SettingsContext.Provider value={{ settings, set }}>
      {children}
    </SettingsContext.Provider>
  );
}
