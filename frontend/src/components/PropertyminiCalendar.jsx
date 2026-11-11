
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import api from "../api/axios";

export default function PropertyminiCalendar({
  listingId,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  onCheckAvailability,
}) {
  const [calendarDates, setCalendarDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // DatePicker dates are local calendar dates.
  const getDateKey = (date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // API dates are normalized to the property's timezone.
  const getApiDateKey = (value) => {
    if (!value) return "";

    const raw = String(value);

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return raw;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  // FETCH CALENDAR
  useEffect(() => {
    if (!listingId) return;

    let cancelled = false;

    const fetchCalendar = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/calendar/${listingId}/calendar`
        );

        if (!cancelled) {
          setCalendarDates(res.data.calendar || []);
        }
      } catch (error) {
        console.error("Calendar fetch error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCalendar();

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  // BUILD STATUS MAP
  const statusMap = useMemo(() => {
    const map = {};

    calendarDates.forEach((item) => {
      const key = getApiDateKey(item.date);

      if (!key) return;

      if (!map[key]) map[key] = [];

      map[key].push(item.status);
    });

    return map;
  }, [calendarDates]);

  const getStatuses = (date) => {
    return statusMap[getDateKey(date)] || [];
  };

  // BOOKED / HOLD DATES
  const isUnavailable = (date) => {
    const statuses = getStatuses(date);

    return (
      statuses.includes("R") ||
      statuses.includes("H")
    );
  };

  // DATE APPEARANCE
  const getDateType = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const current = new Date(date);
    current.setHours(0, 0, 0, 0);

    if (current < today) return "past-day";

    const statuses = getStatuses(date);

    const hasCIN = statuses.includes("CIN");
    const hasCOUT = statuses.includes("COUT");
    const hasR = statuses.includes("R");
    const hasH = statuses.includes("H");

    const previous = new Date(date);
    previous.setDate(previous.getDate() - 1);

    const previousStatuses = getStatuses(previous);

    const previousBooked =
      previousStatuses.includes("R") ||
      previousStatuses.includes("COUT");

    if (hasCIN && hasCOUT) return "turnover-day";

    if (hasCIN && previousBooked) return "turnover-day";

    if (hasCIN) return "checkin-day";

    if (hasCOUT) return "checkout-day";

    if (hasR || hasH) return "blocked-day";

    return "available-day";
  };

  // RANGE SELECTION
  const handleDateChange = (dates) => {
    const [start, end] = dates;

    if (!start) {
      setCheckIn(null);
      setCheckOut(null);
      return;
    }

    if (!end) {
      setCheckIn(start);
      setCheckOut(null);
      return;
    }

    // Prevent a range from crossing a booked/held date.
    const cursor = new Date(start);
    cursor.setDate(cursor.getDate() + 1);

    while (cursor < end) {
      if (isUnavailable(cursor)) {
        setCheckIn(start);
        setCheckOut(null);
        return;
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    setCheckIn(start);
    setCheckOut(end);
  };

  const formatDisplayDate = (date) => {
    if (!date) return "Select date";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const changeMonth = (amount) => {
    setCurrentMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + amount,
          1
        )
    );
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="booking-calendar-shell w-full rounded-2xl bg-[#E0E2E8] p-4 sm:p-6">

      {/* HEADER */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <CalendarDays className="text-[#D18B48]" size={23} />

        <h2 className="font-serif text-2xl font-bold text-[#191A2C]">
          Reserve Your Stay
        </h2>

        <span className="text-[9px] font-bold tracking-[1.5px] text-[#D18B48]">
          LIVE AVAILABILITY · INSTANT PRICING
        </span>
      </div>

      {/* ARRIVAL / DEPARTURE */}
      <div className="grid grid-cols-2 overflow-hidden rounded-t-2xl border border-[#D9B18B] bg-white/50">

        <div
          className={`border-r border-[#D9B18B] p-4 ${
            !checkIn ? "bg-white/30" : ""
          }`}
        >
          <span className="text-[10px] font-bold tracking-[1.5px] text-[#D18B48]">
            ARRIVAL
          </span>

          <p className="mt-1 text-sm font-semibold text-[#D18B48] sm:text-base">
            {formatDisplayDate(checkIn)}
          </p>
        </div>

        <div className="p-4">
          <span className="text-[10px] font-bold tracking-[1.5px] text-[#D18B48]">
            DEPARTURE
          </span>

          <p className="mt-1 text-sm font-semibold text-[#191A2C] sm:text-base">
            {formatDisplayDate(checkOut)}
          </p>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="rounded-b-2xl border border-t-0 border-[#D9B18B] bg-white/40 p-3 sm:p-5">

        {/* MONTH NAVIGATION */}
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            disabled={
              currentMonth.getFullYear() === today.getFullYear() &&
              currentMonth.getMonth() === today.getMonth()
            }
            onClick={() => changeMonth(-1)}
            className="rounded-lg border border-gray-300 p-2 text-[#D18B48] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={19} />
          </button>

          <h3 className="font-serif text-xl font-bold text-[#191A2C] sm:text-2xl">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="rounded-lg border border-gray-300 p-2 text-[#D18B48] transition hover:bg-white"
          >
            <ChevronRight size={19} />
          </button>
        </div>

        {loading ? (
          <div className="flex h-[310px] items-center justify-center text-sm text-gray-500">
            Loading availability...
          </div>
        ) : (
          <DatePicker
            inline
            selectsRange
            startDate={checkIn}
            endDate={checkOut}
            selected={checkIn}
            onChange={handleDateChange}
            minDate={today}
            openToDate={currentMonth}
            onMonthChange={setCurrentMonth}
            monthsShown={1}
            dayClassName={getDateType}
            showOtherMonths={false}
            fixedHeight
            filterDate={(date) => {
              const current = new Date(date);
              current.setHours(0, 0, 0, 0);

              return (
                current >= today &&
                !isUnavailable(date)
              );
            }}
            calendarClassName="booking-datepicker"
          />
        )}

        {/* LEGEND */}
        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-3 border-t border-[#D9B18B] pt-4 text-[11px] text-[#5C6470] sm:text-xs">

          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded bg-[#F1C99F]" />
            Available
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded bg-[#ADB8D6]" />
            Booked
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-3.5 w-3.5 rounded"
              style={{
                background:
                  "linear-gradient(135deg,#F1C99F 50%,#ADB8D6 50%)",
              }}
            />
            Check-In
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-3.5 w-3.5 rounded"
              style={{
                background:
                  "linear-gradient(315deg,#F1C99F 50%,#ADB8D6 50%)",
              }}
            />
            Check-Out
          </div>

          <div className="flex items-center gap-2">
            <span className="relative h-3.5 w-3.5 overflow-hidden rounded bg-[#ADB8D6]">
              <span className="absolute left-[-20%] top-1/2 h-[2px] w-[140%] -rotate-45 bg-black" />
            </span>
            Turnover
          </div>
        </div>
      </div>

      {/* BUTTON */}
      <button
        type="button"
        disabled={!checkIn || !checkOut}
        onClick={onCheckAvailability}
        className="mt-5 w-full rounded-xl bg-[#171729] px-6 py-4 text-xs font-bold tracking-[1.5px] text-white transition duration-300 hover:bg-[#D18B48] disabled:cursor-not-allowed disabled:opacity-40"
      >
        CHECK AVAILABILITY →
      </button>

      {/* INLINE STYLES */}
      <style>{`
        .booking-calendar-shell .booking-datepicker {
          width: 100% !important;
          border: none !important;
          background: transparent !important;
          font-family: inherit;
        }

        .booking-calendar-shell .react-datepicker__month-container {
          width: 100%;
          float: none;
        }

        .booking-calendar-shell .react-datepicker__header {
          background: transparent;
          border: none;
          padding-bottom: 12px;
        }

        .booking-calendar-shell .react-datepicker__current-month {
          display: none;
        }

        .booking-calendar-shell .react-datepicker__day-names,
        .booking-calendar-shell .react-datepicker__week {
          display: flex;
          justify-content: space-between;
        }

        .booking-calendar-shell .react-datepicker__day-name {
          flex: 1;
          height: 34px;
          line-height: 34px;
          margin: 2px;
          color: #D18B48;
          font-size: 12px;
          font-weight: 700;
        }

        .booking-calendar-shell .react-datepicker__day {
          flex: 1;
          height: 39px;
          line-height: 39px;
          margin: 3px;
          border-radius: 9px;
          font-size: 13px;
          transition: background .2s, transform .2s;
        }

        .booking-calendar-shell .react-datepicker__day:not(.react-datepicker__day--disabled):hover {
          background: #D18B48 !important;
          color: white !important;
          transform: translateY(-2px);
        }

        .booking-calendar-shell .available-day {
          background: #F1C99F !important;
          color: #222 !important;
        }

        .booking-calendar-shell .blocked-day {
          background: #ADB8D6 !important;
          color: #222 !important;
          opacity: .7;
        }

        .booking-calendar-shell .checkin-day {
          background: linear-gradient(135deg,#F1C99F 50%,#ADB8D6 50%) !important;
          color: #222 !important;
        }

        .booking-calendar-shell .checkout-day {
          background: linear-gradient(315deg,#F1C99F 50%,#ADB8D6 50%) !important;
          color: #222 !important;
        }

        .booking-calendar-shell .turnover-day {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: #ADB8D6 !important;
          color: #222 !important;
        }

        .booking-calendar-shell .turnover-day::after {
          content: "";
          position: absolute;
          width: 180%;
          height: 2px;
          background: #171717;
          top: 50%;
          left: -40%;
          transform: rotate(-45deg);
          pointer-events: none;
        }

        .booking-calendar-shell .past-day {
          background: #E5E5E5 !important;
          color: #A0A0A0 !important;
          opacity: .5;
        }

        .booking-calendar-shell .react-datepicker__day--selected,
        .booking-calendar-shell .react-datepicker__day--range-start,
        .booking-calendar-shell .react-datepicker__day--range-end {
          background: #D18B48 !important;
          color: white !important;
        }

        .booking-calendar-shell .react-datepicker__day--in-range {
          background: #E8B985 !important;
          color: #222 !important;
        }

        .booking-calendar-shell .react-datepicker__day--disabled {
          cursor: not-allowed;
        }

        .booking-calendar-shell .react-datepicker__day--outside-month {
          visibility: hidden;
        }

        .booking-calendar-shell .react-datepicker__navigation {
          display: none;
        }

        @media (max-width: 480px) {
          .booking-calendar-shell .react-datepicker__day {
            height: 34px;
            line-height: 34px;
            margin: 2px;
            font-size: 11px;
          }

          .booking-calendar-shell .react-datepicker__day-name {
            height: 30px;
            line-height: 30px;
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
