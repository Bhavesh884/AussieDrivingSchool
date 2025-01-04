import React, { useState, useEffect, useRef } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, set } from "date-fns";
import axios from "../../axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";
import { useLoading } from "../../LoadingContext";
import { handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ModalComponent = ({ firstSlot, secondSlot, onClose, onSubmit }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-[9999999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Confirm Selection
        </h2>
        <div className="mb-4">
          <p>
            <strong>First Slot:</strong> {firstSlot?.title}
          </p>
          <p>
            {firstSlot?.start.toLocaleString()} -{" "}
            {firstSlot?.end.toLocaleString()}
          </p>
        </div>
        <div className="mb-4">
          <p>
            <strong>Second Slot:</strong> {secondSlot?.title}
          </p>
          <p>
            {secondSlot?.start.toLocaleString()} -{" "}
            {secondSlot?.end.toLocaleString()}
          </p>
        </div>
        <div className="flex justify-end gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={onSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const RescheduleSlots = ({
  selectedBookingId,
  slectedIntructorId,
  setRescheduleLessonModalOpen,
}) => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedFirstSlot, setSelectedFirstSlot] = useState(null);
  const [selectedSecondSlot, setSelectedSecondSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Ref for the second calendar
  const secondCalendarRef = useRef(null);
  const { setIsLoading } = useLoading();

  // Fetch "booked" slots for the first calendar
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/items/Booking/${selectedBookingId}?fields=Availability.*`
        );
        const slots = response.data.data.Availability.map((item) => ({
          id: item.id,
          start: new Date(item.start_datetime),
          end: new Date(item.end_datetime),
          title: `Booked - ${item.duration}hr`,
          duration: item.duration,
          status: item.status,
        }));
        setBookedSlots(slots);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookedSlots();
  }, []);

  // Fetch "not_booked" slots dynamically upon slot selection
  const fetchAvailableSlots = async (selectedDate, selectedDuration) => {
    try {
      setIsLoading(true);
      const formattedDate = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      const response = await axios.get(
        `/items/Availability?filter[instructor][_eq]=${slectedIntructorId}&filter[status][_eq]=not_booked&filter[start_datetime][_gte]=${formattedDate}`
      );
      const slots = response.data.data
        .map((item) => ({
          id: item.id,
          start: new Date(item.start_datetime),
          end: new Date(item.end_datetime),
          title: `Available - ${item.duration}hr`,
          duration: item.duration,
          status: item.status,
        }))
        .filter((slot) => slot.duration === selectedDuration); // Filter by duration

      setAvailableSlots(slots);

      // Smooth scroll to the second calendar
      if (secondCalendarRef.current) {
        secondCalendarRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle slot selection for the first calendar
  const handleFirstSlotClick = (slot) => {
    setSelectedFirstSlot(slot);
    fetchAvailableSlots(slot.start, slot.duration);
  };

  // Handle slot selection for the second calendar
  const handleSecondSlotClick = (slot) => {
    setSelectedSecondSlot(slot);
    setShowModal(true);
  };

  // Submit data to the API
  const handleSubmit = async () => {
    const payload = [
      {
        id: selectedFirstSlot.id,
        status: "not_booked",
        booking: null,
      },
      {
        id: selectedSecondSlot.id,
        status: "booked",
        booking: selectedBookingId,
      },
    ];

    try {
      setIsLoading(true);
      const response = await axios.patch("/items/Availability", payload);
      console.log(response.data);
      handleSuccess("Slots updated successfully!");
      setShowModal(false);
      setSelectedFirstSlot(null);
      setSelectedSecondSlot(null);
      setRescheduleLessonModalOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* First Calendar */}
      <div className="mb-6 border-slate-300 border rounded-lg p-4">
        <h1 className="text-2xl font-bold mb-2 text-gray-700">Booked Slots</h1>
        <Calendar
          localizer={localizer}
          events={bookedSlots}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={(slotInfo) => handleFirstSlotClick(slotInfo)}
          onSelectEvent={(event) => handleFirstSlotClick(event)}
          views={["month", "week", "day"]}
        />
      </div>
      <hr className="my-4 border-slate-300 border-2" />
      {/* Second Calendar */}
      {availableSlots.length > 0 && (
        <div
          ref={secondCalendarRef}
          className="my-6 border-slate-300 border rounded-lg p-4"
        >
          <h1 className="text-2xl font-bold mb-2 text-gray-700">
            Available Slots
          </h1>
          <Calendar
            localizer={localizer}
            events={availableSlots}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            selectable
            onSelectSlot={(slotInfo) => handleSecondSlotClick(slotInfo)}
            onSelectEvent={(event) => handleSecondSlotClick(event)}
            views={["month", "week", "day"]}
          />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ModalComponent
          firstSlot={selectedFirstSlot}
          secondSlot={selectedSecondSlot}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default RescheduleSlots;
