import { useEffect, useState } from "react";
import { GetMods } from "@wailsjs/go/main/App";
import { msfs } from "@wailsjs/go/models";

import MSFSModList from "@/components/msfs-mod-list";

export default function HomePage() {
  const [mods, setMods] = useState<msfs.Mod[]>([]);

  useEffect(() => {
    const fetchMods = async () => {
      const mods = await GetMods();
      setMods(mods);
    };

    fetchMods();
  }, []);

  return (
    <div className="px-4 py-4">
      <h1 className="px-2 text-2xl font-medium">All Mods</h1>
      <MSFSModList mods={mods} />
    </div>
  );
}
