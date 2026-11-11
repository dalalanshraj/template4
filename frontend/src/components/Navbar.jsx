
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const LOGO =
  "https://content.app-sources.com/s/24618439467748482/uploads/Logo/TMTTK_Logo-6201989.jpg";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Prevent background scroll on mobile
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { title: "HOME", to: "/" },
    {
      title: "VIEW PROPERTIES",
      children: [
        {
          title: "Million Dollar View",
          subtitle: "Marathon · 4BR · Sleeps 8 · 285-Ft Private Pier",
          to: "/properties/6ae8c80a68bee59f43da5f91",
        },
        {
          title: "Horizon",
          subtitle: "Marathon · 4BR · Sleeps 8 · Ocean-View Every Room",
          to: "/property/YOUR_PROPERTY_ID_2",
        },
        {
          title: "Ocean Dream",
          subtitle: "Marathon · 4BR · Sleeps 8 · 140-Ft Water Frontage",
          to: "/property/YOUR_PROPERTY_ID_3",
        },
        {
          title: "Ocean Panorama",
          subtitle: "Marathon · 4BR · Sleeps 8 · Coming Soon",
          disabled: true,
        },
      ],
    },
    { title: "GUEST REVIEWS", to: "/#guest-reviews" },
    { title: "KNOW YOUR HOST", to: "/#host" },
    {
      title: "SHOW ALL RENTALS",
      to: "/all-rentals",
    },
    {
      title: " THINGS TO DO ",
       to: "/things-to-do",
    },
    { title: "CONTACT US", to: "/contact-us" },
  ];

  const linkClass = (to) =>
    `relative whitespace-nowrap text-[14px] xl:text-[13px]
    font-medium tracking-[0.09em]
    transition-colors duration-300
 
    hover:text-[#B58A3B]
    ${location.pathname === to
      ? "text-[#B58A3B]"
      : "text-[#000]"
    }`;

  return (
    <header
      className={`
        fixed inset-x-0 top-0 z-50
        transition-all duration-500
        ${isScrolled
          ? "bg-[#E8F3FA]/95 shadow-md backdrop-blur-xl"
          : "bg-transparent shadow-none"
        }
      `}
    >
      <div
        className={`
          relative mx-auto flex max-w-[2000px]
          items-center justify-between
          px-5 sm:px-8 lg:px-[3%]
          transition-all duration-500
          ${isScrolled
            ? "min-h-[100px] py-3"
            : "min-h-[190px] py-4"
          }
        `}
      >
        {/* LOGO */}
        <Link
          to="/"
          aria-label="Go to homepage"
          className={`
            relative z-20 flex shrink-0
            items-center justify-center
            rounded-[20px] bg-white
          drop-shadow-xl/50
            transition-all duration-500
            ${isScrolled
              ? "h-[85px] w-[220px]"
              : "h-[130px] w-[255px]"
            }
          `}
        >
          <h1 className="text-2xl font-bold text-[#102d3b]">LOGO</h1>
          {/* <img
            src={LOGO}
            alt="Take Me To The Keys - Florida Keys Oceanfront Rentals"
            className={`
              block w-full object-contain
              transition-all duration-500 
              ${isScrolled
                ? "max-h-[72px] px-4"
                : "max-h-[150px] px-5 "
              }
            `}
          /> */}
        </Link>

        {/* DESKTOP NAVIGATION */}


        <nav className="ml-auto hidden items-center gap-5 lg:flex xl:gap-7 2xl:gap-9">

          {navLinks.map((item) => (

            <div
              key={item.title}
              className="relative flex h-full items-center"
              onMouseEnter={() => {
                if (item.children) {
                  setActiveDropdown(item.title);
                }
              }}
              onMouseLeave={() => setActiveDropdown(null)}
            >

              {item.children ? (
                <>

                  {/* Dropdown Trigger */}

                  <button
                    type="button"
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.title ? null : item.title
                      )
                    }
                    className={`
              ${linkClass("")}
              flex items-center gap-2
              whitespace-nowrap
              transition-all duration-300
            `}
                  >
                    {item.title}

                    <ChevronDown
                      size={14}
                      className={`
                transition-transform duration-300
                ${activeDropdown === item.title
                          ? "rotate-180"
                          : ""
                        }
              `}
                    />
                  </button>

                  {/* PREMIUM MEGA DROPDOWN */}

                   

         
<div
  className={`
    absolute left-1/2 top-full z-[100]
    w-[430px] max-w-[calc(100vw-30px)]
    -translate-x-1/2 pt-3
    transition-all duration-300
    ${
      activeDropdown === item.title
        ? "visible translate-y-0 opacity-100"
        : "invisible translate-y-2 opacity-0 pointer-events-none"
    }
  `}
>
  <div className="
    overflow-hidden
    rounded-[4px]
    border border-[#D8DDE0]
    border-t-[2px] border-t-[#C98A4B]
    bg-white
    shadow-[0_10px_30px_rgba(0,0,0,0.15)]
  ">

    {item.children.map((child) => {

      const content = (
        <div className="
          group/item
          flex min-h-[99px]
          flex-col justify-center
          px-[30px] py-4
          transition-colors duration-300
          hover:bg-[#F8F4F0]
        ">

          <div className="flex items-center gap-2">

            <h3 className="
              font-serif
              text-[16px]
              font-medium
              text-[#000]
              transition-colors
              group-hover/item:text-[#B77A3E]
            "style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 400,
  }}>
              {child.title}
            </h3>

            {!child.disabled && (
              <span className="
                text-[17px]
                text-[#C98A4B]
                transition-transform
                group-hover/item:translate-x-1
              ">
                →
              </span>
            )}

          </div>

          <p className="
            mt-2
            
            text-[12px]
            italic
            tracking-wide
            text-[#64798A]
          "    style={{
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 400,
  }}>
            {child.subtitle}
          </p>

        </div>
      );

      return child.disabled ? (
        <div key={child.title} className="opacity-50">
          {content}
        </div>
      ) : (
        <Link
          key={child.to}
          to={child.to}
          onClick={() => setActiveDropdown(null)}
          className="block border-b border-gray-100 last:border-0"
        >
          {content}
        </Link>
      );
    })}

  </div>
</div>


                </>
              ) : (

                <Link
                  to={item.to}
                  className={linkClass(item.to)}
                >
                  {item.title}
                </Link>

              )}

            </div>

          ))}

        </nav>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={
            mobileOpen ? "Close navigation" : "Open navigation"
          }
          aria-expanded={mobileOpen}
          className="
            relative z-[60] flex h-12 w-12
            items-center justify-center
            rounded-full border border-gray-200
            bg-white text-[#173447]
            shadow-md transition-all
            hover:bg-[#E8F3FA]
            lg:hidden
          "
        >
          {mobileOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      <div
        className={`
          absolute inset-x-0 top-full z-50
          overflow-hidden bg-white shadow-2xl
          transition-all duration-500
          lg:hidden
          ${mobileOpen
            ? "visible max-h-[85vh] translate-y-0 opacity-100"
            : "invisible max-h-0 -translate-y-3 opacity-0"
          }
        `}
      >
        <nav className="max-h-[85vh] overflow-y-auto px-6 py-4">
          {navLinks.map((item) => (
            <div
              key={item.title}
              className="border-b border-gray-100"
            >
              {item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.title
                          ? null
                          : item.title
                      )
                    }
                    className="
                      flex w-full items-center
                      justify-between py-5
                      text-left text-sm font-semibold
                      tracking-wider text-[#173447]
                    "
                  >
                    <span>{item.title}</span>
                    <ChevronDown
                      size={17}
                      className={`
                        transition-transform duration-300
                        ${activeDropdown === item.title
                          ? "rotate-180"
                          : ""
                        }
                      `}
                    />
                  </button>

                  <div
                    className={`
                      grid transition-all duration-300
                      ${activeDropdown === item.title
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                      }
                    `}
                  >
                    <div className="overflow-hidden">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={() => setMobileOpen(false)}
                          className="
                            block py-3 pl-5
                            text-sm text-gray-600
                            hover:text-[#B58A3B]
                          "
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    block py-5 text-sm
                    font-semibold tracking-wider
                    transition-colors
                    ${location.pathname === item.to
                      ? "text-[#B58A3B]"
                      : "text-[#173447]"
                    }
                  `}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}
