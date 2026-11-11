import { Link } from "react-router-dom";
import ThingsToDoSection from "../components/homeSection/ActivitiesSection.jsx";
export default function ThingsToDo() {
  const places = [
    {
      category: "THE ICON",
      title: "Old Seven Mile",
      highlight: "Bridge",
      description:
        "One of the longest bridges in North America, and the single most photographed stretch of road in the Keys. The original 1912 span — once part of Henry Flagler’s railroad.",
      image: "https://content.app-sources.com/s/24618439467748482/uploads/Image_URLs/Seven_Mile_Bridge_Attractions-6009063.jpg",
    },
    {
      category: "FIVE-ACRE TIME CAPSULE",
      title: "Pigeon Key",
      highlight: "Historic District",
      description:
        "A tiny island that once housed over four hundred workers building Flagler’s railroad in the early 1900s — now a preserved historic district reachable by tram or boat.",
      image: "https://content.app-sources.com/s/24618439467748482/uploads/Image_URLs/Pigeon_Key_Historic_District_Attractions-6009212.jpg",
    },
    {
      category: "A WORKING MARINE FAMILY",
      title: "Dolphin Research",
      highlight: "Center",
      description:
        "A nonprofit home to a family of rescued dolphins and sea lions on Grassy Key — not a marine park, a marine family.",
      image: "https://content.app-sources.com/s/24618439467748482/uploads/Image_URLs/Dolphin_Research_Center_Attractions-6008945.jpg",
    },
    {
      category: "UNDER THE WATER",
      title: "Sombrero Reef",
      highlight: "Sanctuary",
      description:
        "Explore beautiful coral formations and tropical marine life in one of the Florida Keys' most memorable snorkeling destinations.",
      image: "https://content.app-sources.com/s/24618439467748482/uploads/Attractions_URLs/The_Turtle_Hospital-6017774.webp",
    },
    {
      category: "NATURE & WILDLIFE",
      title: "Turtle Hospital",
      highlight: "Marathon",
      description:
        "Discover the inspiring rescue and rehabilitation work helping injured sea turtles return to their natural ocean home.",
      image: "https://content.app-sources.com/s/24618439467748482/uploads/Attractions_URLs/Florida_Keys_Aquarium_Encounters-6017770.webp",
    },
    {
      category: "ISLAND ADVENTURE",
      title: "Bahia Honda",
      highlight: "State Park",
      description:
        "Enjoy turquoise waters, beautiful sandy beaches, scenic views and unforgettable outdoor experiences in the Florida Keys.",
      image: "https://content.app-sources.com/s/24618439467748482/uploads/Attractions_URLs/Crane_Point_Museum__Nature_Center-6017769.webp",
    },
  ];

  return (
    <>
      {/* =========================================
                    HERO
      ========================================= */}

      <section
        className="relative w-full overflow-hidden bg-cover bg-center bg-no-repeat mt-46"
        style={{
          backgroundImage:
            "url('https://content.app-sources.com/s/24618439467748482/uploads/Image_URLs/Seven_Mile_Bridge_Attractions-6009063.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-[#092536]/45" />
        <div
          className="
  relative z-10 mx-auto flex min-h-[360px] w-full max-w-[1600px]
  flex-col items-center justify-center
  px-5 py-16 text-center
  sm:min-h-[420px] sm:px-8 sm:py-20
  lg:min-h-[590px] lg:px-12
"
        >
          {/* Top eyebrow */}
          <div className="mb-7 flex items-center justify-center gap-4 sm:mb-9">
            <span className="h-px w-8 bg-[#F6D2B9] sm:w-12" />

            <p
              className="
        text-[9px] font-semibold uppercase
        tracking-[3px] text-[#F6D2B9]
        sm:text-[11px] sm:tracking-[5px]
      "
            >
              MARATHON · MIDDLE KEYS · FLORIDA KEYS
            </p>

            <span className="h-px w-8 bg-[#F6D2B9] sm:w-12" />
          </div>

          {/* Main Heading */}
          <h1
            className="
        max-w-6xl text-4xl font-light
        leading-[1.15] tracking-[-1px]
        text-white
        sm:text-5xl sm:leading-[1.12]
        md:text-6xl
        lg:text-[76px] xl:text-[84px]
      "
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The complete{" "}
            <span className="italic text-[#F6D2B9]">Florida Keys guide</span>
            <br className="hidden sm:block" />
            <span className="sm:inline"> by Take Me To The Keys</span>
          </h1>

          {/* Decorative divider */}
          <div className="my-7 flex items-center justify-center gap-3 sm:my-9">
            <span className="h-px w-12 bg-[#F6D2B9]/70 sm:w-20" />
            <span className="text-sm text-[#F6D2B9]">◆</span>
            <span className="h-px w-12 bg-[#F6D2B9]/70 sm:w-20" />
          </div>

          {/* Description */}
          <p
            className="
        mx-auto max-w-4xl
        text-sm font-light italic
        leading-7 text-white/90
        sm:text-base sm:leading-8
        md:text-lg
      "
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            From a family of wild dolphins to a rescued sea turtle sanctuary,
            from a bridge that walks straight out into open ocean to a slice of
            pie that's yellow, never green — your curated guide to the middle of
            paradise, from Karen and Roman, who call Marathon home.
          </p>
        </div>
      </section>

      {/* =========================================
                  CONTENT SECTION
      ========================================= */}

      <section className="w-full overflow-hidden bg-[#F0F8FA] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24">

      {/* Section Heading */}
      <div className="mx-auto mb-12 max-w-4xl text-center sm:mb-16">

        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-[#D18B48]" />
          <span className="text-[10px] font-semibold uppercase tracking-[4px] text-[#D18B48]">
            ICONIC LANDMARKS
          </span>
          <span className="h-px w-10 bg-[#D18B48]" />
        </div>

        <h2
          className="text-3xl font-light leading-tight text-[#142B3D] sm:text-4xl md:text-5xl"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Marathon's postcards,{" "}
          <span className="italic text-[#F07850]">
            brought to life.
          </span>
        </h2>

        <div className="my-6 flex items-center justify-center gap-3">
          <span className="h-px w-7 bg-[#F07850]" />
          <span className="text-xs text-[#F07850]">✦</span>
          <span className="h-px w-7 bg-[#F07850]" />
        </div>

        <p
          className="mx-auto max-w-3xl px-2 text-sm italic leading-7 text-[#60798A] sm:text-base sm:leading-8 md:text-lg"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          A bridge so long it disappears into the horizon, a hospital
          that's saved thousands of sea turtles, a family of wild
          dolphins you can actually meet, and a five-acre island that
          once housed four hundred railroad workers — the icons every
          visitor should stand in front of at least once.
        </p>
      </div>

      {/* Six Cards */}
      <div className="mx-auto grid max-w-[1450px] grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">

        {places.map((place, index) => (
          <article
            key={place.title}
            className="group min-w-0 overflow-hidden border border-[#E4E8E8] bg-white shadow-[0_5px_20px_rgba(20,40,50,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_18px_40px_rgba(20,40,50,0.13)]"
          >

            {/* Image */}
            <div className="relative h-[230px] overflow-hidden sm:h-[240px] lg:h-[255px]">

              <img
                src={place.image}
                alt={`${place.title} ${place.highlight}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#102536]/25 to-transparent" />

              {/* Category */}
              <div className="absolute left-4 top-4 bg-white px-4 py-3 shadow-md sm:left-5">
                <span className="text-[9px] font-semibold uppercase tracking-[2px] text-[#19384D]">
                  {place.category}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 sm:p-6 lg:p-7">

              <h3
                className="text-[24px] font-medium leading-tight text-[#142B3D] sm:text-[26px]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {place.title}{" "}
                <span className="italic text-[#F07850]">
                  {place.highlight}
                </span>
              </h3>

              <p
                className="mt-4 text-sm leading-7 text-[#536C7D] sm:text-[15px]"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                {place.description}
              </p>

              {/* Bottom Decoration */}
              <div className="mt-6 flex items-center gap-3">
                <span className="h-px w-10 bg-[#D18B48]" />
                <span className="text-[10px] text-[#D18B48]">✦</span>
              </div>

            </div>
          </article>
        ))}

      </div>
    </section>
      {/* =========================================
                  BOTTOM SPACING
      ========================================= */}

      <div className="   " />
      <ThingsToDoSection />
    </>
  );
}
