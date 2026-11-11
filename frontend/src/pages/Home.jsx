import { useEffect, useState } from "react";

import { CheckCircle2 } from "lucide-react";
import api from "../api/axios.js";
import { FaFacebookF, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { TbHomeSearch } from "react-icons/tb";
import { FaHandHoldingUsd } from "react-icons/fa";
import { Calendar, Home, MapPin } from "lucide-react";
// import heroVideo from "../assets/hero.mp4";
// 👆 apni hero image ka correct path lagana
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AboutSection from "../components/homeSection/AboutSection.jsx";
import GallerySection from "../components/gallarySection";
import { Link, useNavigate } from "react-router-dom";
import ThingsToDoSection from "../components/homeSection/ActivitiesSection.jsx";
import ReviewsSection from "../components/ReviewsSection.jsx";
import TestimonialCarousel from "../components/ReviewsSection.jsx";
import PropertyCard from "../components/PropertyCard.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import ContactSection from "../components/contactSection.jsx";
import Properties from "./Properties.jsx";
import HomeProperties from "../components/HomeProperties.jsx";
import HeroSection from "../components/HeroSection.jsx";
import AmenitiesSection from "../components/homeSection/amenitiesSection.jsx";


export default function Hero({ listingId }) {
  const [featured, setFeatured] = useState(null);
  const [listings, setListings] = useState([]);
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
  });
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [bedrooms, setBedrooms] = useState("");
  const [location, setLocation] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobiles, setIsMobiles] = useState(window.innerWidth < 768);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [stickySearch, setStickySearch] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setStickySearch(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => setShowModal(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!formData.checkIn || !formData.checkOut) {
      setError("Please select both dates");
      setShowModal(true);
      return;
    }

    const params = new URLSearchParams({
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
    }).toString();

    navigate(`/results?${params}`);
  };

  const parseLocalDate = (dateString) => {
    if (!dateString) return null;

    const [year, month, day] = dateString.split("-");

    return new Date(year, month - 1, day);
  };
  // ===========================
  // FETCH FEATURED LISTING
  // ===========================

  useEffect(() => {
    api
      .get("/listings/published")
      .then((res) => {
        const data = res.data || [];

        setFeatured(data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .get("/listings/published")
      .then((res) => {
        setListings(res.data.listings || res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      {/* =====================================
                    HERO SECTION
      ====================================== */}
x
      <HeroSection />
      <section id="host">
      <AboutSection />
      </section>

      {/* <AmenitiesSection />  */}
      <ThingsToDoSection />

      {/* <GallerySection /> */}
<section id="guest-reviews">
      <TestimonialCarousel  />
      </section>
      {/* <ThingsToDoSection /> */}
      {/* <ContactSection /> */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center 
        bg-black/30 backdrop-blur-sm z-50"
        >
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-sm text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Notice</h2>

            <p className="text-gray-700 mb-4">{error}</p>

            <button
              onClick={() => setShowModal(false)}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
