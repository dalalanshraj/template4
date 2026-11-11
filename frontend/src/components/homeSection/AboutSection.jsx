
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import api from "../../api/axios";

export default function AboutSection() {
  const [images, setImages] = useState([]);
  const [owner, setOwner] = useState(null);

  const OWNER_ID = "6ab6aac6a7e7e82d7d700839";

  const fallbackImage = "/heroImg1.webp";

  // =====================================
  // IMAGE URL
  // =====================================

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return fallbackImage;

    if (path.startsWith("http")) return path;

    const base = import.meta.env.VITE_API_URL || "";

    return (
      base.replace(/\/$/, "") +
      "/" +
      path.replace(/^\//, "")
    );
  };

  // =====================================
  // FETCH GALLERY IMAGES
  // =====================================

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await api.get("/gallery/published");

        const savedSections = JSON.parse(
          localStorage.getItem("gallerySections") || "{}"
        );

        const galleryImages = Array.isArray(data)
          ? data
            .map((img) => ({
              ...img,
              sectionType:
                savedSections[img._id] ||
                img.sectionType ||
                "",
            }))
            .filter((img) => img.status === "published")
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          : [];

        setImages(galleryImages);
      } catch (err) {
        console.error("Gallery fetch error:", err);
      }
    };

    fetchImages();
  }, []);

  // =====================================
  // FETCH OWNER
  // =====================================

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const { data } = await api.get(
          `/profile/public/${OWNER_ID}`
        );

        setOwner(data);
      } catch (err) {
        console.error("Owner fetch error:", err);
      }
    };

    fetchOwner();
  }, []);

  // =====================================
  // GALLERY IMAGES
  // =====================================

  const galleryImages = useMemo(() => {
    return images.map((img) => getImageUrl(img.image));
  }, [images]);

  const collageImages = [
    galleryImages[0] || fallbackImage,
    galleryImages[1] || fallbackImage,
    galleryImages[2] || fallbackImage,
    galleryImages[3] || fallbackImage,
  ];

  // =====================================
  // OWNER DETAILS
  // =====================================

  const ownerName =
    owner?.name ||
    [owner?.firstName, owner?.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Your Hosts";

  const ownerImage = getImageUrl(
    owner?.image ||
    owner?.profileImage ||
    owner?.photo ||
    owner?.avatar
  );

  return (
    <section className="relative overflow-hidden bg-[#f7f9f9] py-16 sm:py-20 lg:py-28">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#dce9e8]/40 blur-3xl" />

      <div className="relative mx-auto max-w-[1450px] px-5 sm:px-8 lg:px-12">

        {/* =====================================
            TOP SECTION
        ===================================== */}

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">

          {/* LEFT: STORY CONTENT */}

          <div className="order-2 lg:order-1">

            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-10 bg-[#c99558]" />
              <span className="text-[11px] font-semibold uppercase tracking-[5px] text-[#bd8246]">
                Our Story
              </span>
            </div>

            <h2
              className="max-w-[700px] text-[42px] font-[300] leading-[1.12] tracking-[-1.8px] text-[#152b3c] sm:text-5xl lg:text-[58px] xl:text-[68px]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              A beautiful place
              <br className="hidden sm:block" />
              to slow down,
              <br />
              <span className="italic font-[300] text-[#315f6c]"style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Unwind & reconnect.
              </span>
            </h2>
            <p
              className="mt-8 text-xl italic text-[#000] sm:text-2xl opacity-60"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Welcome — your coastal escape awaits.
            </p>

            <div className="mt-8 max-w-[680px] space-y-5 text-[15px] leading-[1.95] text-[#52697a] sm:text-base lg:text-[17.5px]">

              <p
                className="text-[15px] leading-[1.95]  text-[#52697a] sm:text-base lg:text-[17px] opacity-90 opacity-90"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                Discover a relaxing beachfront getaway in Blue Mountain
                Beach, along the beautiful and iconic Highway 30A.
                Thoughtfully designed for comfort, our recently updated
                condo offers the perfect setting for families and friends
                to spend quality time together.
              </p>

              <p
                className="text-[15px] leading-[1.95] text-[#52697a] sm:text-base lg:text-[17px] opacity-90"
                style={{ fontFamily: "'Manrope', sans-serif" }}
              >
                With three bedrooms and three full bathrooms, the
                property comfortably accommodates up to nine guests.
                From peaceful mornings to relaxing evenings, every
                detail is designed to make your stay comfortable
                and memorable.
              </p>

            </div>

          </div>

          {/* RIGHT: IMAGE COLLAGE */}

          <div className="order-1 lg:order-2">

            <div className="relative">

              {/* Decorative Circle */}

              <div className="absolute -right-4 -top-5 z-0 h-24 w-24 rounded-full border border-[#d2a36e] sm:-right-5 sm:-top-6 sm:h-28 sm:w-28" />

              {/* Main Image */}

              <div className="group relative z-10 h-[280px] overflow-hidden rounded-md sm:h-[400px] lg:h-[440px]">

                <img
                  src={collageImages[0]}
                  alt="Beachfront vacation property"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#102d3b]/70 via-transparent to-transparent" />

                <div className="absolute left-5 top-5">
                  <span className="inline-flex items-center gap-2 bg-[#d9b17c] px-4 py-2 text-[10px] font-semibold uppercase tracking-[2px] text-[#173244]">
                    <Sparkles size={12} />
                    Welcome to the coast
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[4px] text-white/80">
                    Your coastal retreat
                  </p>

                  <h3
                    className="mt-2 text-2xl italic text-white sm:text-3xl"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Comfort, views & relaxation
                  </h3>
                </div>

              </div>

              {/* Three Small Images */}

              <div className="relative z-10 mt-3 grid grid-cols-3 gap-3">

                {collageImages.slice(1).map((image, index) => {
                  const labels = [
                    "Beach Views",
                    "Relax & Unwind",
                    "Coastal Living",
                  ];

                  return (
                    <div
                      key={index}
                      className="group relative h-[115px] overflow-hidden rounded-md sm:h-[155px] lg:h-[165px]"
                    >
                      <img
                        src={image}
                        alt={labels[index]}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#102d3b]/70 to-transparent" />

                      <span className="absolute bottom-3 left-2 right-2 text-center text-[8px] font-semibold uppercase tracking-[1.5px] text-white sm:text-[10px]">
                        {labels[index]}
                      </span>
                    </div>
                  );
                })}

              </div>

            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[10px] italic tracking-wider text-[#718695] sm:gap-5 sm:text-xs">
              <span>Relax & Recharge</span>
              <span className="text-[#c99558]">✦</span>
              <span>Coastal Memories</span>
              <span className="text-[#c99558]">✦</span>
              <span>Made for You</span>
            </div>

          </div>

        </div>

        {/* =====================================
            STORY + PROMISE
        ===================================== */}

        <div className="mt-20 grid grid-cols-1 items-center gap-12   pt-12 lg:mt-2 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:pt-16">

          {/* STORY CONTINUATION */}

          <div className="space-y-6 text-[15px] leading-[1.95] text-[#52697a] sm:text-base lg:text-[17px] opacity-90">

            <p
              className="text-[15px] leading-[1.95] text-[#52697a] sm:text-base lg:text-[17px] opacity-90"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Located along the beautiful 30A coastline, Blue Mountain
              Beach offers a wonderful blend of peaceful surroundings,
              beautiful Gulf views and the charm of a coastal community.
              It is a place where you can enjoy the beach, explore the
              local area and simply take time for yourself.
            </p>

            <p
              className="text-[15px] leading-[1.95] text-[#52697a] sm:text-base lg:text-[17px] opacity-90"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Our goal is simple: to provide a welcoming place where
              guests can feel at home while enjoying everything the
              coast has to offer. Whether you are planning a family
              vacation, a getaway with friends or a relaxing beach
              escape, we want your stay to be special.
            </p>

            <p
              className="text-[15px] leading-[1.95] text-[#52697a] sm:text-base lg:text-[17px] opacity-90"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Three bedrooms. Three full bathrooms. Room for up to
              nine guests. One memorable coastal getaway.
            </p>

            <div className="flex flex-wrap gap-3 pt-3">

              {[
                "Beachfront Living",
                "Family Friendly",
                "Made for Relaxation",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#c9d8df] bg-[#edf3f5] px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[1.9px] text-[#315c70] sm:text-[10px]"
                >
                  <span className="mr-2 text-[#c99558]">✦</span>
                  {item}
                </span>
              ))}

            </div>

          </div>

          {/* PROMISE CARD */}

          <div className="relative overflow-hidden rounded-lg border border-[#e4d8c6] bg-gradient-to-br from-[#fbf8f1] to-[#eef3f3] px-6 py-10 shadow-[0_15px_50px_rgba(30,55,65,0.06)] sm:px-10 sm:py-12">

            {/* Decorative Corners */}

            <div className="absolute left-4 top-4 h-8 w-8 border-l border-t border-[#d6a66e]" />
            <div className="absolute bottom-4 right-4 h-8 w-8 border-b border-r border-[#d6a66e]" />

            <div className="text-center">

              <div className="mb-6 flex items-center justify-center gap-4">
                <span className="h-px w-8 bg-[#c99558]" />
                <span className="text-[10px] font-semibold uppercase tracking-[4px] text-[#c99558]">
                  The Promise
                </span>
                <span className="h-px w-8 bg-[#c99558]" />
              </div>

              <p
                className="mx-auto max-w-[500px] font-light text-xl italic leading-relaxed text-[#29485b] sm:text-2xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Every detail is designed to make your stay
                <span className="text-[#c99558]"> comfortable </span>
                and your time at the beach
                <span className="text-[#c99558]"> unforgettable.</span>
              </p>

              <div className="mx-auto my-8 flex items-center justify-center gap-2">
                <span className="h-px w-8 bg-[#d4b28b]" />
                <Sparkles size={15} className="text-[#c99558]" />
                <span className="h-px w-8 bg-[#d4b28b]" />
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-5">

                <div>
                  <h3
                    className="text-3xl italic text-[#315f6c] sm:text-4xl"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    3
                  </h3>
                  <p className="mt-2 text-[9px] font-semibold uppercase leading-relaxed tracking-[1.5px] text-[#52697a] sm:text-[10px]">
                    Bedrooms
                  </p>
                </div>

                <div>
                  <h3
                    className="text-3xl italic text-[#315f6c] sm:text-4xl"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    9
                  </h3>
                  <p className="mt-2 text-[9px] font-semibold uppercase leading-relaxed tracking-[1.5px] text-[#52697a] sm:text-[10px]">
                    Guest Capacity
                  </p>
                </div>

                <div>
                  <h3
                    className="text-3xl italic text-[#315f6c] sm:text-4xl"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    3
                  </h3>
                  <p className="mt-2 text-[9px] font-semibold uppercase leading-relaxed tracking-[1.5px] text-[#52697a] sm:text-[10px]">
                    Full Baths
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            HOST INTRODUCTION
        ===================================== */}

        <div className="mt-16 border-t border-[#dce3e5] pt-10 sm:mt-20 sm:pt-12">

          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">

            {/* Owner Image */}

            <div className="flex shrink-0 items-center justify-center sm:justify-start">

              <div className="h-[100px] w-[100px] overflow-hidden rounded-2xl border-[5px] border-white shadow-lg sm:h-[115px] sm:w-[115px]">
                <img
                  src={ownerImage}
                  alt={ownerName}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

            </div>

            {/* Owner Details */}

            <div className="text-center sm:text-left">

              <p
                className="text-lg italic text-[#c99558]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                With warmth,
              </p>

              <h3
                className="mt-1 text-2xl text-[#193449] sm:text-3xl"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {ownerName}
              </h3>

              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[3px] text-[#315f91] sm:text-[10px]">
                Your Hosts & Your Neighbors
              </p>

            </div>

          </div>

          <div className="mt-7 max-w-[850px] border-l border-[#e3c9aa] pl-6 sm:ml-2 sm:pl-10">

            <p
              className="text-base italic leading-[2] text-[#657c8d] sm:text-lg"
              style={{ fontFamily: "Georgia, serif" }}
            >
              We believe a great vacation is about more than just
              where you stay. It is about the little details, the
              comfortable moments and the memories you take home.
              We look forward to welcoming you and helping make
              your coastal getaway truly special.
            </p>

          </div>

          {/* Bottom Link */}

          <div className="mt-10 flex justify-center sm:justify-start">
            <a
              href="/contact"
              className="group inline-flex items-center gap-3 border-b border-[#c99558] pb-2 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#315f6c] transition-colors hover:text-[#c99558]"
            >
              Get in touch with us
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
