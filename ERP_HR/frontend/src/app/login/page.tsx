"use client";
import { useState, useEffect, useRef } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiArrowRight,
  FiUsers,
  FiBriefcase,
  FiCalendar,
  FiAward,
} from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";

// This component ensures that its children are only rendered on the client side.
// This prevents Math.random() calls from causing a hydration mismatch between server and client.
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null); // Explicitly type the ref

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const role = searchParams.get("role");
    const empId = searchParams.get("empId");
    const fullName = searchParams.get("fullName");
    if (token) {
      localStorage.setItem("token", token);
      if (email || role || empId || fullName) {
        const userObj = { email, role, empId, fullName };
        localStorage.setItem("user", JSON.stringify(userObj));
      }
      router.replace("/dashboard");
    }

    const currentContainer = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!currentContainer) return;

      const { left, top, width, height } =
        currentContainer.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      // FIX: Convert the calculated numbers 'x' and 'y' to strings.
      document.documentElement.style.setProperty("--mouse-x", String(x));
      document.documentElement.style.setProperty("--mouse-y", String(y));
    };

    if (currentContainer) {
      currentContainer.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (currentContainer) {
        currentContainer.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        if (data.user || data.role) {
          const userObj = data.user
            ? data.user
            : {
                email: data.email || "",
                role: data.role || "USER",
                empId: data.empId || "",
                fullName: data.fullName || "",
              };
          localStorage.setItem("user", JSON.stringify(userObj));
        }
        router.push("/dashboard");
      } else {
        const data = await res.text();
        setError(data || "Invalid credentials");
      }
    } catch {
      setError("Login failed. Please try again later.");
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --mouse-x: 0;
          --mouse-y: 0;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(3deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(60, 141, 188, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(60, 141, 188, 0.8);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .floating-element {
          animation: float 6s ease-in-out infinite;
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }

        .floating-element:hover {
          transform: translateY(-5px) scale(1.05)
            rotate3d(
              calc(var(--mouse-y) * 2),
              calc(var(--mouse-x) * 2),
              0,
              5deg
            );
        }

        .pulse-effect {
          animation: pulse 3s ease-in-out infinite;
        }

        .glow-effect {
          animation: glow 2s ease-in-out infinite;
        }

        .slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }

        .transform-3d {
          transform: perspective(1000px) rotateX(calc(var(--mouse-y) * -5deg))
            rotateY(calc(var(--mouse-x) * 5deg));
        }

        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          pointer-events: none;
        }
      `}</style>

      <div
        className="min-h-screen flex bg-gray-900 overflow-hidden"
        ref={containerRef}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a3a] via-[#2a3b4c] to-[#3c8dbc] opacity-90 z-0"></div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ClientOnly>
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${
                    Math.random() * 10 + 10
                  }s infinite ease-in-out`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5 + 0.1,
                }}
              ></div>
            ))}
          </ClientOnly>
        </div>

        {/* 3D Floating Elements */}
        <ClientOnly>
          <div
            className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-[#3c8dbc] opacity-20 floating-element"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-[#2a5f8a] opacity-30 floating-element"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-24 h-24 rounded-full bg-[#3c8dbc] opacity-10 floating-element"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-1/3 right-1/3 w-12 h-12 rounded-full bg-[#2a5f8a] opacity-25 floating-element"
            style={{ animationDelay: "3s" }}
          ></div>
        </ClientOnly>

        {/* Main Content */}
        <div className="w-full flex items-center justify-center p-4 sm:p-8 z-10 transform-3d">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl glass-effect">
            {/* Left side - Branding and HRMS information */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc] to-[#2a5f8a] opacity-90 z-0"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMzYzhkYmMiLz4KICA8cGF0aCBkPSJNMTIgMTJMMTggMTJMMTggMThMMTIgMThMMTIgMTJaIiBmaWxsLW9wYWNpdHk9IjAuMSIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=')] opacity-10"></div>

              <div
                className="relative z-10 flex items-center space-x-3 slide-in"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-md floating-element">
                  <FiUser className="text-[#3c8dbc] text-xl" />
                </div>
                <span className="text-2xl font-bold">HRMS Portal</span>
              </div>

              <div className="relative z-10 max-w-md mt-8">
                <h1
                  className="text-4xl font-bold mb-6 slide-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  Human Resource Management System
                </h1>
                <p
                  className="text-blue-100 text-lg slide-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  Streamline your HR processes with our comprehensive management
                  platform. Manage employees, track attendance, process payroll,
                  and more.
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: <FiUsers className="text-2xl mb-2" />,
                      text: "Employee Management",
                    },
                    {
                      icon: <FiBriefcase className="text-2xl mb-2" />,
                      text: "Leave Tracking",
                    },
                    {
                      icon: <FiCalendar className="text-2xl mb-2" />,
                      text: "Scheduling",
                    },
                    {
                      icon: <FiAward className="text-2xl mb-2" />,
                      text: "Performance",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm floating-element slide-in"
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      {item.icon}
                      <span className="text-sm text-center">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="relative z-10 flex space-x-2 mt-8 slide-in"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="w-3 h-3 rounded-full bg-white opacity-30 pulse-effect"></div>
                <div
                  className="w-3 h-3 rounded-full bg-white opacity-30 pulse-effect"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-3 h-3 rounded-full bg-white pulse-effect"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 bg-white/95 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">
                <div
                  className="lg:hidden mb-8 flex justify-center slide-in"
                  style={{ animationDelay: "0.1s" }}
                >
                  <div className="flex items-center space-x-3 text-[#3c8dbc] floating-element">
                    <div className="w-12 h-12 rounded-lg bg-[#3c8dbc] flex items-center justify-center shadow-md">
                      <FiUser className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold">HRMS Portal</span>
                  </div>
                </div>

                <div
                  className="mb-8 text-center slide-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Welcome Back
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Sign in to access your HR dashboard
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div
                    className="relative slide-in"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <FiMail className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      placeholder="Email or Employee ID"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all transform hover:scale-[1.01]"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                    />
                  </div>

                  <div
                    className="relative slide-in"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <FiLock className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full pl-12 pr-12 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all transform hover:scale-[1.01]"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {error && (
                    <div
                      className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start slide-in"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <svg
                        className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <div
                    className="flex justify-between items-center slide-in"
                    style={{ animationDelay: "0.6s" }}
                  >
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#3c8dbc] focus:ring-[#3c8dbc] border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={() => router.push("/forgot-password")}
                      className="text-sm text-[#3c8dbc] hover:text-[#2a5f8a] font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#3c8dbc] text-white py-3 rounded-lg hover:bg-[#2a5f8a] transition-all flex items-center justify-center font-medium shadow-md hover:shadow-lg glow-effect transform hover:scale-[1.01] slide-in"
                    style={{ animationDelay: "0.7s" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Logging in...
                      </>
                    ) : (
                      <>
                        Sign in <FiArrowRight className="ml-2" />
                      </>
                    )}
                  </button>
                </form>

                <div
                  className="mt-6 slide-in"
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all flex items-center justify-center font-medium shadow-sm transform hover:scale-[1.01]"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 48 48"
                        className="mr-2"
                      >
                        <g>
                          <path
                            fill="#4285F4"
                            d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.9-6.9C35.64 2.36 30.13 0 24 0 14.64 0 6.4 5.64 2.44 14.02l8.06 6.27C12.7 14.36 17.89 9.5 24 9.5z"
                          />
                          <path
                            fill="#34A853"
                            d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.9-2.17 5.36-4.62 7.02l7.18 5.59C43.6 37.36 46.1 31.36 46.1 24.5z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M10.5 28.29c-1.13-3.36-1.13-6.93 0-10.29l-8.06-6.27C.64 16.36 0 20.07 0 24c0 3.93.64 7.64 2.44 10.27l8.06-6.27z"
                          />
                          <path
                            fill="#EA4335"
                            d="M24 48c6.13 0 11.64-2.02 15.82-5.5l-7.18-5.59c-2.01 1.35-4.59 2.16-7.64 2.16-6.11 0-11.3-4.86-13.5-11.5l-8.06 6.27C6.4 42.36 14.64 48 24 48z"
                          />
                        </g>
                      </svg>
                      Sign in with Google
                    </button>
                  </div>
                </div>

                <div
                  className="mt-8 text-center slide-in"
                  style={{ animationDelay: "0.9s" }}
                >
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <button
                      onClick={() => router.push("/signup")}
                      className="text-[#3c8dbc] hover:text-[#2a5f8a] font-medium transition-colors"
                    >
                      Get started
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
