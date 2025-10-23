"use client";

import { Atom, Folder, LogOutIcon, Moon, Sun, User2 } from "lucide-react";
import { Button, LinkButton } from "../ui/button";
import s from "./header-main.module.scss";
import { useAppSelector } from "@/hooks/storeHooks";
import Link from "next/link";
import { useSignout } from "@/hooks/useSignout";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/ThemeProvider";

const HeaderMain = () => {
  const userInfo = useAppSelector((state) => state.auth.userInfo);
  const pathname = usePathname();
  const { handleSignout, isLoading: loadingSignout } = useSignout();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={s.container}>
      <Link className={s.logo} href={"/"}>
        <span>
          <Atom size={18} />
        </span>
        <h4>aSLR</h4>
      </Link>

      <div className={s.action_btns}>
        {userInfo?.accessToken && (
          <>
            {!pathname.endsWith("/") && (
              <LinkButton variant="bordered" href={"/"}>
                <span>
                  <Folder size={18} />
                </span>
                My Projects
              </LinkButton>
            )}
            {!pathname.endsWith("/account") && (
              <LinkButton variant="bordered" href={"/account"}>
                <span>
                  <User2 size={18} />
                </span>
                My Account
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
              Signout
            </Button>
          </>
        )}

        <Button variant="bordered" onClick={toggleTheme}>
          <span>
            {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default HeaderMain;
