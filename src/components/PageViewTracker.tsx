"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const PRIVATE_PATHS = ["/admin", "/login"];

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || PRIVATE_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))) return;
    let referrerHost = "";
    try {
      referrerHost = document.referrer ? new URL(document.referrer).host : "";
    } catch {
      referrerHost = "";
    }
    fetch("/api/corporate/analytics/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, referrerHost }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
