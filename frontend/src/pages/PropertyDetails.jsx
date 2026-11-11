import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays, Home, Search, ArrowRight } from "lucide-react";
import PropertyGallery from "../components/PropertyGallery";
import ReviewModal from "../components/ReviewModal";
import BookingPreviewModal from "../components/BookingModal";
import ProCalendar from "../components/ProCalendar.jsx";

import { MdFamilyRestroom, MdOutlineDoorBack } from "react-icons/md";
import { LuBath } from "react-icons/lu";
import { IoHome } from "react-icons/io5";

import { amenitiesData } from "../amenitiesData.js";
import { activitiesData } from "../activitiesData.js";
import InquiryModal from "../components/InquiryModal.jsx";
import DisplayCalendar from "../components/miniCalendar.jsx";
import PropertyminiCalendar from "../components/PropertyminiCalendar.jsx";
import GallerySection from "../components/gallarySection.jsx";
import BookingBar from "../components/BookingBar.jsx";
import OwnerRezWidget from "../components/OwnerRezWidget.jsx";
import RatesInformation from "../components/RatesInformation.jsx";
import AmenitiesSection from "../components/AmenitiesSection.jsx";

const PropertyDetail = () => {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

const [reviewPage, setReviewPage] = useState(0);
const [reviewFilter, setReviewFilter] = useState("all");
  const [openBooking, setOpenBooking] = useState(false);
const [openReview, setOpenReview] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);

  const [blockedDates, setBlockedDates] = useState([]);
  const [openInquiry, setOpenInquiry] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [guests, setGuests] = useState(1);
  const [preview, setPreview] = useState(null);
  

  // ================= FETCH LISTING =================
  useEffect(() => {
    api
      .get(`/listings/${id}`)
      .then((res) => {
        setListing(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);
  const publishedReviews = (listing?.reviews || []).filter(
  (review) => review.published === true
);
  const formatDisplayDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

    // ================= REVIEWS =================
   
 const approvedReviews = useMemo(() => {
  return (publishedReviews || []).filter(
    (review) => review.published === true
  );
}, [publishedReviews]);

const getReviewPlatform = (review) =>
  String(review.platform || review.source || review.channel || "")
    .toLowerCase()
    .trim();

const availablePlatforms = [
  {
    id: "airbnb",
    label: "Airbnb",
  },
  {
    id: "vrbo",
    label: "Vrbo",
  },
].filter((platform) =>
  approvedReviews.some(
    (review) => getReviewPlatform(review).includes(platform.id)
  )
);

const filteredReviews =
  reviewFilter === "all"
    ? approvedReviews
    : approvedReviews.filter((review) =>
        getReviewPlatform(review).includes(reviewFilter)
      );

const averageRating =
  approvedReviews.length > 0
    ? (
        approvedReviews.reduce(
          (sum, review) => sum + Number(review.rating || 0),
          0
        ) / approvedReviews.length
      ).toFixed(1)
    : "0.0";

const reviewsPerPage = 2;
const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

const currentReviews = filteredReviews.slice(
  reviewPage * reviewsPerPage,
  reviewPage * reviewsPerPage + reviewsPerPage
);

const changeReviewPage = (page) => {
  setReviewPage(Math.max(0, Math.min(page, totalPages - 1)));
};

  // ================= FETCH CALENDAR =================
  useEffect(() => {
    api.get(`/listings/${id}/calendar`).then((res) => {
      const blocked = res.data
        .filter((d) => d.status === "R" || d.status === "H")
        .map((d) => {
          const dt = new Date(d.date);
          dt.setHours(0, 0, 0, 0);
          return dt;
        });

      setBlockedDates(blocked);
    });
  }, [id]);
  const getMinNightsForDate = (date) => {
    if (!listing?.rates || !date) return 1;

    const selected = listing.rates.find((r) => {
      const from = new Date(r.from);
      const to = new Date(r.to);

      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);

      return date >= from && date <= to;
    });

    return selected?.minNights || 1;
  };

  // 🔹 useEffect
  useEffect(() => {
    if (checkIn && checkOut && listing) {
      const minNights = getMinNightsForDate(checkIn);

      const diff = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

      if (diff < minNights) {
        const newDate = new Date(checkIn);
        newDate.setDate(newDate.getDate() + minNights);
        setCheckOut(newDate);
      }
    }
  }, [checkIn, checkOut, listing]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        {/* Hero */}
        <div className="h-[450px] bg-gray-200" />

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Title */}
          <div className="h-8 w-2/3 bg-gray-200 rounded mb-4" />

          {/* Location */}
          <div className="h-5 w-1/3 bg-gray-200 rounded mb-10" />

          {/* Content */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="h-5 w-full bg-gray-200 rounded" />
              <div className="h-5 w-5/6 bg-gray-200 rounded" />
              <div className="h-5 w-4/6 bg-gray-200 rounded" />
            </div>

            <div className="h-48 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // ================= IMAGES =================
  const getImageUrl = (photo) => {
    const apiBase = import.meta.env.VITE_API_URL || "";

    // Remove /api from API base URL
    const backendBase = apiBase.replace(/\/api\/?$/, "").replace(/\/$/, "");

    const rawUrl =
      typeof photo === "string"
        ? photo
        : photo?.url ||
          photo?.secure_url ||
          photo?.imageUrl ||
          photo?.path ||
          photo?.src ||
          photo?.filename ||
          photo?.image ||
          "";

    if (!rawUrl || typeof rawUrl !== "string") {
      return fallbackImages[0];
    }

    // Already complete URL
    if (/^https?:\/\//i.test(rawUrl)) {
      return rawUrl;
    }

    // Frontend public folder images
    if (rawUrl.startsWith("/property/") || rawUrl.startsWith("/images/")) {
      return rawUrl;
    }

    // Backend uploaded images
    return `${backendBase}/${rawUrl.replace(/^\/+/, "")}`;
  };
  const imageUrls = listing.photos || [];



  // ================= YOUTUBE =================
  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    if (url.includes("embed")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
    return null;
  };

  // ================= MAP =================
  const getMapEmbedUrl = (lat, lng) => {
    const finalLat = Number(lat);
    const finalLng = Number(lng);

    return `https://maps.google.com/maps?q=${finalLat},${finalLng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };
  const formatDate = (date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  
const mainTitle = listing?.property?.title || "Beautiful Beach Property";
const highlightedWord = "";
  // ================= MIN NIGHT AUTO FIX =================
  // 🔹 single function

  return (
    <div className="mt-40">
      {/* GALLERY */}

      {/* PROPERTY TITLE + REVIEW HEADER */}
      <section className="border-b border-gray-300 bg-[#F3F7FA] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          {/* TITLE */}
          <div className="min-w-0">
            <h1 className="text-3xl font-bold uppercase leading-tight tracking-tight text-[#191A2C] sm:text-4xl lg:text-[42px]">
              {mainTitle}{" "}
              <span className="text-[#D18B48]">{highlightedWord}</span>
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
           

              <span className="hidden text-gray-400 sm:block">|</span>

              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#D18B48] sm:text-xs">
                SLEEPS {listing.property?.maxSleeps || 0}
                {" · "}
                {listing.property?.bedrooms || 0} BEDROOMS
                {" · "}
                {listing.property?.bathrooms || 0} BATHROOMS
              </p>
            </div>
          </div>

          {/* REVIEW SUMMARY */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-300 bg-white px-4 py-3 shadow-sm sm:justify-start">
            <div className="flex items-center gap-2">
              <span className="text-xl text-[#191A2C]">✦</span>
              <span className="text-center text-[9px] font-bold leading-tight text-[#191A2C]">
                Guest
                <br />
                Favourite
              </span>
              <span className="text-xl text-[#191A2C]">✦</span>
            </div>

            <div className="h-12 w-px bg-[#E5B47D]" />

            <div className="min-w-[85px] text-center">
              <p className="text-xl font-bold text-[#D18B48]">
                {averageRating}
              </p>

              <p className="text-sm tracking-[2px] text-[#D18B48]">★★★★★</p>

              <p className="font-serif text-[10px] italic text-[#D18B48]">
                {listing.property?.title}
              </p>
            </div>

            <div className="h-12 w-px bg-[#E5B47D]" />

            <div className="text-center">
              <p className="text-xl font-bold text-[#D18B48]">
                {publishedReviews.length}
              </p>

              <p className="text-[9px] font-bold tracking-[1.5px] text-[#191A2C]">
                VERIFIED
                <br />
                REVIEWS
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                document.getElementById("reviews")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="rounded-full bg-[#191A2C] px-5 py-3 text-[9px] font-bold tracking-[1.5px] text-white transition hover:bg-[#D18B48]"
            >
              READ ALL →
            </button>
          </div>
        </div>
      </section>

      {/* GALLERY + BOOKING CALENDAR */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-3 bg-[#F3F7FA] px-3 py-5 sm:px-5 lg:px-6 xl:grid-cols-[1.65fr_1fr]">
        {/* LEFT: IMAGE GALLERY */}
        <div className="min-w-0" id="photos">
          <PropertyGallery images={listing?.photos || []} />
        </div>

        {/* RIGHT: BOOKING CALENDAR */}
        <div className="min-w-0 xl:sticky xl:top-[100px]">
          <PropertyminiCalendar
            listingId={listing._id}
            checkIn={checkIn}
            setCheckIn={setCheckIn}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            onCheckAvailability={() => setOpenBooking(true)}
          />
        </div>
      </div>

{/* MINI SECTION NAVBAR */}
<nav
  aria-label="Property sections"
  className="
    sticky top-[100px] z-40
    w-full border-y border-[#D9DDE1]
    bg-white/95 backdrop-blur-md
    shadow-[0_4px_12px_rgba(0,0,0,0.06)]
  "
>
  <div
    className="
      mx-auto flex w-full max-w-[1600px]
      items-center justify-start
      gap-5 overflow-x-auto
      whitespace-nowrap px-5 py-5
      scrollbar-hide
      md:justify-center md:gap-6
      lg:gap-8 lg:px-8 lg:py-6
    "
  >
    {[
      { label: "PHOTOS", id: "photos" },
      { label: "THE HOME", id: "description" },
      { label: "RATES", id: "rates" },
      { label: "AMENITIES", id: "amenities" },
      { label: "REVIEWS", id: "reviews" },
      { label: "LOCATION", id: "location" },
      { label: "VIDEO & VIRTUAL TOUR", id: "videos" },
    ].map((item, index, array) => (
      <React.Fragment key={item.id}>
        <a
          href={`#${item.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
          className="
            shrink-0 text-[10px]
            font-semibold tracking-[2px]
            text-[#191A2C]
            transition-colors duration-300
            hover:text-[#C8884A]
            sm:text-[11px]
            lg:text-xs lg:tracking-[3px]
          "
        >
          {item.label}
        </a>

        {index !== array.length - 1 && (
          <span
            className="
              h-[9px] w-[9px] shrink-0
              rotate-45 bg-[#D9A36E]
            "
          />
        )}
      </React.Fragment>
    ))}
  </div>
</nav>

      <div className="w-full max-w-full mx-auto px-4 sm:px-5 lg:px-6 mt-0 mb-20 overflow-visible">
        {/* LEFT */}
        <div className="w-full max-w-full bg-white rounded-3xl p-4 sm:p-6 md:p-0 overflow-visible">
          <section
            id="description"
            className=" scroll-mt-[90px] sm:scroll-mt-[100px] lg:scroll-mt-[150px] w-full max-w-full px-4
            lg:px-6 py-10 lg:py-14 "
          >
            <div className="w-full flex justify-center">
              <div className="w-full max-w-6xl">
                <h1
                  className="text-[48px] font-[300] text-[#191A2C] mb-6"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  About The{" "}
                  <span className="text-[#c8884a]">Property</span>{" "}
                </h1>
                {/* DESCRIPTION */}

                <div
                  className=" text-gray-600 text-base md:text-lg xl:text-[21px] leading-relaxed font-light prose
    prose-lg max-w-none prose-headings:text-black prose-headings:font-bold prose-headings:mb-4 prose-p:text-gray-600
    prose-p:leading-8 prose-p:mb-5 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-black
    prose-strong:font-semibold prose-ul:my-5 prose-ol:my-5 prose-li:text-gray-600 prose-li:marker:text-blue-600 prose-li:mb-2
 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:text-gray-600 
    prose-img:rounded-xl prose-img:shadow-lg leading-relaxed
    
  "
                  style={{
                    fontFamily: "Montserrat , sans-serif",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: listing.description || "",
                  }}
                />
              </div>
            </div>
          </section>
          {/* PROPERTY VIDEO + LOCATION MAP */}
          
{/* PROPERTY VIDEO SECTION */}
{listing.video?.youtube && (
  <section
    id="videos"
    className="
      relative
      w-full
      overflow-hidden
      bg-[#0B2A3D]
      px-4
      py-14
      sm:px-6
      sm:py-16
      md:px-8
      md:py-20
      lg:px-12
      lg:py-24
      scroll-mt-[90px]
      sm:scroll-mt-[110px]
      lg:scroll-mt-[130px]
    "
  >
    <div className="mx-auto w-full max-w-[1440px]">

      {/* SECTION HEADING */}
      <div className="mx-auto mb-9 max-w-5xl text-center sm:mb-12">

        {/* EYEBROW */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="h-px w-8 bg-[#C8884A] sm:w-12" />

          <span className="text-[11px] font-semibold tracking-[3px] text-[#D49A63] sm:text-[11px] sm:tracking-[5px]">
            THE PREMIERE
          </span>

          <span className="h-px w-8 bg-[#C8884A] sm:w-12" />
        </div>

        {/* MAIN TITLE */}
        <h2
          className="
            text-center
            font-light
            leading-[1.4]
            tracking-[-0.025em]
            text-white
            text-4xl
            sm:text-5xl
            md:text-6xl
            lg:text-[64px]
            xl:text-[58px]
          "
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Step Inside,{" "}

          <span
            className="inline-block italic"
            style={{
              background:
                "linear-gradient(135deg, #F8E7B0 0%, #D4AF37 45%, #B8860B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Long Before You Arrive.
          </span>
        </h2>

        {/* DESCRIPTION */}
        <p
          className="
            mx-auto
            mt-5
            max-w-2xl
            px-2
            text-center
            text-sm
            font-light
            leading-7
            text-[#F1E0CB]/70
            sm:mt-6
            sm:text-base
            sm:leading-8
            md:text-lg
          "
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Two ways to walk these grounds before you've even
          packed a bag — a film that captures the feeling,
          and an interactive tour that lets you wander it
          yourself.
        </p>
      </div>

      {/* VIDEO FRAME */}
      <div className="relative mx-auto w-full max-w-[1260px]">

        {/* TOP LEFT DECORATIVE CORNER */}
        <span className="absolute -left-2 -top-3 z-10 h-10 w-10 border-l-2 border-t-2 border-[#C8884A] sm:-left-4 sm:-top-4 sm:h-12 sm:w-12" />

        {/* BOTTOM RIGHT DECORATIVE CORNER */}
        <span className="absolute -bottom-3 -right-2 z-10 h-10 w-10 border-b-2 border-r-2 border-[#C8884A] sm:-bottom-4 sm:-right-4 sm:h-12 sm:w-12" />

        {/* RESPONSIVE VIDEO */}
        <div
          className="
            relative
            aspect-video
            w-full
            overflow-hidden
            rounded-xl
            border-[3px]
            border-[#C8884A]
            bg-black
            shadow-[0_20px_70px_rgba(0,0,0,0.35)]
            sm:rounded-[22px]
            sm:border-4
          "
        >
          <iframe
            src={getYoutubeEmbed(listing.video.youtube)}
            className="
              absolute
              inset-0
              h-full
              w-full
              border-0
              transition-transform
              duration-700
              hover:scale-[1.02]
            "
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            title="Property Video Tour"
          />
        </div>
      </div>

      {/* VIDEO CAPTION */}
      <p
        className="
          mt-6
          text-center
          text-[9px]
          font-medium
          tracking-[2px]
          text-white/40
          sm:mt-8
          sm:text-[10px]
          sm:tracking-[3px]
        "
      >
        {listing.property?.title?.toUpperCase() || "PROPERTY"} — OFFICIAL PROPERTY FILM
      </p>

      {/* BOTTOM DECORATION */}
      <div className="mt-12 flex items-center justify-center gap-4 sm:mt-16">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C8884A]/60 sm:w-32" />

        <span className="text-sm text-[#D49A63]">✦</span>

        <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C8884A]/60 sm:w-32" />
      </div>
    </div>
  </section>
)}
 
 <div className="mt-10">
<RatesInformation listing={listing} />
 </div>

 



          {/* PROPERTY LOCATION MAP */}
          
          {/* AMENITIES */}
          {/* =========================
      AMENITIES
========================= */}

       
 <AmenitiesSection listing={listing}
  amenitiesData={amenitiesData}/>

          {/* Activities */}

          {/* {activitiesData.map((section) => {
            const selected = section.options.filter(
              (item) => listing.activities?.[item],
            );
            if (selected.length === 0) return null;

            return (
              <div key={section.title} className="mb-6">
                <h2 className="text-2xl font-semibold mt-8 mb-4">Activities</h2>
                <h5 className="bg-[#2f9bad] text-white p-2 rounded-xl text-lg mb-2">
                  {section.title}
                </h5>

                <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 list-disc ml-6">
                  {selected.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })} */}

          {/* VIDEO */}

          {/* Calendar  */}
          {/* <div
            id="availability"
            className="
    scroll-mt-[90px]
    sm:scroll-mt-[100px]
    lg:scroll-mt-[150px]

    w-full
    max-w-full

    mt-6

    px-3
    sm:px-6
    md:px-10
    lg:px-20
  "
          >
            <PropertyminiCalendar listingId={listing._id} />
          </div> */}
          {/* ======================================================
                    PREMIUM REVIEWS
====================================================== */}
 


        
<section
  id="reviews"
  className="
    w-full scroll-mt-[100px]
    bg-[#F4F8F9]
    px-4 py-12
    sm:px-6 sm:py-16
    lg:px-8 lg:py-20
  "
>
  <div className="mx-auto max-w-[1240px]">

    {/* HEADER */}
    <div className="mb-9 text-center sm:mb-12">

      <div className="mb-5 flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-[#C8884A]" />
        <span className="text-sm text-[#C8884A]">◆</span>
        <span className="h-px w-10 bg-[#C8884A]" />
      </div>

      <h2
        className="
          text-3xl font-medium
          text-[#092536]
          sm:text-4xl md:text-5xl
        "
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        What Our Guests{" "}
        <span className="italic text-[#C8884A]">Say</span>
      </h2>

      <p
        className="
          mt-3 text-[10px]
          uppercase tracking-[0.22em]
          text-[#8AA5B5]
          sm:text-xs sm:tracking-[0.3em]
        "
      >
        {listing?.location?.city || "Marathon"},{" "}
        {listing?.location?.state || "Florida Keys"} · Gulf-Front Estate
      </p>

      {/* RATING */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <span
          className="text-4xl text-[#092536] sm:text-5xl"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {averageRating}
        </span>

        <div className="text-left">
          <div className="text-xl tracking-[2px] text-[#C8884A]">
            ★★★★★
          </div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#617C8D]">
            {approvedReviews.length} Verified Reviews
          </p>
        </div>
      </div>

      {/* GUEST FAVOURITE */}
      <div
        className="
          mx-auto mt-5 inline-flex
          max-w-full items-center justify-center
          rounded-full bg-[#062433]
          px-5 py-2
          text-[9px] font-semibold
          uppercase tracking-[0.2em]
          text-[#E0A064]
          sm:px-7 sm:text-[10px]
        "
      >
        ★ &nbsp; Guest Favourite ·{" "}
        {listing?.property?.title || "Property"}
      </div>

      {/* FILTER BUTTONS */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">

        <button
          type="button"
          onClick={() => {
            setReviewFilter("all");
            setReviewPage(0);
          }}
          className={`
            rounded-full border px-5 py-3
            text-xs font-semibold
            transition-all duration-300
            sm:px-7
            ${
              reviewFilter === "all"
                ? "border-[#062433] bg-[#062433] text-[#E0A064]"
                : "border-[#E9D8C6] bg-transparent text-[#536B7C] hover:border-[#C8884A]"
            }
          `}
        >
          All Reviews
          <span className="ml-2 opacity-70">
            ({approvedReviews.length})
          </span>
        </button>

        {availablePlatforms.map((platform) => {
          const count = approvedReviews.filter((review) =>
            getReviewPlatform(review).includes(platform.id)
          ).length;

          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => {
                setReviewFilter(platform.id);
                setReviewPage(0);
              }}
              className={`
                rounded-full border px-5 py-3
                text-xs font-semibold
                transition-all duration-300
                sm:px-7
                ${
                  reviewFilter === platform.id
                    ? "border-[#062433] bg-[#062433] text-[#E0A064]"
                    : "border-[#E9D8C6] bg-transparent text-[#536B7C] hover:border-[#C8884A]"
                }
              `}
            >
              {platform.label}
              <span className="ml-2 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>
    </div>

    {/* REVIEW CARDS */}
    {currentReviews.length > 0 ? (
      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:gap-6">

        {currentReviews.map((review) => {
          const rating = Math.max(
            0,
            Math.min(5, Number(review.rating) || 0)
          );

          const guestName = review.name || "Guest";
          const platform = getReviewPlatform(review);

          return (
            <article
              key={review._id}
              className="
                flex h-full min-w-0 flex-col
                rounded-[20px]
                border border-[#F0E3D5]
                bg-[#FFFEFC]
                p-5
                transition-all duration-300
                hover:border-[#DDA36D]
                hover:shadow-[0_12px_35px_rgba(20,40,50,0.07)]
                sm:p-7
                lg:p-8
              "
            >
              {/* CARD HEADER */}
              <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="
                      flex h-11 w-11 shrink-0
                      items-center justify-center
                      rounded-full bg-[#062433]
                      text-lg text-[#DDA36D]
                    "
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {guestName.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#142C3D] sm:text-base">
                      {guestName}
                    </h3>

                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#89A3B4]">
                      Verified Guest
                    </p>
                  </div>
                </div>

                <div
                  className="shrink-0 text-base tracking-[1px] text-[#C8884A] sm:text-lg"
                  aria-label={`${rating} out of 5 stars`}
                >
                  {"★".repeat(rating)}
                  <span className="text-[#EBDDCF]">
                    {"★".repeat(5 - rating)}
                  </span>
                </div>
              </div>

              {/* PLATFORM + RATING */}
              <div className="mt-4 flex flex-wrap items-center gap-2">

                {platform && (
                  <span className="
                    rounded-full border border-[#FFC8C3]
                    bg-[#FFF0EF] px-3 py-1
                    text-[9px] font-bold
                    uppercase tracking-[0.12em]
                    text-[#E45A55]
                  ">
                    {platform}
                  </span>
                )}

                <span className="
                  rounded-full bg-[#062433]
                  px-3 py-1
                  text-[9px] font-semibold
                  text-[#E0A064]
                ">
                  {rating.toFixed(1)}
                </span>
              </div>

              {/* MESSAGE */}
              <p
                className="
                  mt-4 flex-1
                  whitespace-pre-line break-words
                  text-sm leading-[1.8]
                  text-[#536B7C]
                  sm:text-[15px]
                "
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                {review.message}
              </p>

              {/* OWNER REPLY */}
              {review.reply && (
                <div className="
                  mt-5 rounded-xl
                  border-l-2 border-[#C8884A]
                  bg-[#F7F5F1] p-4
                ">
                  <h4 className="mb-2 text-xs font-semibold text-[#A56D3B]">
                    Owner Response
                  </h4>
                  <p className="whitespace-pre-line break-words text-sm leading-7 text-[#536B7C]">
                    {review.reply}
                  </p>
                </div>
              )}

              {/* CARD FOOTER */}
              <div className="
                mt-6 flex flex-wrap
                items-center justify-between
                gap-3 border-t border-[#F0E6DC]
                pt-4
              ">
                <span className="text-xs text-[#91A9B8]">
                  Stayed ·{" "}
                  {review.stayDate || review.createdAt
                    ? new Date(
                        review.stayDate || review.createdAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "Guest"}
                </span>

                <span className="
                  inline-flex items-center gap-1.5
                  text-[9px] font-bold
                  uppercase tracking-[0.15em]
                  text-[#0B526B]
                ">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0B7890]" />
                  Verified Review
                </span>
              </div>
            </article>
          );
        })}

      </div>
    ) : (
      <div className="
        rounded-2xl border border-[#F0E3D5]
        bg-white px-5 py-14 text-center
      ">
        <h3
          className="text-2xl text-[#092536]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          No Reviews Yet
        </h3>
        <p className="mt-2 text-sm text-[#718896]">
          No published reviews are available in this category.
        </p>
      </div>
    )}

    {/* PAGINATION */}
    {totalPages > 1 && (
      <div className="
        mt-8 flex flex-wrap
        items-center justify-center gap-4
        sm:mt-9 sm:gap-6
      ">

        <button
          type="button"
          onClick={() => changeReviewPage(reviewPage - 1)}
          disabled={reviewPage === 0}
          aria-label="Previous reviews"
          className="
            flex h-11 w-11 items-center
            justify-center rounded-full
            border border-[#F0DECC]
            bg-white text-[#536B7C]
            text-xl transition
            hover:border-[#C8884A]
            hover:text-[#C8884A]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          ←
        </button>

        <div className="flex max-w-[220px] flex-wrap items-center justify-center gap-2">
          {Array.from(
            { length: Math.min(totalPages, 14) },
            (_, i) => {
              const start = Math.max(
                0,
                Math.min(reviewPage - 6, totalPages - 14)
              );

              const page = start + i;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => changeReviewPage(page)}
                  aria-label={`Go to review page ${page + 1}`}
                  className={`
                    h-2.5 w-2.5 rounded-full
                    transition-all duration-300
                    ${
                      reviewPage === page
                        ? "scale-125 bg-[#C8884A]"
                        : "bg-[#E9DED2] hover:bg-[#C8884A]/60"
                    }
                  `}
                />
              );
            }
          )}
        </div>

        <span className="text-xs tracking-[0.15em] text-[#88A1B1]">
          {reviewPage + 1} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => changeReviewPage(reviewPage + 1)}
          disabled={reviewPage === totalPages - 1}
          aria-label="Next reviews"
          className="
            flex h-11 w-11 items-center
            justify-center rounded-full
            border border-[#F0DECC]
            bg-white text-[#536B7C]
            text-xl transition
            hover:border-[#C8884A]
            hover:text-[#C8884A]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          →
        </button>
      </div>
    )}

    {/* BOTTOM LABEL */}
    <div className="
      mt-8 border-t border-[#EDE3D9]
      pt-5 text-center
    ">
      <p className="
        text-[9px] uppercase
        tracking-[0.18em]
        text-[#91A9B8]
        sm:text-[10px] sm:tracking-[0.25em]
      ">
        Verified Guest Reviews ·{" "}
        {listing?.property?.title || "Property"} ·{" "}
        {listing?.location?.city || "Florida Keys"}
      </p>
    </div>

  </div>
</section>

{/* EXISTING REVIEW MODAL */}
{openReview && (
  <ReviewModal
    listingId={id}
    onClose={() => setOpenReview(false)}
  />
)}

        </div>
        
        {/* PROPERTY LOCATION MAP */}

{listing?.location?.lat != null &&
  listing?.location?.lng != null && (
    <section
      id="location"
      className="
        relative isolate left-1/2 -translate-x-1/2
        w-screen max-w-none overflow-hidden
        bg-[#171B29]
        scroll-mt-[100px]
        px-4 py-16 sm:py-20 lg:py-24
      "
    >
      {/* Curved light background */}
      <div
        className="absolute inset-x-0 top-0 h-[38%] bg-[#F3F8FB]"
        style={{
          clipPath: "ellipse(90% 100% at 50% 0%)",
        }}
      />

      {/* Heading and Description */}
      <div className="relative z-10 mx-auto mb-10 max-w-5xl text-center sm:mb-12">

        <div className="mx-auto mb-7 h-[2px] w-32 bg-[#C8884A] sm:w-48" />

        <h2
          className="
            text-[36px] font-light leading-[1.12]
            tracking-[-1.8px] text-[#152b3c]
            opacity-90 sm:text-5xl lg:text-[58px]
            xl:text-[68px]
          "
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {mainTitle}{" "}
              <span className="text-[#D18B48]">{highlightedWord}</span>
              
        </h2>
          <p className="font-serif text-base italic text-[#25374B] sm:text-lg">
                {listing.location?.address || "Panama City Beach, Florida"}
              </p>

        <p
          className="
            mx-auto mt-6 max-w-4xl
            px-2 text-base font-light italic
            leading-8 text-[#3a5160]
            sm:mt-8 sm:text-lg
          "
          style={{ fontFamily: "Georgia, serif" }}
        >
        No Service Fees | Book Directly With Us | Best Prices Guaranteed
        </p>
      </div>

      {/* Map outer white frame */}
      <div
        className="
          relative z-10 mx-auto
          w-full max-w-[1400px]
          bg-white p-3
          shadow-[0_10px_35px_rgba(0,0,0,0.12)]
          sm:p-4 lg:p-5
        "
      >
        <iframe
          src={getMapEmbedUrl(
            listing.location.lat,
            listing.location.lng
          )}
          className="
            block h-[300px] w-full border-0
            sm:h-[400px] md:h-[450px]
            lg:h-[486px]
          "
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title="Property Location"
        />
      </div>
    </section>
  )}
         
      </div>

      {/* BOOKING MODAL */}
      {openBooking && (
        <BookingPreviewModal
          propertyId={id}
          checkIn={formatDate(checkIn)}
          checkOut={formatDate(checkOut)}
          onClose={() => setOpenBooking(false)}
        />
      )}
    </div>
  );
};
<style>
  {`
        .lxtour-head {
          color: #c8884a;
        }
      `}
</style>;
export default PropertyDetail;
