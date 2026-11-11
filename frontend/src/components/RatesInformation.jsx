import React, { useMemo } from "react";
import {
  CreditCard,
  Wallet,
  KeyRound,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

export default function RatesInformation({ listing }) {
  const rates = listing?.rates || [];
  const extraFees = listing?.extraFees || [];

  // Starting nightly price
  const startingPrice = useMemo(() => {
    const prices = rates
      .map((rate) => Number(rate.nightly))
      .filter((price) => Number.isFinite(price) && price > 0);

    return prices.length ? Math.min(...prices) : null;
  }, [rates]);

  // Minimum stay
  const minimumStay = useMemo(() => {
    const values = rates
      .map((rate) => Number(rate.minNights))
      .filter((value) => value > 0);

    return values.length ? Math.min(...values) : null;
  }, [rates]);

  // Format currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  // Format dates
  const formatDate = (value) => {
    if (!value) return "";

    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  // Get image
  const getImageUrl = (photo) => {
    if (!photo) return "";

    const base = (import.meta.env.VITE_API_URL || "")
      .replace(/\/api\/?$/, "")
      .replace(/\/$/, "");

    const url =
      typeof photo === "string"
        ? photo
        : photo.url ||
          photo.secure_url ||
          photo.imageUrl ||
          photo.path ||
          photo.src ||
          "";

    if (!url) return "";

    if (/^https?:\/\//i.test(url)) return url;

    if (url.startsWith("/property/") || url.startsWith("/images/")) {
      return url;
    }

    return `${base}/${url.replace(/^\/+/, "")}`;
  };

  const propertyImage = getImageUrl(listing?.photos?.[0]);

  const scrollToAvailability = () => {
    document.getElementById("availability")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
   <section
  id="rates"
  className="
  relative
  left-1/2
  w-screen
  -translate-x-1/2
  scroll-mt-24
  overflow-hidden
  bg-[#171D2A]
  px-5
  py-14
  sm:px-8
  sm:py-16
  lg:px-12
  lg:py-20
"
>
    <div className="
  mx-auto
  grid
  w-full
  max-w-[1440px]
  grid-cols-1
  items-stretch
  gap-10
  lg:grid-cols-[1.3fr_1fr]
  lg:gap-12
">
        {/* LEFT: RATES INFORMATION */}
        <div className="flex flex-col">
          <div className="mb-10">
           
            <h2
  className="text-4xl font-light leading-tight text-white sm:text-5xl"
  style={{ fontFamily: "'Cormorant Garamond', serif" }}
>
  Rates Information
</h2>

            <div className="mt-5 h-[3px] w-24 bg-gradient-to-r from-[#C8884A] to-transparent" />
          </div>

          {/* NIGHTLY PRICE */}
          <div className="mb-8 flex items-center gap-5">
            <CreditCard size={32} className="shrink-0 text-white" />

            <div>
             <p className="text-2xl font-medium text-white sm:text-3xl">
                {startingPrice !== null
                  ? `From ${formatCurrency(startingPrice)} Per NIGHT`
                  : "Contact Us For Rates"}
              </p>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-8 space-y-3 text-sm leading-7 sm:text-base">
            <p className="text-[#72BD43]">
              Our rates vary depending on the season and the length of your
              stay. Please select your dates to get an{" "}
              <span className="font-semibold italic">EXACT QUOTE.</span>
            </p>

            <p className="font-medium text-yellow-400">
              Discounts on longer stays.
            </p>
          </div>

          {/* EXTRA FEES */}
          <div className="space-y-7">
            {extraFees.map((fee, index) => {
              const isPercentage = fee.type === "%";

              return (
                <div key={`${fee.name}-${index}`}>
                  <div className="flex flex-wrap items-center gap-4 sm:gap-7">
                    <Wallet size={31} className="shrink-0 text-white" />

                  <h3 className="min-w-[120px] text-xl font-medium text-white sm:text-2xl">
                      {fee.name}
                    </h3>
<p className="text-xl font-medium text-white sm:text-2xl">
                      {isPercentage
                        ? `${fee.value}%`
                        : formatCurrency(fee.value)}
                    </p>
                  </div>

                  {fee.option === "optional" && (
                    <p className="ml-12 mt-2 text-xs text-[#D49A63]">
                      Optional fee
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* MINIMUM STAY */}
          {minimumStay !== null && (
            <div className="mt-9">
              <div className="flex flex-wrap items-center gap-5 sm:gap-7">
                <KeyRound size={31} className="shrink-0 text-white" />

              <h3 className="min-w-[120px] text-xl font-medium text-white sm:text-2xl">
                  Minimum Stay
                </h3>

                <p className="text-xl font-medium text-white sm:text-2xl">
                  {minimumStay} Nights
                </p>
              </div>

              <p className="ml-12 mt-4 text-sm leading-7 text-[#D49A63]">
                Minimum stay requirements may vary by season.
              </p>
            </div>
          )}

          {/* SEASONAL RATES */}
          {rates.length > 0 && (
            <div className="mt-12">
              <div className="mb-5 flex items-center gap-3">
                <CalendarDays size={22} className="text-[#C8884A]" />

                <h3
                  className="text-2xl font-medium text-white"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Seasonal Rates
                </h3>
              </div>

              <div className="space-y-3">
                {rates.map((rate, index) => (
                  <div
                    key={`${rate.season}-${index}`}
                    className="rounded-xl border border-white/10 bg-white/[0.04] p-4 transition duration-300 hover:border-[#C8884A]/60 hover:bg-white/[0.07]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-base font-semibold text-[#E5B47D]">
                        {rate.season || `Season ${index + 1}`}
                      </h4>

                      <span className="text-xs text-gray-400">
                        {formatDate(rate.from)} – {formatDate(rate.to)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div>
                       <p className="text-2xl font-medium text-white sm:text-3xl">
                          Nightly
                        </p>
                   <p className="text-xl font-medium text-white sm:text-2xl">
                          {formatCurrency(rate.nightly)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">
                          Weekly
                        </p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          {formatCurrency(rate.weekly)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">
                          Monthly
                        </p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          {formatCurrency(rate.monthly)}
                        </p>
                      </div>
                    </div>

                    {rate.minNights > 0 && (
                     <p className="text-xl font-medium text-white sm:text-2xl">
                        Minimum {rate.minNights} nights
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            onClick={scrollToAvailability}
            className="mt-10 flex w-fit items-center justify-center gap-3 rounded-full bg-[#C8884A] px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_10px_35px_rgba(200,136,74,0.35)] transition duration-300 hover:-translate-y-1 hover:bg-[#D99A5B] sm:px-10"
          >
            GET INSTANT QUOTE
            <ArrowRight size={18} />
          </button>
        </div>

        {/* RIGHT: PROPERTY IMAGE */}
      <div className="
  relative
  mx-auto
  w-full
  max-w-[580px]
  lg:max-w-none
  lg:h-full
  lg:min-h-[650px]
">
  {/* Top decorative corner */}
  <div className="absolute -right-3 -top-3 z-10 h-16 w-16 border-r-2 border-t-2 border-[#C8884A] sm:-right-4 sm:-top-4" />

  {/* Image */}
  <div className="
    relative
    h-[420px]
    w-full
    overflow-hidden
    border-4
    border-[#C8884A]
    bg-[#243342]
    sm:h-[550px]
    lg:h-full
    lg:min-h-[650px]
  ">
    {propertyImage ? (
      <img
        src={propertyImage}
        alt={`${listing?.property?.title || "Property"} rates`}
        loading="lazy"
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          object-center
          transition-transform
          duration-700
          hover:scale-105
        "
      />
    ) : (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Property image unavailable
      </div>
    )}

    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
  </div>

  {/* Bottom decorative corner */}
  <div className="absolute -bottom-3 -left-3 z-10 h-16 w-16 border-b-2 border-l-2 border-[#C8884A] sm:-bottom-4 sm:-left-4" />
</div>
      </div>
    </section>
  );
}
