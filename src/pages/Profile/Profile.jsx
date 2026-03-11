import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaSave,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import { supabase } from "../../Backend/SupabaseClient";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    email: "",
  });
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalVendors: 0,
    memberSince: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      await fetchProfile(user.id);
      await fetchUserStats(user.id);
    } catch (error) {
      console.error("Error checking user:", error);
      navigate("/signup");
    }
  };

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      const profileData = data || {};
      setProfile(profileData);

      // Format display values properly
      const displayName =
        profileData?.username ||
        user?.user_metadata?.username ||
        (profileData?.phone_number
          ? `User${profileData.phone_number.slice(-4)}`
          : "User");

      const displayPhone = profileData?.phone_number || "Not provided";
      const displayEmail =
        user?.email ||
        (profileData?.phone_number
          ? `${profileData.phone_number} (Phone User)`
          : "No email");

      setFormData({
        username: displayName,
        phoneNumber: profileData?.phone_number || "",
        email: displayEmail,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchUserStats = async (userId) => {
    try {
      // Get user's reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("id, vendor_id")
        .eq("user_id", userId);

      if (reviewsError) throw reviewsError;

      // Get unique vendors count
      const uniqueVendors = new Set(reviews?.map((r) => r.vendor_id)).size;

      // Get user's created vendors
      const { data: vendors, error: vendorsError } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", userId);

      if (vendorsError) throw vendorsError;

      // Get member since date
      const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "Unknown";

      setStats({
        totalReviews: reviews?.length || 0,
        totalVendors: vendors?.length || 0,
        memberSince,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const updates = {
        id: user.id,
        username: formData.username,
        phone_number: formData.phoneNumber,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;

      setProfile(updates);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="review-card">
          <div className="loading-container">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="review-card">
        <div>
          <div className="brand-header">
            <div className="tagline">
              <i className="clipboard-check">My Profile</i>
            </div>
          </div>

          <button className="back-button" onClick={handleBack}>
            <FaArrowLeft /> Back
          </button>

          {error && <div className="error-message">{error}</div>}

          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {formData.username?.charAt(0).toUpperCase() || <FaUser />}
            </div>
            <div className="profile-title">
              <h2>{formData.username || "User"}</h2>
              <p>Member since {stats.memberSince}</p>
            </div>
            {!editing && (
              <button
                className="edit-profile-btn"
                onClick={() => setEditing(true)}
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="profile-stats">
            <div className="stat-card">
              <span className="stat-number">{stats.totalReviews}</span>
              <span className="stat-label">Reviews</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.totalVendors}</span>
              <span className="stat-label">Vendors</span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="profile-info">
            <h3>Profile Information</h3>

            {editing ? (
              // Edit Mode
              <div className="profile-form">
                <div className="form-group">
                  <label>
                    <FaUser className="form-icon" /> Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Your username"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaEnvelope className="form-icon" /> Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="disabled-input"
                  />
                  <small className="input-note">Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>
                    <FaPhone className="form-icon" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                  />
                </div>

                <div className="form-actions">
                  <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <FaSave /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        username:
                          profile?.username ||
                          `User${profile?.phone_number?.slice(-4) || ""}`,
                        phoneNumber: profile?.phone_number || "",
                        email:
                          user?.email ||
                          (profile?.phone_number
                            ? `${profile.phone_number} (Phone User)`
                            : "No email"),
                      });
                    }}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="profile-details">
                <div className="detail-item">
                  <FaUser className="detail-icon" />
                  <div>
                    <span className="detail-label">Username</span>
                    <span className="detail-value">
                      {profile?.username ||
                        `User${profile?.phone_number?.slice(-4) || ""}`}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <div>
                    <span className="detail-label">Email</span>
                    <span className="detail-value">
                      {user?.email ||
                        (profile?.phone_number
                          ? `${profile.phone_number} (Phone User)`
                          : "No email")}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <div>
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">
                      {profile?.phone_number || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            )}
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

export default Profile;
