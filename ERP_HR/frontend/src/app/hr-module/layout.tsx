import React from "react";
import AuthGuard from "@/app/components/AuthGuard";

export const metadata = {
  title: "HR Module",
};

export default function HrModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      {/* preserve any shared layout for hr-module pages */}
      {children}
    </AuthGuard>
  );
}
