"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { trackEvent } from "@/lib/analytics/ga";
import { siteConfig } from "@/lib/constants/site";

type ResumeLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href" | "target" | "rel"> & {
  children?: ReactNode;
  /** Where the link was clicked, sent with the analytics event. */
  location: string;
};

/** Opens the resume PDF in a new tab and records a `resume_download` GA event. */
export function ResumeLink({ children, location, onClick, ...props }: ResumeLinkProps) {
  return (
    <a
      href={siteConfig.resume}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        trackEvent("resume_download", { location });
        onClick?.(event);
      }}
      {...props}
    >
      {children ?? "Download Resume"}
    </a>
  );
}
