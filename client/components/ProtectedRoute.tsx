"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !user) {
      router.push(redirectTo);
    }
  }, [user, isHydrated, router, redirectTo]);

  // Show loading while hydrating or redirecting
  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-red-900 to-black flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
