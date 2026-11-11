
import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AmenitiesSection({ listing, amenitiesData }) {
  const [openIndex, setOpenIndex] = useState(null);

  // Get property image
  const getImageUrl = (photo) => {
    const base = (import.meta.env.VITE_API_URL || "")
      .replace(/\/api\/?$/, "")
      .replace(/\/$/, "");

    const url =
      typeof photo === "string"
        ? photo
        : photo?.url ||
          photo?.secure_url ||
          photo?.imageUrl ||
          photo?.path ||
          photo?.src ||
          "";

    if (!url) return "";

    if (/^https?:\/\//i.test(url)) return url;

    if (url.startsWith("/property/") || url.startsWith("/images/")) {
      return url;
    }

    return `${base}/${url.replace(/^\/+/, "")}`;
  };

  const propertyImage = useMemo(() => {
    const photos = listing?.photos || [];

    const validPhoto = photos.find((photo) => {
      const url =
        typeof photo === "string"
          ? photo
          : photo?.url ||
            photo?.secure_url ||
            photo?.imageUrl ||
            photo?.path ||
            photo?.src;

      return Boolean(url);
    });

    return validPhoto ? getImageUrl(validPhoto) : "";
  }, [listing?.photos]);

  // Only categories with selected amenities
  const categories = useMemo(() => {
    return (amenitiesData || [])
      .map((section) => ({
        ...section,
        selected: section.options.filter(
          (item) => listing?.amenities?.[item]
        ),
      }))
      .filter((section) => section.selected.length > 0);
  }, [amenitiesData, listing?.amenities]);

  return (
    <section
      id="amenities"
      className="
        w-full
        overflow-hidden
      
        px-4
        py-14
        scroll-mt-[90px]
        sm:px-6
        sm:py-16
        lg:scroll-mt-[150px]
        lg:px-10
        lg:py-20
      "
    >
      <div className="mx-auto w-full max-w-[1440px]">

        {/* TOP DECORATIVE LINE */}
        <div className="mx-auto mb-7 h-[2px] w-32 bg-[#C8884A] sm:w-48" />

        {/* HEADING */}
        <div className="mb-9 text-center sm:mb-12">
           <h2
            className="  text-[42px] font-[300] leading-[1.12] tracking-[-1.8px] text-[#152b3c] sm:text-5xl lg:text-[58px] xl:text-[68px] opacity-90"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Property{" "}
            <span className="italic text-[#D18B48]"style={{ fontFamily: "'Cormorant Garamond', serif" }}>
             Amenities
            </span>{" "}
            
          </h2>

           <p
              className="mt-8 mx-40 text-xl italic text-[#3a5160] sm:text-[18px]  font-[300]"
              style={{ fontFamily: "Georgia, serif" }}
            >
           All modern amenities to make your stay more comfortable. We are happy to help you in case anything is needed during your stay at the property.
          </p>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div
          className="
            grid
            grid-cols-1
            items-start
            gap-8
            sm:gap-10
            lg:grid-cols-2
            lg:gap-16
          "
        >

          {/* LEFT: AMENITIES ACCORDION */}
          <div className="flex min-w-0 flex-col gap-3">

            {categories.length > 0 ? (
              categories.map((section, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={section.title}
                    className="w-full overflow-hidden"
                  >
                    {/* ACCORDION HEADER */}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenIndex(isOpen ? null : index)
                      }
                      aria-expanded={isOpen}
                      className="
                        flex
                        min-h-[64px]
                        w-full
                        items-center
                        justify-between
                        gap-4
                        bg-[#C8884A]
                        px-5
                        py-4
                        text-left
                        text-white
                        transition-colors
                        duration-300
                        hover:bg-[#B9793E]
                        sm:min-h-[68px]
                        sm:px-7
                      "
                    >
                      <span
                        className="
                          text-base
                          font-medium
                          sm:text-lg
                          md:text-xl
                        "
                        style={{
                          fontFamily: "'Quicksand', sans-serif",
                        }}
                      >
                        {section.title}
                      </span>

                      <ChevronDown
                        size={23}
                        className={`
                          shrink-0
                          transition-transform
                          duration-300
                          ${isOpen ? "rotate-180" : "rotate-0"}
                        `}
                      />
                    </button>

                    {/* ACCORDION CONTENT */}
                    <div
                      className={`
                        grid
                        transition-[grid-template-rows]
                        duration-300
                        ease-in-out
                        ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
                      `}
                    >
                      <div className="overflow-hidden">
                        <div
                          className="
                            border
                            border-[#C8884A]/30
                            bg-white
                            px-5
                            py-5
                            sm:px-7
                          "
                        >
                          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {section.selected.map((item) => (
                              <li
                                key={item}
                                className="
                                  flex
                                  items-start
                                  gap-3
                                  text-sm
                                  leading-6
                                  text-[#52696D]
                                  sm:text-base
                                "
                                style={{
                                  fontFamily: "'Quicksand', sans-serif",
                                }}
                              >
                                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#C8884A]" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-gray-500">
                No amenities available for this property.
              </p>
            )}

          </div>

          {/* RIGHT: PROPERTY IMAGE */}
          <div
            className="
              relative
              min-w-0
              w-full
              overflow-hidden
              bg-[#DCE8EA]
              lg:sticky
              lg:top-28
            "
          >
            {propertyImage ? (
              <img
                src={propertyImage}
                alt={`${listing?.property?.title || "Property"} amenities`}
                loading="lazy"
                className="
                  block
                  aspect-[4/3]
                  h-auto
                  w-full
                  object-cover
                  object-center
                  transition-transform
                  duration-700
                  hover:scale-105
                  sm:aspect-[16/10]
                  lg:aspect-[4/5]
                  xl:aspect-[5/5]
                "
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center text-gray-500">
                Property image unavailable
              </div>
            )}

            {/* IMAGE OVERLAY */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* IMAGE CAPTION */}
            <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-7">
              <p className="text-xs font-medium uppercase tracking-[3px] text-white/80">
                Your Stay, Your Comfort
              </p>

              <h3
                className="mt-2 text-2xl font-medium sm:text-3xl"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Experience the Difference
              </h3>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
