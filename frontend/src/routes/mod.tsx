import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { GetModManifest } from "@wailsjs/go/main/App";
import { msfs } from "@wailsjs/go/models";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const NotFound = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      Mod not found!
    </div>
  );
};

export default function ModPage() {
  const { id } = useParams();
  if (!id) return <NotFound />;

  const [manifest, setManifest] = useState<msfs.PackageManifest>();

  useEffect(() => {
    const fetchManifest = async () => {
      const m = await GetModManifest(id);
      setManifest(m);
    };

    fetchManifest();
  }, []);

  if (!manifest) return <NotFound />;

  return (
    <div className="flex h-full flex-col gap-y-3 px-6 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Mods</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl">
          {manifest.title}{" "}
          <span className="text-muted-foreground text-sm">
            {manifest.creator}
          </span>
        </h1>
        <div className="flex items-center gap-x-2">
          <div className="text-muted-foreground px-3 py-2 font-mono font-light">
            {manifest.package_version}
          </div>
          <div className="bg-muted text-muted-foreground rounded border px-3 py-2 text-sm font-light">
            {manifest.content_type.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
}
