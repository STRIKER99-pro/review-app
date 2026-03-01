
import './SeeReview.css'

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const SeeReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Location state:", location.state); 

    // Get vendor data passed from SearchVendor
    const vendorData = location.state?.vendor;

    if (!vendorData) {
      console.error("No vendor data found in location state");
      toast.error("No vendor selected");
      navigate("/");
      return;
    }

    console.log("Vendor data received:", vendorData);
    setVendor(vendorData);

    // Load reviews from localStorage
    const loadReviews = () => {
      const storedReviews = JSON.parse(
        localStorage.getItem(`reviews_${vendorData.id}`) || "[]",
      );
  
      const reviewsToUse =
        storedReviews;
      setReviews(reviewsToUse);

      // Calculate average rating
      if (reviewsToUse.length > 0) {
        const total = reviewsToUse.reduce((sum, review) => sum + review.rating, 0,);
        const avg = total / reviewsToUse.length;
        setAverageRating(avg);
      } else{
        setAverageRating(0)
      }

      setLoading(false);
    };

    loadReviews();
  }, [location.state, navigate]);

  // render star funtion
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5; 

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="full-star-icon" />);
      } else if (hasHalf && i === fullStars + 1) {
        stars.push(<FaStarHalfAlt key={i} className="full-star-icon" />);
      } else {
        stars.push(<FaRegStar key={i} className="empty-star-icon" />);
      }
    }
    return stars;
  };

  // HANDLE ADD REVIEW
  const handleAddReview = () => {
    if (!vendor) return;

    // Navigate to add review page with vendor data
    navigate("/SubmitReview", {
      state: { vendor: vendor },
    });
  };


  const handleSeeMore = (e) => {
    e.preventDefault();
    toast.info("Loading all reviews...");
  };

  if (loading) {
    return (
      <div className="review-card">
        <div className="brand-header">
          <div className="brand-title">
            ReviewIt <span>Trust</span>
          </div>
          <div className="tagline">
            <i className="clipboard-check">Check before you buy</i>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading vendor details...
        </div>
      </div>
    );
  }

  // If no vendor data, show error
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
        <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
          No vendor data found. Please go back and select a vendor.
        </div>
        <div className="add-btn">
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
            <i className="clipboard-check">Check before you buy</i>
          </div>
        </div>

        <div className="review-container">
          <div className="review-content">
            <div className="review-item">
              <span className="review-label">Name:</span>
              <span className="review-value">
                {vendor.name}
              </span>
            </div>
            <div className="review-item">
              <span className="review-label">Tel:</span>
              <span className="review-value">
                {vendor.phoneNumber}
              </span>
            </div>
            <div className="review-item">
              <span className="review-label">Category:</span>
              <span className="review-value">
                {vendor.category || vendor.name?.split(" ")}
              </span>
            </div>
          </div>

          <div className="review-rate">
            <div className="review-item">
              <span className="review-label">Average Rating</span>
              <div className="review-value rating-compact">
                <span className="stars-avg">
                  {reviews.length > 0 ? (renderStars(averageRating)
                  ):(
                    <span className="no-rating">No rating yet</span>
                  )}
                </span>
                <span className="review-count">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="see-more">
          <a href="#" className="see-more-link" onClick={handleSeeMore}>
            see more
          </a>
        </div>

        
        <div className="review-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review-entry">
                <span className="review-text">{review.text}</span>
                <span className="review-stars">
                  {renderStars(review.rating)}
                </span>
                <span className="review-date">{review.date}</span>
              </div>
            ))
          ) : (
            <div className="review-entry">
              <span className="review-text">No reviews yet</span>
            </div>
          )}
        </div>

        {/* Add Review Button */}
        <div className="add-btn">
          <button onClick={handleAddReview}>Add Review</button>
        </div>
      </div>

      {/* Footer */}
      <div className="copyright-footer">
        <div>About us</div>
        <div>© 2026 ReviewIT. All rights reserved.</div>
      </div>
    </div>
  );
};

export default SeeReview;