import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import "leaflet/dist/leaflet.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// FRONTEND
import HeroSection from "./pages/Home";
import Properties from "./pages/Properties";
import Results from "./pages/Results";
import PropertyDetail from "./pages/PropertyDetails";
// import BookingPage from "./pages/BookingPage";
// import SeaDunesBeachFront from "./pages/PropertiesListing/SeaDunes";


// ADMIN
import AdminRoute from "./admin/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import Listings from "./admin/pages/Listings";
import AddListing from "./admin/pages/AddListing";
import Bookings from "./admin/pages/Bookings";
import Users from "./admin/pages/Users";
import GalleryAdmin from "./admin/pages/Gallery";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
import Contact from "./pages/Contact";
import BookingPolicy from "./pages/bookingPolicy";
import ThingsToDo from "./pages/ThingstoDo";
import MeetOwners from "./pages/MeetOwners";
import PropertyManagementIntro from "./pages/PropertyManagementHero";
// import SpecialsDeals from "./pages/Specials";
// import Reviews from "./pages/Reviews";
import AboutUs from "./pages/About";
// import CommunityDetails from "./pages/CommunityDetails";
import Inquiry from "./admin/pages/Inquiry";
function App() {
  const location = useLocation();

  // 🔑 check: are we on admin page?
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {/* FRONTEND ONLY */}
      {!isAdminRoute && <Navbar listingId="6adb7a6a6101b6fb9bebdd9b" />}

      <Routes>
        {/* FRONTEND ROUTES */}
        <Route path="/" element={<HeroSection />} />
        <Route path="properties/:id" element={<PropertyDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact-us" element={<Contact listingId="6adb7a6a6101b6fb9bebdd9b" />} />
        <Route path="/booking-policy" element={<BookingPolicy />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/things-to-do" element={<ThingsToDo />} />
        <Route path="/meet-the-owner" element={<MeetOwners />} />
        <Route path="/all-rentals" element={<Results />} />
        <Route path="/property-management" element={<PropertyManagementIntro />} />
        <Route path="/about-us" element={<AboutUs />} />
        {/* <Route path="/BookingPage" element={<BookingPage />} />
        
        <Route path="/specials" element={<SpecialsDeals/>} />
        <Route path="/reviews" element={< Reviews />} />
        <Route path="/sea-dunes-beach-front" element={<SeaDunesBeachFront />} />
      
        <Route path="/community/:id" element={<CommunityDetails />} /> */}



        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<Login />} />

        {/* ADMIN PAGES */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/listings"
          element={
            <AdminRoute>
              <AdminLayout>
                <Listings />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/listings/property_add"
          element={
            <AdminRoute>
              <AdminLayout>
                <AddListing />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminLayout>
                <Bookings />
              </AdminLayout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </AdminRoute>
          }

        />
        <Route
          path="/admin/listings/:id"
          element={
            <AdminRoute>
              <AdminLayout>
                <AddListing />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <AdminRoute>
              <AdminLayout>
                <GalleryAdmin />
              </AdminLayout>
            </AdminRoute>
          }
        />
        <Route
          path="/admin/inquiries"
          element={
            <AdminRoute>
              <AdminLayout>
                <Inquiry />
              </AdminLayout>
            </AdminRoute>
          }
        />
      </Routes>

      {/* FRONTEND ONLY */}
      {!isAdminRoute && <Footer listingId="6adb7a6a6101b6fb9bebdd9b" />}

    </>
  );
}

export default App;
