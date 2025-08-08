"use client";
import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-100 via-yellow-100 to-orange-100">
      <div className="bg-white rounded-xl shadow-2xl p-10 flex flex-col items-center animate-fade-in">
        <svg
          className="w-20 h-20 text-red-500 mb-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="#f3f4f6"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01"
          />
        </svg>
        <h1 className="text-4xl font-extrabold text-red-700 mb-2">
          Something Went Wrong
        </h1>
        <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
          {error?.message ||
            "An unexpected error occurred. Please try again later."}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Try Again
        </button>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
