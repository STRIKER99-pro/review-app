import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import "./CreateVendor.css";

const CreateVendor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    phoneNumber: "",
    category: "",
  });

  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when typing
    if (error[name]) {
      setError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "businessName":
        return !value.trim() ? "Business name is required" : "";
      case "phoneNumber":
        if (!value.trim()) return "Vendor number is required";
        if (!/^\d{9}$/.test(value)) return "Phone number must be 9 digits";
        return "";
      case "category":
        return !value.trim() ? "Category is required" : "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newError = {};
    Object.keys(formData).forEach((key) => {
      const fieldError = validateField(key, formData[key]);
      if (fieldError) newError[key] = fieldError;
    });
    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmit(true);

    try {
      const existingVendors = JSON.parse(
        localStorage.getItem("vendorNumbers") || "[]",
      );
      const newVendor = {
        id: Date.now(),
        businessName: formData.businessName,
        phoneNumber: parseInt(formData.phoneNumber),
        category: formData.category,
        createdAt: new Date().toISOString(),
      };
      existingVendors.push(newVendor);
      localStorage.setItem("vendorNumbers", JSON.stringify(existingVendors));

      setSuccess("Vendor created successfully");

      setFormData({
        businessName: "",
        phoneNumber: "",
        category: "",
      });

      // Redirect after success
      setTimeout(() => {
        setSuccess("");
        navigate("/SearchVendor"); // Go back to search page
      }, 2000);
    } catch (err) {
      setError((prev) => ({
        ...prev,
        submit: "Failed to create vendor. Please try again",
      }));
    } finally {
      setSubmit(false);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setError((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  return (
    <div className="review-card">
      <Toaster position="top-center" />
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
        {error.submit && <div className="error-message">{error.submit}</div>}

        <form onSubmit={handleSubmit} className="create-vendor">
          <div className="form-field">
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Your Business Name"
              disabled={submit}
              className={error.businessName ? "input-error" : ""}
            />
            {error.businessName && (
              <div className="field-error-message">{error.businessName}</div>
            )}
          </div>

          <div className="form-field">
            <input
              type="number"
              name="phoneNumber"
              placeholder="Enter Vendors Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submit}
              className={error.phoneNumber ? "input-error" : ""}
            />
            {error.phoneNumber && (
              <div className="field-error-message">{error.phoneNumber}</div>
            )}
          </div>

          <div className="form-field">
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="What is your Category e.g Fashion"
              disabled={submit}
              className={error.category ? "input-error" : ""}
            />
            {error.category && (
              <div className="field-error-message">{error.category}</div>
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
              {submit ? "Creating..." : "Create"}
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
};

export default CreateVendor;
