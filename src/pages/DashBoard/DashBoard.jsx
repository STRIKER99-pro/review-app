
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
} from "react-icons/fa";
import "./DashBoard.css";

const DashBoard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    // Check user status
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const guest = localStorage.getItem("guestSession");

    if (user) setCurrentUser(user);
    if (guest === "true") setIsGuest(true);

    // Close sidebar when resizing to desktop
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("guestSession");
    navigate("/signup");
  };

  // Close sidebar when clicking on overlay or any nav link
  const handleContentClick = () => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay active" onClick={closeSidebar}></div>
      )}

      {/* Mobile Menu Toggle Button */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand-title">
            ReviewIt <span>Trust</span>
          </div>
          <button className="close-sidebar" onClick={closeSidebar}>
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Quick search..."
            onClick={() => {
              navigate("/");
              handleContentClick();
            }}
            readOnly
          />
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleContentClick}
          >
            <FaHome /> <span>Home</span>
          </NavLink>

          <NavLink
            to="/CreateVendor"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleContentClick}
          >
            <FaPlus /> <span>Create Vendor</span>
          </NavLink>

          {currentUser && (
            <>
              <NavLink
                to="/my-reviews"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={handleContentClick}
              >
                <FaStar /> <span>My Reviews</span>
              </NavLink>

              <NavLink
                to="/create-vendor"
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                onClick={handleContentClick}
              >
                <FaPlus /> <span>Add Vendor</span>
              </NavLink>
            </>
          )}

          <NavLink
            to="/SeeReview"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={handleContentClick}
          >
            <FaList /> <span>See Reviews</span>
          </NavLink>

          {currentUser && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={handleContentClick}
            >
              <FaUser /> <span>Profile</span>
            </NavLink>
          )}

          <NavLink
            to="/about"
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
              <p className="guest-badge">Guest Mode</p>
              <div className="guest-permissions">
                <span>View & Search</span>
                <span className="restricted">Create/Review</span>
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
                  onClick={() => navigate("/login")}
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