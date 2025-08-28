"use client";

import { PageLoader } from "@/components/ui/loader";
import { errorToast } from "@/components/ui/toast";
import { useAppSelector } from "@/hooks/storeHooks";
import { useRefreshMutation } from "@/redux/apis/authApiSlice";
import { useEffect, useState } from "react";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const [refresh, { isLoading }] = useRefreshMutation();
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const userInfo = useAppSelector((state) => state.auth.userInfo);

  // Determine if initialization is needed
  const persist =
    typeof window !== "undefined" &&
    localStorage.getItem("persist_signin") === "true";

  useEffect(() => {
    const verifyAuth = async () => {
      if (!userInfo?.accessToken && persist) {
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
  if (!isAuthInitialized || isLoading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

export default AuthInitializer;
