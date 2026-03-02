import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage/HomePage";
import DashBoard from "./pages/DashBoard/DashBoard";
import Signup from "./pages/SignUpPage/Signup";
import SearchVendor from "./pages/SearchVendor/SearchVendor";
import CreateVendor from "./pages/NewVendor/CreateVendor";
import SeeReview from "./pages/SeeReviewed/SeeReview";
import SubmitReview from "./pages/SubmitReview/SubmitReview";

// ===== FIXED: Protected Route with safe JSON parsing =====
const ProtectedRoute = ({ children }) => {
  // Safely get and parse currentUser
  const currentUserString = localStorage.getItem("currentUser");
  let currentUser = null;

  try {
    currentUser = JSON.parse(currentUserString);
  } catch (error) {
    console.error("Error parsing currentUser:", error);
  }

  const guestSession = localStorage.getItem("guestSession");

  // If guest or no user, redirect to signup
  if (guestSession === "true" || !currentUser) {
    return <Navigate to="/Signup" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashBoard />}>
          <Route index element={<HomePage />} />
          <Route path="SearchVendor" element={<SearchVendor />} />

          {/*PROTECTED ROUTES */}
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
        </Route>

        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
