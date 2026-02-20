import React from 'react'

const CreateVendor = () => {
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
        <form action="create" className="create-vendor">
          <input type="text" placeholder="Enter Your Business Name" />
          <input type="number" placeholder="Enter Vendors Number" />
          <input type="text" placeholder="What is your Category e.g Fashion" />
          <div className="add-btn">
            <button>Create</button>
          </div>
        </form>
      </div>
      <div className="copyright-footer">
        <div>About us</div>
        <div>© 2026 ReviewIT. All rights reserved.</div>
      </div>
    </div>
  );
}

export default CreateVendor
