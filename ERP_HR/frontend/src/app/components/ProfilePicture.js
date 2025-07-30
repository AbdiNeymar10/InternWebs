import React, { useRef, useState, useEffect } from "react";
import { authFetch } from "../../utils/authFetch";

const API_BASE = "http://localhost:8080/api/auth/users/empid/";

export default function ProfilePicture({
  disableClick = false,
  className,
  fillParent = false,
}) {
  // Hydration fix: only render after client mount
  const [hasMounted, setHasMounted] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [fullName, setFullName] = useState("");
  const fileInputRef = useRef();
  const [empId, setEmpId] = useState(null);

  // Helper to get empId from localStorage, only on client
  const getValidEmpId = () => {
    if (typeof window === "undefined") return null;
    let raw = window.localStorage.getItem("empId");
    if (!raw) {
      const userStr = window.localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          raw = userObj.empId;
        } catch {}
      }
    }
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return null;
    return trimmed;
  };

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== "undefined") {
      const validEmpId = getValidEmpId();
      setEmpId(validEmpId);
      let storedFullName = window.localStorage.getItem("fullName");
      if (!storedFullName) {
        const userStr = window.localStorage.getItem("user");
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            storedFullName = userObj.fullName;
          } catch {}
        }
      }
      setFullName(
        storedFullName && storedFullName.trim() ? storedFullName : ""
      );
    }
    const handleStorage = () => {
      if (typeof window === "undefined") return;
      const validEmpId = getValidEmpId();
      setEmpId(validEmpId);
      let storedFullName = window.localStorage.getItem("fullName");
      if (!storedFullName) {
        const userStr = window.localStorage.getItem("user");
        if (userStr) {
          try {
            const userObj = JSON.parse(userStr);
            storedFullName = userObj.fullName;
          } catch {}
        }
      }
      setFullName(
        storedFullName && storedFullName.trim() ? storedFullName : ""
      );
    };
    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const validEmpId = getValidEmpId();
    if (!validEmpId) return;
    setFeedback("");
    authFetch(`${API_BASE}${validEmpId}/profile-picture`)
      .then((res) => {
        if (res.ok) return res.blob();
        throw new Error();
      })
      .then((blob) => {
        setImageUrl(URL.createObjectURL(blob));
      })
      .catch((err) => {
        setImageUrl(null);
      });
  }, [empId]);

  useEffect(() => {
    if (loading || feedback) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [loading, feedback]);

  const handleFileChange = async (e) => {
    if (typeof window === "undefined") return;
    const currentEmpId = getValidEmpId();
    setEmpId(currentEmpId);
    let currentFullName = window.localStorage.getItem("fullName");
    if (!currentFullName) {
      const userStr = window.localStorage.getItem("user");
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          currentFullName = userObj.fullName;
        } catch {}
      }
    }
    setFullName(
      currentFullName && currentFullName.trim() ? currentFullName : ""
    );

    let file;
    if (e.target && e.target.files && e.target.files.length > 0) {
      file = e.target.files[0];
    } else if (e.files && e.files.length > 0) {
      file = e.files[0];
    }
    if (!currentEmpId) {
      setFeedback("User not found. Please refresh and login again.");
      return;
    }
    if (!file) {
      setFeedback("No file selected.");
      return;
    }
    setLoading(true);
    setFeedback("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await authFetch(
        `${API_BASE}${currentEmpId}/profile-picture`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (res.ok) {
        // Refresh image with cache busting
        const imgRes = await authFetch(
          `${API_BASE}${currentEmpId}/profile-picture`
        );
        if (imgRes.ok) {
          const blob = await imgRes.blob();
          setImageUrl(URL.createObjectURL(blob) + "?t=" + new Date().getTime());
          setFeedback("Profile picture updated successfully.");
        } else {
          setImageUrl(null);
          setFeedback(
            "Profile picture uploaded, but could not retrieve image."
          );
        }
      } else {
        const errorText = await res.text();
        setFeedback(`Failed to upload profile picture: ${errorText}`);
      }
    } catch (err) {
      setFeedback("Failed to upload profile picture. " + (err?.message || ""));
    }
    setLoading(false);
  };

  if (!hasMounted) {
    // Render nothing until client mount to avoid hydration mismatch
    return null;
  }
  return (
    <>
      {showToast && (
        <div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded shadow-lg flex items-center justify-center"
          style={{ minWidth: "220px", maxWidth: "350px" }}
        >
          {loading ? "Uploading..." : feedback}
        </div>
      )}
      <div className="relative mr-2 flex items-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="User profile picture"
            className={
              (fillParent
                ? "absolute inset-0 w-full h-full object-cover rounded-full"
                : "w-full h-full rounded-full object-cover") +
              (className ? ` ${className}` : "") +
              " cursor-pointer"
            }
            onClick={
              disableClick
                ? undefined
                : () => {
                    if (typeof window === "undefined") return;
                    const currentEmpId = getValidEmpId();
                    setEmpId(currentEmpId);
                    let currentFullName =
                      window.localStorage.getItem("fullName");
                    if (!currentFullName) {
                      const userStr = window.localStorage.getItem("user");
                      if (userStr) {
                        try {
                          const userObj = JSON.parse(userStr);
                          currentFullName = userObj.fullName;
                        } catch {}
                      }
                    }
                    setFullName(
                      currentFullName && currentFullName.trim()
                        ? currentFullName
                        : ""
                    );
                    if (currentEmpId && fileInputRef.current)
                      fileInputRef.current.click();
                  }
            }
            title={
              typeof window !== "undefined" && getValidEmpId()
                ? "Change profile picture"
                : "Login required"
            }
            style={
              typeof window !== "undefined" && getValidEmpId()
                ? { opacity: 1, pointerEvents: "auto" }
                : { opacity: 0.5, pointerEvents: "none" }
            }
          />
        ) : (
          <div
            className={
              (fillParent
                ? "absolute inset-0 w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white text-xl font-bold cursor-pointer"
                : "w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white text-xl font-bold cursor-pointer") +
              (className ? ` ${className}` : "")
            }
            onClick={
              disableClick
                ? undefined
                : () => {
                    if (typeof window === "undefined") return;
                    const currentEmpId = getValidEmpId();
                    setEmpId(currentEmpId);
                    let currentFullName =
                      window.localStorage.getItem("fullName");
                    if (!currentFullName) {
                      const userStr = window.localStorage.getItem("user");
                      if (userStr) {
                        try {
                          const userObj = JSON.parse(userStr);
                          currentFullName = userObj.fullName;
                        } catch {}
                      }
                    }
                    setFullName(
                      currentFullName && currentFullName.trim()
                        ? currentFullName
                        : ""
                    );
                    if (currentEmpId && fileInputRef.current)
                      fileInputRef.current.click();
                  }
            }
            title={
              typeof window !== "undefined" && getValidEmpId()
                ? "Set profile picture"
                : "Login required"
            }
            style={
              typeof window !== "undefined" && getValidEmpId()
                ? { opacity: 1, pointerEvents: "auto" }
                : { opacity: 0.5, pointerEvents: "none" }
            }
          >
            {fullName && fullName.trim().length > 0
              ? fullName.trim().charAt(0).toUpperCase()
              : "?"}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={
            loading || (typeof window !== "undefined" && !getValidEmpId())
          }
        />
      </div>
    </>
  );
}
