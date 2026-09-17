"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { Toaster } from "@/components/ui/toast";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return true;
  return target.closest('[role="dialog"]') !== null;
}

function ThemeHotkey() {
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() !== "d") return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      const next = resolvedTheme === "dark" ? "light" : "dark";
      if (document.startViewTransition) {
        document.startViewTransition(() => flushSync(() => setTheme(next)));
      } else {
        setTheme(next);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resolvedTheme, setTheme]);

  return null;
}

export function Provider({ children }: { children: ReactNode }) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ThemeHotkey />
        {children}
      </ThemeProvider>
      <Toaster />
    </>
  );
}