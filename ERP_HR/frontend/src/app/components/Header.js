import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faUser,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import ProfilePicture from "./ProfilePicture";

export default function Header({ toggleSidebar }) {
  // Dropdown and modal state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const profileRef = useRef(null);
  // Handle input change for settings form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      await Swal.fire({
        title: "Error",
        text: "New passwords do not match",
        icon: "error",
        confirmButtonColor: "#3c8dbc",
      });
      return;
    }
    setLoading(true);
    try {
      // Get user identifier (email or empId)
      let identifier = "";
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          identifier = parsedUser.email || parsedUser.empId || "";
        }
      }
      if (!identifier) throw new Error("User identifier not found");
      const response = await axios.post(
        "http://localhost:8080/api/auth/change-password",
        {
          identifier,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );
      await Swal.fire({
        title: "Success!",
        text: response.data || "Password changed successfully",
        icon: "success",
        confirmButtonColor: "#3c8dbc",
      });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsSettingsModalOpen(false);
      setShowChangePasswordForm(false);
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text:
          error.response?.data ||
          error.response?.data?.message ||
          "Failed to change password",
        icon: "error",
        confirmButtonColor: "#3c8dbc",
      });
    } finally {
      setLoading(false);
    }
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.98,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.5,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const user = (() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          return {
            name: parsedUser.fullName || parsedUser.name || "Guest",
            email: parsedUser.email || "guest@example.com",
            role: parsedUser.role || "Unknown",
          };
        } catch {
          return { name: "Guest", email: "guest@example.com", role: "Unknown" };
        }
      }
    }
    return { name: "Guest", email: "guest@example.com", role: "Unknown" };
  })();

  // Logout handler (replace with your logic if needed)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshedToken");
    window.location.href = "/hr-module";
  };

  return (
    <header className="bg-gray-800 text-white p-1 flex justify-between items-center sticky top-0 z-10 w-full">
      {/* Left Section: Logo and Menu Icon */}
      <div className="flex items-center">
        <button className="mr-4 focus:outline-none" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <div className="text-xl font-bold">INSA ERP</div>
      </div>

      {/* Right Section: Search and Profile */}
      <div className="flex items-center">
        {/* Search Input */}
        {/* <div className="relative mr-4">
          <input
            className="border rounded px-4 py-2 pl-10 text-gray-800"
            placeholder="Search"
            type="text"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 text-gray-500"
          />
        </div> */}

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setIsProfileOpen((v) => !v)}
            aria-label="User menu"
          >
            {/* Avatar: Use ProfilePicture as avatar */}
            <ProfilePicture
              disableClick
              className="w-11 h-11 min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] rounded-full border-2 border-white shadow object-cover"
            />
          </button>
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full text-left flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon
                    icon={faUser}
                    className="mr-3 text-[#3c8dbc]"
                  />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsSettingsModalOpen(true);
                  }}
                  className="w-full text-left flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon
                    icon={faCog}
                    className="mr-3 text-[#3c8dbc]"
                  />
                  <span>Settings</span>
                </button>
                <button
                  className="w-full text-left flex items-center px-4 py-3 text-base text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon
                    icon={faSignOutAlt}
                    className="mr-3 text-[#3c8dbc]"
                  />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="fixed inset-0 bg-black"
              variants={backdropVariants}
              onClick={() => setIsProfileModalOpen(false)}
            />
            <motion.div
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
              variants={modalVariants}
            >
              <div className="absolute top-4 right-4">
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsProfileModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>
              <div className="p-8">
                <div className="text-center mb-6">
                  {/* Profile Picture at the top */}
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden aspect-square flex items-center justify-center">
                    <ProfilePicture className="w-24 h-24 min-w-[96px] min-h-[96px] max-w-[96px] max-h-[96px] rounded-full object-cover" />
                  </div>
                  {/* Full Name */}
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {user.name}
                  </h2>
                  {/* Department (using role as department) */}
                  <div className="text-base text-gray-600 mb-4">
                    {user.role}
                  </div>
                  {/* User Information Section */}
                  <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      User Information
                    </h3>
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">
                        Full name:
                      </span>
                      <span className="ml-2 text-gray-900">{user.name}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-900">{user.email}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Role:</span>
                      <span className="ml-2 text-gray-900">{user.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal with Change Password stepper */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="fixed inset-0 bg-black"
              variants={backdropVariants}
              onClick={() => {
                setIsSettingsModalOpen(false);
                setShowChangePasswordForm(false);
                setFormData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
            />
            <motion.div
              className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
              variants={modalVariants}
            >
              <div className="absolute top-4 right-4">
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsSettingsModalOpen(false);
                    setShowChangePasswordForm(false);
                    setFormData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                  Settings
                </h2>
                {!showChangePasswordForm ? (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <button
                        onClick={() => setShowChangePasswordForm(true)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="p-2 rounded-full bg-[#3c8dbc] text-white mr-3">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="h-5 w-5"
                            />
                          </div>
                          <div className="text-left">
                            <h3 className="font-medium text-gray-800">
                              Change Password
                            </h3>
                            <p className="text-sm text-gray-500">
                              Update your account password
                            </p>
                          </div>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc]"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 focus:outline-none"
                          onClick={() => setShowCurrentPassword((v) => !v)}
                          tabIndex={-1}
                        >
                          {showCurrentPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.875-4.575A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.575-1.125"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc]"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 focus:outline-none"
                          onClick={() => setShowNewPassword((v) => !v)}
                          tabIndex={-1}
                        >
                          {showNewPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.875-4.575A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.575-1.125"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc]"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 focus:outline-none"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.875-4.575A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.575-1.125"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-[#3c8dbc] hover:bg-[#367fa9] text-white font-medium rounded-lg shadow-md transition duration-300 flex justify-center items-center"
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
                            Updating...
                          </>
                        ) : (
                          "Change Password"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
