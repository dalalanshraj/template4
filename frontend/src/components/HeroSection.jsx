
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../api/axios";
import {
  
  ArrowUpRight,
  BedDouble,
  Bath,
  Users,
  MapPin,
} from "lucide-react";

// ==========================================
// MANUAL PROPERTY VIDEOS
// Add your property video paths here.
// Keys must match property title slugs.
// ==========================================

const PROPERTY_VIDEOS = {
  "million-dollar-view": "/million-dollar-view.mp4",
  "horizon": "/horizon.mp4",
  "ocean-dream": "/ocean-dream.mp4",
  "ocean-panorama": "/ocean-panorama.mp4",
};

const FALLBACK_IMAGE = "/images/hero-fallback.webp";

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function HeroSection() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/listings/published");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.listings ||
            res.data?.properties ||
            [];
console.log("ALL PROPERTIES:", data);

console.log(
  "FIRST PROPERTY PHOTOS:",
  data[0]?.photos
);

console.log(
  "FIRST PHOTO:",
  data[0]?.photos?.[0]
);
        setProperties(data.slice(0, 4));
      } catch (error) {
        console.error("Property fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Active property
  const activeProperty = properties[activeIndex];

  // Get property title
  const getTitle = (property) =>
    property?.property?.title || "Florida Keys Rentals";

  // Get property image
 const getImage = (property) => {
  const photos = property?.photos;

  if (!photos || photos.length === 0) {
    return FALLBACK_IMAGE;
  }

  const photo = photos[0];

  let imageUrl = "";

  if (typeof photo === "string") {
    imageUrl = photo;
  } else {
    imageUrl =
      photo?.url ||
      photo?.secure_url ||
      photo?.imageUrl ||
      photo?.path ||
      photo?.src ||
      "";
  }

  if (!imageUrl) return FALLBACK_IMAGE;

  // Absolute URL
  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:")
  ) {
    return imageUrl;
  }

  // Relative backend image path
  const baseURL = api.defaults.baseURL?.replace(/\/api\/?$/, "") || "";

  return `${baseURL}/${imageUrl.replace(/^\/+/, "")}`;
};

  // Manually assigned video
  const activeVideo = useMemo(() => {
    if (!activeProperty) return "";

    const titleSlug = slugify(getTitle(activeProperty));

    return PROPERTY_VIDEOS[titleSlug] || "";
  }, [activeProperty]);

  // Reset video error when property changes
  useEffect(() => {
    setVideoError(false);
  }, [activeVideo]);

  // Select property on hover
  const handleHover = (index) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Property details
  const handlePropertyClick = (property, index) => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      if (activeIndex !== index) {
        setActiveIndex(index);
        return;
      }
    }

    if (property?._id) {
      navigate(`/property/${property._id}`);
    }
  };

  // Loading
  if (loading) {
    return (
      <section className="min-h-screen animate-pulse bg-[#092B37]" />
    );
  }

  if (!properties.length) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[#092B37] text-white">
        No published properties found.
      </section>
    );
  }

  return (
    <section className="
      relative isolate w-full overflow-hidden
      bg-[#092B37] text-white
      min-h-[1050px]
      lg:min-h-[1000px]
    ">

      {/* ==================================
          BACKGROUND VIDEO
      =================================== */}

      <div className="absolute inset-0 z-0 overflow-hidden">

        {activeVideo && !videoError ? (
          <video
            key={activeVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={getImage(activeProperty)}
            onError={() => setVideoError(true)}
            className="h-full w-full object-cover"
          >
            <source src={activeVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            key={getImage(activeProperty)}
            src={getImage(activeProperty)}
            alt={getTitle(activeProperty)}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
            className="h-full w-full object-cover"
          />
        )}

      </div>

      {/* ==================================
          VIDEO OVERLAY
      =================================== */}

      <div className="
        absolute inset-0 z-[1]
        bg-black/15
      " />

      <div className="
        absolute inset-0 z-[1]
        bg-gradient-to-b
        from-black/15 via-transparent
        to-[#061D27]/90
      " />

      {/* ==================================
          TOP MARQUEE
          Navbar occupies first 190px.
      =================================== */}

      <div className="
        relative z-20
        mt-[168px]
        h-[40px] w-full
        overflow-hidden
        border-y border-white/30
        bg-black/25
        backdrop-blur-sm
      ">

        <div className="hero-marquee flex h-full w-max items-center">

          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex h-full shrink-0 items-center "
            >
              {[
                ["FLORIDA KEYS", "State Park & Kiteboarding"],
                ["SUNSET BAY", "Grassy Key Sunsets"],
                ["OVERSEAS HIGHWAY", "The Road to Paradise"],
                ["MARATHON", "Discover Island Life"],
              ].map(([title, subtitle]) => (
                <div
                  key={title}
                  className="
                    flex items-center gap-8
                    px-8 sm:gap-12 sm:px-14
                  "
                >
                  <span className="
                    whitespace-nowrap
                    text-[11px] font-semibold
                    tracking-[0.25em]
                    sm:text-sm
                  ">
                    {title}
                  </span>

                  <span className="
                    whitespace-nowrap
                    font-serif text-base italic
                    text-white/90 sm:text-xl
                  ">
                    {subtitle}
                  </span>

                  <span className="text-xl text-[#A9DCEB]">
                    ✦
                  </span>
                </div>
              ))}
            </div>
          ))}

        </div>
      </div>

      {/* ==================================
          MAIN CONTENT
      =================================== */}

      <div className="
        relative z-10 mx-auto
        flex w-full max-w-[1800px]
        flex-col
        px-5 pb-[165px]
        pt-8 sm:px-10
        lg:px-[4%]
      ">

        {/* Heading */}

        <div className="mb-8">

          <p className="
            mb-3 text-[11px]
            font-medium tracking-[0.35em]
            text-white/85 sm:text-sm
          ">
            TAKE ME TO THE KEYS
          </p>

          <h1 className="
            font-serif font-normal
            leading-[1.05]
            font-[300] 
            tracking-tight
            text-[clamp(38px,5.2vw,86px)]
            drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]
          " style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Where the Horizon

            <span className="
              mt-1 block italic font-[300]
              text-[#E8C68F]
            "style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Never Says Goodbye.
            </span>
          </h1>

          {/* Dynamic property name */}

          <div className="mt-3 min-h-[45px]">

            <h2
              key={activeProperty?._id}
              className="
                animate-[fadeIn_0.5s_ease]
                font-serif italic
                font-[300]
                text-xl text-white
                sm:text-3xl
              "style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {getTitle(activeProperty)}
            </h2>

          </div>
        </div>

        {/* ==================================
            PROPERTY CARDS
        =================================== */}

       
{/* =====================================
    INTERACTIVE PROPERTY CARDS
===================================== */}

    
{/* =====================================
    LUXURY PROPERTY CARDS
===================================== */}

<div className="
  mt-auto grid
  grid-cols-2 gap-3
  sm:gap-5
  lg:grid-cols-4 lg:gap-6
">

  {properties.map((property, index) => {

    const image = getImage(property);
    const title = getTitle(property);
    const isActive = activeIndex === index;

    const bedrooms = property.property?.bedrooms || 0;
    const bathrooms = property.property?.bathrooms || 0;
    const sleeps = property.property?.maxSleeps || 0;

    const location =
      property.location?.city || "Florida Keys";

    return (
      <article
        key={property._id}
        onMouseEnter={() => handleHover(index)}
        onFocus={() => handleHover(index)}
        className={`
          luxury-property-card
          group relative
          h-[250px]
          sm:h-[320px]
          lg:h-[min(43vh,410px)]
          ${
            isActive
              ? "luxury-card-active"
              : ""
          }
        `}
      >

        {/* FULL PROPERTY IMAGE */}

        <img
          src={image}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="luxury-card-image"
        />

        {/* IMAGE OVERLAY */}

        <div className="luxury-card-overlay" />

        {/* TOP INFORMATION */}

        <div className="luxury-card-top">

          <span className="luxury-card-category">
            {property.property?.category || "LUXURY RENTAL"}
          </span>

          <span className="luxury-card-number">
            0{index + 1}
          </span>

        </div>

        {/* ACTIVE INDICATOR */}

        {isActive && (
          <div className="luxury-active-line" />
        )}

        {/* BOTTOM CONTENT */}

        <div className="luxury-card-content">

          {/* Location */}

          <div className="luxury-location">
            <MapPin size={12} />
            <span>{location}</span>
          </div>

          {/* Property Title */}

          <h3 className="luxury-card-title">
            {title}
          </h3>

          {/* Property Details */}

          <div className="luxury-card-details">

            <div className="luxury-detail">
              <BedDouble size={15} />
              <span>{bedrooms} BR</span>
            </div>

            <span className="luxury-divider" />

            <div className="luxury-detail">
              <Bath size={15} />
              <span>{bathrooms} BA</span>
            </div>

            <span className="luxury-divider" />

            <div className="luxury-detail">
              <Users size={15} />
              <span>{sleeps} Guests</span>
            </div>

          </div>

          {/* BUTTON */}

          <button
            type="button"
            onClick={() =>
              handlePropertyClick(property, index)
            }
            className="luxury-card-button"
          >
            <span>EXPLORE PROPERTY</span>

            <span className="luxury-button-icon">
              <ArrowUpRight size={17} />
            </span>
          </button>

        </div>

      </article>
    );
  })}

</div>

      </div>

      {/* ==================================
          BOTTOM BOOKING BAR
      =================================== */}

      <div className="
        absolute bottom-0 left-0
        z-30 w-full
        border-t border-white/20
        bg-[#092B37]/90
        backdrop-blur-xl
      ">

        <div className="
          mx-auto grid max-w-[1800px]
          grid-cols-1 items-center
          gap-4 px-5 py-4
          sm:px-10
          lg:grid-cols-[1fr_1.5fr_1fr]
          lg:px-[4%] lg:py-5
        ">

          {/* Left information */}

          <div className="hidden lg:block">

            <p className="
              font-serif text-lg italic
              text-[#E8C68F]
            ">
              Direct Booking
              <span className="text-white/80">
                {" "}· No Booking Fees · Stunning
              </span>
            </p>

            <p className="
              mt-1 font-serif text-base
              italic text-white/80
            ">
              Florida Keys Homes
            </p>

          </div>

          {/* Center button */}

          <div className="text-center">

            <p className="
              mb-3 text-[9px]
              font-semibold
              tracking-[0.2em]
              text-[#B5D8E5]
              sm:text-xs
            ">
              TAKE ME TO THE KEYS · FLORIDA KEYS OCEANFRONT RENTALS
            </p>

            <button
              type="button"
              onClick={() => {
                if (activeProperty?._id) {
                  navigate(`/property/${activeProperty._id}`);
                }
              }}
              className="
                flex min-h-[52px]
                w-full max-w-[290px]
                mx-auto items-center
                justify-center gap-3
                bg-[#DDB783]
                px-6
                text-[11px] font-semibold
                tracking-[0.2em]
                text-white
                transition-all duration-300
                hover:bg-[#BD955F]
              "
            >
              CHECK AVAILABILITY
              <ArrowRight size={16} />
            </button>

          </div>

          {/* Right information */}

          <div className="
            hidden items-center
            justify-end gap-5
            lg:flex
          ">

            {[
              [String(properties.length), "VACATION HOMES"],
              ["Direct", "FROM OWNER"],
              ["Curated", "HOSPITALITY"],
            ].map(([title, subtitle]) => (
              <div
                key={subtitle}
                className="
                  border-l border-white/30
                  pl-4
                "
              >
                <p className="
                  font-serif text-lg
                  italic text-[#B5D8E5]
                ">
                  {title}
                </p>

                <p className="
                  text-[9px]
                  tracking-[0.15em]
                  text-white/80
                ">
                  {subtitle}
                </p>
              </div>
            ))}

          </div>

        </div>
      </div>

    </section>
  );
}
