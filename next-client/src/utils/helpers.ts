import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const parseError = (error: unknown): string => {
  // Check if error is a FetchBaseQueryError
  if (typeof error === "object" && error !== null && "data" in error) {
    const fetchError = error as FetchBaseQueryError;

    // Check if data contains a message
    if (
      fetchError.data &&
      typeof fetchError.data === "object" &&
      "message" in fetchError.data
    ) {
      return String((fetchError.data as { message?: unknown }).message);
    }

    return "An error occurred while processing the request.";
  }

  return "An unexpected error occurred.";
};
