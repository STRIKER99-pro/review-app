import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  FaHome,
  FaSearch,
  FaStar,
  FaPlus,
  FaList,
  FaUser,
  FaInfo,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaPen,
} from "react-icons/fa";
import { supabase } from "../../Backend/SupabaseClient"; // ADDED: Import supabase
import "./DashBoard.css";

const DashBoard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true); // ADDED: Loading state

  useEffect(() => {
    checkUser();

    // Close sidebar when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // CHANGED: Check user from Supabase instead of localStorage
  const checkUser = async () => {
    try {
      // Check guest session first
      const guest = localStorage.getItem("guestSession");
      if (guest === "true") {
        setIsGuest(true);
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      // Check Supabase session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Get additional user data from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        setCurrentUser({
          id: user.id,
          username: profile?.username || user.email?.split("@")[0] || "User",
          email: user.email,
          phoneNumber: profile?.phone_number || user.phone || "",
        });
        setIsGuest(false);
      } else {
        setCurrentUser(null);
        setIsGuest(false);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // CHANGED: Logout from Supabase
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("guestSession");
      setCurrentUser(null);
      setIsGuest(false);
      navigate("/signup");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Close sidebar when clicking on overlay or any nav link
  const handleContentClick = () => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay active" onClick={closeSidebar}></div>
      )}

      {/* Mobile Menu Toggle Button */}
      <button
        className={`menu-toggle ${isSidebarOpen ? "hidden" : ""}`}
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-title">
            ReviewIt <span>Trust</span>
          </div>
          <button
            className={`close-sidebar ${!isSidebarOpen ? "hidden" : ""}`}
            onClick={closeSidebar}
          >
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Quick search..."
            onClick={() => {
              navigate("/SearchVendor");
              handleContentClick();
            }}
            readOnly
          />
        </div>

        <nav className="sidebar-nav">
          {/* Home*/}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleContentClick}
          >
            <FaHome /> <span>Home </span>
          </NavLink>

          {/* Search Page */}
          <NavLink
            to="/SearchVendor"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleContentClick}
          >
            <FaSearch /> <span>Search Vendors</span>
          </NavLink>

          {/* Create Vendor Page - Available for both users and guests */}
          <NavLink
            to="/CreateVendor"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleContentClick}
          >
            <FaPlus /> <span>Create Vendor</span>
          </NavLink>

          {/* See Reviews Page */}
          <NavLink
            to="/SeeReview"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleContentClick}
          >
            <FaList /> <span>See Reviews</span>
          </NavLink>

          {/* Submit Review Page - Only for logged in users */}
          {currentUser && (
            <NavLink
              to="/SubmitReview"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={handleContentClick}
            >
              <FaPen /> <span>Submit Review</span>
            </NavLink>
          )}

          {/* My Reviews - Only for logged in users */}
          {currentUser && (
            <NavLink
              to="/MyReviews"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={handleContentClick}
            >
              <FaStar /> <span>My Reviews</span>
            </NavLink>
          )}

          {/* Profile - Only for logged in users */}
          {currentUser && (
            <NavLink
              to="/Profile"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={handleContentClick}
            >
              <FaUser /> <span>Profile</span>
            </NavLink>
          )}

          {/* About Page */}
          <NavLink
            to="/About"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleContentClick}
          >
            <FaInfo /> <span>About</span>
          </NavLink>
        </nav>

        {/* User Status Panel */}
        <div className="sidebar-user">
          {currentUser ? (
            <div className="user-info">
              <div className="user-avatar">
                {currentUser.username?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <strong>{currentUser.username}</strong>
                <small>{currentUser.email || currentUser.phoneNumber}</small>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : isGuest ? (
            <div className="guest-info">
              <p className="guest-badge">👤 Guest Mode</p>
              <div className="guest-permissions">
                <span>✓ View & Search</span>
                <span className="restricted">✗ Create/Review</span>
              </div>
              <div className="guest-actions">
                <button
                  onClick={() => navigate("/signup")}
                  className="signup-btn"
                >
                  <FaUserPlus /> Sign Up
                </button>
                <button
                  onClick={() => navigate("/Signup")}
                  className="login-btn"
                >
                  <FaSignInAlt /> Login
                </button>
              </div>
              {/* Guest message for Submit Review */}
              <p
                className="guest-note"
                style={{
                  fontSize: "0.7rem",
                  marginTop: "10px",
                  color: "#ef4444",
                }}
              >
                *Login to submit reviews
              </p>
            </div>
          ) : (
            <div className="guest-info">
              <p>Welcome to ReviewIt</p>
              <div className="guest-actions">
                <button
                  onClick={() => navigate("/signup")}
                  className="signup-btn"
                >
                  <FaUserPlus /> Sign Up
                </button>
                <button
                  onClick={() => navigate("/Signup")}
                  className="login-btn"
                >
                  <FaSignInAlt /> Login
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <p>© 2026 ReviewIT</p>
          <div className="footer-links">
            <a href="/about">About</a> · <a href="/privacy">Privacy</a> ·{" "}
            <a href="/terms">Terms</a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main" onClick={handleContentClick}>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashBoard;
