import "./SearchVendor.css";

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaWhatsapp,
  FaUserPlus,
  FaChevronDown,
  FaSearch,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { toast, Toaster } from "react-hot-toast";
import { supabase } from "../../Backend/SupabaseClient";

const SearchVendor = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("vendor");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchContent, setSearchContent] = useState(false);

  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryVendors, setCategoryVendors] = useState([]);

  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const [vendorNumbers, setVendorNumbers] = useState([]);

  // Fetch vendors from Supabase
  useEffect(() => {
    fetchVendors();
  }, []);

  // Function to fetch vendors from Supabase
 const fetchVendors = async () => {
   try {
     console.log("Fetching vendors...");
     const { data: vendorsData, error: vendorsError } = await supabase
       .from("vendors")
       .select("*");

     if (vendorsError) throw vendorsError;

     if (vendorsData && vendorsData.length > 0) {
       const formattedVendors = await Promise.all(
         vendorsData.map(async (vendor) => {
           // Get reviews
           const { data: reviewsData } = await supabase
             .from("reviews")
             .select("rating")
             .eq("vendor_id", vendor.id);

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
             id: vendor.id,
             phoneNumber: vendor.phone_number,
             name: vendor.business_name,
             category: vendor.category,
             location: vendor.location,
             rating: avgRating,
             reviews: reviewCount,
           };
         }),
       );

       console.log("Formatted vendors:", formattedVendors);
       setVendorNumbers(formattedVendors);
     } else {
       console.log("No vendors found");
       setVendorNumbers([]);
     }
   } catch (error) {
     console.error("Error fetching vendors:", error);
     toast.error("Failed to load vendors");
     setVendorNumbers([]);
   }
 };

  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const { data: vendors, error } = await supabase
        .from("vendors")
        .select("category")
        .not("category", "is", null);

      if (error) throw error;

      // Get unique categories
      const uniqueCategories = [...new Set(vendors.map((v) => v.category))];

      // Create category objects with icons
      const categoryList = uniqueCategories.map((cat, index) => ({
        id: index + 1,
        name: cat,
        rating: 0,
      }));

      setCategories(categoryList);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  // Call it in useEffect
  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateVendor = () => {
    setShowCreateModel(false);
    navigate("/CreateVendor", {
      state: { phoneNumber: selectedVendor.phoneNumber },
    });
    toast.success("Let create your vendor profile");
  };

  const handleItemClick = (item) => {
    if (searchType === "vendor") {
      navigate("/SeeReview", { state: { vendor: item } });
    } else {
      navigate(`/category/${item.id}`, { state: { category: item } });
    }
  };

  // Handle category click to show vendors in that category
  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setSearchContent(true);

    try {
      // Filter vendors by the selected category
      const vendorsInCategory = vendorNumbers.filter(
        (vendor) =>
          vendor.category?.toLowerCase() === category.name.toLowerCase(),
      );

      setCategoryVendors(vendorsInCategory);
      setFilteredResults(vendorsInCategory);
      setSearchType("vendor"); // Switch to vendor view to show the list
    } catch (error) {
      console.error("Error filtering vendors by category:", error);
      toast.error("Failed to load vendors in this category");
    }
  };

  // Handle back to categories
  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCategoryVendors([]);
    setSearchContent(false);
    setSearchType("item"); // Switch back to category view
  };

  const HandleSearch = (e) => {
    e.preventDefault();
    console.log(`searching ${searchType}:`, searchQuery);

    if (!searchQuery.trim()) {
      toast.error("please enter a search term");
      return;
    }

    if (searchType === "vendor") {
      const vendor = vendorNumbers.find(
        (vendor) => vendor.phoneNumber === searchQuery,
      );
      if (vendor) {
        navigate(`/SeeReview/${vendor.id}`, { state: { vendor } });
      } else {
        setSelectedVendor({ phoneNumber: searchQuery });
        setShowCreateModel(true);
      }
    } else {
      const category = categories.find((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      if (category) {
        // Show vendors in this category instead of navigating
        handleCategoryClick(category);
      } else {
        toast.error("category not found");
      }
    }
  };

  const renderStars = (rating, type = "half") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="full-star-icon" />);
      } else if (hasHalf && i === fullStars + 1) {
        stars.push(<FaStarHalfAlt key={i} className="full-star-icon" />);
      } else {
        stars.push(<FaRegStar key={i} className="empty-star-icon" />);
      }
    }
    return stars;
  };

  const handleVendorClick = (vendor) => {
    navigate("/SeeReview", { state: { vendor } });
  };

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!selectedCategory) {
      if (searchType === "vendor") {
        setFilteredResults(vendorNumbers.slice(0, 10));
      } else {
        setFilteredResults(categories.slice(0, 10));
      }
    }
  }, [searchType, vendorNumbers, selectedCategory]);

  useEffect(() => {
    if (!searchQuery.trim() && !selectedCategory) {
      setSearchContent(false);
      if (searchType === "vendor") {
        setFilteredResults(vendorNumbers);
      } else {
        setFilteredResults(categories);
      }
      setSelectedIndex(-1);
      return;
    }

    if (selectedCategory) {
      return; // Don't filter when showing category vendors
    }

    setSearchContent(true);
    const query = searchQuery.toLowerCase().trim();

    if (searchType === "vendor") {
      const filtered = vendorNumbers.filter((vendor) => {
        return (
          vendor.phoneNumber.includes(query) ||
          vendor.name.toLowerCase().includes(query)
        );
      });
      setFilteredResults(filtered);
    } else {
      const filtered = categories.filter((category) => {
        return category.name.toLowerCase().includes(query);
      });
      setFilteredResults(filtered);
    }
    setSelectedIndex(-1);
  }, [searchQuery, searchType, vendorNumbers, selectedCategory]);

  useEffect(() => {
    console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("Supabase Anon Key:", import.meta.env.VITE_SUPABASE_ANON_KEY);
  }, []);
  
  const handleKeyDown = (e) => {
    if (!filteredResults.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredResults.length - 1 ? prev + 1 : prev,
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case "Enter":
        e.preventDefault();
        const selected = filteredResults[selectedIndex];
        if (selectedIndex >= 0) {
          handleItemClick(selected);
        } else if (searchQuery.trim()) {
          handleExactSearch();
        }
        break;

      case "Escape":
        setFilteredResults([]);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleExactSearch = () => {
    if (!searchQuery.trim()) return;

    if (searchType === "vendor") {
      const exactVendor = vendorNumbers.find(
        (vendor) => vendor.phoneNumber === searchQuery,
      );

      if (exactVendor) {
        handleVendorClick(exactVendor);
      } else {
        const isPhoneNumder = /^\d{9,}$/.test(searchQuery.replace(/\D/g, ""));
        if (isPhoneNumder) {
          setSelectedVendor({ phoneNumber: searchQuery });
          setShowCreateModel(true);
        } else {
          toast.error("Please enter a valid phone number");
        }
      }
    } else {
      const exactCategory = categories.find(
        (category) => category.name.toLowerCase() === searchQuery.toLowerCase(),
      );
      if (exactCategory) {
        handleCategoryClick(exactCategory);
      } else {
        toast.error("category not found.");
      }
    }
  };

  const handeSearchContent = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (selectedCategory) {
      setSelectedCategory(null);
      setCategoryVendors([]);
    }
  };

  return (
    <div className="review-card">
      <div>
        <div className="brand-header">
          <div className="tagline">
            <i className="clipboard-check">Check before you buy</i>
          </div>
        </div>

        <form className="search-vendor" onSubmit={HandleSearch}>
          <div className="search-row">
            <button
              type="button"
              className="dropdown"
              onClick={() => setShowDropDown(!showDropDown)}
            >
              {searchType === "vendor" ? <FaWhatsapp /> : <MdCategory />}
              <FaChevronDown />
            </button>

            <input
              ref={inputRef}
              type={searchType === "vendor" ? "text" : "text"}
              className="search-vendor"
              placeholder={
                searchType === "vendor"
                  ? "Enter business name"
                  : "Enter product type"
              }
              value={searchQuery}
              onChange={handeSearchContent}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          {showDropDown && (
            <div className="dropdown-menu">
              <button
                type="button"
                onClick={() => {
                  setSearchType("vendor");
                  setShowDropDown(false);
                }}
              >
                <FaWhatsapp /> Search business name
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchType("item");
                  setShowDropDown(false);
                }}
              >
                <MdCategory /> search by Category
              </button>
            </div>
          )}
        </form>

        {/* Category Header when category is selected */}
        {selectedCategory && (
          <div className="category-header">
            <button className="back-button" onClick={handleBackToCategories}>
              ← Back to Categories
            </button>
            <h2 className="selected-category-title">
              <tegory className="category-icon" /> {selectedCategory.name}
            </h2>
            <p className="vendor-count">
              {categoryVendors.length} vendor
              {categoryVendors.length !== 1 ? "s" : ""} found
            </p>
          </div>
        )}

        {/* Results Display */}
        {searchContent && filteredResults.length > 0 && (
          <div className="live-results" ref={resultsRef}>
            <div className="results-header">
              <span className="results-count">
                {filteredResults.length}
                {searchType === "vendor" ? " vendors" : " categories"}
                Found
              </span>
            </div>

            {searchType === "vendor" ? (
              <div className="vendors-grid">
                {filteredResults.map((item, index) => (
                  <div
                    key={item.id}
                    className={`vendor-card ${index === selectedIndex ? "selected" : ""}`}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="vendor-header">
                      <div className="vendor-icon">
                        <FaWhatsapp />
                      </div>
                      <div className="vendor-details">
                        <div className="vendor-name">{item.name} </div>
                        <div className="vendor-phone">
                          {/* <FaWhatsapp className="whatsapp-icon" /> */}
                          {/* {item.phoneNumber} */}
                        </div>
                      </div>
                    </div>

                    {item.category && (
                      <div className="vendor-category">{item.category}</div>
                    )}

                    <div className="vendor-footer">
                      <div className="vendor-stars">
                        <div className="stars">{renderStars(item.rating)}</div>
                        <span className="review-count">({item.reviews})</span>
                      </div>
                      <span className="review-badge">
                        {item.rating > 0 ? item.rating.toFixed(1) : "New"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="categories-grid">
                {filteredResults.map((item, index) => (
                  <div
                    key={item.id}
                    className={`category-card ${index === selectedIndex ? "selected" : ""}`}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="category-icon-large">
                      <ategory className="contact-icon" />
                    </div>
                    <div className="category-title">{item.name}</div>
                    <div className="category-vendor-count">
                      {
                        vendorNumbers.filter((v) => v.category === item.name)
                          .length
                      }{" "}
                      vendors
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {searchContent &&
          searchQuery.trim() &&
          filteredResults.length === 0 && (
            <div className="no-results">
              <Toaster position="bottom-center" />
              {showCreateModel && (
                <div className="model-overlay">
                  <div className="model-content">
                    <h3>Vendor Not Found</h3>
                    <p>
                      No vendor found with the business name :{" "}
                      <strong>{selectedVendor?.phoneNumber}</strong>
                    </p>
                    <p>would you like to create a new vendor profile?</p>
                    <div className="model-action">
                      <button
                        className="btn-secondary"
                        onClick={() => setShowCreateModel(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-primary"
                        onClick={handleCreateVendor}
                      >
                        Create Vendor
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        {!searchContent && !selectedCategory && (
          <div className="review-search">
            {searchType === "vendor" ? (
              <>
                <h3 className="section-title">
                  <FaUserPlus className="contact-icon" /> Top Vendors
                </h3>
                {vendorNumbers.length > 0 ? (
                  <div className="vendors-grid">
                    {vendorNumbers.slice(0, 6).map((vendor) => (
                      <div
                        key={vendor.id}
                        className="vendor-card"
                        onClick={() => handleItemClick(vendor)}
                      >
                        <div className="vendor-contents">
                          <div className="vendor-header">
                            <div className="vendor-icon">
                              <FaWhatsapp />
                            </div>
                            <div className="vendor-details">
                              <div className="vendor-name">{vendor.name}</div>
                              {vendor.category && (
                                <div className="vendor-category">
                                  {vendor.category}
                                </div>
                              )}
                              <div className="vendor-phone">
                                {/* <FaWhatsapp className="whatsapp-icon" />
                                {vendor.phoneNumber} */}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="vendor-footer">
                          <div className="vendor-stars">
                            <div className="stars">
                              {renderStars(vendor.rating)}
                            </div>
                            <span className="review-count">
                              ({vendor.reviews}{" "}
                              {vendor.reviews === 1 ? "review" : "reviews"})
                            </span>
                          </div>
                          <span className="review-badge">
                            {vendor.rating > 0
                              ? vendor.rating.toFixed(1)
                              : "New"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-vendors-message">
                    <p>No vendors found. Create your first vendor!</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="section-title">
                  <MdCategory className="contact-icon" /> Shop Categories
                </h3>
                {categories.length > 0 ? (
                  <div className="categories-grid">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="category-card"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div className="category-contents">
                          <div className="category-icon-large">
                            <MdCategory />
                            <div className="category-title">
                              {category.name}
                            </div>
                          </div>

                          <div className="category-vendor-count">
                            {
                              vendorNumbers.filter(
                                (v) => v.category === category.name,
                              ).length
                            }{" "}
                            vendors
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-categories-message">
                    <p>No categories found. Create vendors with categories!</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div className="copyright-footer">
        <div>About us</div>
        <div>© 2026 ReviewIT. All rights reserved.</div>
      </div>
    </div>
  );
};

export default SearchVendor;
