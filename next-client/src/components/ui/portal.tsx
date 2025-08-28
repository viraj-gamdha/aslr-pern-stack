import type { ReactNode } from "react";
import { createPortal } from "react-dom";

export const Portal = ({ children }: {children: ReactNode}) => {
  const portalRoot = document.getElementById('portal-root');
  return createPortal(children, portalRoot as HTMLElement);
};