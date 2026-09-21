"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import {
  DemoActions,
  demoBackgroundClass,
  type DemoBackground,
} from "@/components/pages/demo-actions";


export function DemoCard({
  href,
  index,
  title,
  icon,
  description,
  connection,
  item,
  wide = false,
  children,
}: {
  href: string;
  index: number;
  title: string;
  /** A glyph for what the card shows, set beside its title. */
  icon?: IconSvgElement;
  description: string;
  connection?: string;
  /**
   * The registry item the card installs. Defaults to the last segment of
   * `href`, which is what every card's route is already named after.
   */
  item?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [background, setBackground] = useState<DemoBackground>("default");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "group/plate flex flex-col",
        wide && "md:col-span-2 xl:col-span-3",
      )}
    >
      <div
        className={cn(
          "border-foreground/10 flex items-center justify-center overflow-hidden rounded-xl border p-5 md:p-6",
          "group-hover/plate:border-foreground/25 h-[340px] transition-colors",
          demoBackgroundClass(background),
          wide && "md:h-[420px]",
        )}
      >
        {mounted ? (
          <div className="flex h-full min-h-0 w-full items-center justify-center">
            {children}
          </div>
        ) : null}
      </div>
      {/* The actions sit beside the link rather than inside it: the trigger is
          a button, and a button inside an anchor is neither valid nor
          clickable without following the link first. */}
      <div className="mt-3.5 flex items-baseline gap-2.5">
        <Link
          href={href}
          aria-label={title}
          className="group/caption flex min-w-0 items-baseline gap-2.5"
        >
          <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
            {String(index).padStart(2, "0")}
          </span>
          {/* Centred rather than baselined: an icon has no baseline of its
              own, so the row would stand its bottom edge on the text's and
              float it above the title. The negative margin draws it in to the
              title it belongs to, off the index. */}
          {icon ? (
            <HugeiconsIcon
              aria-hidden
              icon={icon}
              strokeWidth={1.75}
              className="text-muted-foreground -me-1 size-3.5 shrink-0 self-center"
            />
          ) : null}
          <h3 className="text-[13.5px] font-medium underline-offset-4 group-hover/caption:underline">
            {title}
          </h3>
          {connection ? (
            <span className="text-muted-foreground font-mono text-[11px]">
              {connection}
            </span>
          ) : null}
        </Link>
        <DemoActions
          item={item ?? href.split("/").filter(Boolean).pop() ?? ""}
          href={href}
          title={title}
          background={background}
          onBackgroundChange={setBackground}
          className="ms-auto self-center"
        />
      </div>
      <p className="text-muted-foreground mt-1 text-[13px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}