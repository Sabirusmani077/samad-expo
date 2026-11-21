"use client";

import { usePathname } from "next/navigation";

export function MehndiSiteFrame() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="mehndi-site-frame" aria-hidden="true">
      <div className="mehndi-bg-watermark" />
      <div className="mehndi-edge mehndi-edge-left" />
      <div className="mehndi-edge mehndi-edge-right" />
      <div className="mehndi-edge mehndi-edge-top" />
      <div className="mehndi-edge mehndi-edge-bottom" />
      <div className="mehndi-corner mehndi-corner-tl" />
      <div className="mehndi-corner mehndi-corner-tr" />
      <div className="mehndi-corner mehndi-corner-bl" />
      <div className="mehndi-corner mehndi-corner-br" />
    </div>
  );
}
