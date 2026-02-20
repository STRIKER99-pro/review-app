import React from "react";

const SubmitReview = () => {
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

        <div className="submit-content">
          <div className="write-review">
            <input
              type="text"
              name="review"
              id="write-review"
              placeholder="Write your review"
            />
          </div>
          <div className="review-item">
            <span className="review-label">Rate vendor</span>
            <div className="review-value rating-compact">
              <span className="review-stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </span>
            </div>
          </div>
          <div className="add-btn">
            <button>Submit</button>
          </div>
        </div>
      </div>
      <div className="copyright-footer">
        <div>About us</div>
        <div>© 2026 ReviewIT. All rights reserved.</div>
      </div>
    </div>
  );
};

export default SubmitReview;
