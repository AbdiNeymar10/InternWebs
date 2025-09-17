"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // null = checking, true = authenticated, false = unauthenticated
  const [checking, setChecking] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    let mounted = true;
    let t: number | undefined;
    let navTimeout: number | undefined;

    try {
      const stored = localStorage.getItem("user");
      if (!stored) {
        // show message and start countdown to redirect
        if (mounted) setChecking(false);
        t = window.setInterval(() => {
          setCountdown((c) => {
            if (c <= 1) {
              if (t) clearInterval(t);
              // navigate after countdown completes (defer to avoid updates during render)
              navTimeout = window.setTimeout(() => router.replace("/login"), 0);
              return 0;
            }
            return c - 1;
          });
        }, 1000);

        return () => {
          mounted = false;
          if (t) clearInterval(t);
        };
      }

      // user exists — proceed
      if (mounted) setChecking(true);
    } catch (err) {
      if (mounted) setChecking(false);
      t = window.setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            if (t) clearInterval(t);
            navTimeout = window.setTimeout(() => router.replace("/login"), 0);
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      return () => {
        mounted = false;
        if (t) clearInterval(t);
      };
    }

    return () => {
      mounted = false;
      if (t) clearInterval(t);
      if (navTimeout) clearTimeout(navTimeout);
    };
  }, [router]);

  // perform the redirect if the user is unauthenticated.
  if (checking === null) {
    return <>{children}</>;
  }

  // Unauthenticated — show message and countdown
  if (checking === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-md rounded p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">
            Authentication required
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            You must be logged in to access this area. Redirecting to the login
            page in {countdown}...
          </p>
          <button
            onClick={() => router.replace("/login")}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Login now
          </button>
        </div>
      </div>
    );
  }

  // Authenticated
  return <>{children}</>;
}
