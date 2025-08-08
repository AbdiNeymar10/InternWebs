import React from "react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white rounded-xl shadow-2xl p-10 flex flex-col items-center animate-fade-in">
        <svg
          className="w-20 h-20 text-purple-500 mb-6"
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
            d="M9.5 9.5a1.5 1.5 0 113 0m-3 5a1.5 1.5 0 003 0"
          />
        </svg>
        <h1 className="text-4xl font-extrabold text-purple-700 mb-2">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-6 text-center max-w-md">
          Oops! The page you are looking for does not exist or has been moved.
          <br />
          Please check the URL or return to the homepage.
        </p>
        <a
          href="/"
          className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-200"
        >
          Go Home
        </a>
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
