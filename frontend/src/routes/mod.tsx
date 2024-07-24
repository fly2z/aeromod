import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { GetModManifest, GetModThumbnail } from "@wailsjs/go/main/App";
import { msfs } from "@wailsjs/go/models";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { base64Image } from "@/lib/utils";

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
  const [thumbnail, setThumbnail] = useState<string>();

  useEffect(() => {
    const fetchManifest = async () => {
      const m = await GetModManifest(id);
      setManifest(m);
    };

    const fetchThumbnail = async () => {
      const t = await GetModThumbnail(id);
      setThumbnail(base64Image(t));
    };

    fetchManifest();
    fetchThumbnail();
  }, []);

  if (!manifest) return <NotFound />;

  return (
    <div className="flex h-full flex-col gap-y-3 px-6 py-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Mods</Link>
            </BreadcrumbLink>
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
          <span className="text-sm text-muted-foreground">
            {manifest.creator}
          </span>
        </h1>
        <div className="flex items-center gap-x-2">
          <div className="px-3 py-2 font-mono font-light text-muted-foreground">
            {manifest.package_version}
          </div>
          <div className="rounded border bg-muted px-3 py-2 text-sm font-light text-muted-foreground">
            {manifest.content_type.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="h-[170px] w-[412px]">
        {thumbnail ? (
          <img src={thumbnail} className="h-full w-full" alt="thumbnail" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            No Thumbnail
          </div>
        )}
      </div>
    </div>
  );
}
