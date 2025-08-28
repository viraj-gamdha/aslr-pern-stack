"use client";

import HeaderMain from "@/components/layout/header-main";
import { LinkButton } from "@/components/ui/button";
import React from "react";

const Home = () => {
  return (
    <main className="layout-a">
      <HeaderMain />
      Home
      <LinkButton href="/test" variant="bordered">Test components</LinkButton>
    </main>
  );
};

export default Home;
