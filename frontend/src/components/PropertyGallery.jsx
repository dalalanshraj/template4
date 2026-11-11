
import { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {
  Images,
  ArrowUpRight,
} from "lucide-react";

const fallbackImages = [
  "/property/property1.jpg",
  "/property/property2.jpg",
  "/property/property3.jpg",
  "/property/property4.jpg",
  "/property/property5.jpg",
];

const navigationItems = [
  { title: "Description", id: "description" },
  { title: "Pictures", id: "pictures" },
  { title: "Amenities", id: "amenities" },
  { title: "Location", id: "location" },
  { title: "Video", id: "videos" },
  { title: "Availability", id: "availability" },
  { title: "Reviews", id: "reviews" },
];

export default function PropertyGallery({ images = [] }) {
  const [open, setOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

const getImageUrl = (photo) => {
  const base = import.meta.env.VITE_API_URL || "";

  // Remove /api from backend URL
  const backendBase = base
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  let url = "";

  if (typeof photo === "string") {
    url = photo;
  } else {
    url =
      photo?.url ||
      photo?.secure_url ||
      photo?.imageUrl ||
      photo?.path ||
      photo?.src ||
      photo?.filename ||
      photo?.image ||
      "";
  }

  if (!url) return fallbackImages[0];

  // Already complete URL
  if (url.startsWith("http")) {
    return url;
  }

  // Frontend public folder images
  if (
    url.startsWith("/property/") ||
    url.startsWith("/images/")
  ) {
    return url;
  }

  // Backend uploaded images
  return `${backendBase}/${url.replace(/^\/+/, "")}`;
};

  const galleryImages = useMemo(() => {
    const validImages = images
      .map(getImageUrl)
      .filter(Boolean);

    return validImages.length ? validImages : fallbackImages;
  }, [images]);

  const slides = galleryImages.map((src) => ({ src }));

  const openLightbox = (index) => {
    setActiveImage(index);
    setOpen(true);
  };

  return (
    <>
      {/* PROPERTY GALLERY */}
      <section
        id="pictures"
        className="w-full bg-[#F3F7FA] px-3 pb-5 pt-4 sm:px-5 lg:px-6"
      >
        <div className="mx-auto max-w-[1600px]">

          <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-xl sm:gap-3 xl:h-[550px] xl:grid-cols-4 xl:grid-rows-2">

            {/* MAIN IMAGE */}
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="group relative col-span-2 row-span-1 min-h-[260px] overflow-hidden sm:min-h-[350px] xl:row-span-2"
            >
              <img
                src={galleryImages[0]}
                alt="Property Images"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

              <span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-md bg-white px-4 py-3 text-[10px] font-bold tracking-[1.5px] text-[#191A2C] shadow-lg transition group-hover:bg-[#D18B48] group-hover:text-white sm:bottom-7 sm:left-7">
                <Images size={16} />
                VIEW ALL {galleryImages.length} PHOTOS
              </span>
            </button>

            {/* FOUR SMALL IMAGES */}
            {galleryImages.slice(1, 5).map((image, index) => (
              <button
                type="button"
                key={`${image}-${index}`}
                onClick={() => openLightbox(index + 1)}
                className="group relative min-h-[135px] overflow-hidden sm:min-h-[200px] xl:min-h-0"
              >
                <img
                  src={image}
                  alt={`Property view ${index + 2}`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />

                {index === 3 && galleryImages.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/45 text-white">
                    <span className="text-xs font-bold tracking-widest">
                      +{galleryImages.length - 5} PHOTOS
                    </span>
                  </div>
                )}
              </button>
            ))}

          </div>
        </div>
      </section>
 
      {/* LIGHTBOX */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={activeImage}
        on={{
          view: ({ index }) => setActiveImage(index),
        }}
      />
    </>
  );
}
