"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { queryClient } from "@/lib/queryClient";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ SSR fallback
  if (typeof window === "undefined") {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  const persister = createSyncStoragePersister({
    storage: window.localStorage,
    key: "myshop-rq-cache",
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: THIRTY_DAYS, // ✅ الكاش يظل بعد refresh لمدة 30 يوم
        buster: "home-cache-v1",
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}