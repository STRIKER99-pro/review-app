import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./Backend/SupabaseClient";
import "./App.css";

import HomePage from "./pages/HomePage/HomePage";
import NavBar from "./pages/NavBar/NavBar";
import Signup from "./pages/SignUpPage/Signup";
import SearchVendor from "./pages/SearchVendor/SearchVendor";
import CreateVendor from "./pages/NewVendor/CreateVendor";
import SeeReview from "./pages/SeeReviewed/SeeReview";
import SubmitReview from "./pages/SubmitReview/SubmitReview";
import Categories from "./pages/Categories/Categories";
import MyReviews from "./pages/MyReviews/MyReviews";
import Profile from "./pages/Profile/Profile";
import About from "./pages/About/About";

//ProtectedRoute for Supabase
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check guest session first
      const guestSession = localStorage.getItem("guestSession");

      if (guestSession === "true") {
        // Guests are not allowed for protected routes
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      // Check Supabase session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/Signup" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<HomePage />} />
          <Route path="SearchVendor" element={<SearchVendor />} />
          <Route path="Categories" element={<Categories />} />
          <Route path="About" element={<About />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="CreateVendor"
            element={
              <ProtectedRoute>
                <CreateVendor />
              </ProtectedRoute>
            }
          />

          <Route path="SeeReview" element={<SeeReview />} />

          <Route
            path="SubmitReview"
            element={
              <ProtectedRoute>
                <SubmitReview />
              </ProtectedRoute>
            }
          />
          <Route
            path="MyReviews" 
            element={
              <ProtectedRoute>
                <MyReviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="Profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
