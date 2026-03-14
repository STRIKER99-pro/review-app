import "./SubmitReview.css";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaStar, FaRegStar } from "react-icons/fa";
import { supabase } from "../../Backend/SupabaseClient";

const SubmitReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to leave a review");
        navigate("/signup");
      }
      setUser(user);
    };

    checkUser();
  }, [navigate]);

  // GET VENDOR DATA
  useEffect(() => {
    const vendorData = location.state?.vendor;

    if (!vendorData) {
      toast.error("No vendor selected");
      navigate("/");
      return;
    }

    console.log("Vendor data received:", vendorData);
    setVendor(vendorData);
  }, [location.state, navigate]);

  // handle rating click
  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  // handle mouse enter for hover effect
  const handleMouseEnter = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  // handle mouse leave
  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  // handle stars with interactivity
  const renderInteractiveStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoverRating || rating);

      stars.push(
        <span
          key={i}
          className="star-clickable"
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: "pointer", display: "inline-block" }}
        >
          {isFilled ? (
            <FaStar className="full-star-icon" size={24} />
          ) : (
            <FaRegStar className="empty-star-icon" size={24} />
          )}
        </span>,
      );
    }
    return stars;
  };

  // Update vendor's average rating - MOVED OUTSIDE handleSubmit
  const updateVendorRating = async (vendorId) => {
    try {
      console.log("Updating rating for vendor:", vendorId);

      // Get all reviews for this vendor
      const { data: reviews, error: fetchError } = await supabase
        .from("reviews")
        .select("rating")
        .eq("vendor_id", vendorId);

      if (fetchError) {
        console.error("Fetch error:", fetchError);
        throw fetchError;
      }

      console.log("Reviews found:", reviews);

      // Calculate new average
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);
      const average = total / reviews.length;

      console.log("Average rating:", average, "Total reviews:", reviews.length);

      // Update vendor with new average and review count
      const { error: updateError } = await supabase
        .from("vendors")
        .update({
          rating: average,
          reviews_count: reviews.length,
        })
        .eq("id", vendorId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      console.log("Vendor rating updated successfully");
    } catch (error) {
      console.error("Error updating vendor rating:", error);
      throw error;
    }
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!vendor) {
      toast.error("Vendor information missing");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to submit a review");
      navigate("/signup");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewId = Date.now();

      // Create new review object for Supabase
      const newReview = {
        id: reviewId,
        vendor_id: vendor.id,
        user_id: user.id,
        text: reviewText.trim(),
        rating: rating,
        date: new Date()
          .toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "/"),
        created_at: new Date().toISOString(),
      };

      console.log("New review:", newReview);

      // Insert review into Supabase
      console.log("Attempting to insert review:", newReview);
      const { error: insertError, data: insertData } = await supabase
        .from("reviews")
        .insert([newReview])
        .select();

      console.log("Insert result:", { insertError, insertData });

      if (insertError) {
        console.error("Insert error details:", insertError);
        throw insertError;
      }

      console.log("Review inserted successfully");

      // Update vendor's average rating
      console.log("Updating vendor rating for vendor:", vendor.id);
      await updateVendorRating(vendor.id);

      toast.success("Review submitted successfully!");

      // go back to review page
      setTimeout(() => {
        navigate("/SeeReview", {
          state: { vendor: vendor },
        });
      }, 1500);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error.message || "Failed to submit review. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!vendor) {
      navigate("/");
      return;
    }
    navigate("/SeeReview", {
      state: { vendor: vendor },
    });
  };

  // Show loading if vendor is null
  if (!vendor) {
    return (
      <div className="review-card">
        <div className="brand-header">
          <div className="tagline">
            <i className="fa fa-clipboard-check">Check before you buy</i>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>Loading vendor data...</p>
          <button onClick={() => navigate("/")}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-card">
      <Toaster position="top-center" />

      <div>
        {/* Header */}
        <div className="brand-header">
          <div className="tagline">
            <i className="clipboard-check">Check before you buy</i>
          </div>
        </div>

        {/* Vendor info banner */}
        <div className="vendor-info-banner">
          <div>
            <strong>Reviewing:</strong> {vendor.name}
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
            {vendor.phoneNumber}
          </div>
        </div>

        {/* Submit Review Form */}
        <form onSubmit={handleSubmit} className="submit-content">
          <div className="write-review">
            <input
              type="text"
              name="review"
              id="write-review"
              placeholder="Write your review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled={isSubmitting}
              maxLength={500}
              required
            />
          </div>

          {/* rating stars */}
          <div className="review-item">
            <span className="review-label">Rate vendor</span>
            <div className="review-value rating-compact">
              <div className="review-stars interactive-stars">
                {renderInteractiveStars()}
              </div>
              {/* show selected rating */}
              {rating > 0 && (
                <span
                  style={{
                    marginLeft: "10px",
                    fontSize: "0.9rem",
                    color: "#6b7280",
                  }}
                >
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          {/* submit and cancel buttons */}
          <div
            className="add-btn"
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button
              className="cancel-button"
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="copyright-footer">
        <div>About us</div>
        <div>© 2026 ReviewIT. All rights reserved.</div>
      </div>
    </div>
  );
};

export default SubmitReview;
