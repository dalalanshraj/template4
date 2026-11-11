
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  X,
  Star,
  Quote,
  ShieldCheck,
  MapPin,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import api from "../api/axios";
import "./ReviewsSection.css";

export default function ReviewsSection() {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH ALL PUBLISHED REVIEWS
  // =====================================

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get("/listings/published");

        const listings = Array.isArray(data)
          ? data
          : data?.listings || data?.properties || [];

        let allReviews = [];

        listings.forEach((listing) => {
          const publishedReviews = (listing.reviews || [])
            .filter((review) => review.published === true)
            .map((review, index) => ({
              ...review,

              reviewId:
                review._id ||
                `${listing._id}-${index}`,

              listingId: listing._id,

              propertyTitle:
                listing.property?.title || "Florida Keys Rental",

              propertyLocation:
                [
                  listing.location?.city,
                  listing.location?.state,
                ]
                  .filter(Boolean)
                  .join(", ") ||
                listing.location?.address ||
                "Florida Keys",
            }));

          allReviews.push(...publishedReviews);
        });

        // Latest reviews first

        // REMOVE DUPLICATE REVIEWS


        // =====================================
        // REMOVE DUPLICATE REVIEWS
        // =====================================

        const normalizeText = (value) =>
          String(value || "")
            .toLowerCase()
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const uniqueReviews = Array.from(
          new Map(
            allReviews.map((review) => {
              const uniqueKey = [
                review.listingId,
                normalizeText(review.name),
                normalizeText(review.title),
                normalizeText(review.message),
                Number(review.rating || 0),
                review.stayDate
                  ? new Date(review.stayDate).toISOString().slice(0, 10)
                  : "",
              ].join("|");

              return [uniqueKey, review];
            })
          ).values()
        );

        // Latest reviews first

        uniqueReviews.sort(
          (a, b) =>
            new Date(b.stayDate || 0) -
            new Date(a.stayDate || 0)
        );

        console.log("TOTAL REVIEWS:", allReviews.length);
        console.log("AFTER DUPLICATE REMOVAL:", uniqueReviews.length);

        setReviews(uniqueReviews);

      } catch (error) {
        console.error(
          "Failed to fetch reviews:",
          error.response?.data || error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // =====================================
  // MODAL SCROLL LOCK + ESCAPE
  // =====================================

  useEffect(() => {
    if (!selectedReview) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedReview(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedReview]);

  // =====================================
  // STATISTICS
  // =====================================

  const stats = useMemo(() => {
    const total = reviews.length;

    const average =
      total > 0
        ? (
          reviews.reduce(
            (sum, review) =>
              sum + Number(review.rating || 0),
            0
          ) / total
        ).toFixed(1)
        : "0.0";

    const homes = new Set(
      reviews.map((review) => review.listingId)
    ).size;

    const fiveStar = reviews.filter(
      (review) => Number(review.rating) === 5
    ).length;

    return [
      {
        value: `${total}+`,
        label: "GUEST STORIES",
      },
      {
        value: average,
        label: "AVERAGE RATING",
        star: true,
      },
      {
        value: homes,
        label: "FEATURED HOMES",
      },
      {
        value: fiveStar,
        label: "FIVE STAR REVIEWS",
      },
    ];
  }, [reviews]);

  // =====================================
  // HELPERS
  // =====================================

  const formatDate = (date) => {
    if (!date) return "Florida Keys Guest";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "";

    return parsed.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name = "Guest") => {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const openReview = (review) => {
    setSelectedReview(review);
  };

  const closeReview = () => {
    setSelectedReview(null);
  };

  const openProperty = () => {
    if (!selectedReview?.listingId) return;

    const listingId = selectedReview.listingId;

    closeReview();

    navigate(`/property/${listingId}`);
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <section className="flex min-h-[400px] items-center justify-center bg-[#F3F7FA]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-[#1F6397] border-t-transparent" />
          <p className="font-serif italic text-[#60798C]">
            Gathering guest stories...
          </p>
        </div>
      </section>
    );
  }

  // =====================================
  // EMPTY REVIEWS
  // =====================================

  if (!reviews.length) {
    return null;
  }

  // =====================================
  // REVIEW CARD
  // =====================================

  const ReviewCard = ({ review, copy }) => (
    <button
      type="button"
      key={`${review.reviewId}-${copy}`}
      onClick={() => openReview(review)}
      className="testimonial-card group text-left"
      aria-label={`Read ${review.name}'s review`}
    >
      {/* Top */}

      <div className="flex items-center justify-between gap-3">

        <div className="flex items-center gap-1 text-[#D28C45]">
          {Array.from({
            length: Math.min(
              5,
              Math.max(0, Number(review.rating) || 5)
            ),
          }).map((_, index) => (
            <Star
              key={index}
              size={14}
              fill="currentColor"
              strokeWidth={1}
            />
          ))}
        </div>

        <span className="testimonial-verified">
          <ShieldCheck size={12} />
          PUBLISHED
        </span>

      </div>

      {/* Quote */}

      <div className="testimonial-quote-mark">
        “
      </div>

      {/* Title */}



      {/* Message */}

      <p className="testimonial-review-message">
        {review.message}
      </p>

      {/* Bottom */}

      <div className="testimonial-card-footer">

        <div className="testimonial-avatar">
          {getInitials(review.name)}
        </div>

        <div className="min-w-0">

          <p className="testimonial-guest-name">
            {review.name || "Guest"}
          </p>

          <p className="testimonial-property-name">
            {review.propertyTitle}
          </p>

        </div>

        <span className="testimonial-card-arrow">
          <ArrowUpRight size={18} />
        </span>

      </div>
    </button>
  );

  return (
    <>
      {/* =====================================
          TESTIMONIAL SECTION
      ====================================== */}

      <section className="testimonial-section">

        {/* HEADER */}

        <div className="testimonial-heading">

          <div className="testimonial-eyebrow">
            <span />
            <p className="text-[11px] font-semibold uppercase tracking-[5px] text-[#bd8246]"> GUEST STORIES</p>

            <span />
          </div>

          <h2
            className="  text-[42px] font-[300] leading-[1.12] tracking-[-1.8px] text-[#152b3c] sm:text-5xl lg:text-[58px] xl:text-[68px] opacity-90"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The horizon remembers{" "}
            <span className="testimonial-blue" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              every guest
            </span>{" "}
            who stayed to watch it{" "}
            <span className="testimonial-gold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              burn gold.
            </span>
          </h2>

          <div className="testimonial-divider" >
            <span />
            ✦
            <span />
          </div>

           <p
              className="mt-8 text-xl italic text-[#3a5160] sm:text-2xl  font-bold"
              style={{ fontFamily: "Georgia, serif" }}
            >
            The best part of hosting is reading what guests
            write once they're home — about sunrise coffee
            on the dock, kayaks slipping past the mangroves,
            the quiet hour before the whole sky turns copper
            over the water. Here are some of those stories,
            in their own words.
          </p>

        </div>

        {/* =====================================
            STATISTICS
        ====================================== */}

        <div className="testimonial-stats">

          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="testimonial-stat"
            >

              <div className="testimonial-stat-value">

                {stat.value}

                {stat.star && (
                  <Star
                    size={22}
                    fill="#D28C45"
                    stroke="none"
                  />
                )}

              </div>

              <p>{stat.label}</p>

            </div>
          ))}

          <span className="testimonial-stats-sparkle">
            ✦
          </span>

        </div>

        {/* =====================================
            ALL REVIEWS MARQUEE
        ====================================== */}


        {/* ALL REVIEWS MARQUEE */}

        <div className="testimonial-marquee-wrapper">

          <div
            className={`testimonial-marquee-track ${reviews.length < 4
                ? "testimonial-marquee-track-static"
                : ""
              }`}
          >

            {(reviews.length >= 4 ? [0, 1] : [0]).map((copy) => (
              <div
                key={copy}
                className="testimonial-marquee-group"
                aria-hidden={copy === 1}
              >
                {reviews.map((review) => (
                  <ReviewCard
                    key={`${review.reviewId}-${copy}`}
                    review={review}
                    copy={copy}
                  />
                ))}
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================
          FULL TESTIMONIAL MODAL
      ====================================== */}

      {selectedReview && (

        <div
          className="testimonial-modal-backdrop"
          onClick={closeReview}
        >

          <div
            className="testimonial-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Guest testimonial"
            onClick={(event) => event.stopPropagation()}
          >

            {/* TOP BAR */}

            <div className="testimonial-modal-top">

              <button
                type="button"
                onClick={closeReview}
                className="testimonial-close"
                aria-label="Close review"
              >
                <X size={18} />
              </button>

              <span className="testimonial-modal-badge">
                <ShieldCheck size={14} />
                PUBLISHED GUEST REVIEW
              </span>

            </div>

            {/* STARS */}

            <div className="testimonial-modal-stars">

              {Array.from({
                length: Math.min(
                  5,
                  Math.max(
                    0,
                    Number(selectedReview.rating) || 5
                  )
                ),
              }).map((_, index) => (
                <Star
                  key={index}
                  size={21}
                  fill="currentColor"
                  stroke="none"
                />
              ))}

            </div>

            {/* QUOTE */}

            <div className="testimonial-modal-quote">
              <Quote size={34} />
            </div>

            {/* TITLE */}

            {selectedReview.title && (
              <h2 className="testimonial-modal-title">
                {selectedReview.title}
              </h2>
            )}

            {/* FULL MESSAGE */}

            <p className="testimonial-modal-message">
              {selectedReview.message}
            </p>

            {/* BOTTOM INFORMATION */}

            <div className="testimonial-modal-bottom">

              {/* GUEST */}

              <div className="testimonial-modal-guest">

                <div className="testimonial-modal-avatar">
                  {getInitials(selectedReview.name)}
                </div>

                <div>

                  <h3>
                    {selectedReview.name || "Guest"}
                  </h3>

                  <p>
                    {formatDate(selectedReview.stayDate)}
                  </p>

                  <span>
                    A FLORIDA KEYS GUEST
                  </span>

                </div>

              </div>

              {/* PROPERTY */}

              <div className="testimonial-stayed-card">

                <span>STAYED AT</span>

                <h3>
                  {selectedReview.propertyTitle}
                </h3>

                <p>
                  <MapPin size={13} />
                  {selectedReview.propertyLocation}
                </p>

                <div className="testimonial-stay-date">
                  <CalendarDays size={13} />
                  {formatDate(selectedReview.stayDate)}
                </div>

              </div>

            </div>

            {/* CTA */}

            <button
              type="button"
              onClick={openProperty}
              className="testimonial-property-button"
            >
              VIEW PROPERTY
              <ArrowRight size={17} />
            </button>

          </div>

        </div>
      )}

    </>
  );
 }