"use client";

import { useParams } from "next/navigation";
import React from "react";

const Project = () => {
  const params = useParams();
  const id = params?.id as string;

  return <div>Project {id}</div>;
};

export default Project;
