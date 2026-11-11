
import { useState } from "react";
import {
  ShoppingBag,
  Pizza,
  Guitar,
  Bike,
  ArrowUpRight,
} from "lucide-react";

const things = [
  {
    category: "SHOPPING",
    title: "Shopping",
    subtitle: "Discover the local favorites",
    desc: "Take advantage of some of the best shopping near Silver Sands Premium Outlets, Pier Park and many local boutiques. Discover unique finds, coastal fashion and local treasures.",
    image: "https://content.app-sources.com/s/24618439467748482/uploads/Image_URLs/Dolphin_Research_Center_Attractions-6008945.jpg",
    icon: ShoppingBag,
    label: "A SHOPPER'S PARADISE",
  },
  {
    category: "DINING",
    title: "Dining",
    subtitle: "A taste of the coast",
    desc: "Enjoy amazing restaurants, fresh seafood, beach cafés and family dining just minutes from your stay. From waterfront dining to hidden local gems, there's something for everyone.",
    image: "https://content.app-sources.com/s/24618439467748482/uploads/Image_URLs/Seven_Mile_Bridge_Attractions-6009063.jpg",
    icon: Pizza,
    label: "FRESH FLAVORS & LOCAL GEMS",
  },
  {
    category: "ENTERTAINMENT",
    title: "Entertainment",
    subtitle: "Make every evening memorable",
    desc: "Arcades, mini golf, live music, nightlife and family attractions are all nearby. Find exciting experiences for every age and make the most of your coastal getaway.",
    image: "https://content.app-sources.com/s/24618439467748482/uploads/Image_URLs/Pigeon_Key_Historic_District_Attractions-6009212.jpg",
    icon: Guitar,
    label: "FUN FOR EVERYONE",
  },
  {
    category: "EXPLORE",
    title: "Visit Nearby Cities",
    subtitle: "Explore beyond the beach",
    desc: "Explore Rosemary Beach, Alys Beach, WaterColor, Seaside and many beautiful coastal communities. Each destination has its own charm, beautiful architecture and local experiences.",
    image: "https://content.app-sources.com/s/24618439467748482/uploads/Image_URLs/Sombrero_Beach_Attractions-6008923.jpg",
    icon: Bike,
    label: "EXPLORE THE COAST",
  },
];

