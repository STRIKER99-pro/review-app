import "./SubmitReview.css";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaStar, FaRegStar } from "react-icons/fa";

const SubmitReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===== FIXED: GET VENDOR DATA (separate useEffect) =====
  useEffect(() => {
    const vendorData = location.state?.vendor;

    if (!vendorData) {
      toast.error("No vendor selected");
      navigate("/");
      return;
    }

    console.log("Vendor data received:", vendorData);
    setVendor(vendorData);
  }, [location.state, navigate]); // ← Fixed: Removed nested useEffect

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

    setIsSubmitting(true);

    //create new review object
    try {
      const newReview = {
        id: Date.now(),
        text: reviewText.trim(),
        rating: rating,
        date: new Date()
          .toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "/"), // format as MM/DD/YYYY
        vendorId: vendor.id,
        vendorName: vendor.name,
      };

      console.log("New review:", newReview);

      // get existing reviews for this vendor
      const storageKey = `reviews_${vendor.id}`;
      const existingReviews = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      );

      // add new reviews
      const updatedReviews = [newReview, ...existingReviews]; // Newest first
      localStorage.setItem(storageKey, JSON.stringify(updatedReviews));

      // update vendor's rating in vendor list
      updateVendorRating(vendor.id, updatedReviews);

      toast.success("Review submitted successfully!");

      // go back to review page
      setTimeout(() => {
        navigate("/SeeReview", {
          state: { vendor: vendor },
        });
      }, 1500);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  //update vendor's rating
  const updateVendorRating = (vendorId, reviews) => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;

    const allVendors = JSON.parse(localStorage.getItem("vendors") || "[]");

    const updatedVendors = allVendors.map((v) => {
      if (v.id === vendorId) {
        return {
          ...v,
          rating: average,
          reviews: reviews.length,
        };
      }
      return v;
    });

    localStorage.setItem("vendors", JSON.stringify(updatedVendors));
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
          <div className="brand-title">
            ReviewIt <span>Trust</span>
          </div>
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
          <div className="brand-title">
            ReviewIt <span>Trust</span>
          </div>
          <div className="tagline">
            <i className="fa fa-clipboard-check">Check before you buy</i>
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



