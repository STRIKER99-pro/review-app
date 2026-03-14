import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { supabase } from "../../Backend/SupabaseClient";
import "./CreateVendor.css";

const CreateVendor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    businessName: "",
    phoneNumber: "",
    category: "",
    location: "",
  });

  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          toast.error("Please login to create a vendor");
          navigate("/signup");
          return;
        }

        setUser(user);
      } catch (err) {
        console.error("Auth error:", err);
        navigate("/signup");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  // Pre-fill phone number if passed from SearchVendor
  useEffect(() => {
    if (location.state?.phoneNumber) {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: location.state.phoneNumber,
      }));
    }
  }, [location.state]);

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
      case "location":
        return !value.trim() ? "Location is required" : "";
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

    if (!user) {
      toast.error("You must be logged in to create a vendor");
      navigate("/signup");
      return;
    }

    setSubmit(true);

    try {
      // Check if phone number already exists
      const { data: existingVendor, error: checkError } = await supabase
        .from("vendors")
        .select("id")
        .eq("phone_number", formData.phoneNumber)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingVendor) {
        toast.error("A vendor with this phone number already exists");
        setSubmit(false);
        return;
      }

      // Insert new vendor
      const { error: insertError } = await supabase.from("vendors").insert([
        {
          id: Date.now(),
          business_name: formData.businessName,
          phone_number: formData.phoneNumber,
          category: formData.category,
          location: formData.location,
          user_id: user.id,
          rating: 0,
          reviews_count: 0,
        },
      ]);

      if (insertError) throw insertError;

      setSuccess("Vendor created successfully");

      setFormData({
        businessName: "",
        phoneNumber: "",
        category: "",
        location: "",
      });

      // Redirect after success
      setTimeout(() => {
        setSuccess("");
        navigate("/SearchVendor");
      }, 2000);
    } catch (err) {
      console.error("Error creating vendor:", err);
      setError((prev) => ({
        ...prev,
        submit: err.message || "Failed to create vendor. Please try again",
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

  if (loading) {
    return (
      <div className="create-vendor-page">
        <div className="review-card">
          <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-vendor-page">
      <div className="review-card">
        <Toaster position="top-center" />
        <div>
          <div className="brand-header">
            <div className="tagline">
              <i className="clipboard-check">Check before you buy</i>
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

            <div className="form-field">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="What is your Location e.g Douala, Cameroon"
                disabled={submit}
                className={error.location ? "input-error" : ""}
              />
              {error.location && (
                <div className="field-error-message">{error.location}</div>
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
    </div>
  );
};

export default CreateVendor;
