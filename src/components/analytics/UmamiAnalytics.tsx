"use client";

import React, { useEffect, Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { UMAMI_CONFIG, trackPageView } from "@/lib/analytics/umami";

function UmamiTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const queryString = searchParams?.toString();
    const fullUrl = queryString ? `${pathname}?${queryString}` : pathname;
    trackPageView(fullUrl, typeof document !== "undefined" ? document.title : undefined);
  }, [pathname, searchParams]);

  return null;
}

export function UmamiAnalytics() {
  if (!UMAMI_CONFIG.websiteId) {
    return null;
  }

  return (
    <>
      <Suspense fallback={null}>
        <UmamiTrackerInner />
      </Suspense>
      <Script
        id="umami-analytics-sovereign"
        strategy="afterInteractive"
        src={UMAMI_CONFIG.scriptUrl}
        data-website-id={UMAMI_CONFIG.websiteId}
        data-host-url={UMAMI_CONFIG.hostUrl}
        data-auto-track="true"
        data-domains={UMAMI_CONFIG.domains}
      />
    </>
  );
}
