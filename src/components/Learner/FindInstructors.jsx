import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FaSearch, FaFilter, FaArrowLeft, FaStar } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import {
  handleError,
  handleSuccess,
  handleWarning,
} from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { useLoading } from "../../LoadingContext";

import { loadStripe } from "@stripe/stripe-js";
import PaymentSuccessPage from "./PaymentSucessful";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51QSK69Ruhc1bo2OWTbJUd9tswR7jHIkEr2fzNDPToS7QA0GWxoz5mAj8usTmTEEgwRJqbJ5IqEYYMqMR4K0wjxoi00U36WNYRs"
);

Modal.setAppElement("#root"); // Set the root for accessibility

// Component for displaying stars based on rating
export const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="text-yellow-500" />
      ))}
      {halfStar && <FaStar className="text-yellow-500 opacity-50" />}
    </div>
  );
};

export const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white rounded-lg p-6 mb-6 border border-solid border-slate-300">
    <p className="text-gray-700 mb-4">{testimonial?.Reviews}</p>
    <div className="flex items-center">
      <img
        src={testimonial?.Given_by?.user_id?.profileImg}
        alt={testimonial?.Given_by?.user_id?.first_name}
        className="w-10 h-10 rounded-full mr-3 shrink-0 object-cover"
      />
      <div>
        <p className="font-semibold">
          {testimonial?.Given_by?.user_id?.first_name}{" "}
          {testimonial?.Given_by?.user_id?.last_name}
        </p>
        <p className="text-gray-500 text-sm">
          {" "}
          {new Date(testimonial?.date_created).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  </div>
);

export const Testimonials = ({ testimonials }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 2;
  const filteredTestimonials = testimonials.filter(
    (testimonial) => testimonial?.Reviews
  );

  const totalPages = Math.ceil(
    filteredTestimonials.length / testimonialsPerPage
  );

  // Get current testimonials to display based on pagination
  const currentTestimonials = filteredTestimonials.slice(
    (currentPage - 1) * testimonialsPerPage,
    currentPage * testimonialsPerPage
  );

  // Pagination functions
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 py-6 border border-solid border-slate-300 rounded-xl mt-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
        Testimonials
      </h2>
      {currentTestimonials.length > 0 ? (
        <div>
          {currentTestimonials?.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="text-blue-500 p-2 px-3 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50 border border-solid border-slate-300"
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`p-2 px-3 rounded-md border border-solid border-slate-300 ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "text-blue-500"
                } hover:bg-blue-200`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="text-blue-500 p-2 px-3 rounded-md bg-blue-100 hover:bg-blue-200 disabled:opacity-50 border border-solid border-slate-400"
            >
              &gt;
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center text-gray-500 font-semibold text-lg">
          No Reviews Yet
        </div>
      )}
    </div>
  );
};

