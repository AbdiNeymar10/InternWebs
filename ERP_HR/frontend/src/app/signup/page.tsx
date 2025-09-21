"use client";
import { useState, useRef, useEffect } from "react";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiUsers, FiBriefcase, FiCalendar, FiAward } from "react-icons/fi";
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
  const containerRef = useRef(null);

  useEffect(() => {
    // Add mouse move effect for 3D perspective
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current as HTMLElement | null;
      if (!container) return;
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      document.documentElement.style.setProperty('--mouse-x', x.toString());
      document.documentElement.style.setProperty('--mouse-y', y.toString());
    };

    const container = containerRef.current as HTMLElement | null;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

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
    <>
      <style jsx global>{`
        :root {
          --mouse-x: 0;
          --mouse-y: 0;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(60, 141, 188, 0.5); }
          50% { box-shadow: 0 0 30px rgba(60, 141, 188, 0.8); }
        }
        
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
        }
        
        .floating-element:hover {
          transform: translateY(-5px) scale(1.05) rotate3d(
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
          transform: perspective(1000px) rotateX(calc(var(--mouse-y) * -5deg)) rotateY(calc(var(--mouse-x) * 5deg));
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

      <div className="min-h-screen flex bg-gray-900 overflow-hidden" ref={containerRef}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a3a] via-[#2a3b4c] to-[#3c8dbc] opacity-90 z-0"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.1
              }}
            ></div>
          ))}
        </div>

        {/* 3D Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-[#3c8dbc] opacity-20 floating-element" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-[#2a5f8a] opacity-30 floating-element" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 rounded-full bg-[#3c8dbc] opacity-10 floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-12 h-12 rounded-full bg-[#2a5f8a] opacity-25 floating-element" style={{animationDelay: '3s'}}></div>

        {/* Main Content */}
        <div className="w-full flex items-center justify-center p-4 sm:p-8 z-10 transform-3d">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl glass-effect">
            {/* Left side - Branding and HRMS information */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc] to-[#2a5f8a] opacity-90 z-0"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj4KICA8cmVjdCB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9IiMzYzhkYmMiLz4KICA8cGF0aCBkPSJNMTIgMTJMMTggMTJMMTggMThMMTIgMThMMTIgMTJaIiBmaWxsLW9wYWNpdHk9IjAuMSIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=')] opacity-10"></div>
              
              <div className="relative z-10 flex items-center space-x-3 slide-in" style={{animationDelay: '0.1s'}}>
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-md floating-element">
                  <FiUser className="text-[#3c8dbc] text-xl" />
                </div>
                <span className="text-2xl font-bold">HRMS Portal</span>
              </div>
              
              <div className="relative z-10 max-w-md mt-8">
                <h1 className="text-4xl font-bold mb-6 slide-in" style={{animationDelay: '0.2s'}}>Join Our Team</h1>
                <p className="text-blue-100 text-lg slide-in" style={{animationDelay: '0.3s'}}>
                  Create your account to access the Human Resource Management System. 
                  Manage your profile, request time off, and access company resources.
                </p>
                
                <div className="mt-10 grid grid-cols-2 gap-4">
                  {[
                    { icon: <FiUsers className="text-2xl mb-2" />, text: "Employee Portal" },
                    { icon: <FiBriefcase className="text-2xl mb-2" />, text: "Leave Management" },
                    { icon: <FiCalendar className="text-2xl mb-2" />, text: "Schedule Access" },
                    { icon: <FiAward className="text-2xl mb-2" />, text: "Performance Tools" }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm floating-element slide-in"
                      style={{animationDelay: `${0.4 + index * 0.1}s`}}
                    >
                      {item.icon}
                      <span className="text-sm text-center">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative z-10 flex space-x-2 mt-8 slide-in" style={{animationDelay: '0.8s'}}>
                <div className="w-3 h-3 rounded-full bg-white opacity-30 pulse-effect"></div>
                <div className="w-3 h-3 rounded-full bg-white opacity-30 pulse-effect" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 rounded-full bg-white pulse-effect" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>

            {/* Right side - Signup Form */}
            <div className="w-full lg:w-1/2 bg-white/95 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
              <div className="w-full max-w-md mx-auto">
                <div className="lg:hidden mb-8 flex justify-center slide-in" style={{animationDelay: '0.1s'}}>
                  <div className="flex items-center space-x-3 text-[#3c8dbc] floating-element">
                    <div className="w-12 h-12 rounded-lg bg-[#3c8dbc] flex items-center justify-center shadow-md">
                      <FiUser className="text-white text-xl" />
                    </div>
                    <span className="text-2xl font-bold">HRMS Portal</span>
                  </div>
                </div>

                <div className="mb-8 text-center slide-in" style={{animationDelay: '0.2s'}}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Account</h2>
                  <p className="text-gray-500 mt-2">Join our HR management system</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="relative slide-in" style={{animationDelay: '0.3s'}}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <FiUser className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all transform hover:scale-[1.01]"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="relative slide-in" style={{animationDelay: '0.4s'}}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <FiMail className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all transform hover:scale-[1.01]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="relative slide-in" style={{animationDelay: '0.5s'}}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <FiUser className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                      type="text"
                      placeholder="Employee ID"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all transform hover:scale-[1.01]"
                      value={empId}
                      onChange={(e) => setEmpId(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="relative slide-in" style={{animationDelay: '0.6s'}}>
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
                  
                  <div className="relative slide-in" style={{animationDelay: '0.7s'}}>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <FiLock className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="w-full pl-12 pr-12 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all transform hover:scale-[1.01]"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
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
                  
                  {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start slide-in" style={{animationDelay: '0.8s'}}>
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                  
                  {success && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-start slide-in" style={{animationDelay: '0.8s'}}>
                      <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{success}</span>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full bg-[#3c8dbc] text-white py-3 rounded-lg hover:bg-[#2a5f8a] transition-all flex items-center justify-center font-medium shadow-md hover:shadow-lg glow-effect transform hover:scale-[1.01] slide-in"
                    style={{animationDelay: '0.9s'}}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account <FiArrowRight className="ml-2" />
                      </>
                    )}
                  </button>
                </form>
                
                <div className="mt-8 text-center slide-in" style={{animationDelay: '1s'}}>
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => router.push("/login")}
                      className="text-[#3c8dbc] hover:text-[#2a5f8a] font-medium transition-colors"
                    >
                      Sign in
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