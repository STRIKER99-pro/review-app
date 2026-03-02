
    import "./HomePage.css";
    import { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";
    import {
      FaStar,
      FaRegStar,
      FaStarHalfAlt,
      FaStore,
      FaWhatsapp,
      FaShieldAlt,
      FaCheckCircle,
      FaArrowRight,
    } from "react-icons/fa";
    import { MdCategory } from "react-icons/md";

const HomePage = () => {
  

  const navigate = useNavigate();
  const [vendorNumbers, setVendorNumbers] = useState([]);
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalReviews: 0,
    verifiedBusinesses: 0
  });

  // Load vendors with actual ratings
  useEffect(() => {
    const storedVendors = JSON.parse(
      localStorage.getItem("vendorNumbers") || "[]",
    );

    const defualtVendors = [
      {
        id: 1,
        phoneNumber: "680752477",
        name: "Mira Fashion",
        rating: 4.5,
        reviews: 32,
      },
      {
        id: 2,
        phoneNumber: "686752477",
        name: "Luxury Fashion",
        rating: 4,
        reviews: 23,
      },
      {
        id: 3,
        phoneNumber: "680755477",
        name: "Jewery Fashion",
        rating: 3,
        reviews: 15,
      },
    ];

    // Load actual ratings from reviews for stored vendors
    const formattedStoredVendors = storedVendors.map((vendor) => {
      // Get reviews for this vendor
      const reviews = JSON.parse(localStorage.getItem(`reviews_${vendor.id}`) || "[]");
      
      // Calculate average rating
      let avgRating = 0;
      if (reviews.length > 0) {
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        avgRating = total / reviews.length;
      }

      return {
        id: vendor.id,
        phoneNumber: vendor.phoneNumber.toString(),
        name: vendor.businessName,
        rating: avgRating,
        reviews: reviews.length,
      };
    });

    const allVendors = [...defualtVendors, ...formattedStoredVendors];
    setVendorNumbers(allVendors);

    // Calculate stats
    const totalReviews = allVendors.reduce((sum, v) => sum + v.reviews, 0);
    const verifiedCount = allVendors.filter(v => v.reviews > 5).length;

    setStats({
      totalVendors: allVendors.length,
      totalReviews: totalReviews,
      verifiedBusinesses: verifiedCount
    });
  }, []);

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

  const handleSignUp = () => {
    navigate("/Signup");
  };

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <div className="brand-header">
          <div className="brand-title">
            ReviewIt <span>Trust</span>
          </div>
          <div className="tagline">
            Check before you buy
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <p className="hero-description">
            <strong>ReviewIt</strong> helps you make informed decisions by providing 
            authentic reviews from real customers. Search for any business, 
            read reviews, and share your own experiences.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <FaStore className="stat-icon business" />
            <div className="stat-info">
              <span className="stat-number">{stats.totalVendors}</span>
              <span className="stat-label">Businesses</span>
            </div>
          </div>
          
          <div className="stat-card">
            <FaStar className="stat-icon reviews" />
            <div className="stat-info">
              <span className="stat-number">{stats.totalReviews}</span>
              <span className="stat-label">Reviews</span>
            </div>
          </div>
          
          <div className="stat-card">
            <FaCheckCircle className="stat-icon verified" />
            <div className="stat-info">
              <span className="stat-number">{stats.verifiedBusinesses}</span>
              <span className="stat-label">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Prompt */}
      <div className="search-prompt">
        <div className="prompt-header">
          <h2>Find <span>Businesses</span></h2>
          <p>Search by phone or category</p>
        </div>
        <button className="search-button" onClick={handleSignUp}>
          Get Started <FaArrowRight />
        </button>
      </div>

      {/* Top Rated Vendors Section */}
      <div className="vendors-section">
        <h3 className="section-title">
          <FaStar className="title-icon" /> Top Rated Vendors
        </h3>
        
        <div className="vendors-list">
          {vendorNumbers
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4)
            .map((vendor) => (
              <div
                key={vendor.id}
                className="vendor-card clickable"
                onClick={() => handleVendorClick(vendor)}
              >
                <div className="vendor-info">
                  <span className="vendor-name">{vendor.name}</span>
                  <span className="vendor-reviews">{vendor.reviews} reviews</span>
                </div>
                <div className="vendor-rating">
                  <div className="stars">
                    {renderStars(vendor.rating)}
                  </div>
                  <span className="rating-value">{vendor.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
        </div>

        <button className="view-all-btn" onClick={handleSignUp}>
          View All Vendors <FaArrowRight />
        </button>
      </div>

      {/* Trust Badges */}
      <div className="trust-badges">
        <div className="trust-item">
          <FaCheckCircle className="trust-icon verified" />
          <span>Verified Reviews</span>
        </div>
        <div className="trust-item">
          <FaShieldAlt className="trust-icon secure" />
          <span>Secure Platform</span>
        </div>
        <div className="trust-item">
          <FaWhatsapp className="trust-icon whatsapp" />
          <span>WhatsApp Connected</span>
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


export default HomePage
