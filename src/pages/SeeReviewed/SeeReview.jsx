import React from "react";

const SeeReview = () => {
  return (
    <div className="review-card">
      <div>
        <div className="brand-header">
          <div className="brand-title">
            ReviewIt <span>Trust</span>
          </div>
          <div className="tagline">
            <i className="fa fa-clipboard-check">Check before you buy</i>
          </div>
        </div>

        <div className="review-container">
          <div className="review-content">
            <div className="review-item">
              <span className="review-label">Name:</span>
              <span className="review-value"> Mira Fashion</span>
            </div>
            <div className="review-item">
              <span className="review-label">Tel:</span>
              <span className="review-value">680752677</span>
            </div>
            <div className="review-item">
              <span className="review-label">Category:</span>
              <span className="review-value">Fashion</span>
            </div>
          </div>

          <div className="review-rate">
            <div className="review-item">
              <span className="review-label">Average Rating</span>
              <div className="review-value rating-compact">
                <span className="stars-avg">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </span>
                <span className="review-count">32 reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div className="see-more">
          <a href="#" className="see-more-link">
            see more
          </a>
        </div>

        <div className="review-list">
          <div className="review-entry">
            <span className="review-text">This vendor sells good stuffs</span>
            <span className="review-stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </span>
            <span className="review-date">11/13/2026</span>
          </div>
          {/* second review */}
          <div className="review-entry">
            <span className="review-text">The services are not bad</span>
            <span className="review-stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </span>
            <span className="review-date">11/13/2026</span>
          </div>
          {/* third review */}
          <div className="review-entry">
            <span className="review-text">Very legit</span>
            <span className="review-stars">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
            </span>
            <span className="review-date">11/13/2026</span>
          </div>
        </div>
        <div className="add-btn">
          <button>Add Review</button>
        </div>
      </div>
      <div className="copyright-footer">
        <div>About us</div>
        <div>© 2026 ReviewIT. All rights reserved.</div>
      </div>
    </div>
  );
};

export default SeeReview;
