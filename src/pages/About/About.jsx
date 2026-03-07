import { useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaUsers,
  FaCheckCircle,
  FaStar,
  FaWhatsapp,
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";
import "./About.css";

const About = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="about-page">
      <div className="review-card">
        <div>
          <div className="brand-header">
            <div className="brand-title">
              ReviewIt <span>Trust</span>
            </div>
            <div className="tagline">
              <i className="clipboard-check">About Us</i>
            </div>
          </div>

          <button className="back-button" onClick={handleBack}>
            <FaArrowLeft /> Back
          </button>

          {/* Hero Section */}
          <div className="about-hero">
            <h1>About ReviewIt</h1>
            <p className="about-tagline">
              Making informed decisions through authentic reviews
            </p>
          </div>

          {/* Mission Section */}
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              ReviewIt was created to help consumers make informed decisions by
              providing authentic, verified reviews from real customers. We
              believe that transparency builds trust between businesses and
              their customers.
            </p>
          </div>

          {/* How It Works */}
          <div className="about-section">
            <h2>How It Works</h2>
            <div className="features-grid">
              <div className="feature-card">
                <FaSearch className="feature-icon" />
                <h3>Search</h3>
                <p>Find businesses by name, phone number, or category</p>
              </div>
              <div className="feature-card">
                <FaStar className="feature-icon" />
                <h3>Read Reviews</h3>
                <p>See what real customers are saying about businesses</p>
              </div>
              <div className="feature-card">
                <FaWhatsapp className="feature-icon" />
                <h3>Connect</h3>
                <p>Contact businesses directly via WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="about-section">
            <h2>Our Impact</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">1,000+</span>
                <span className="stat-label">Businesses</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">5,000+</span>
                <span className="stat-label">Reviews</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Users</span>
              </div>
            </div>
          </div>

          {/* Trust Section */}
          <div className="about-section">
            <h2>Why Trust Us</h2>
            <div className="trust-features">
              <div className="trust-feature">
                <FaCheckCircle className="trust-icon verified" />
                <div>
                  <h3>Verified Reviews</h3>
                  <p>All reviews come from real users</p>
                </div>
              </div>
              <div className="trust-feature">
                <FaShieldAlt className="trust-icon secure" />
                <div>
                  <h3>Secure Platform</h3>
                  <p>Your data is protected and private</p>
                </div>
              </div>
              <div className="trust-feature">
                <FaUsers className="trust-icon community" />
                <div>
                  <h3>Community Driven</h3>
                  <p>Built by users, for users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="about-section contact-section">
            <h2>Get in Touch</h2>
            <p>Have questions or suggestions? We'd love to hear from you.</p>
            <div className="contact-info">
              <p>Email: support@reviewit.com</p>
              <p>Phone: +237 68075267</p>
              <p>Location: cameroon</p>
            </div>
          </div>
        </div>

        <div className="copyright-footer">
          <div>About us</div>
          <div>© 2026 ReviewIT. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default About;
