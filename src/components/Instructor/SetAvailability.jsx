import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./customCalendar.css";
import axios from "../../axios";
import { useLoading } from "../../LoadingContext";

const localizer = momentLocalizer(moment);

const SetAvailability = ({ setAvailabilityBool }) => {
  const [slots, setSlots] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [selectedSlots, setSelectedSlots] = useState([]);

  const generateSlotsForDuration = (currentDate, newSlots, hours) => {
    const formattedDate = currentDate.format("YYYY-MM-DD");
    const startDateTime = moment.tz(
      `${formattedDate}T${startTime}`,
      "Asia/Kolkata"
    );
    const endDateTime = moment.tz(
      `${formattedDate}T${endTime}`,
      "Asia/Kolkata"
    );

    let currentSlotStart = moment(startDateTime);

    while (currentSlotStart.isBefore(endDateTime)) {
      const currentSlotEnd = currentSlotStart.clone().add(hours, "hours");

      if (currentSlotEnd.isAfter(endDateTime)) break;

      newSlots.push({
        instructor: localStorage.getItem("instructorId"),
        start_datetime: currentSlotStart.toISOString(),
        end_datetime: currentSlotEnd.toISOString(),
        duration: hours,
        status: "not_booked",
      });

      currentSlotStart = currentSlotEnd.clone();
    }
  };

  const generateSlots = () => {
    const newSlots = [];

    // Set start and end date correctly at midnight in IST
    let currentDate = moment.tz(startDate, "Asia/Kolkata").startOf("day");
    const endDateMoment = moment.tz(endDate, "Asia/Kolkata").endOf("day");

    while (currentDate.isSameOrBefore(endDateMoment, "day")) {
      if (duration === "1" || duration === "both") {
        generateSlotsForDuration(currentDate.clone(), newSlots, 1);
      }
      if (duration === "2" || duration === "both") {
        generateSlotsForDuration(currentDate.clone(), newSlots, 2);
      }
      currentDate = currentDate.add(1, "day"); // Increment date by one day in IST
    }

    const uniqueSlots = [
      ...slots,
      ...newSlots.filter(
        (slot) =>
          !slots.some(
            (existing) =>
              existing.start_datetime === slot.start_datetime &&
              existing.end_datetime === slot.end_datetime
          )
      ),
    ];
    setSlots(uniqueSlots);
  };

  const handleEventClick = (event) => {
    const slotIndex = selectedSlots.findIndex(
      (slot) =>
        slot.start_datetime === event.start && slot.end_datetime === event.end
    );

    if (slotIndex !== -1) {
      setSelectedSlots(selectedSlots.filter((_, index) => index !== slotIndex));
    } else {
      setSelectedSlots([...selectedSlots, event]);
    }
  };

  const getEventStyle = (event) => {
    let backgroundColor = event.duration === 1 ? "#48D1CC" : "#89CFF0";
    if (
      selectedSlots.some(
        (slot) => slot.start === event.start && slot.end === event.end
      )
    ) {
      backgroundColor = "#2196f3";
    }
    return {
      style: { backgroundColor, color: "white", borderRadius: "5px" },
    };
  };
  const { setIsLoading } = useLoading();

  const postSlots = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post("/items/Availability", slots);
      console.log("Slots posted successfully:", res);
      setSlots([]);
      setSelectedSlots([]);
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setEndTime("");
      setDuration("1");
      setAvailabilityBool("get");
    } catch (error) {
      console.error("Error posting slots:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6  bg-white overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-4">Set Availability</h1>
      <div className="w-full border border-solid border-slate-300 p-6 rounded-lg shadow-md">
        <div className="flex justify-between gap-4 flex-wrap md:flex-nowrap">
          <div className="mb-4 w-full md:w-1/2">
            <label className="block mb-2 text-sm font-semibold">
              Start Date
            </label>
            <input
              type="date"
              className="w-full p-2 mb-4 border rounded-md"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mb-4 w-full md:w-1/2">
            <label className="block mb-2 text-sm font-semibold">End Date</label>
            <input
              type="date"
              className="w-full p-2 mb-4 border rounded-md"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between gap-4 flex-wrap md:flex-nowrap">
          <div className="mb-4 w-full md:w-1/2">
            <label className="block mb-2 text-sm font-semibold">
              Start Time
            </label>
            <input
              type="time"
              className="w-full p-2 mb-4 border rounded-md"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="mb-4 w-full md:w-1/2">
            <label className="block mb-2 text-sm font-semibold">End Time</label>
            <input
              type="time"
              className="w-full p-2 mb-4 border rounded-md"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        <label className="block mb-2 text-sm">Duration (hours)</label>
        <select
          className="w-full p-2 mb-4 border rounded-md"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        >
          <option value="1">1 Hour</option>
          <option value="2">2 Hours</option>
          <option value="both">Both</option>
        </select>

        <div className="flex gap-4 justify-between">
          <button
            onClick={() => {
              // smoothscroll to 400px
              window.scrollTo({ top: 300, behavior: "smooth" });
              generateSlots();
            }}
            className="w-full p-2 bg-indigo-600 text-white rounded-md"
          >
            Generate Slots
          </button>
        </div>
      </div>
      <div className="flex gap-4 justify-between items-center mt-8">
        <div className="text-3xl font-bold ">My Availability</div>
        <button
          onClick={postSlots}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md"
        >
          Post Slots
        </button>
      </div>
      <div className="mt-10">
        <Calendar
          localizer={localizer}
          className="p-4 px-6 bg-white rounded-lg shadow-md border border-solid border-slate-300"
          events={slots.map((slot) => ({
            ...slot,
            title: `${slot.duration} Hour Slot`,
            start: moment(slot.start_datetime).toDate(),
            end: moment(slot.end_datetime).toDate(),
          }))}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={handleEventClick}
          eventPropGetter={getEventStyle}
        />
      </div>
    </div>
  );
};

export default SetAvailability;
