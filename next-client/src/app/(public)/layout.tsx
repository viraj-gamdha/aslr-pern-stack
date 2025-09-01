"use client";

import HeaderMain from "@/components/layout/header-main";
import { PageLoader } from "@/components/ui/loader";
import { useAppSelector } from "@/hooks/storeHooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This is the NonAuth provider for public pages..
// All have same with-layout-a pattern
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const isAuthenticated = !!userInfo?.accessToken;

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/"); // Redirect to the main app page
    }
  }, [isAuthenticated, router]);

  // Show loader until authentication is confirmed
  if (isAuthenticated) {
    return <PageLoader />;
  }

  // Render the public page
  return (
    <main className="layout-a">
      <HeaderMain />
      <div className="layout-content-wrapper">{children}</div>
    </main>
  );
}
