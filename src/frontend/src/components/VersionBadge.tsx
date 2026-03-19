"use client";

import { useEffect, useState } from "react";
import { getLibraries } from "@/lib/api";

const versionCache: Record<string, string> = {};
let fetchPromise: Promise<void> | null = null;

function fetchVersions(): Promise<void> {
  if (!fetchPromise) {
    fetchPromise = getLibraries()
      .then((data) => {
        for (const lib of data.libraries) {
          versionCache[lib.name.toLowerCase()] = lib.version;
        }
      })
      .catch(() => {});
  }
  return fetchPromise;
}

export default function VersionBadge({
  name,
  fallback,
  className,
}: {
  name: string;
  fallback: string;
  className?: string;
}) {
  const [version, setVersion] = useState(fallback);

  useEffect(() => {
    const key = name.toLowerCase();
    if (versionCache[key]) {
      setVersion(versionCache[key]);
      return;
    }
    fetchVersions().then(() => {
      if (versionCache[key]) setVersion(versionCache[key]);
    });
  }, [name]);

  return <span className={className}>v{version}</span>;
}
