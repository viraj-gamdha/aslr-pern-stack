import HeaderMain from "@/components/layout/header-main";
import { LayoutChildren } from "@/types/general";
import React from "react";

const WithLayoutA = ({ children }: LayoutChildren) => {
  return (
    <main className="layout-a">
      <HeaderMain />
      <div className="layout-content-wrapper">{children}</div>
    </main>
  );
};

export default WithLayoutA;
