
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import SearchVendor from './pages/SearchVendor/SearchVendor';
import CreateVendor from './pages/NewVendor/CreateVendor';
import SeeReview from './pages/SeeReviewed/SeeReview';
import SubmitReview from './pages/SubmitReview/SubmitReview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<SearchVendor />} />
        <Route path= "/CreateVendor" element={<CreateVendor/>}  />
        <Route path ="/SeeReview" element={<SeeReview/>}/>
        <Route path="/SubmitReview" element={<SubmitReview/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
