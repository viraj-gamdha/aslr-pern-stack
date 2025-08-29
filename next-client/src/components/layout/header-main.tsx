"use client";

import { LogOutIcon, User2 } from "lucide-react";
import { Button } from "../ui/button";
import s from "./header-main.module.scss";
import { useSignoutMutation } from "@/redux/apis/authApiSlice";
import { errorToast, successToast } from "../ui/toast";
import { parseError } from "@/utils/helpers";
import { useAppSelector } from "@/hooks/storeHooks";
import Link from "next/link";

const HeaderMain = () => {
  const [signout, { isLoading }] = useSignoutMutation();
  const userInfo = useAppSelector((state) => state.auth.userInfo);

  const handleSignout = async () => {
    try {
      const res = await signout({}).unwrap();

      if (res.success) {
        successToast(res.message);
      }
    } catch (error) {
      errorToast(parseError(error));
    }
  };

  return (
    <div className={s.container}>
      <Link className={s.logo} href={"/"}>
        <h4>DOSLR</h4>
      </Link>

      {userInfo?.accessToken && (
        <div className={s.action_btns}>
          <Button variant="bordered">
            <User2 size={18} />
            My Account
          </Button>

          <Button
            variant="bordered"
            onClick={handleSignout}
            disabled={isLoading}
          >
            <LogOutIcon size={18} />
            Signout
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeaderMain;
