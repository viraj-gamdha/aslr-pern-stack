"use client";

import { PageLoader } from "@/components/ui/loader";
import { errorToast } from "@/components/ui/toast";
import { useAppSelector } from "@/hooks/storeHooks";
import { useRefreshMutation } from "@/redux/apis/authApiSlice";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSigninMutation } from "@/redux/apis/authApiSlice";

// ADDED: Separate component for logic that uses useSearchParams
const AuthInitializerContent = ({ children }: { children: React.ReactNode }) => {
  const [refresh, { isLoading }] = useRefreshMutation();
  const [login, { isLoading: isLoginLoading }] = useSigninMutation();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const searchParams = useSearchParams();

  // Determine if initialization is needed
  const persist =
    typeof window !== "undefined" &&
    localStorage.getItem("persist_signin") === "true";

  useEffect(() => {
    const verifyAuth = async () => {
      const skipAuth = searchParams.get("skip-auth") === "true";

      if (skipAuth && !userInfo?.accessToken) {
        try {
          const res = await login({
            email: "test@email.com",
            password: "11111111",
          }).unwrap();
          if (!res.success) {
            errorToast(res.message);
          }
        } catch (err) {
          console.log("Error during auto login:", err);
        }
      } else if (!userInfo?.accessToken && persist) {
        try {
          const res = await refresh({}).unwrap();
          if (!res.success) {
            errorToast(res.message);
          }
        } catch (err) {
          console.log("Error during token refresh:", err);
        }
      }
      setIsAuthInitialized(true);
    };

    verifyAuth();
  }, []);

  // loading or a blank screen until refresh is done
  if (!isAuthInitialized || isLoading || isLoginLoading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

// MODIFIED: Wrap with Suspense boundary
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <AuthInitializerContent>{children}</AuthInitializerContent>
    </Suspense>
  );
};

export default AuthInitializer;