export default function ThingsToDoSection() {
  const [activeCard, setActiveCard] = useState(null);

  const renderCard = (item, index, large = false) => {
  const Icon = item.icon;
  const isActive = activeCard === index;

  const handleCardClick = () => {
    // Tap interaction only on touch devices
    if (window.matchMedia("(hover: none)").matches) {
      setActiveCard((prev) => (prev === index ? null : index));
    }
  };

     return (
    <article
      key={item.title}
      onClick={handleCardClick}
      className={`group relative isolate cursor-pointer overflow-hidden rounded-md bg-[#103D4C] ${
        large
          ? "h-[420px] sm:h-[520px] xl:h-full xl:min-h-[680px]"
          : "h-[280px] sm:h-[320px] xl:h-[240px]"
      }`}
    >
      {/* IMAGE */}
      <img
        src={item.image}
        alt={item.title}
        loading="lazy"
        className="
          absolute inset-0
          h-full w-full
          object-cover
          transition-transform
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-110
        "
      />

      {/* DARK OVERLAY */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-t
          from-[#071E2A]/90
          via-[#071E2A]/20
          to-transparent
          transition-opacity
          duration-500
          group-hover:opacity-0
        "
      />

      {/* CATEGORY */}
      <div className="absolute left-5 top-5 z-10 sm:left-7 sm:top-7">
        <span className="border border-white/30 bg-[#123C4B]/85 px-4 py-2 text-[9px] font-bold tracking-[2px] text-white backdrop-blur-sm">
          {item.category}
        </span>
      </div>

      {/* DEFAULT CONTENT */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 z-10
          p-6 sm:p-8
          transition-all duration-500 ease-out
          ${
            isActive
              ? "translate-y-6 opacity-0"
              : "translate-y-0 opacity-100"
          }
          group-hover:translate-y-6
          group-hover:opacity-0
        `}
      >
        <p className="mb-3 font-serif text-sm italic tracking-[2px] text-[#E7B77D]"style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 400,
    }}>
          {item.label}
        </p>

        <h3
          className={`font-serif italic leading-tight text-white  ${
            large ? "text-4xl lg:text-5xl" : "text-3xl"
          }`}
       style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 400,
    }} >
          {item.title}
        </h3>

        <p className="italic text-[#E5B47D]"
    style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 400,
    }}
  >
          {item.subtitle.toUpperCase()}
        </p>

        <div className="mt-5 flex items-center gap-2 text-[#E7B77D]">
          <span className="text-[10px] font-bold tracking-[2px]">
            EXPLORE MORE
          </span>
          <ArrowUpRight size={16} />
        </div>
      </div>

      {/* ANIMATED CONTENT PANEL */}
      <div
        className={`
          absolute inset-0 z-20
          flex flex-col justify-center
          overflow-y-auto
          bg-[#103D4C]
          p-6 sm:p-8
          transition-all
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${
            isActive
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-full opacity-0"
          }
          group-hover:pointer-events-auto
          group-hover:translate-y-0
          group-hover:opacity-100
        `}
      >
        {/* CORNER DESIGN */}
        <span className="absolute right-5 top-5 h-8 w-8 border-r border-t border-[#D7A66F]" />
        <span className="absolute bottom-5 left-5 h-8 w-8 border-b border-l border-[#D7A66F]" />

        {/* ICON AND LABEL */}
        {/* <div className="mb-4 flex items-center gap-3 text-[#D7A66F]">
          <Icon size={22} strokeWidth={1.5} />

          <span className="text-[9px] font-bold tracking-[2px] sm:text-[10px]">
            {item.label}
          </span>
        </div> */}

        {/* TITLE */}
       <h3
  className={`italic text-white ${
    large
      ? "text-3xl sm:text-4xl lg:text-[42px] font-light"
      : "text-2xl sm:text-3xl font-light"
  }`}
  style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 400,
  }}
>
  {item.title},{" "}
  <span
    className="italic text-[#E5B47D]"
    style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontWeight: 400,
    }}
  >
    {item.subtitle.toLowerCase()}.
  </span>
</h3>

        {/* DIVIDER */}
        <div className="my-4 h-px w-14 shrink-0 bg-[#D7A66F]" />

        {/* DESCRIPTION */}
        <p className="text-xs leading-6 text-white/80 sm:text-sm sm:leading-7" 
        style={{ fontFamily: "Georgia, serif" , fontWeight: 300, }}>
          {item.desc}
        </p>

        {/* BOTTOM */}
        <div className="mt-5 flex shrink-0 items-center gap-3 text-[#E5B47D]">
          <span className="text-[9px] font-bold tracking-[2px]">
            DISCOVER MORE
          </span>
          <ArrowUpRight size={16} />
        </div>
      </div>
    </article>
  );
  };

  return (
    <section className="overflow-hidden bg-[#EDF4F7] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* SECTION HEADING */}
        <div className="mx-auto mb-14 max-w-5xl text-center sm:mb-16">
          <div className="mb-6 flex items-center justify-center gap-4 text-[10px] font-bold tracking-[4px] text-[#1F6397]">
            <span className="h-px w-9 bg-[#1F6397]" />
              <p className="text-[11px] font-semibold uppercase tracking-[5px] text-[#bd8246]">
               THINGS TO DO NEARBY </p> 
            <span className="h-px w-9 bg-[#1F6397]" />
          </div>

           <h2
            className="  text-[42px] font-[300] leading-[1.12] tracking-[-1.8px] text-[#152b3c] sm:text-5xl lg:text-[58px] xl:text-[68px] opacity-90"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Discover the beauty{" "}
            <span className="italic text-[#286D9C]"style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              beyond
            </span>{" "}
            the beach.
          </h2>

          <div className="my-6 flex items-center justify-center gap-3 text-[#D7A66F]">
            <span className="h-px w-8 bg-[#24679c]" />
            ✦
            <span className="h-px w-8 bg-[#24679c]" />
          </div>

     <p
              className="mt-8 text-xl italic text-[#3a5160] sm:text-[18px]  font-[300]"
              style={{ fontFamily: "Georgia, serif" }}
            >
            From unforgettable dining and shopping to coastal
            adventures and charming nearby towns, there's
            something special waiting around every corner.
          </p>
        </div>

        {/* FOUR IMAGE LAYOUT */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">

          {/* LARGE LEFT IMAGE */}
          <div className="xl:col-span-3 xl:row-span-3">
            {renderCard(things[0], 0, true)}
          </div>

          {/* THREE RIGHT IMAGES */}
          {things.slice(1).map((item, index) => (
            <div
              key={item.title}
              className="xl:col-span-2"
            >
              {renderCard(item, index + 1)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
