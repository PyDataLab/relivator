"use client";

import React from "react";
import { cn } from "~/lib/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-accent", className)}
      {...props}
    />
  );
};

export default Skeleton;
