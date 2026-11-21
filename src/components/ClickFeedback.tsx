"use client";

import React, { useEffect } from "react";

export function ClickFeedback() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePointerDown = (e: PointerEvent) => {
      // Find if clicked element or its parent is interactive
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, [role="button"], [role="tab"], input, select, textarea, label, summary, [data-clickable="true"]'
      );

      // Create click burst ripple at exact coordinates
      const ripple = document.createElement("span");
      ripple.className = "global-click-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;

      // If clicked on an interactive button or tab, make ripple slightly larger with accent
      if (interactive) {
        ripple.classList.add("interactive-ripple");
        interactive.classList.add("tactile-pressed");
        setTimeout(() => {
          interactive.classList.remove("tactile-pressed");
        }, 220);
      }

      document.body.appendChild(ripple);

      // Remove after animation completes (400ms)
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 420);
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return null;
}
