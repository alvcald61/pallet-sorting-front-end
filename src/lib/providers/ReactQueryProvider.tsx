"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

function isSessionExpiredError(error: unknown): boolean {
  return error instanceof Error && error.message === "SESSION_EXPIRED";
}

function handleSessionExpired() {
  window.location.href = "/login";
}

/**
 * React Query Provider Component
 * Configures QueryClient with optimized defaults
 */
export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            if (isSessionExpiredError(error)) {
              handleSessionExpired();
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (isSessionExpiredError(error)) {
              handleSessionExpired();
            }
          },
        }),
        defaultOptions: {
          queries: {
            // Cache data for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep unused data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests, but not on auth errors
            retry: (failureCount, error) => {
              if (isSessionExpiredError(error)) return false;
              return failureCount < 3;
            },
            // Retry with exponential backoff
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus
            refetchOnWindowFocus: true,
            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
            // Refetch on network reconnect
            refetchOnReconnect: true,
          },
          mutations: {
            // Retry mutations once, but not on auth errors
            retry: (failureCount, error) => {
              if (isSessionExpiredError(error)) return false;
              return failureCount < 1;
            },
            // Retry after 1 second
            retryDelay: 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show devtools only in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
