
import {useEffect, useState, useRef } from "react";
import {useNavigate} from  "react-router-dom";
import {FaWhatsapp, FaUserPlus, FaChevronDown, FaSearch, FaStar, FaRegStar, FaStarHalfAlt} from 'react-icons/fa';
import {MdCategory} from 'react-icons/md';
import { toast, Toaster} from 'react-hot-toast'

const SearchVendor = () =>{
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("vendor");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropDown, setShowDropDown] = useState(false);
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchContent, setSearchContent] = useState(false);

  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const [vendorNumbers, setVendorNumbers] = useState([]);


  useEffect(() => {
    const storedVendors = JSON.parse(
      localStorage.getItem("vendorNumbers") || "[]",
    );

    const defualtVendors = [
      {
        id: 1,
        phoneNumber: "680752477",
        name: "Mira Fashion",
        rating: 4.5,
        reviews: 32,
      },
      {
        id: 2,
        phoneNumber: "686752477",
        name: "Luxury Fashion",
        rating: 4,
        reviews: 23,
      },
      {
        id: 3,
        phoneNumber: "680755477",
        name: "Jewery Fashion",
        rating: 3,
        reviews: 15,
      },
    ];

    const formattedStoredVendors = storedVendors.map((vendor) => ({
      id: vendor.id,
      phoneNumber: vendor.phoneNumber.toString(),
      name: vendor.businessName,
      rating: 0,
      reviews: 0,
    }));

    setVendorNumbers([...defualtVendors, ...formattedStoredVendors]);
  }, []);


    const categories = [
      { id: 1, name: "Luxury Fashion", rating: 4 },
      { id: 2, name: "Jewelry Store", rating: 2 },
      { id: 3, name: "Watch Shop", rating: 3 },
      { id: 4, name: "Handbag Boutiques", rating: 2.5 },
      { id: 5, name: "Baby Clothing", rating: 4.5 },
      { id: 6, name: "Kids Fashion", rating: 1 },
      { id: 7, name: "Sport Wear", rating: 1.5 },
    ];
  
  

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


  const HandleSearch = (e) => {
    e.preventDefault();
    console.log(`searching ${searchType}:`, searchQuery);

    if (!searchQuery.trim()) {
      toast.error("please enter a search term");
      return;
    }

    if (searchType === "vendor") {
      const vendor = vendorNumbers.find((vendor) => vendor.phoneNumber === searchQuery);
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
        navigate(`/category/${category.id}`, { state: { category } });
      } else {
        toast.error("category not found");
      }
    }
  };

  const renderStars = (rating, type = "half") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

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
    navigate(`/SeeReview/${vendor.id}`, { state: { vendor } });
  };

  const handleCategoryClick = (category) => {
    navigate(`/SeeReview/${categories.id}`, { state: { category } });
  };



  useEffect (() => {
    if ( selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex] );

  useEffect(() => {
    if (searchType === "vendor") {
      setFilteredResults(vendorNumbers.slice(0, 10));
    } else {
      setFilteredResults(categories.slice(0, 10));
    }
  }, [searchType]);



  useEffect (() => {
    console.log("useEffect running", {searchQuery, searchType});

    if(!searchQuery.trim()) {
      console.log("enpty search");
      setSearchContent(false)
      if (searchType === 'vendor') {
        setFilteredResults(vendorNumbers)
      } else {
        setFilteredResults(categories)
      }
      setSelectedIndex(-1);
      return;
    }

    setSearchContent(true)
    const query = searchQuery.toLowerCase().trim();
    if(searchType === 'vendor') {
      console.log("filtering vendors");
      const filtered = vendorNumbers.filter(vendor =>{
        console.log("checking vendor:", vendor);
        return vendor.phoneNumber.includes(query) || 
               vendor.name.toLowerCase().includes(query);    
      });
      console.log("filtered vendors",filtered);
      setFilteredResults(filtered);
    } else {
      console.log("filtered categories");
      const filtered = categories.filter(category => {
        console.log("checcking categories:", category);
        return category.name.toLowerCase().includes(query)
      });
      console.log("filtered categories:", filtered);
      setFilteredResults(filtered);
    }
    setSelectedIndex(-1);
  }, [searchQuery, searchType, vendorNumbers])



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

    if(searchType === 'vendor') {

      const exactVendor = vendorNumbers.find(vendor => vendor.phoneNumber === searchQuery);

      if (exactVendor) {
        handleVendorClick(exactVendor);
      } else {
        const isPhoneNumder = /^\d{9,}$/.test(searchQuery.replace(/\D/g, ''));
        if (isPhoneNumder) {
          setSelectedVendor({phoneNumber: searchQuery});
          setShowCreateModel(true);
        } else {
          toast.error("Please enter a valid phone number");
        }
      }
    } else {
      const exactCategory = categories.find(category =>
        category.name.toLowerCase() === searchQuery.toLowerCase()
      );
      if (exactCategory) {
        handleCategoryClick(exactCategory);
      } else {
        toast.error("category not found.")
      }
    }
  };

  const handeSearchContent  = (e) => {
    const value = e.target.value
    setSearchQuery(value)
  };

  return (
    // input-form
    <div className="review-card">
      <div>
        <div className="brand-header">
          <div className="brand-title">
            ReviewIt <span>Trust</span>
          </div>
          <div className="tagline">
            <i className="clipboard-check">Check before you buy</i>
          </div>
        </div>

        {/* search vendor form */}
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
              type={searchType === "vendor" ? "number" : "/^[A-Za-z]*$/"}
              className="search-vendor"
              placeholder={
                searchType === "vendor"
                  ? "Enter WhatsApp number"
                  : "Enter product type"
              }
              value={searchQuery}
              onChange={handeSearchContent}
              onKeyDown={handleKeyDown}
              autoFocus
            />

            {/* action button */}
            <button type="submit" className="action-btn">
              {searchType === "vendor" ? (
                <FaUserPlus />
              ) : (
                <FaSearch className="search-icon" />
              )}
            </button>
          </div>

          {/* dropdown menu */}
          {showDropDown && (
            <div className="dropdown-menu">
              <button
                type="button"
                onClick={() => {
                  setSearchType("vendor");
                  setShowDropDown(false);
                }}
              >
                <FaWhatsapp /> Search by Number
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchType("item");
                  setShowDropDown(false);
                }}
              >
                <MdCategory /> search By Item
              </button>
            </div>
          )}
        </form>

        {/* filtered result */}
        {searchContent && filteredResults.length > 0 && searchQuery.trim() && (
          <div className="live-results" ref={resultsRef}>
            <div className="results-header">
              <span className="results-count">
                {filteredResults.length}
                {searchType === "vendor" ? " vedor Numbers " : "categories"}
                Found
              </span>
            </div>
            {filteredResults.map((item, index) => (
              <div
                key={item.id}
                className={`result-item ${index === selectedIndex ? "selected" : ""}`}
                // onClick={handleItemClick(item)}
                // onMouseEnter={setSelectedIndex(index)}
              >
                {searchType === "vendor" ? (
                  <>
                    <div className="contact-icon">
                      <FaWhatsapp />
                    </div>
                    <div className="result-info">
                      <div className="result-primary">
                        <span className="result-phone">{item.phoneNumber}</span>
                        <span className="result-name">{item.name}</span>
                      </div>
                      <div className="result-rating">
                        {renderStars(item.rating)}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="contact-icon">
                      <MdCategory />
                    </div>
                    <div className="result-info">
                      <div className="result-primary">
                        <span className="result-name">{item.name}</span>
                      </div>
                      <div className="result-rating">
                        {renderStars(item.rating)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
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
                      No vendor found with number:{" "}
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

        {/* handle search */}
        {!searchContent && (
          <div className="review-search">
            {searchType === "vendor" ? (
              // contact list

              <div className="review-contact-container">
                <h3 className="section-title">
                  <FaUserPlus /> Top Vendors
                </h3>
                {vendorNumbers.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="review-contact clickable"
                    onClick={() => handleItemClick(vendor)}
                  >
                    <div className="review-numbers">
                      <FaWhatsapp className="contact-icon" />
                      {vendor.phoneNumber}
                    </div>
                    <div className="vendor-info">
                      <span className="vendor-name">{vendor.name}</span>
                    </div>
                    {/* star reviews */}
                    <div className="star-icon">
                      {renderStars(vendor.rating)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // category list

              <div className="categories-list">
                <h3 className="section-title">
                  <MdCategory /> Shop Categories
                </h3>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="review-contact clickable"
                    onClick={() => handleItemClick(category)}
                  >
                    <div className="review-numbers">
                      <MdCategory className="contact-icon" />
                      {category.name}
                    </div>
                    <div className="star-icon">
                      {renderStars(category.rating)}
                    </div>
                  </div>
                ))}
              </div>
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
}

export default SearchVendor;


