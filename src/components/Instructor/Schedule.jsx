import React, { useState, useEffect } from "react";

import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";
import axios from "../../axios";
import { useLoading } from "../../LoadingContext";

// Setup date-fns localization
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyBigCalendar = ({ events }) => {
  const { setIsLoading } = useLoading();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [slotDetails, setSlotDetails] = useState(null);

  const handleSelectEvent = async (event) => {
    try {
      setIsLoading(true);
      setSelectedSlot(event);
      setModalOpen(true);

      // Fetch details for the selected slot
      const response = await axios.get(
        `/items/Availability/${event.id}?fields=*,booking.learner.user_id.*,booking.package.,booking.package.lessons.Lessons_id.*`
      );
      setSlotDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching slot details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-4  min-h-screen">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: event.duration === 1 ? "#38bdf8" : "#0ea5e9",
            color: "white",
            borderRadius: "5px",
            border: "none",
          },
        })}
        className=" rounded-lg"
      />

      {modalOpen && slotDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-3xl w-full overflow-y-auto max-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-sky-600">Slot Details</h2>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => setModalOpen(false)}
              >
                ✖
              </button>
            </div>

            {/* Slot Details */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Slot Information
              </h3>
              <p>
                <strong>ID:</strong> {slotDetails.id}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-600 font-medium">
                  {slotDetails.status}
                </span>
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {new Date(slotDetails.start_datetime).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {new Date(slotDetails.end_datetime).toLocaleString()}
              </p>
              <p>
                <strong>Instructor ID:</strong> {slotDetails.instructor}
              </p>
            </div>

            {/* Learner Information */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Learner Information
              </h3>
              <div className="flex items-center gap-4">
                <img
                  src={
                    slotDetails?.booking?.learner?.user_id?.profileImg ||
                    "https://via.placeholder.com/80"
                  }
                  alt="Learner Avatar"
                  className="w-20 h-20 rounded-full shadow-md"
                />
                <div>
                  <p>
                    <strong>Name:</strong>{" "}
                    {`${slotDetails?.booking?.learner?.user_id?.first_name ||
                      "N/A"} ${slotDetails?.booking?.learner?.user_id
                      ?.last_name || "N/A"}`}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {slotDetails?.booking?.learner?.user_id?.email || "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {slotDetails?.booking?.learner?.user_id?.phoneNumber ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {`${slotDetails?.booking?.learner?.user_id?.city ||
                      "N/A"}, ${slotDetails?.booking?.learner?.user_id?.state ||
                      "N/A"}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Lesson Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Lesson Details
              </h3>
              <div className="space-y-4">
                {slotDetails?.booking?.package?.lessons?.map(
                  (lesson, index) => (
                    <div
                      key={lesson?.Lessons_id?.id || index}
                      className="p-4 border rounded-lg shadow-sm bg-gray-50"
                    >
                      <h4 className="text-md font-semibold text-sky-600 mb-1">
                        Lesson {index + 1}:{" "}
                        {lesson?.Lessons_id?.lesson_name || "N/A"}
                      </h4>
                      <p>
                        <strong>Description:</strong>{" "}
                        {lesson?.Lessons_id?.lesson_description || "N/A"}
                      </p>
                      <p>
                        <strong>Duration:</strong>{" "}
                        {lesson?.Lessons_id?.Lesson_duration || "N/A"} hour(s)
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
                onClick={() => setModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SchedulePage = () => {
  const { setIsLoading } = useLoading();
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Schedule Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/items/Booking?filter[package].[Instructor][_eq]=${localStorage.getItem(
            "instructorId"
          )}&fields=id,date_created,package.price,learner.user_id.profileImg,learner.user_id.first_name,learner.user_id.last_name,package.Instructor.user_id.profileImg,package.Instructor.user_id.first_name,package.Instructor.user_id.last_name`
        );

        const formattedData = response.data.data.map((item) => ({
          id: item.id,
          date: new Date(item.date_created).toDateString(),
          price: item.package.price,
          instructor: {
            name: `${item.package.Instructor.user_id.first_name} ${item.package.Instructor.user_id.last_name}`,
            image: item.package.Instructor.user_id.profileImg,
          },
          learner: {
            name: `${item.learner.user_id.first_name} ${item.learner.user_id.last_name}`,
            image: item.learner.user_id.profileImg,
          },
        }));

        setScheduleData(formattedData);
      } catch (error) {
        console.error("Error fetching schedule data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch Booking Details for Modal
  const handleCardClick = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/items/Booking/${id}?fields=package.*,package.lessons.Lessons_id.*,learner.*,learner.user_id.*`
      );
      setSelectedBooking(response.data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Schedule Cards */}
      <div className=" w-full bg-white border-b-2 border-solid border-slate-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scheduleData.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col gap-2 cursor-pointer hover:shadow-lg"
              onClick={() => handleCardClick(item.id)}
            >
              {/* Instructor */}
              <div className="flex items-center gap-4  border-b-2 border-solid border-gray-300 pb-4">
                <img
                  src={item.instructor.image}
                  alt={item.instructor.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 p-1"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    <strong>Instructor:</strong> {item.instructor.name}
                  </h3>
                  <p className="text-sm text-gray-500">Date: {item.date}</p>
                </div>
              </div>
              {/* Learner */}
              <div className="flex items-center gap-4">
                <img
                  src={item.learner.image}
                  alt={item.learner.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 p-1"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    <strong>Learner:</strong> {item.learner.name}
                  </h3>
                  <p className="text-sm text-gray-500">Price: ${item.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-3xl w-full overflow-y-auto max-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-sky-600">
                Booking Details
              </h2>
              <button
                className="text-red-500 hover:text-red-700 text-2xl"
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>
            </div>

            {/* Package Details */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Package Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <p>
                  <strong>Name:</strong> {selectedBooking.package.name}
                </p>
                <p>
                  <strong>Plan Type:</strong>{" "}
                  {selectedBooking.package.Plan_Type}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {selectedBooking.package.Description}
                </p>
                <p>
                  <strong>Discount:</strong>{" "}
                  <span className="text-green-600">
                    {selectedBooking.package.Discount}%
                  </span>
                </p>
                <p>
                  <strong>Price:</strong> ${selectedBooking.package.price}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedBooking.package.duration}{" "}
                  hours
                </p>
              </div>
            </div>

            {/* Learner Information */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Learner Information
              </h3>
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedBooking.learner.user_id.profileImg ||
                    "https://via.placeholder.com/80"
                  }
                  alt="Learner Avatar"
                  className="w-20 h-20 rounded-full shadow-md"
                />
                <div className="text-gray-600">
                  <p>
                    <strong>ID:</strong> {selectedBooking.learner.id}
                  </p>
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedBooking.learner.user_id.first_name}{" "}
                    {selectedBooking.learner.user_id.last_name}
                  </p>
                  <p>
                    <strong>Last Active:</strong>{" "}
                    {selectedBooking.learner.Last_active_date}
                  </p>
                  <p>
                    <strong>Is Banned:</strong>{" "}
                    {selectedBooking.learner.isLearnerBan === "false"
                      ? "No"
                      : "Yes"}
                  </p>
                </div>
              </div>
            </div>

            {/* Lesson Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Lesson Details
              </h3>
              <div className="space-y-4">
                {selectedBooking.package.lessons.map((lesson, index) => (
                  <div
                    key={lesson.Lessons_id?.id}
                    className="p-4 border rounded-lg shadow-sm bg-gray-50"
                  >
                    <h4 className="text-lg text-md font-bold text-sky-600 mb-1">
                      {lesson.Lessons_id?.lesson_name}
                    </h4>
                    <p className="text-gray-700">
                      <strong>Description:</strong>{" "}
                      {lesson.Lessons_id?.lesson_description}
                    </p>
                    <p className="text-gray-700">
                      <strong>Duration:</strong>{" "}
                      {lesson.Lessons_id?.Lesson_duration} hour(s)
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Schedule = () => {
  const [events, setEvents] = useState([]);

  const [activeTab, setActiveTab] = useState("schedule");
  const { setIsLoading } = useLoading();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/items/Availability?filter[instructor][_eq]=${localStorage.getItem(
          "instructorId"
        )}&filter[status][_eq]=booked&filter[start_datetime][_gte]=` +
          new Date().toISOString()
      );

      const formattedEvents = response.data.data.map((slot) => ({
        id: slot.id,
        title: `${slot.duration}-hour slot`,
        start: new Date(slot.start_datetime),
        end: new Date(slot.end_datetime),
        duration: slot.duration,
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSlots();
  }, []);
  return (
    <div className="flex flex-col items-center gap-4 py-4  ">
      {/* Toggle Buttons */}
      <div className="flex justify-center gap-4 w-full max-w-md">
        <button
          onClick={() => handleTabChange("schedule")}
          className={`px-6 py-2 rounded-md text-lg font-semibold transition-all duration-300 ${
            activeTab === "schedule"
              ? "bg-sky-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-sky-100"
          }`}
        >
          Schedule
        </button>
        <button
          onClick={() => handleTabChange("calendar")}
          className={`px-6 py-2 rounded-md text-lg font-semibold transition-all duration-300 ${
            activeTab === "calendar"
              ? "bg-sky-500 text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-sky-100"
          }`}
        >
          Calendar
        </button>
      </div>

      {/* Content Rendering */}
      <div className="p-6 w-full bg-white rounded-lg shadow-lg">
        {activeTab === "schedule" && (
          <>
            <h2 className="text-3xl border-b-2 border-slate-300 pb-2 font-semibold text-sky-600 mb-4">
              Schedule Page
            </h2>
            <SchedulePage />
          </>
        )}
        {activeTab === "calendar" && (
          <>
            <h2 className="text-3xl border-b-2 border-slate-300 pb-2 font-semibold text-sky-600 mb-4">
              Calendar
            </h2>
            <MyBigCalendar events={events} />
          </>
        )}
      </div>
    </div>
  );
};

export default Schedule;
