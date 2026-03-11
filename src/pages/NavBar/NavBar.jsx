import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom";
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
  FaChevronDown,
} from "react-icons/fa";
import { supabase } from "../../Backend/SupabaseClient";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const guest = localStorage.getItem("guestSession");
      if (guest === "true") {
        setIsGuest(true);
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMenus();
  };

  if (loading) {
    return (
      <div className="navbar-loading">
        <div className="navbar-loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo" onClick={() => handleNavigation("/")}>
            <span className="logo-icon">⭐</span>
            <span className="logo-text">ReviewIt</span>
            <span className="logo-badge">Trust</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="navbar-links">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <FaHome /> <span>Home</span>
            </NavLink>
            <NavLink
              to="/SearchVendor"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <FaSearch /> <span>Search</span>
            </NavLink>
            <NavLink
              to="/Categories"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <FaList /> <span>Categories</span>
            </NavLink>
            <NavLink
              to="/CreateVendor"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <FaPlus /> <span>Create</span>
            </NavLink>
            <NavLink
              to="/SeeReview"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <FaStar /> <span>Reviews</span>
            </NavLink>
            <NavLink
              to="/About"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <FaInfo /> <span>About</span>
            </NavLink>
          </div>

          {/* User Section */}
          <div className="navbar-user">
            {currentUser ? (
              <div className="user-menu">
                <button
                  className="user-menu-button"
                  onClick={toggleProfileMenu}
                >
                  <div className="user-avatar-small">
                    {currentUser.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{currentUser.username}</span>
                  <FaChevronDown
                    className={`dropdown-icon ${isProfileMenuOpen ? "open" : ""}`}
                  />
                </button>

                {isProfileMenuOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-user-info">
                        <strong>{currentUser.username}</strong>
                        <small>
                          {currentUser.email || currentUser.phoneNumber}
                        </small>
                      </div>
                    </div>
                    <div className="dropdown-items">
                      <button onClick={() => handleNavigation("/Profile")}>
                        <FaUser /> Profile
                      </button>
                      <button onClick={() => handleNavigation("/MyReviews")}>
                        <FaStar /> My Reviews
                      </button>
                      <button onClick={() => handleNavigation("/SubmitReview")}>
                        <FaPen /> Submit Review
                      </button>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="logout-btn">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : isGuest ? (
              <div className="guest-menu">
                <span className="guest-badge-small">👤 Guest</span>
                <button
                  className="nav-login-btn"
                  onClick={() => navigate("/signup")}
                >
                  <FaSignInAlt /> Login
                </button>
                <button
                  className="nav-signup-btn"
                  onClick={() => navigate("/signup")}
                >
                  <FaUserPlus /> Sign Up
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <button
                  className="nav-login-btn"
                  onClick={() => navigate("/signup")}
                >
                  <FaSignInAlt /> Login
                </button>
                <button
                  className="nav-signup-btn"
                  onClick={() => navigate("/signup")}
                >
                  <FaUserPlus /> Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-links">
              <NavLink to="/" onClick={closeMenus}>
                <FaHome /> Home
              </NavLink>
              <NavLink to="/SearchVendor" onClick={closeMenus}>
                <FaSearch /> Search
              </NavLink>
              <NavLink to="/Categories" onClick={closeMenus}>
                <FaList /> Categories
              </NavLink>
              <NavLink to="/CreateVendor" onClick={closeMenus}>
                <FaPlus /> Create Vendor
              </NavLink>
              <NavLink to="/SeeReview" onClick={closeMenus}>
                <FaStar /> See Reviews
              </NavLink>
              <NavLink to="/About" onClick={closeMenus}>
                <FaInfo /> About
              </NavLink>

              {currentUser && (
                <>
                  <div className="mobile-divider"></div>
                  <NavLink to="/Profile" onClick={closeMenus}>
                    <FaUser /> Profile
                  </NavLink>
                  <NavLink to="/MyReviews" onClick={closeMenus}>
                    <FaStar /> My Reviews
                  </NavLink>
                  <NavLink to="/SubmitReview" onClick={closeMenus}>
                    <FaPen /> Submit Review
                  </NavLink>
                </>
              )}

              {!currentUser && !isGuest && (
                <>
                  <div className="mobile-divider"></div>
                  <button onClick={() => handleNavigation("/signup")}>
                    <FaSignInAlt /> Login
                  </button>
                  <button onClick={() => handleNavigation("/signup")}>
                    <FaUserPlus /> Sign Up
                  </button>
                </>
              )}

              {isGuest && (
                <>
                  <div className="mobile-divider"></div>
                  <div className="mobile-guest-info">
                    <span className="guest-badge">👤 Guest Mode</span>
                    <p className="guest-note">Login to submit reviews</p>
                  </div>
                </>
              )}

              {currentUser && (
                <>
                  <div className="mobile-divider"></div>
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="navbar-main-content">
        <Outlet />
      </main>
    </>
  );
};

export default NavBar;
