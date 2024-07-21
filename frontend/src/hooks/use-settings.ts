import { useState, useEffect } from "react";
import { config } from "@wailsjs/go/models";
import { GetSettings, SetSetting } from "@wailsjs/go/main/App";

type Settings = config.AppConfig;

export function useSettings() {
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

  return {
    settings,
    set,
  };
}
