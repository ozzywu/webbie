"use client";

import { useEffect } from "react";

export function AllowScroll() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "auto";
    body.style.overflow = "auto";

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, []);

  return null;
}