const AvailabilitySchedule = ({ setAvailabilityFlag, selectedPackage }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  // const DeleteAvailability = async (overlappingSlots) => {
  //   const keys = overlappingSlots.map((slot) => slot.id);
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.delete(`/items/Availability`, {
  //       data: { keys: keys }, // Specify data explicitly here
  //     });
  //     console.log(response.data);
  //     getAvailability();
  //     navigate("/learnerpage");
  //   } catch (error) {
  //     console.error("Error deleting availability:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const findOverlappingAvailabilities = (selectedSlots, slots) => {
  //   // Step 1: Extract unique dates from selected slots
  //   const selectedDates = new Set(
  //     selectedSlots.map(
  //       (slot) => new Date(slot.start_datetime).toISOString().split("T")[0]
  //     )
  //   );

  //   // Step 2: Filter slots that fall on the selected dates
  //   const slotsOnSelectedDates = slots.filter((slot) => {
  //     const slotDate = new Date(slot.start_datetime)
  //       .toISOString()
  //       .split("T")[0];
  //     return selectedDates.has(slotDate);
  //   });

  //   // Step 3: Helper function to check if two time ranges overlap
  //   const isOverlapping = (slot1, slot2) => {
  //     return (
  //       new Date(slot1.start_datetime) < new Date(slot2.end_datetime) &&
  //       new Date(slot1.end_datetime) > new Date(slot2.start_datetime)
  //     );
  //   };

  //   // Step 4: Find overlapping slots, excluding the selected slots themselves
  //   const overlappingSlots = slotsOnSelectedDates.filter((slot) =>
  //     selectedSlots.some(
  //       (selectedSlot) =>
  //         slot.id !== selectedSlot.id && isOverlapping(selectedSlot, slot)
  //     )
  //   );

  //   return overlappingSlots;
  // };

  // const MarkAvailability = async () => {
  //   try {
  //     setIsLoading(true);
  //     // Create the payload by mapping over selectedSlots
  //     const payload = selectedSlots.map((slot) => ({
  //       id: slot.id,
  //       status: "booked",
  //     }));

  //     // Send the PATCH request with the payload
  //     const response = await axios.patch(`items/Availability/`, payload);

  //     console.log(response);

  //     const overlappingSlots = findOverlappingAvailabilities(
  //       selectedSlots,
  //       slots
  //     );
  //     // console.log(overlappingSlots);
  //     DeleteAvailability(overlappingSlots);
  //     setSelectedSlots([]);
  //   } catch (error) {
  //     console.log("Error marking availability:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const createBooking = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.post("items/Booking", {
  //       learner: localStorage.getItem("LearnerId"),
  //       package: selectedPackage.id,
  //       status: "pending",
  //       Availability: selectedSlots.map((slot) => slot.id),
  //     });
  //     console.log(response.data);
  //     MarkAvailability();
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const loadStripePayment = async () => {
    const stripe = await stripePromise;

    try {
      // createBooking();
      // handleSuccess("Payment successful!");

      localStorage.setItem(
        "selectedPackage",
        JSON.stringify(selectedPackage.id)
      );
      localStorage.setItem(
        "selectedSlotsIds",
        JSON.stringify(selectedSlots.map((slot) => slot.id))
      );
      localStorage.setItem("selectedSlots", JSON.stringify(selectedSlots));
      localStorage.setItem("slots", JSON.stringify(slots));
      // Proceed to redirect the user to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        lineItems: [
          {
            price: "price_1QSKrJRuhc1bo2OWr2OCtDUN", // Replace with your actual Price ID
            quantity: 1,
          },
        ],
        mode: "payment",
        successUrl: `${window.location.origin}/paymentsuccess`, // Use the current URL with success=true
        cancelUrl: `${window.location.origin}/paymentfailed`, // Use the current URL with success=false
      });

      if (result.error) {
        console.error("Error during payment processing:", result.error);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  const getAvailability = async () => {
    const now = new Date();
    const formattedDateTime = now.toISOString().split(".")[0];
    console.log("formattedDateTime", formattedDateTime);

    try {
      setIsLoading(true);
      const response = await axios(
        `items/Availability?filter[instructor][_eq]=${selectedPackage.Instructor}&filter[status][_eq]=not_booked&filter[start_datetime][_gte]=${formattedDateTime}`
      );
      setSlots(response.data.data);
    } catch (error) {
      handleError("Error in fetching details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAvailability();
  }, []);

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const weekDay = date.toLocaleDateString("en-US", { weekday: "short" });
    return { day, month, weekDay, fullDate: date.toDateString() };
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    const { fullDate, day, month, weekDay } = formatDate(slot.start_datetime);
    if (!acc[fullDate]) acc[fullDate] = { day, month, weekDay, slots: [] };
    acc[fullDate].slots.push({
      ...slot,
      time: formatTime(slot.start_datetime),
    });
    return acc;
  }, {});

  const dates = Object.keys(groupedSlots).map((key) => ({
    fullDate: key,
    day: groupedSlots[key].day,
    month: groupedSlots[key].month,
    weekDay: groupedSlots[key].weekDay,
    slots: groupedSlots[key].slots,
  }));

  const currentSlots = selectedDate
    ? dates.find((d) => d.fullDate === selectedDate).slots
    : [];

  const toggleSlot = (slot) => {
    let updatedSlots = [...selectedSlots];
    if (updatedSlots.find((s) => s.id === slot.id)) {
      updatedSlots = updatedSlots.filter((s) => s.id !== slot.id);
    } else {
      updatedSlots.push(slot);
    }

    const totalDuration = updatedSlots.reduce((sum, s) => sum + s.duration, 0);

    if (totalDuration <= selectedPackage.duration) {
      setSelectedSlots(updatedSlots);
    } else {
      handleWarning(
        `You can only select slots totaling ${selectedPackage.duration} hours.`
      );
    }
  };
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  console.log("selectedSlots", selectedSlots);
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">
        Package Details
      </h2>

      <div className="border rounded-lg p-3 mb-3">
        <h2 className="text-xl border-b border-solid border-slate-300 font-bold text-blue-500 mb-2 pb-3">
          {selectedPackage.name}
        </h2>
        <p className="text-gray-600 mb-1">
          <strong>Type:</strong> {selectedPackage.Plan_Type}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Price:</strong> ${selectedPackage.price}
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Duration:</strong> {selectedPackage.duration} hours
        </p>
        <p className="text-gray-600 mb-1">
          <strong>Discount:</strong> {selectedPackage.Discount}%
        </p>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">
        Availability Schedule
      </h2>

      <div className="p-5">
        <p className="font-semibold text-gray-700 text-lg mb-3">Select Date</p>
        <div className="flex space-x-4 mb-6 overflow-x-auto">
          {dates.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(date.fullDate)}
              className={`flex flex-col items-center p-3 border rounded-lg w-20 ${
                selectedDate === date.fullDate
                  ? "border-blue-600 text-blue-600 bg-blue-100"
                  : "border-gray-300"
              } shadow hover:shadow-lg transition duration-200`}
            >
              <span className="text-lg font-bold">{date.day}</span>
              <span className="text-sm">{date.month}</span>
              <span className="text-sm">{date.weekDay}</span>
            </button>
          ))}
        </div>

        {selectedDate && (
          <>
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">1-Hour Slots:</h4>
              <div className="flex space-x-4 overflow-x-auto">
                {currentSlots
                  .filter((slot) => slot.duration === 1)
                  .map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => toggleSlot(slot)}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedSlots.some((s) => s.id === slot.id)
                          ? "bg-orange-500 text-white"
                          : "border-gray-300"
                      } shadow hover:shadow-lg transition duration-200`}
                    >
                      {slot.time}
                    </button>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">2-Hour Slots:</h4>
              <div className="flex space-x-4 overflow-x-auto">
                {currentSlots
                  .filter((slot) => slot.duration === 2)
                  .map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => toggleSlot(slot)}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedSlots.some((s) => s.id === slot.id)
                          ? "bg-orange-500 text-white"
                          : "border-gray-300"
                      } shadow hover:shadow-lg transition duration-200`}
                    >
                      {slot.time}
                    </button>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-4 justify-between items-center">
        <button
          onClick={() => setAvailabilityFlag(false)}
          className="flex items-center text-gray-700 px-4 py-2 rounded-lg hover:underline hover:text-blue-500 transition md:mb-2"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <button
          onClick={() => setSummaryModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-300"
        >
          Confirm Package & Pay
        </button>
        <Modal
          isOpen={summaryModalOpen}
          onRequestClose={() => setSummaryModalOpen(false)}
          contentLabel="Booking Summary"
          className="modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-scroll"
          overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 z-[9999]"
        >
          <div className="flex flex-col h-full">
            {/* Modal Header */}
            <h2 className="text-lg font-semibold mb-4 p-4 border-b">
              Booking Summary
            </h2>

            {/* Scrollable Content */}
            <div className="overflow-y-scroll max-h-[400px] flex flex-wrap gap-4 p-6">
              {selectedSlots.map((slot, index) => (
                <div
                  key={slot.id}
                  className="p-4 bg-gray-100 rounded shadow-md border w-[200px] flex-shrink-0"
                >
                  <p>
                    <strong>ID:</strong> {slot.id}
                  </p>
                  <p>
                    <strong>Date Created:</strong>{" "}
                    {new Date(slot.date_created).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time Created:</strong>{" "}
                    {new Date(slot.date_created).toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>User Created:</strong>{" "}
                    {slot.user_created || "Not Available"}
                  </p>
                  <p>
                    <strong>User Updated:</strong>{" "}
                    {slot.user_updated || "Not Available"}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer with Price and Buttons */}
            <div className="border-t p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Total Price: ${selectedSlots.length * 40}
                </h3>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="p-2 bg-gray-300 hover:bg-gray-400 text-black rounded"
                  onClick={() => setSummaryModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="p-2 bg-green-500 hover:bg-green-700 text-white rounded"
                  onClick={loadStripePayment}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
};

const GetPackages = ({ setPackageFlag, id }) => {
  const [packages, setPackages] = useState([]);
  const [availabilityFlag, setAvailabilityFlag] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const fetchAllPackages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/items/Packages?filter[Instructor][_eq]=${id}&fields=*,lessons.*,lessons.Lessons_id.*`
      );
      console.log(response.data.data);
      setPackages(response.data.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyLearner = () => {
    localStorage.getItem("LearnerId")
      ? setAvailabilityFlag(true)
      : navigate("/login");
  };

  useEffect(() => {
    fetchAllPackages();
  }, []);

  return (
    <>
      {availabilityFlag ? (
        <AvailabilitySchedule
          setAvailabilityFlag={setAvailabilityFlag}
          selectedPackage={selectedPackage}
        />
      ) : (
        <div className="mt-6 min-h-screen">
          <div className="flex mb-6 items-center">
            <FaArrowLeft
              className="mr-4 hover:cursor-pointer"
              size={20}
              onClick={() => setPackageFlag(false)}
            />
            <h1 className="text-3xl font-bold text-blue-600">
              Available Packages
            </h1>
          </div>
          {packages.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-white shadow-md rounded-lg p-4 hover:shadow-2xl transition-shadow duration-300 border-2 flex flex-col h-[380px] border-solid ${
                    pkg.id === selectedPackage?.id
                      ? "border-blue-500"
                      : "border-neutral-100"
                  } `}
                  onClick={() => {
                    setSelectedPackage(pkg);
                  }}
                >
                  <div className="flex-1 overflow-y-auto">
                    <h2 className="text-xl border-b border-solid border-slate-300 font-bold text-blue-500 mb-2 pb-3">
                      {pkg.name}
                    </h2>
                    <p className="text-gray-600 mb-1">
                      <strong>Type:</strong> {pkg.Plan_Type}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Price:</strong> ${pkg.price}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Duration:</strong> {pkg.duration} hours
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Discount:</strong> {pkg.Discount}%
                    </p>
                    {pkg.Description && (
                      <p className="text-gray-600 mb-2">
                        <strong>Description:</strong> {pkg.Description}
                      </p>
                    )}
                    {pkg.lessons.length > 0 && (
                      <div className="mb-2">
                        <p className="text-gray-700 font-semibold mb-1">
                          Lessons:
                        </p>
                        <ul className="list-disc list-inside text-gray-600">
                          {pkg.lessons.map(
                            (lesson, index) =>
                              lesson.Lessons_id && (
                                <li key={index}>
                                  <span className="font-semibold">
                                    {lesson.Lessons_id.lesson_name}
                                  </span>
                                  : {lesson.Lessons_id.lesson_description}
                                </li>
                              )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    className="mt-4 bg-slate-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-slate-600 transition-all"
                    onClick={verifyLearner}
                  >
                    Next
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="font-bold text-xl text-center text-gray-600 mt-20 min-h-screen">
              No Packages Available
            </div>
          )}
        </div>
      )}
    </>
  );
};

export const InstructorDetailModal = ({
  setModalInstructorDetailOpen,
  instructorFullDetails,
}) => {
  const [packageFlag, setPackageFlag] = useState(false);
  const {
    profileImg,
    first_name,
    last_name,
    city,
    state,
    pincode,
    locality,
  } = instructorFullDetails[0]?.user_id;

  const approvedVehicles = instructorFullDetails[0]?.vehicle.filter(
    (vehicle) => vehicle.is_vehicle_approved === "true"
  );

  return (
    <div className=" p-2 py-8">
      <button
        onClick={() => {
          setModalInstructorDetailOpen(false);
        }}
        className="flex items-center text-gray-700 px-4 py-2 rounded-lg hover:underline hover:text-blue-500 transition mb-4 md:mb-2"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
      <div className="bg-white  rounded-xl p-6 border border-solid border-slate-300">
        {/* Header Section */}
        <div className="border-b border-solid border-slate-300 mb-6">
          <div className="flex gap-6 sm:gap-4  xs:justify-between items-center flex-wrap sm:flex-nowrap mb-6">
            <div className="flex items-start gap-4">
              <img
                src={profileImg}
                alt="Instructor"
                className="w-16 h-16 rounded-full object-cover object-center shrink-0"
              />
              <div>
                <h1 className="text-2xl font-semibold">
                  {first_name} {last_name}
                </h1>
                <p className="text-gray-600 flex items-center">
                  <span className="material-icons text-lg mr-1">
                    <FaLocationDot />
                  </span>{" "}
                  {city}, {state}
                </p>
                {instructorFullDetails[0].average_rating && (
                  <div className="flex items-center mt-2 mb-3">
                    <StarRating
                      rating={instructorFullDetails[0].average_rating}
                    />
                    <span className="text-sm ml-2">
                      {Math.floor(instructorFullDetails[0].average_rating)}/5
                    </span>
                  </div>
                )}
              </div>
            </div>
            {!packageFlag && (
              <button
                onClick={() => setPackageFlag(true)}
                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
              >
                Book Now
              </button>
            )}
          </div>
        </div>

        {packageFlag ? (
          <GetPackages
            setPackageFlag={setPackageFlag}
            id={instructorFullDetails[0]?.id}
          />
        ) : (
          //-------------- Info Section------------------
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2 md:border-r border-solid border-slate-300 pr-2">
              <div className="pb-4 border-b bordersolid border-slate-300">
                <div className="mb-3">
                  <p className="text-black font-bold">Years of Experience</p>
                  <p>{instructorFullDetails[0]?.Experience}</p>
                </div>
                <div>
                  <p className="text-black font-bold">Location</p>
                  <p>{city}</p>
                </div>
                <div className="font-bold mt-3 text-black">
                  Languages Spoken
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {instructorFullDetails[0]?.language_spoken ? (
                    instructorFullDetails[0]?.language_spoken.map(
                      (language) => (
                        <span
                          key={language}
                          className="p-1 bg-slate-200 border border-gray-300 rounded-md"
                        >
                          {language}
                        </span>
                      )
                    )
                  ) : (
                    <div>Not Provided</div>
                  )}
                </div>
              </div>
              <div>
                <div className="mb-3">
                  <p className="text-black font-bold">
                    Total Lessons Conducted
                  </p>
                  <p>150 Lessons</p>
                </div>
                <div className="mb-3">
                  <p className="text-black font-bold">Total Hours Taught</p>
                  <p>300 Hours</p>
                </div>
                <div className="mb-3">
                  <p className="text-black font-bold">Student Ratings</p>
                  <p>4.8/5 Stars</p>
                </div>
                <div className="mb-3">
                  <p className="text-black font-bold">Number of Reviews</p>
                  <p>45 Reviews</p>
                </div>
                <div className="mb-3">
                  <p className="text-black font-bold">Approval Rate</p>
                  <p>95%</p>
                </div>
                <div>
                  <p className="text-black font-bold">Cancellation Rate</p>
                  <p>3%</p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-600 mb-3">
                  Self Description
                </h2>
                <p className="text-gray-700">
                  {instructorFullDetails[0]?.Self_description}
                </p>
              </div>

              {approvedVehicles.length > 0 && (
                <div className="">
                  <h2 className="text-2xl font-bold text-blue-600 mb-3">
                    Available Vehicles
                  </h2>
                  {approvedVehicles.map((vehicleInfo, index) => (
                    <div className="text-sm" key={vehicleInfo.id}>
                      <div className="font-bold mt-4 text-lg">
                        Vehicle {index + 1} Details :
                      </div>
                      <ul className="list-disc list-inside ">
                        <li className="font-bold mt-4 text-base">
                          Vehicle Company
                        </li>
                        <div className="ml-7">{vehicleInfo.Company}</div>
                        <li className="font-bold mt-4 text-base">
                          Vehicle Model
                        </li>
                        <div className="ml-7">{vehicleInfo.Model}</div>
                      </ul>
                      <div
                        className={`${index < approvedVehicles.length - 1 &&
                          "border-b mt-5 border-gray-300"}`}
                      ></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {!packageFlag && (
        <Testimonials testimonials={instructorFullDetails[0]?.ratings} />
      )}
    </div>
  );
};

const InstructorCard = ({
  instructor,
  setModalInstructorDetailOpen,
  setInstructorFullDetails,
}) => {
  const { setIsLoading } = useLoading();
  // function to fetch instructor details by id
  const getinstructorInfobyId = async (instructorId) => {
    try {
      setIsLoading(true);
      const response = await axios(
        `api/getinstructorfulldetails?instructorId=${instructorId}`
      );
      setInstructorFullDetails(response.data.data);
      setModalInstructorDetailOpen(true);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 md:px-6 text-center border border-solid border-slate-200">
      <img
        src={instructor?.user_id?.profileImg}
        alt={`${instructor?.user_id?.first_name} ${instructor?.user_id?.last_name}`}
        className="w-16 h-16 rounded-full mx-auto mb-3 object-cover object-center"
      />
      <h2 className="text-lg font-semibold">
        {instructor?.user_id?.first_name} {instructor?.user_id?.last_name}
      </h2>

      <div className={`flex items-center justify-center mt-2 mb-3`}>
        {instructor.average_rating ? (
          <>
            <StarRating rating={instructor.average_rating} />
            <span className="text-sm ml-2">
              {Math.floor(instructor.average_rating)}/5
            </span>
          </>
        ) : (
          <p className="text-sm">No Ratings Yet</p>
        )}
      </div>
      <p className="text-sm flex justify-between items-center shrink-0 mb-2">
        <strong>Location:</strong> {instructor?.user_id?.city}
      </p>
      <p className="text-sm flex justify-between items-center shrink-0">
        <strong>Status:</strong> {instructor?.Availibility}
      </p>
      <div
        onClick={() => {
          getinstructorInfobyId(instructor.id);
        }}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded cursor-pointer"
      >
        View Details
      </div>
    </div>
  );
};

const FindInstructor = ({ setFindInstructors, location, setSearchText }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(false);
  const [allInstructorDetails, setAllInstructorDetail] = useState([]);
  const [instructorFullDetails, setInstructorFullDetails] = useState([]);
  const [isFilterModalOpen, setisFilterModalOpen] = useState(false);
  const [modalInstructorDetailOpen, setModalInstructorDetailOpen] = useState(
    false
  );
  const [loading, setLoading] = useState(false);

  console.log("instructorFullDetails", instructorFullDetails);

  const handleSearchByChange = (type) => {
    setSearchBy(type);
    setisFilterModalOpen(false);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setisFilterModalOpen(false);
  };
  const handleGenderChange = (gender) => {
    setGenderFilter(gender);
    setisFilterModalOpen(false);
  };

  const findTopRatedInstructor = () => {
    setRatingFilter((prev) => !prev);
    setisFilterModalOpen(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSearchBy("name");
    setStatusFilter("");
    setGenderFilter("");
    setRatingFilter(false);
  };
  const { setIsLoading } = useLoading();
  // function to get all instructor details
  const allInstructors = async () => {
    try {
      setIsLoading(true);
      //API for fetching all instructor details
      const response = await axios("api/getunbanedinstructors");
      setLoading(true);
      setAllInstructorDetail(response.data.data);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInstructors = allInstructorDetails.filter((instructor) => {
    const matchesSearch =
      searchBy === "name"
        ? `${instructor?.user_id?.first_name} ${instructor?.user_id?.last_name}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : instructor?.user_id?.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "" || instructor?.Availibility === statusFilter;

    const filterByGender =
      instructor?.user_id?.gender === genderFilter || !genderFilter;

    const isTopRated = instructor.average_rating >= 3 || !ratingFilter;

    return matchesSearch && matchesStatus && filterByGender && isTopRated;
  });

  useEffect(() => {
    allInstructors();
    if (location.length > 0) {
      setSearchBy("location");
      setSearchQuery(location);
    }
  }, []);

  return (
    <div className="p-5 max-w-4xl lg:max-w-5xl mx-auto">
      <button
        onClick={() => {
          setFindInstructors(false);
          setSearchText("");
        }}
        className="flex items-center text-gray-700 px-4 py-2 rounded-lg hover:underline hover:text-blue-500 transition mb-4 md:mb-2"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
        Find the Best Instructor for Your Lessons
      </h1>

      <div className="flex gap-4 justify-between items-center mb-6 flex-wrap md:flex-nowrap">
        <div className="flex-1 flex items-center bg-gray-100 rounded-md px-4">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by Name or Location"
            className="flex-1 bg-transparent outline-none p-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setisFilterModalOpen(true)}
            className="flex items-center ml-4 text-gray-500"
          >
            <FaFilter className="mr-2" /> Search By
          </button>
          <button
            onClick={resetFilters}
            className="ml-4 text-red-500 flex items-center"
          >
            <BiReset className="mr-2" />
            Reset Filter
          </button>
        </div>
      </div>

      {/* Instructor Cards */}
      <div className="grid gap-4 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:mt-8 mx-10 xs:mx-0">
        {filteredInstructors.length === 0 && (
          <p className="text-gray-500 text-center col-span-4 text-2xl font-bold py-6">
            No instructors found for your search category.
          </p>
        )}

        {filteredInstructors.map((instructor, index) => (
          <InstructorCard
            key={index}
            instructor={instructor}
            setModalInstructorDetailOpen={setModalInstructorDetailOpen}
            setInstructorFullDetails={setInstructorFullDetails}
          />
        ))}
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onRequestClose={() => setisFilterModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 z-[999999]"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[999999]"
      >
        <h2 className="text-lg font-semibold mb-4">
          Search and Status Filters
        </h2>

        <div>
          <p className="font-semibold mb-2">Search By:</p>
          <button
            onClick={() => handleSearchByChange("name")}
            className={`block w-full py-2 px-4 rounded ${
              searchBy === "name" ? "bg-blue-400" : ""
            }`}
          >
            Name
          </button>
          <button
            onClick={() => handleSearchByChange("location")}
            className={`block w-full py-2 px-4 rounded ${
              searchBy === "location" ? "bg-blue-400" : ""
            }`}
          >
            Location
          </button>
          <button
            onClick={() => handleGenderChange("male")}
            className={`block w-full py-2 px-4 rounded ${
              genderFilter === "male" ? "bg-blue-400" : ""
            }`}
          >
            Male Instructor
          </button>
          <button
            onClick={() => handleGenderChange("female")}
            className={`block w-full py-2 px-4 rounded ${
              genderFilter === "female" ? "bg-blue-400" : ""
            }`}
          >
            Female Instructor
          </button>

          <button
            onClick={() => findTopRatedInstructor()}
            className={`block w-full py-2 px-4 rounded ${
              ratingFilter ? "bg-blue-400" : ""
            }`}
          >
            Top Rated Instructor
          </button>
        </div>

        <div className="mt-4">
          <p className="font-semibold mb-2">Filter by Status:</p>
          <button
            onClick={() => handleStatusChange("")}
            className={`block w-full py-2 px-4 rounded ${
              statusFilter === "" ? "bg-blue-400 text-white" : ""
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleStatusChange("Active")}
            className={`block w-full py-2 px-4 rounded ${
              statusFilter === "Active" ? "bg-blue-400 text-white" : ""
            }`}
          >
            Active
          </button>
          <button
            onClick={() => handleStatusChange("Inactive")}
            className={`block w-full py-2 px-4 rounded ${
              statusFilter === "Inactive" ? "bg-blue-400 text-white" : ""
            }`}
          >
            Inactive
          </button>
          <button
            onClick={() => handleStatusChange("On Leave")}
            className={`block w-full py-2 px-4 rounded ${
              statusFilter === "on Leave" ? "bg-blue-400 text-white" : ""
            }`}
          >
            On Leave
          </button>
        </div>

        <button
          onClick={() => setisFilterModalOpen(false)}
          className="mt-4 text-center w-full py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </Modal>
      {/*profile detail modal*/}
      <Modal
        isOpen={modalInstructorDetailOpen}
        onRequestClose={() => setModalInstructorDetailOpen(false)}
        className="bg-white shadow-lg px-3 md:px-10 pt-5 w-full md:w-5/6 lg:w-8/12 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end"
      >
        <InstructorDetailModal
          setModalInstructorDetailOpen={setModalInstructorDetailOpen}
          instructorFullDetails={instructorFullDetails}
        />
      </Modal>
    </div>
  );
};

export default FindInstructor;
