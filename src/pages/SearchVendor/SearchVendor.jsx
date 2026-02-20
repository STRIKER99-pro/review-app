
import {useState } from "react";
// import {useNavigate} from  "react-router-dom";
import {FaWhatsapp, FaUserPlus, FaChevronDown, FaSearch, FaStar, FaRegStar, FaStarHalfAlt} from 'react-icons/fa';
import {MdCategory} from 'react-icons/md';
// import { toast, Toaster} from 'react-hot-toast'

const SearchVendor = () =>{
  // const navigate = useNavigate();
    const [searchType, setSearchType] = useState('vendor');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropDown, setShowDropDown] = useState(false);
    // const [showCreateModel, setShowCreateModel] = useState(false);
    // const [selectedVendor, setSelectedVendor] = useState(null);
    // const [filteredResults, setFilteredResults] = useState([]);
    // const [selectedIndex, setSelectedIndex] = useState(-1);


    // const inputRef = useRef(null);
    // const resultsRef = useRef(null);

    const vendorNumbers = [
      {id: 1, phoneNumber: "680752477", name: "Mira Fashion", rating: 4.5, reviews: 32},
      {id: 2, phoneNumber: "686752477", name: "Luxury Fashion", rating: 4, reviews: 23},
      {id: 3, phoneNumber: "680755477", name: "Jewery Fashion", rating: 3, reviews: 15},
    ];

    const categories = [
      { id: 1, name: "Luxury Fashion", rating: 4 },
      { id: 2, name: "Jewelry Store", rating: 2 },
      { id: 3, name: "Watch Shop", rating: 3 },
      { id: 4, name: "Handbag Boutiques", rating: 2.5 },
      { id: 5, name: "Baby Clothing", rating: 4.5 },
      { id: 6, name: "Kids Fashion", rating: 1 },
      { id: 7, name: "Sport Wear", rating: 1.5 },
    ];


    // useEffect(() => {
    //   if(!searchQuery.trim()){

    //     if(searchType === 'vendor'){
    //       setFilteredResults(vendorNumbers.slice(0, 10));
    //     }else {
    //       setFilteredResults(categories);
    //     }
    //     setSelectedIndex(-1);
    //     return;
    //   }
    //   const query = searchQuery.toLowerCase().trim();

    //   if (searchQuery === 'vendor'){

    //     const filtered = vendorNumbers.filter(vendor => 
    //       vendor.phoneNumber.includes(query) ||
    //       vendor.name.toLowerCase().includes(query)
    //   );
    //   setFilteredResults(filtered);
    //   }else {
    //     const filtered = categories.filter(category =>
    //       category.toLowerCase().includes(query)
    //     );
    //     setFilteredResults(filtered);
    //   }
    //   setFilteredResults(-1);
    // }, [searchQuery, searchType]
    // );


    // const handleKeyDown = (e) => {
    //   if (!filteredResults.length) 
    //     return;

    //   switch (e.key){
    //     case 'ArrowDown':
    //       setSelectedIndex(prev =>
    //         prev < filteredResults.length - 1 ? prev + 1 : prev
    //       );
    //       break;

    //       case 'ArrowUp':
    //         e.preventDefault();
    //         setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    //         break;

    //         case 'Enter': 
    //         e.preventDefault();
    //         const selected = filteredResults[selectedIndex];
    //         if(selectedIndex >= 0){
    //           handleItemClick(selected)
    //         } else if (searchQuery.trim()) {
    //           handleExactSearch();
    //         }
    //         break;

    //         case 'Escape':
    //           setFilteredResults([]);
    //           setSelectedIndex(-1);
    //   }
      
    // };


    // useEffect (() => {
    //   if ( selectedIndex >= 0 && resultsRef.current) {
    //     const selectedElement = resultsRef.current.children[selectedIndex];
    //     if (selectedElement) {
    //       selectedElement.scrollIntoView({
    //         block: 'nearest',
    //         behavior: 'smooth'
    //       });
    //     }
    //   }
    // }, [selectedIndex] );

    // const handleExactSearch = () => {
    //   if (!searchQuery.trim()) return;

    //   if(searchQuery === 'vendor') {

    //     const exactVendor = vendorNumbers.find(vendor => vendor.phoneNumber === searchQuery);
    //     if (exactVendor) {
    //       handleVendorClick(exactVendor);
    //     } else {
    //       const isPhoneNumder = /^\d{9,}$/.test(searchQuery.replace(/\D/g, ''));
    //       if (isPhoneNumder) {
    //         setSelectedVendor({phoneNumber: searchQuery});
    //         setShowCreateModel(true);
    //       } else {
    //         toast.error("Please enter a valid phone number");
    //       }
    //     } 
    //   } else {
    //     const exactCategory = categories.find(category => 
    //       category.name.toLowerCase() === searchQuery.toLowerCase()
    //     );
    //     if (exactCategory) {
    //       handleCategoryClick(exactCategory);
    //     } else {
    //       toast.error("category not found.")
    //     }
    //   }
    // };



    const HandleSearch = (e) => {
        e.preventDefault();
        console.log(`searching ${searchType}:`, searchQuery);
       
        // if(!searchQuery.trim()){
        //   toast.error("please enter a search term");
        //   return;
        }

    //     if (searchType === 'vendor'){

    //       const vendor = vendorNumbers.find(v => v.phone === searchQuery);
    //       if(vendor) {
    //         navigate(`/vendor/${vendor.id}`, {state: {vendor}});
    //       } else {

    //         setSelectedVendor({phoneNumber: searchQuery});
    //         setShowCreateModel(true);
    //       }
    //      } else {

    //         const category = categories.find(category => 
    //           category.name.toLowerCase().includes(searchQuery.toLowerCase())
    //         );
    //         if(category){
    //           navigate(`/category/${category.id}`, {state: {category} });
    //         }else {
    //           toast.error("category not found");
    //         }
    //       }
    //     };

      //  const  handleItemClick = (item) => {
      //     if (searchType === 'vendor') {
      //       navigate(`/SeeReviewed/${item.id}`, {state: {vendor: item}})
      //     } else {
      //       navigate(`/category/${item.id}`, {state: {category: item}})
      //     }
      //   }

        // const handleVendorClick = (vendor) => {
        //   navigate(`/vendor/${vendor.id}`, {state: {vendor} })
        // };

        // const handleCategoryClick = (category) => {
        //   navigate(`/category/${category.id}`, {state: {category} })
        // };

        // const handleCreateVendor =() => {
        //   setShowCreateModel(false);
        //   navigate('/CreateVendor', {
        //     state: {phoneNumber: selectedVendor.phoneNumber}
        //   })
        //   toast.success("let create your vendor profile")
        // };


        // const renderStars = (rating, type = 'half') => {
        //   const stars = [];
        //   const fullStars = Math.floor(rating);
        //   const hasHalf = rating%1 !==0;

        //   for (let i = 1; i <= 5; i++){
        //     if(i <= fullStars){
        //       stars.push(<FaStar key = {i} className="full-star-icon" />);
        //     }else if(hasHalf && i === fullStars +1){
        //       stars.push(<FaStarHalfAlt key = {i} className="full-star-icon" />);
        //     }else {
        //       stars.push(<FaRegStar key = {i} className="empty-star-icon" />);
        //     }
        //   }
        //   return stars;
        // }

    return (
      // input-form
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
          <form className="search-vendor" onSubmit={HandleSearch}>
            <div className="search-row">
              <button
                type="button"
                className="dropdown"
                onClick={() => setShowDropDown(!showDropDown)}
              >
                {searchType === "vendor" ? <FaWhatsapp /> : <MdCategory />}
                <span>
                  {" "}
                  <FaChevronDown />{" "}
                </span>
              </button>

              <input
                type={searchType === "vendor" ? "number" : "/^[A-Za-z]*$/"}
                className="search-vendor"
                role="searchBox"
                placeholder={
                  searchType === "vendor"
                    ? "Enter WhatsApp number"
                    : "Enter product type"
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* action button */}
              <button type="submit" className="action">
                {searchType === "vendor" ? (
                  <FaUserPlus />
                ) : (
                  <FaSearch className="search-icon" />
                )}
              </button>
            </div>
            {/* list items */}

            {showDropDown && (
              <div className="dropdown-menu">
                <button
                  type="button"
                  onClick={() => {
                    setSearchType("vendor");
                    setShowDropDown(false);
                  }}
                >
                  Search by Number
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchType("item");
                    setShowDropDown(false);
                  }}
                >
                  search By Item
                </button>
              </div>
            )}
          </form>
          <div className="review-search">
            {searchType === "vendor" ? (
              <div className="review-contact-container">
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    680752677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <FaUserPlus className="contact-icon" />
                    689952677
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <MdCategory className="contact-icon" />
                    Luxury Fashion
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <MdCategory className="contact-icon" />
                    Jewery Store
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <MdCategory className="contact-icon" />
                   Watch Shop
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <MdCategory className="contact-icon" />
                    Phone Shop
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <MdCategory className="contact-icon" />
                    Handbag Boutiques 
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <MdCategory className="contact-icon" />
                    Baby Clothing
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <MdCategory className="contact-icon" />
                    Kids Fashion
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <MdCategory className="contact-icon" />
                    Custom T-shirt 
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
                  </div>
                </div>
                <div className="review-contact">
                  <div type="numbers" className="review-numbers">
                    <MdCategory className="contact-icon" />
                    Sport Wear
                  </div>
                  <div className="star-icon">
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStar className="full-star-icon" />
                    <FaStarHalfAlt className="full-star-icon" />
                    <FaRegStar className="empty-star-icon" />
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
    );
}

export default SearchVendor;


