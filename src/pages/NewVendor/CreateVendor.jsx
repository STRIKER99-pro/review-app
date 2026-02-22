
import { useState } from 'react';

const CreateVendor = () => {
  const [formData, setForData] = useState({
      businessName: '',
      phoneNumber:  '',
      category: ''
  });

  
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState('');
  const [success, setSucces] = useState('');

  const handleCahange = (e) => {
    const {name, value} = e.target;
    setForData(prev => ({
      ...prev,
      [name]: value
    }));

    if(error[name]) {
      setError(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setError('');
    setSucces('');
  };

  const validateField = (name, value) => {
    switch(name) {
      case 'businessName':
        return !value.trim() ? 'Business name is required' : '';
      case 'phoneNumber':
        if (!value.trim()) return 'Vendor number is required';
        if(!/^\d{9}$/.test(value)) return 'phone number must be 9 digits';
        return '';
      case 'category':
        return !value.trim() ? 'category is required' : '';
      default:
        return '';
    }
  }

  const validateForm = () => {
    const newError ={};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newError[key] = error;
    });
    setError(newError);
    return Object.keys(newError).length ===0;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmit(true);
    

    try {
      const existingVendors = JSON.parse(localStorage.getItem('vendor') || '[]');
      const newVendor = {
        id: Date.now(),
        ...formData,
        phoneNumber:  parseInt(formData.phoneNumber),
        createdAt: new Date().toISOString()
      };
      existingVendors.push(newVendor)
      localStorage.setItem('vendorNumbers', JSON.stringify(existingVendors));

      setSucces('Vendor created succefully');

      setForData({
        businessName: '',
        phoneNumber: '',
        category: ''
      })

      setTimeout(() => setSucces(''), 3000);

    }catch (err) {
      setError(prev => ({
        ...prev,
        submit: 'failed to create vendor. Please try again'
      }));
    }finally {
      setSubmit(false)
    }
  };

  const handleBlur = (e) => {
    const {name, value} = e.target;
    const error = validateField(name, value);
    setError(prev => ({
      ...prev,
      [name]: error
    }));
  };


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

        {/* display messages */}

        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="create-vendor">
          <div className="form-field">
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleCahange}
              onBlur={handleBlur}
              placeholder="Enter Your Business Name"
              disabled={submit}
              className={error.businessName ? "input-error" : ""}
            />
            {error.businessName && (
              <div className="input-error">{error.businessName}</div>
            )}
          </div>

          <div className="form-field">
            <input
              type="number"
              name="phoneNumber"
              placeholder="Enter Vendors Number"
              value={formData.phoneNumber}
              onChange={handleCahange}
              onBlur={handleBlur}
              disabled={submit}
              className={error.phoneNumber ? "input-error" : ""}
            />
            {error.phoneNumber && (
              <div className="input-error">{error.phoneNumber}</div>
            )}
          </div>

          <div className="form-field">
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleCahange}
              onBlur={handleBlur}
              placeholder="What is your Category e.g Fashion"
              disabled={submit}
              className={error.category ? "input-error" : ""}
            />
            {error.category && (
              <div className="input-error">
                {error.category}
              </div>
            )}
          </div>

          <div className="add-btn">
            <button
              type="submit"
              disabled={submit}
              style={{
                opacity: submit ? 0.7 : 1,
                cursor: submit ? "not-allowed" : "pointer",
              }}
            >
              {submit ? "creating..." : "create"}
            </button>
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
