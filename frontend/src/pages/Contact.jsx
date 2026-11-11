import { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axios";
import { IoLocation } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
} from "lucide-react";

export default function Contact({ listingId }) {
  const [listing, setListing] = useState(null);

  const [calendarData, setCalendarData] = useState([]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    adults: "",
    kids: "",
    checkIn: null,
    checkOut: null,
    message: "",
  });

  // =====================================
  // FETCH LISTING
  // =====================================

  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)

      .then((res) => {
        setListing(res.data);
      })

      .catch(console.log);
  }, [listingId]);

  // =====================================
  // FETCH CALENDAR
  // =====================================

  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/calendar/${listingId}/calendar`)

      .then((res) => {
        setCalendarData(res.data.calendar || []);
      })

      .catch(console.log);
  }, [listingId]);

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatLocalDate = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",

      year: "numeric",

      month: "2-digit",

      day: "2-digit",
    }).format(new Date(date));
  };

  // =====================================
  // BLOCKED MAP
  // =====================================

  const blockedMap = useMemo(() => {
    const map = {};

    calendarData.forEach((item) => {
      const itemDate = new Date(
        new Date(item.date).toLocaleString("en-US", {
          timeZone: "America/Chicago",
        }),
      );

      const key = formatLocalDate(itemDate);

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(item.status);
    });

    return map;
  }, [calendarData]);

  // =====================================
  // DATE TYPE
  // =====================================

  const getDateType = (date) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const currentDate = new Date(date);

    currentDate.setHours(0, 0, 0, 0);

    // PAST
    if (currentDate < today) {
      return "past-day";
    }

    const currentKey = formatLocalDate(currentDate);

    const statuses = blockedMap[currentKey] || [];

    const hasCIN = statuses.includes("CIN");

    const hasCOUT = statuses.includes("COUT");

    const hasR = statuses.includes("R");

    const hasH = statuses.includes("H");

    // TURNOVER
    if (hasCIN && hasCOUT) {
      return "turnover-day";
    }

    // CHECK-IN
    if (hasCIN) {
      return "checkin-day";
    }

    // CHECK-OUT
    if (hasCOUT) {
      return "checkout-day";
    }

    // BLOCKED
    if (hasR) {
      return "blocked-day";
    }

    // HOLD
    if (hasH) {
      return "hold-day";
    }

    return "available-day";
  };

  // =====================================
  // BLOCKED CHECK
  // =====================================

  const isBlocked = (date) => {
    const key = formatLocalDate(date);

    const statuses = blockedMap[key] || [];

    return statuses.includes("R");
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const dbPayload = {
        property: listingId,

        name: form.name,

        email: form.email,

        phone: form.phone,

        message: form.message,

        Arrival: form.checkIn,

        Departure: form.checkOut,

        Adults: form.adults,

        Kids: form.kids,
      };

      await api.post("/inquiries", dbPayload);

      const recipients = [
        listing?.property?.email,
        listing?.property?.email,
      ].filter(Boolean);

      const emailPayload = {
        to_email: recipients.join(","),

        Recipients: recipients.join(", "),

        property: listing?.property?.title,

        name: form.name,
        email: form.email,
        phone: form.phone,

        Arrival: formatLocalDate(form.checkIn),
        Departure: formatLocalDate(form.checkOut),

        adults: form.adults,
        kids: form.kids,

        message: form.message,
      };

      for (const recipient of recipients) {
        await emailjs.send(
          "service_04sk77i",
          "template_h8d4zrt",
          {
            ...emailPayload,
            to_email: recipient,
          },
          "xppi5YZRRXZI6aHUJ",
        );
      }

      setStatus({
        type: "success",

        message: "Booking request sent successfully ✅",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        adults: "",
        kids: "",
        checkIn: null,
        checkOut: null,
        message: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.log(err);

      setStatus({
        type: "error",

        message: "Something went wrong ❌",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // NIGHTS
  // =====================================

  const nights =
    form.checkIn && form.checkOut
      ? Math.ceil((form.checkOut - form.checkIn) / (1000 * 60 * 60 * 24))
      : 0;

  
return (
  <main
    className="w-full overflow-x-clip bg-[#F3F8FB] mt-46"
    style={{ fontFamily: "'Quicksand', sans-serif" }}
  >
    {/* HERO */}
    <section
      className="relative flex min-h-[360px] items-center bg-cover bg-center bg-no-repeat sm:min-h-[460px] lg:min-h-[560px]"
      style={{
        backgroundImage: "url('https://content.app-sources.com/s/24618439467748482/uploads/Contact_us/Contact_Us-6012445.webp?format=webp')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#102A3A]/45 via-[#102A3A]/10 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1450px] px-5 pb-12 pt-24 sm:px-8 lg:px-12">
        <h1 className="text-[46px] font-light leading-tight tracking-[-2px] text-white sm:text-[65px] md:text-[80px] lg:text-[94px]">
          Get In Touch
        </h1>
      </div>

      {/* Curved hero bottom */}
      <div className="absolute bottom-[-1px] left-0 w-full">
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="block h-[45px] w-full sm:h-[75px]"
          aria-hidden="true"
        >
          <path
            d="M0 80 C340 0 850 20 1100 65 C1250 95 1350 90 1440 65 L1440 100 L0 100 Z"
            fill="#F3F8FB"
          />
        </svg>
      </div>
    </section>

    {/* CONTACT CONTENT */}
    <section className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-20 sm:px-8 lg:px-12">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">

        {/* LEFT SIDE: FORM */}
        <div className="min-w-0 pt-8 sm:pt-12 lg:pt-10">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-sm text-[#405761]">
                Name <span className="text-[#D18B48]">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Please Tell Us Your Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full rounded-full border border-[#DADFE1] bg-white px-6 py-4 text-sm text-[#243E49] outline-none transition focus:border-[#C8884A] focus:ring-2 focus:ring-[#C8884A]/15"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label htmlFor="contact-email" className="mb-2 block text-sm text-[#405761]">
                Email <span className="text-[#D18B48]">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                required
                autoComplete="email"
                placeholder="Please Enter Your Email Address"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full rounded-full border border-[#DADFE1] bg-white px-6 py-4 text-sm text-[#243E49] outline-none transition focus:border-[#C8884A] focus:ring-2 focus:ring-[#C8884A]/15"
              />
            </div>

            {/* PHONE */}
            <div>
              <label htmlFor="contact-phone" className="mb-2 block text-sm text-[#405761]">
                Phone <span className="text-[#D18B48]">*</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="Enter Your Best Contact Number"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                className="w-full rounded-full border border-[#DADFE1] bg-white px-6 py-4 text-sm text-[#243E49] outline-none transition focus:border-[#C8884A] focus:ring-2 focus:ring-[#C8884A]/15"
              />
            </div>

            {/* DATES */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <label className="mb-2 block text-sm text-[#405761]">
                  Check In <span className="text-[#D18B48]">*</span>
                </label>
                <DatePicker
                  selected={form.checkIn}
                  selectsStart
                  startDate={form.checkIn}
                  endDate={form.checkOut}
                  minDate={new Date()}
                  required
                  placeholderText="Select Check In"
                  dateFormat="MMM dd, yyyy"
                  wrapperClassName="w-full"
                  onChange={(date) =>
                    setForm({
                      ...form,
                      checkIn: date,
                      checkOut:
                        form.checkOut && date && form.checkOut <= date
                          ? null
                          : form.checkOut,
                    })
                  }
                  className="w-full rounded-full border border-[#DADFE1] bg-white px-5 py-4 text-sm outline-none focus:border-[#C8884A]"
                />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-sm text-[#405761]">
                  Check Out <span className="text-[#D18B48]">*</span>
                </label>
                <DatePicker
                  selected={form.checkOut}
                  selectsEnd
                  startDate={form.checkIn}
                  endDate={form.checkOut}
                  minDate={
                    form.checkIn
                      ? new Date(
                          form.checkIn.getFullYear(),
                          form.checkIn.getMonth(),
                          form.checkIn.getDate() + 1
                        )
                      : new Date()
                  }
                  required
                  placeholderText="Select Check Out"
                  dateFormat="MMM dd, yyyy"
                  wrapperClassName="w-full"
                  onChange={(date) =>
                    setForm({ ...form, checkOut: date })
                  }
                  className="w-full rounded-full border border-[#DADFE1] bg-white px-5 py-4 text-sm outline-none focus:border-[#C8884A]"
                />
              </div>
            </div>

            {/* GUESTS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="min-w-0">
                <label htmlFor="contact-adults" className="mb-2 block text-sm text-[#405761]">
                  Adults *
                </label>
                <input
                  id="contact-adults"
                  type="number"
                  min="1"
                  required
                  placeholder="Adults"
                  value={form.adults}
                  onChange={(e) =>
                    setForm({ ...form, adults: e.target.value })
                  }
                  className="w-full rounded-full border border-[#DADFE1] bg-white px-5 py-4 text-sm outline-none focus:border-[#C8884A]"
                />
              </div>

              <div className="min-w-0">
                <label htmlFor="contact-kids" className="mb-2 block text-sm text-[#405761]">
                  Kids
                </label>
                <input
                  id="contact-kids"
                  type="number"
                  min="0"
                  placeholder="Kids"
                  value={form.kids}
                  onChange={(e) =>
                    setForm({ ...form, kids: e.target.value })
                  }
                  className="w-full rounded-full border border-[#DADFE1] bg-white px-5 py-4 text-sm outline-none focus:border-[#C8884A]"
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div>
              <label htmlFor="contact-message" className="mb-2 block text-sm text-[#405761]">
                Message <span className="text-[#D18B48]">*</span>
              </label>
              <textarea
                id="contact-message"
                rows={4}
                required
                placeholder="How can we help you?"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                className="w-full resize-y rounded-[28px] border border-[#405C66] bg-white px-6 py-4 text-sm text-[#243E49] outline-none focus:border-[#C8884A]"
              />
            </div>

            {nights > 0 && (
              <p className="text-sm text-[#405761]">
                Length of stay: <strong>{nights} nights</strong>
              </p>
            )}

            {status.message && (
              <p
                role="status"
                className={`rounded-xl p-3 text-sm ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status.message}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#C98A4B] px-8 py-5 text-xl font-medium text-white transition duration-300 hover:bg-[#B57637] disabled:cursor-not-allowed disabled:opacity-60 sm:text-2xl"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>

          {/* QUOTE */}
          <div className="mt-16 sm:mt-20">
            <p
              className="text-xl italic leading-[1.8] text-[#3C5961] sm:text-2xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              "Every stay here begins long before the keys change hands —
              with a question, a reply, and a house being quietly made
              ready for people we haven't met yet."
            </p>

            <p
              className="mt-3 text-xl italic text-[#C98A4B]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              — Your Hosts
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: CONTACT INFORMATION */}
        <aside className="relative min-w-0 bg-white px-6 py-10 shadow-[0_15px_40px_rgba(20,40,50,0.06)] sm:px-10 sm:py-14 lg:-mt-24 lg:px-12 lg:py-20">
          <h2
            className="text-2xl font-semibold italic text-[#C98A4B] sm:text-[28px]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            A quiet word. A real reply.
          </h2>

          <p className="mt-8 text-base leading-[2] text-[#48616B] sm:text-lg">
            Every message comes straight to us — not a team,
            not a call centre, just your hosts and their inbox.
            We read each one ourselves and write back as soon as we can.
            Whether you're deciding on a family getaway,
            planning a reunion, or simply wondering about
            one small detail before you book — we'd love to hear from you.
          </p>

          <div className="my-9 h-[2px] w-full bg-[#C98A4B]" />

          <h3 className="text-lg font-bold uppercase text-[#36525B]">
            Reach Us Directly
          </h3>

          <div className="mt-7 space-y-4 break-words text-base leading-7 sm:text-lg">
            <p>
              <strong className="text-[#36525B]">Email: </strong>
              {listing?.property?.email ? (
                <a
                  href={`mailto:${listing.property.email}`}
                  className="text-[#C98A4B] hover:underline"
                >
                  {listing.property.email}
                </a>
              ) : (
                <span className="text-[#78909A]">your@mail.com</span>
              )}
            </p>

            <p>
              <strong className="text-[#36525B]">Phone: </strong>
              {listing?.property?.phone ? (
                <a
                  href={`tel:${listing.property.phone}`}
                  className="text-[#C98A4B] hover:underline"
                >
                  {listing.property.phone || "000-000-0000"}
                </a>
              ) : (
                <span className="text-[#78909A]">000-000-0000</span>
              )}
            </p>

            <p>
              <strong className="text-[#36525B]">Hours: </strong>
              <span className="text-[#C98A4B]">
             Always within reach — 24 / 7
              </span>
            </p>

            
          </div>

          <div className="mt-9 h-[2px] w-full bg-[#C98A4B]" />

          <p
            className="mt-10 text-xl italic text-[#C98A4B]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            We look forward to hearing from you.
          </p>
        </aside>
      </div>
    </section>

    {/* BOTTOM ORANGE WAVE */}
    <div className="w-full overflow-hidden">
      <svg
        viewBox="0 0 1440 75"
        preserveAspectRatio="none"
        className="block h-[45px] w-full sm:h-[75px]"
        aria-hidden="true"
      >
        <path
          d="M0 65 C300 0 620 0 880 42 C1100 80 1300 60 1440 45 L1440 75 L0 75 Z"
          fill="#C98A4B"
        />
      </svg>
    </div>
  </main>
);

}
