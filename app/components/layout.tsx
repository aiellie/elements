import type { ReactNode } from "react";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { CONTAINER } from "@/lib/constants";
import { cn } from "@/lib/utils";
  
export default function Layout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      {/* pb clears the fixed footer (h-8 + py-1) so the last row is reachable. */}
      <main className={cn(CONTAINER, "flex-1")}>{children}</main>
      <SiteFooter />
    </div>
  );
}