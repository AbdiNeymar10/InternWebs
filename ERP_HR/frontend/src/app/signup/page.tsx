"use client";
import { useState } from "react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [empId, setEmpId] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [role] = useState("EMPLOYEE");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Email validation: must include '@' and '.'
    if (!email.includes("@") || !email.includes(".")) {
      setError("Email must include '@' and '.'");
      setLoading(false);
      return;
    }
    // Password validation: at least 6 chars, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters, include one uppercase, one lowercase, and one number."
      );
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, empId, fullName, password, role }),
      });
      if (res.ok) {
        setSuccess("Signup successful! Redirecting to login...");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        const data = await res.text();
        setError(data || "Signup failed");
      }
    } catch {
      setError("Signup failed");
    }
    setLoading(false);
  };

  const handleGoogleSignup = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl border-2 border-gray-300 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Sign Up
        </h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiUser className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiMail className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiUser className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="EmpId"
              className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiLock className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-10 pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 focus:outline-none"
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
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiLock className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full pl-10 pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 focus:outline-none"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <FiEyeOff className="w-5 h-5" />
              ) : (
                <FiEye className="w-5 h-5" />
              )}
            </button>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-2">
          {/* <button
            onClick={handleGoogleSignup}
            className="w-full bg-white border border-gray-300 text-gray-800 py-2 rounded-2xl hover:bg-gray-200 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 48 48"
              className="inline-block"
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
            Sign Up with Google
          </button> */}
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-white border border-gray-300 text-blue-700 py-2 rounded-2xl hover:bg-gray-300 transition mt-2"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}
