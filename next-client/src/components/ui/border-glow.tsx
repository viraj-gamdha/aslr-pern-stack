import type { ReactNode } from "react";
import s from "./border-glow.module.scss";

export const BorderGlow = ({ children }: { children: ReactNode }) => {
  return (
    <div className={s.parent}>
      <div className={s.glow} />
      <div className={s.content}>{children}</div>
    </div>
  );
};
