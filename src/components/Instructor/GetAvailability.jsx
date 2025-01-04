import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./customCalendar.css";
import axios from "../../axios";
import { MdDeleteOutline } from "react-icons/md";
import { useLoading } from "../../LoadingContext";
import Modal from "react-modal";

const localizer = momentLocalizer(moment);

const GetAvailability = () => {
  const [events, setEvents] = useState([]);
  const [keys, setkeys] = useState([]); // Stores selected slot IDs
  const { setIsLoading } = useLoading();
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  // Helper function to convert UTC to IST
  const convertToIST = (dateTime) => {
    return moment
      .utc(dateTime)
      .tz("Asia/Kolkata")
      .toDate();
  };

  // Fetch availability data from the API
  const getUserAvailability = async () => {
    try {
      setIsLoading(true);
      const instructorId = localStorage.getItem("instructorId");
      if (!instructorId) {
        console.error("Instructor ID not found in localStorage");
        return;
      }

      const response = await axios.get(
        `/items/Availability?filter[instructor][_eq]=${instructorId}&filter[status][_eq]=not_booked`
      );

      const apiData = response.data.data;
      const mappedEvents = apiData.map((slot) => ({
        id: slot.id,
        title: `${slot.duration}-hour slot`,
        start: convertToIST(slot.start_datetime),
        end: convertToIST(slot.end_datetime),
        duration: slot.duration,
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle slot selection
  const handleSelectSlot = ({ start, end }) => {
    const selectedSlot = events.find(
      (event) =>
        event.start.getTime() === start.getTime() &&
        event.end.getTime() === end.getTime()
    );

    if (selectedSlot) {
      const isAlreadySelected = keys.includes(selectedSlot.id);
      if (!isAlreadySelected) {
        setkeys((prev) => [...prev, selectedSlot.id]);
      } else {
        setkeys((prev) => prev.filter((id) => id !== selectedSlot.id));
      }
    }
  };

  // Event style customization
  const eventStyleGetter = (event) => {
    const isSelected = keys.includes(event.id);
    const backgroundColor = isSelected
      ? "red"
      : event.duration === 1
      ? "#48D1CC"
      : "#89CFF0";

    return {
      style: {
        backgroundColor,
        color: "white",
        padding: "5px",
        borderRadius: "5px",
      },
    };
  };

  const DeleteAvailability = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/items/Availability`, {
        data: { keys: keys },
      });
      getUserAvailability();
      setkeys([]);
      setSummaryModalOpen(false);
    } catch (error) {
      console.error("Error deleting availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserAvailability();
  }, []);

  return (
    <div className="h-[700px] py-4">
      <div className="flex justify-between items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold mb-4">Availability Calendar</h2>

        <button
          className="p-2 bg-red-500 hover:bg-red-700 text-white rounded flex gap-2 items-center"
          onClick={() => setSummaryModalOpen(true)}
          disabled={keys.length === 0}
        >
          <MdDeleteOutline size={20} />
          Delete Selected Slots
        </button>
      </div>

      <Modal
        isOpen={summaryModalOpen}
        onRequestClose={() => setSummaryModalOpen(false)}
        contentLabel="Selected Slots Summary"
        className="modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-scroll"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-[9999]"
      >
        <div className="relative flex flex-col h-full">
          {/* Modal Header */}
          <h2 className="text-lg font-semibold mb-4 p-4 border-b">
            Selected Slots Summary
          </h2>

          {/* Scrollable Content */}
          <div className="overflow-y-scroll max-h-[400px] flex flex-wrap gap-4 p-6">
            {keys.map((id) => {
              const slot = events.find((event) => event.id === id);
              return (
                <div
                  key={id}
                  className={`p-4 bg-gray-100 rounded shadow-md border w-full md:w-[48%]`}
                >
                  <p>
                    <strong>Date:</strong>{" "}
                    {moment(slot.start).format("DD MMM YYYY")}
                  </p>
                  <p>
                    <strong>Start:</strong>{" "}
                    {moment(slot.start).format("hh:mm A")}
                  </p>
                  <p>
                    <strong>End:</strong> {moment(slot.end).format("hh:mm A")}
                  </p>
                  <p>
                    <strong>Duration:</strong> {slot.duration} hour(s)
                  </p>
                </div>
              );
            })}
          </div>

          {/* Footer with Buttons */}
          <div className="flex justify-end gap-4 p-4 border-t">
            <button
              className="p-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
              onClick={() => setSummaryModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="p-2 bg-red-500 hover:bg-red-700 text-white rounded"
              onClick={DeleteAvailability}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>

      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectSlot}
        eventPropGetter={eventStyleGetter}
        defaultView="day"
        views={["day", "week", "month"]}
        step={60}
        timeslots={1}
        min={moment()
          .tz("Asia/Kolkata")
          .startOf("day")
          .toDate()} // 12:00 AM
        max={moment()
          .tz("Asia/Kolkata")
          .endOf("day")
          .toDate()} // 11:59 PM
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
};

export default GetAvailability;
