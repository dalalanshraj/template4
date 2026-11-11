
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";
import {
  FiPhone,
  FiArrowUpRight,
} from "react-icons/fi";

export default function Footer({ listingId }) {
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!listingId) return;

    const fetchContact = async () => {
      try {
        const res = await api.get(`/listings/${listingId}`);

        setContactNumber(res.data?.property?.phone || "");
        setEmail(res.data?.property?.email || "");
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    };

    fetchContact();
  }, [listingId]);

  const importantLinks = [
    { name: "Home", to: "/" },
    { name: "BOOK NOW", to: "/properties/6adb7a6a6101b6fb9bebdd9b" },
    { name: "Guest Reviews", to: "/guest-reviews" },
    { name: "Top Things To Do", to: "/things-to-do" },
    { name: "Where To Eat", to: "/where-to-eat" },
  ];

  const propertyLinks = [
    { name: "Million Dollar View", to: "/million-dollar-view" },
    { name: "Horizon", to: "/horizon" },
    { name: "Ocean Dream", to: "/ocean-dream" },
    { name: "Home", to: "/" },
    { name: "Show All Rentals", to: "/properties/6adb7a6a6101b6fb9bebdd9b" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: FaFacebookF, href: null },
    { name: "Instagram", icon: FaInstagram, href: null },
  ];

  return (
    <footer className="relative mt-16 overflow-hidden bg-[#f3f7fa] text-[#354f52] sm:mt-20">

      {/* Decorative background */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-0 h-[300px] w-full rotate-[-8deg] bg-white/80" />
      </div>

      <div className="relative mx-auto max-w-[1450px] px-5 py-14 sm:px-8 lg:px-12 lg:py-16">

        {/* MAIN FOOTER */}

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.55fr_0.75fr_0.75fr_0.95fr] lg:gap-12">

          {/* BRAND */}

          <div>

            <h2
              className="text-2xl font-semibold uppercase tracking-[1px] sm:text-[30px]"
              style={{ fontFamily: "'Open Sans', Arial", fontWeight: 400 }}
            >
              <span className="text-[#354f52]">
                TAKE ME TO
              </span>{" "}
              <span className="text-[#c8884a]">
                THE KEYS
              </span>
            </h2>

            <p
              className="mt-7 max-w-[520px] text-lg italic leading-[1.5] text-[#405b60] sm:text-[20px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Four oceanfront homes nestled across Marathon,
              Florida Keys — the Atlantic a few steps one way,
              the Gulf sunset a few steps the other. Private
              pools, wide-open kitchens, and enough space that
              everybody gets their own view of the water.
              We built or developed these homes ourselves,
              and we still answer the phone ourselves.
              Come watch the horizon with us.
            </p>

            <p
              className="mt-7 text-xl text-[#c8884a] sm:text-2xl"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              "Hosted By  "
            </p>

            {/* SOCIAL LINKS */}

            <div className="mt-8 flex items-center gap-7">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href || undefined}
                    aria-label={social.name}
                    title={social.name}
                    onClick={
                      social.href
                        ? undefined
                        : (e) => e.preventDefault()
                    }
                    className="text-[#405b60] transition hover:text-[#c8884a]"
                  >
                    <Icon size={19} />
                  </a>
                );
              })}
            </div>
          </div>
          {/* IMPORTANT */}
          <div>
            <h3 className=" text-[20px] font-medium uppercase text-[#c8884a]"
              style={{ fontFamily: "'Open Sans', Arial", fontWeight: 400 }}>
              Important
            </h3>
            <div className="mt-4 h-[2px] w-30 shrink-0 bg-[#c8884a]" />
            <ul className="space-y-4 mt-5">

              {importantLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="text-base text-[#526b70]  transition hover:text-[#c8884a] sm:text-[17px]"
                    style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* PROPERTIES */}
          <div>
            <h3 className=" text-[20px] font-medium uppercase text-[#c8884a]"
              style={{ fontFamily: "'Open Sans', Arial", fontWeight: 400 }}>
              Properties
            </h3>
            <div className="mt-4 h-[2px] w-35 shrink-0 bg-[#c8884a]" />
            <ul className="space-y-4 mt-5">
              {propertyLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="text-base text-[#526b70]  transition hover:text-[#c8884a] sm:text-[17px]"
                    style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}

          <div>
            <h3 className=" text-[20px] font-medium uppercase text-[#c8884a]"
              style={{ fontFamily: "'Open Sans', Arial", fontWeight: 400 }}>
              Contact
            </h3>
            <div className="mt-4 h-[2px] w-30 shrink-0 bg-[#c8884a]" />
            <div className="space-y-3 text-base leading-relaxed text-[#526b70] sm:text-lg mt-5">
              <p className="font-medium"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}>
                 Your Name
              </p>
              <a
                href={`mailto:${email || "your@mail.com"}`}
                className="block break-all transition hover:text-[#c8884a]"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}>
                {email || "your@mail.com"}
              </a>
              <a
                href={`tel:${(contactNumber || "000-000-0000").replace(/[^\d+]/g, "")}`}
                className="block transition hover:text-[#c8884a]"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}>
                {contactNumber || "000-000-0000"}
              </a>
              <a
                href={`tel:${(contactNumber || "000-000-0000").replace(/[^\d+]/g, "")}`}
                aria-label="Call us"
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-[#c8884a] text-[#c8884a] transition hover:bg-[#c8884a] hover:text-white"
                style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 300 }}>
                <FiPhone size={18} />
              </a>
            </div>
            <Link
              to="/contact-us"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#c8884a] px-7 py-3 text-base text-white shadow-sm transition hover:bg-[#ad7138] hover:shadow-lg"
            >
              Contact Us
              <FiArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </div>
      {/* COPYRIGHT */}

      <div className="relative bg-black px-5 py-5 text-white">

        <div className="mx-auto flex max-w-[1450px] flex-col items-center justify-between gap-3 sm:flex-row">

          <p className="text-center text-sm font-light text-white/80">
            © Copyright {new Date().getFullYear()}.  <a
              href="https://digifyamerica.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-[#c8884a]"
            >
              Digify America
            </a> &nbsp;
            All Rights Reserved.
          </p>
        </div>

      </div>

    </footer>
  );
}
