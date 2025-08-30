"use client";

import { Atom, Folder, LogOutIcon, User2 } from "lucide-react";
import { Button, LinkButton } from "../ui/button";
import s from "./header-main.module.scss";
import { useAppSelector } from "@/hooks/storeHooks";
import Link from "next/link";
import { useSignout } from "@/hooks/useSignout";
import { usePathname } from "next/navigation";

const HeaderMain = () => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const pathname = usePathname();
  const { handleSignout, isLoading: loadingSignout } = useSignout();

  return (
    <div className={s.container}>
      <Link className={s.logo} href={"/"}>
        <span>
          <Atom size={18} />
        </span>
        <h4>DOSLR</h4>
      </Link>

      {userInfo?.accessToken && (
        <div className={s.action_btns}>
          {!pathname.endsWith("/") && (
            <LinkButton variant="bordered" href={"/"}>
              <span>
                <Folder size={18} />
              </span>
              <p>My Projects</p>
            </LinkButton>
          )}
          {!pathname.endsWith("/account") && (
            <LinkButton variant="bordered" href={"/account"}>
              <span>
                <User2 size={18} />
              </span>
              <p>My Account</p>
            </LinkButton>
          )}
          <Button
            variant="bordered"
            onClick={handleSignout}
            disabled={loadingSignout}
          >
            <span>
              <LogOutIcon size={18} />
            </span>
            <p>Signout</p>
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeaderMain;
