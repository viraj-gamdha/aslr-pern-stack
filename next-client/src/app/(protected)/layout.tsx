"use client";

// This is the RequireAuth provider layout
import { PageLoader } from "@/components/ui/loader";
import { useAppSelector } from "@/hooks/storeHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const isAuthenticated = !!userInfo?.accessToken;

  useEffect(() => {
    // After AuthInitializer runs, if user is still not authenticated, redirect.
    if (!isAuthenticated) {
      router.replace("/signin");
    }
  }, [isAuthenticated, router]);

  // Show loader until authentication is confirmed
  if (!isAuthenticated) {
    return <PageLoader />;
  }

  // Render the protected content
  return children;
}
