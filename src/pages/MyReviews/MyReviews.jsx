import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaStore,
  FaArrowLeft,
} from "react-icons/fa";
import { supabase } from "../../Backend/SupabaseClient";
import "./MyReviews.css";

const MyReviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    totalVendors: 0,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/signup");
        return;
      }

      setUser(user);
      fetchUserReviews(user.id);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/signup");
    }
  };

  const fetchUserReviews = async (userId) => {
    try {
      setLoading(true);

      // Fetch all reviews by this user
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(
          `
          *,
          vendors (
            id,
            business_name,
            phone_number,
            category
          )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      // Calculate stats
      const totalReviews = reviewsData?.length || 0;
      let totalRating = 0;

      if (totalReviews > 0) {
        totalRating = reviewsData.reduce(
          (sum, review) => sum + review.rating,
          0,
        );
      }

      // Get unique vendors count
      const uniqueVendors = new Set(reviewsData?.map((r) => r.vendor_id)).size;

      setStats({
        totalReviews,
        averageRating: totalReviews > 0 ? totalRating / totalReviews : 0,
        totalVendors: uniqueVendors,
      });

      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star-filled" />);
      } else if (hasHalf && i === fullStars + 1) {
        stars.push(<FaStarHalfAlt key={i} className="star-half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-empty" />);
      }
    }
    return stars;
  };

  const handleVendorClick = (vendor) => {
    navigate("/SeeReview", { state: { vendor } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="my-reviews-page">
        <div className="review-card">
          <div className="loading-container">Loading your reviews...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-reviews-page">
      <div className="review-card">
        <div>
          <div className="brand-header">
            <div className="brand-title">
              ReviewIt <span>Trust</span>
            </div>
            <div className="tagline">
              <i className="clipboard-check">My Reviews</i>
            </div>
          </div>

          <button className="back-button" onClick={handleBack}>
            <FaArrowLeft /> Back
          </button>

          {/* Stats Cards */}
          <div className="reviews-stats">
            <div className="stat-card-small">
              <FaStar className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">{stats.totalReviews}</span>
                <span className="stat-label">Total Reviews</span>
              </div>
            </div>

            <div className="stat-card-small">
              <div className="stars-preview">
                {renderStars(stats.averageRating)}
              </div>
              <div className="stat-info">
                <span className="stat-number">
                  {stats.averageRating.toFixed(1)}
                </span>
                <span className="stat-label">Avg Rating</span>
              </div>
            </div>

            <div className="stat-card-small">
              <FaStore className="stat-icon" />
              <div className="stat-info">
                <span className="stat-number">{stats.totalVendors}</span>
                <span className="stat-label">Vendors</span>
              </div>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>You haven't written any reviews yet.</p>
              <button
                className="browse-btn"
                onClick={() => navigate("/SearchVendor")}
              >
                Browse Vendors
              </button>
            </div>
          ) : (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div
                    className="vendor-info-header"
                    onClick={() =>
                      handleVendorClick({
                        id: review.vendors.id,
                        name: review.vendors.business_name,
                        phoneNumber: review.vendors.phone_number,
                        category: review.vendors.category,
                      })
                    }
                  >
                    <h3 className="vendor-name">
                      {review.vendors.business_name}
                    </h3>
                    <span className="vendor-category">
                      {review.vendors.category}
                    </span>
                  </div>

                  <div className="review-content">
                    <div className="review-rating">
                      <div className="stars">{renderStars(review.rating)}</div>
                      <span className="rating-value">{review.rating}/5</span>
                    </div>

                    <p className="review-text">"{review.text}"</p>

                    <div className="review-footer">
                      <span className="review-date">
                        {formatDate(review.created_at || review.date)}
                      </span>
                      <button
                        className="view-vendor-btn"
                        onClick={() =>
                          handleVendorClick({
                            id: review.vendors.id,
                            name: review.vendors.business_name,
                            phoneNumber: review.vendors.phone_number,
                            category: review.vendors.category,
                          })
                        }
                      >
                        View Vendor
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="copyright-footer">
          <div>About us</div>
          <div>© 2026 ReviewIT. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default MyReviews;


