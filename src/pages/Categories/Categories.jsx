import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaWhatsapp, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { supabase } from "../../Backend/SupabaseClient";
import "./Categories.css";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [vendorsInCategory, setVendorsInCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all vendors from Supabase and group them by category
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);

      // Fetch all vendors from Supabase
      const { data: vendorsData, error: vendorsError } = await supabase
        .from("vendors")
        .select("*");

      if (vendorsError) throw vendorsError;

      // If no vendors in database, show empty state
      if (!vendorsData || vendorsData.length === 0) {
        setCategories([]);
        setLoading(false);
        return;
      }

      // Create a map to group vendors by category
      const categoryMap = new Map();

      vendorsData.forEach((vendor) => {
        const categoryName = vendor.category || "Uncategorized";

        if (!categoryMap.has(categoryName)) {
          categoryMap.set(categoryName, {
            name: categoryName,
            vendors: [],
            icon: getCategoryIcon(categoryName),
          });
        }

        categoryMap.get(categoryName).vendors.push({
          id: vendor.id,
          businessName: vendor.business_name,
          phoneNumber: vendor.phone_number,
          category: vendor.category,
          name: vendor.business_name,
          location: vendor.location,
        });
      });

      // Convert map to array and sort by category name
      const categoriesList = Array.from(categoryMap.values())
        .map((cat) => ({
          ...cat,
          count: cat.vendors.length,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      console.log("Dynamic categories loaded:", categoriesList);
      setCategories(categoriesList);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to assign icons based on category name
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes("fashion") || name.includes("clothing")) return "";
    if (name.includes("jewel") || name.includes("accessory")) return "";
    if (name.includes("watch")) return "";
    if (name.includes("handbag") || name.includes("bag")) return "";
    if (name.includes("baby")) return "";
    if (name.includes("kid")) return "";
    if (name.includes("sport") || name.includes("fitness")) return "";
    if (name.includes("phone") || name.includes("electronics")) return "";
    if (name.includes("shirt") || name.includes("tshirt")) return "";
    if (name.includes("shoe") || name.includes("footwear")) return "";
    if (name.includes("food") || name.includes("restaurant")) return "";
    if (name.includes("beauty") || name.includes("cosmetic")) return "";
    if (name.includes("furniture") || name.includes("home")) return "";
    return "🏪";
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);

    try {
      // Get reviews for each vendor to calculate ratings
      const vendorsWithRatings = await Promise.all(
        category.vendors.map(async (vendor) => {
          const { data: reviewsData, error: reviewsError } = await supabase
            .from("reviews")
            .select("rating")
            .eq("vendor_id", vendor.id);

          if (reviewsError) throw reviewsError;

          let avgRating = 0;
          const reviewCount = reviewsData?.length || 0;
          if (reviewCount > 0) {
            const total = reviewsData.reduce(
              (sum, review) => sum + review.rating,
              0,
            );
            avgRating = total / reviewCount;
          }

          return {
            ...vendor,
            rating: avgRating,
            reviewCount: reviewCount,
          };
        }),
      );

      setVendorsInCategory(vendorsWithRatings);
    } catch (error) {
      console.error("Error loading vendor reviews:", error);
    }
  };

  const handleVendorClick = (vendor) => {
    navigate("/SeeReview", { state: { vendor } });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setVendorsInCategory([]);
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

  if (loading) {
    return (
      <div className="categories-page">
        <div className="review-card">
          <div className="categories-content">
            <div style={{ textAlign: "center", padding: "50px" }}>
              Loading categories...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="review-card">
        <div className="categories-content">
          <div className="brand-header">
            <div className="tagline">
              <i className="fa fa-clipboard-check">Browse by Category</i>
            </div>
          </div>

          {!selectedCategory ? (
            // Categories Grid View
            <>
              <h2 className="categories-title">Shop Categories</h2>
              {categories.length > 0 ? (
                <div className="categories-grid">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="category-card"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <span className="category-icon">{category.icon}</span>
                      <h3 className="category-name">{category.name}</h3>
                      <p className="category-count">
                        {category.count} vendor{category.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-categories">
                  <p>No categories found. Create some vendors first!</p>
                  <button
                    className="create-btn"
                    onClick={() => navigate("/CreateVendor")}
                  >
                    Create a Vendor
                  </button>
                </div>
              )}
            </>
          ) : (
            // Vendors in Selected Category View
            <>
              <div className="category-header">
                <button
                  className="back-button"
                  onClick={handleBackToCategories}
                >
                  ← Back to Categories
                </button>
                <h2 className="selected-category-title">
                  <span className="category-icon">{selectedCategory.icon}</span>
                  {selectedCategory.name}
                </h2>
                <p className="vendor-count">
                  {vendorsInCategory.length} vendor
                  {vendorsInCategory.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {vendorsInCategory.length > 0 ? (
                <div className="vendors-list">
                  {vendorsInCategory.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="vendor-card clickable"
                      onClick={() => handleVendorClick(vendor)}
                    >
                      <div className="vendor-info">
                        <span className="vendor-name">
                          {vendor.businessName || vendor.name}
                        </span>
                        <span className="vendor-phone">
                          <FaWhatsapp className="whatsapp-icon" />{" "}
                          {vendor.phoneNumber}
                        </span>
                      </div>
                      <div className="vendor-rating">
                        <div className="stars">
                          {renderStars(vendor.rating)}
                        </div>
                        <span className="review-count">
                          {vendor.reviewCount}{" "}
                          {vendor.reviewCount === 1 ? "review" : "reviews"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-vendors">
                  <p>No vendors found in this category yet.</p>
                </div>
              )}
            </>
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

export default Categories;
