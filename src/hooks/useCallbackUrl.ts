"use client";

import { useSearchParams } from "next/navigation";

export function useCallbackUrl() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("returnTo") || "/";

  function getLoginUrl(targetPath?: string) {
    const base = "/login";
    const url = targetPath
      ? `${base}?callbackUrl=${encodeURIComponent(targetPath)}`
      : base;
    return url;
  }

  function getRegisterUrl(targetPath?: string) {
    const base = "/register";
    const url = targetPath
      ? `${base}?callbackUrl=${encodeURIComponent(targetPath)}`
      : base;
    return url;
  }

  function getPostAuthRedirect() {
    return callbackUrl;
  }

  return {
    callbackUrl,
    getLoginUrl,
    getRegisterUrl,
    getPostAuthRedirect,
  };
}