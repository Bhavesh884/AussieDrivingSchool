import React from "react";
import { StarRating } from "./FindInstructors";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import Modal from "react-modal";
import RescheduleSlots from "./RescheduleSlot";
import { GiPartyPopper } from "react-icons/gi";
import axios from "../../axios";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { useLoading } from "../../LoadingContext";

const MyBookings = ({ bookingDetails, fetchBookingData }) => {
  const [rescheduleLessonModalOpen, setRescheduleLessonModalOpen] = useState(
    false
  );
  const [cancelBookingModal, setCancelBookingModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [slectedIntructorId, setSelectedInstructorId] = useState(null);
  const [bookingData, setBookingData] = useState([]);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [ratingModal, setRatingModal] = useState(false);
  const [successRatingModal, setSuccessRatingModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("pendingBookings");

  //submit rating and feedback
  const postRatings = async () => {
    try {
      const payload = {
        Given_by: localStorage.getItem("LearnerId"),
        given_to: slectedIntructorId,
        ratings_given: rating,
        Reviews: feedback,
      };
      await axios.post("items/Instructor_Rating", payload);
      await axios.patch(`items/Booking/${selectedBookingId}`, {
        get_rating: "true",
      });
      fetchBookingData();
      console.log("rating posted successfully");
      setRatingModal(false);
      setRating(0);
      setFeedback("");
      setSuccessRatingModal(true);
    } catch (error) {
      console.log("error in posting ratings", error);
    }
  };

  const openRatingModal = (instructorId, bookingId) => {
    //filter booking data by booking id
    const bookingData = bookingDetails[0]?.booking.filter(
      (data) => data.id === bookingId
    );
    setBookingData(bookingData);
    setSelectedInstructorId(instructorId);
    setSelectedBookingId(bookingId);
    setRatingModal(true);
  };
console.log("selectedBookingId",selectedBookingId)
   //Cancel Booking
   const cancelBooking = async () => {
    // check canceled by
    let canceledBy;

    // Determine who is canceling
    if (localStorage.getItem("isAdmin") !== null) {
      canceledBy = "Admin";
    } else if (localStorage.getItem("isInstructor") !== null) {
      canceledBy = "Instructor";
    } else if (localStorage.getItem("isLearner") !== null) {
      canceledBy = "Learner";
    }

    try {
      const cancelDetails = {
        is_canceled: "true",
        canceled_by: canceledBy,
        cancellation_reason: cancelReason,
        cancellation_date: new Date().toISOString(),
      };
      const response = await axios.patch(
        `items/Booking/${selectedBookingId}`,
        cancelDetails
      );
      handleSuccess("Booking cancelled successfully.");
      setCancelBookingModal(false);
      //viewBookingProfile(bookingId);
      setCancelReason("");
    } catch (error) {
      handleError("Error in Cancel Booking");
    }
  };
  //Enable submit rating button
  const submitRatingBtnEnabled = rating > 0 || feedback.trim() !== "";

  //Filter by Pending Lessons
  const pendingLesson = bookingDetails[0]?.booking.filter(
    (data) => data?.status === "pending"
  );

  //Filter Completed Bookings
  const completedBookings = bookingDetails[0]?.booking.filter(
    (data) => data?.status === "Completed" && data?.get_rating === "false"
  );

  //Filter Rated Bookings
  const ratedBookings = bookingDetails[0]?.booking.filter(
    (data) => data?.get_rating === "true"
  );

  console.log("pendingLesson:", pendingLesson);
  console.log("completedBookings:", completedBookings);
  console.log("rated:", ratedBookings);

  const getCategoryData = () => {
    if (selectedCategory === "completedBooking") return completedBookings;
    if (selectedCategory === "ratedInstructors") return ratedBookings;
    return pendingLesson; // Default to pendingLesson
  };

  console.log("bookingDetails", bookingDetails);

  return (
    <div className="flex flex-col gap-8 items-center py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        Your Bookings
      </h1>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setSelectedCategory("pendingBookings")}
          className={`py-2 px-4 rounded-lg ${
            selectedCategory === "pendingBookings"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Pending Bookings
        </button>
        <button
          onClick={() => setSelectedCategory("completedBooking")}
          className={`py-2 px-4 rounded-lg ${
            selectedCategory === "completedBooking"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Completed Bookings
        </button>
        <button
          onClick={() => setSelectedCategory("ratedInstructors")}
          className={`py-2 px-4 rounded-lg ${
            selectedCategory === "ratedInstructors"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Rated Instructors
        </button>
      </div>
      {getCategoryData()?.length > 0 ? (
        getCategoryData().map((booking, index) => (
          <div key={booking.id}>
            <div className="bg-white rounded-lg shadow-lg p-2 md:p-8 px-10 max-w-5xl w-full border border-solid border-slate-200">
              {/* Instructor details */}
              <div className="flex items-center gap-6 sm:gap-0 flex-wrap sm:flex-nowrap justify-between mb-6 border-b border-solid border-gray-200 py-4">
                <div className="flex items-center">
                  <img
                    src={booking?.package?.Instructor?.user_id?.profileImg}
                    alt="ProfileImg"
                    className="w-16 h-16 rounded-full border-2 border-green-500 object-cover shrink-0"
                  />
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {booking?.package.Instructor?.user_id?.first_name}{" "}
                      {booking?.package.Instructor?.user_id?.last_name}
                    </h2>
                    <p className="text-gray-600 flex items-center">
                      {booking?.package.Instructor?.user_id?.city},{" "}
                      {booking?.package.Instructor?.user_id?.state}
                    </p>
                    {/* <div className="flex items-center">
                      <span className="text-yellow-500 material-icons mr-1">
                        <StarRating rating={4.5} />
                      </span>
                      <span className="text-gray-600">4.2/5</span>
                    </div> */}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <button
                    className={`bg-red-500 text-white font-semibold py-2 px-4 rounded-lg  ${booking?.is_canceled !== "true" && "hover:bg-red-600" }`}
                    onClick={() => {
                      setCancelBookingModal(true)
                      setSelectedBookingId(booking?.id);
                  }}
                  disabled = {booking?.is_canceled === "true"}
                  >
                    {
                      booking?.is_canceled === "true" ? "Booking Cancelled" : "Cancel Booking"
                    }
                    
                  </button>
                  <button
                    className={`px-4 py-2 bg-success-300 text-white font-semibold rounded-md ${booking.status !=
                      "Completed" && "hidden"} ${booking.get_rating ===
                      "false" && "hover:hover:bg-success-400"}`}
                    onClick={() =>
                      openRatingModal(booking.package.Instructor.id, booking.id)
                    }
                    disabled={booking.get_rating === "true"}
                  >
                    {booking.get_rating === "true"
                      ? "Rated"
                      : "Rate Instructor"}
                  </button>
                </div>
              </div>
              {/* Booking information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Booking Information Section */}
                <div>
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">
                    Booking Information
                  </h3>
                  <p className="text-black flex flex-col mb-2">
                    <span className="font-bold">Package Type:</span>{" "}
                    {booking?.package?.Plan_Type}
                  </p>
                  <p className="text-black flex flex-col mb-2">
                    <span className="font-bold">Package Price:</span> $
                    {booking?.package?.price}
                  </p>
                  <p className="text-black flex flex-col mb-2">
                    <span className="font-bold">Payment Status:</span> Paid
                  </p>
                  <p className="text-black flex flex-col mb-2">
                    <span className="font-bold">Payment Method:</span> Credit
                    Card
                  </p>
                </div>

                {/* Additional Details Section */}
                <div>
                  <h3 className="text-2xl font-bold text-blue-600 mb-4">
                    Additional Details
                  </h3>
                  <p className="text-gray-700 font-semibold">
                    Cancellation Policy
                  </p>
                  <p className="text-gray-600 mb-4">
                    You can cancel or reschedule up to 24 hours before the
                    lesson.
                  </p>
                  <p className="text-green-600 font-semibold ">
                    Next Scheduled Lesson
                  </p>
                  <p className="text-orange-700 mb-4">24 November 2024</p>
                  <button
                    className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-900"
                    onClick={() => {
                      setSelectedBookingId(booking?.id);
                      setSelectedInstructorId(booking?.package?.Instructor?.id);
                      setRescheduleLessonModalOpen(true);
                    }}
                  >
                    Reschedule
                  </button>
                </div>
              </div>

              {/* Lesson Progress tracking */}
              <div className="flex flex-col items-start mt-8 ">
                <h1 className="text-xl md:text-3xl font-bold text-blue-700 mb-8">
                  Lesson Progress Tracking
                </h1>

                <div className="overflow-x-auto w-full max-w-4xl border rounded-md">
                  <table className="w-full bg-white shadow-lg rounded-lg">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 text-left text-sm uppercase tracking-wider">
                        <th className="px-6 py-3">Lesson</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking?.package?.lessons.map((lesson, index) => {
                        // Create a set of completed lesson IDs
                        const completedLessonIds = new Set(
                          booking?.lesson_completed?.map(
                            (completed) => completed.lesson
                          )
                        );

                        // Check if the current lesson is completed
                        const isCompleted = completedLessonIds.has(
                          lesson?.Lessons_id?.id
                        );
                        return (
                          <tr
                            key={lesson?.Lessons_id?.id}
                            className={`border-t ${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }`}
                          >
                            <td className="px-6 py-4 text-gray-700">
                              {lesson?.Lessons_id?.lesson_name}
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                              {lesson?.Lessons_id?.lesson_description}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                                  isCompleted
                                    ? "border-green-600 text-green-600"
                                    : "border-blue-600 text-blue-600"
                                }`}
                              >
                                {isCompleted ? "Completed" : "Upcoming"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex justify-center text-gray-500 font-semibold text-lg">
          No Bookings Yet
        </div>
      )}
      {/* Reschedule Lesson Modal */}
      <Modal
        isOpen={rescheduleLessonModalOpen}
        contentLabel="Confirm Rescheduling"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        className="bg-[#FFFFFF]  rounded-lg shadow-lg p-6 w-full overflow-y-scroll max-h-screen"
      >
        <h1 className="text-3xl font-bold text-[#202224] text-center">
          Confirm Rescheduling
        </h1>
        <p className="text-xl text-red-500 mt-2 text-center">
          You are about to reschedule this lesson. Please confirm the new time
          and date below!!!.
        </p>

        <RescheduleSlots
          slectedIntructorId={slectedIntructorId}
          selectedBookingId={selectedBookingId}
          setRescheduleLessonModalOpen={setRescheduleLessonModalOpen}
        />

        <div className="mt-6 flex justify-between gap-2">
          <button
            className="bg-[#B7B7B7] text-[#FFFFFF] px-4 py-2 rounded hover:bg-gray-400 w-40"
            onClick={() => setRescheduleLessonModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>

       {/* cancel booking modal */}
       <Modal
        isOpen={cancelBookingModal}
        contentLabel="Cancel Booking"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-8"
        className="bg-[#FFFFFF] rounded-lg shadow-lg p-6 w-full max-w-lg m-7"
      >
        <h3 className="text-lg font-semibold mb-4">
          {" "}
          Are you sure you want to cancel this booking?
        </h3>
        <p className=" text-gray-900 text-sm mt-2">
          Please provide reason to cancel this booking.
        </p>
        <textarea
          className="w-full border px-3 py-2 border-gray-300 rounded mt-2 outline-none  transition-shadow shadow-sm text-gray-700 bg-gray-50resize-vertical"
          placeholder="Provide the reason for banning the account..."
          rows="5"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-4">
          <button
            className="bg-[#EE6055] text-[#FFFFFF] px-4 text-sm rounded-md hover:bg-red-700"
            onClick={() => cancelBooking()}
          >
            Cancel Booking
          </button>
          <button
            onClick={() => setCancelBookingModal(false)}
            className="text-gray-700 px-4 py-2 mr-2"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Rating Modal */}
      <Modal
        isOpen={ratingModal}
        contentLabel="Cancel Booking"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-8"
        className="bg-[#FFFFFF] rounded-lg shadow-lg p-6 w-full max-w-lg"
      >
        <h2 className="text-lg font-semibold text-[#202224]">
          How was your session with{" "}
          {bookingData[0]?.package?.Instructor?.user_id?.first_name}{" "}
          {bookingData[0]?.package?.Instructor?.user_id?.last_name}?
        </h2>
        <p className="text-sm text-[#202224] mt-2">
          Rate your experience with the instructor!
        </p>
        <div className="flex items-center mt-4 space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="text-3xl"
            >
              {rating >= star ? (
                <AiFillStar className="text-yellow-400" />
              ) : (
                <AiOutlineStar className="text-gray-300" />
              )}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-sm text-[#202224]">
            Write about your experience
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="3"
            className="w-full mt-2 p-2 border rounded-lg focus:outline-none"
            placeholder="Your feedback..."
          />
        </div>
        <div className="text-sm text-[#202224] mt-3">
          “Helpful” | “Knowledgeable” | “Friendly” | “Patient”
        </div>
        <div className="flex justify-between mt-5">
          <button
            onClick={() => {
              setRatingModal(false);
              setRating(0);
              setFeedback("");
            }}
            className="w-full mr-2 py-2 text-[#FFFFFF] bg-[#B7B7B7]  rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => postRatings()}
            className={`w-full ml-2 py-2 text-[#FFFFFF] rounded-lg  ${
              submitRatingBtnEnabled
                ? "bg-[#2B6BE7] hover:bg-blue-700"
                : "bg-[#B7B7B7]"
            }`}
            disabled={!submitRatingBtnEnabled}
          >
            Submit
          </button>
        </div>
      </Modal>

      {/* feedback Modal */}
      <Modal
        isOpen={successRatingModal}
        onRequestClose={() => setSuccessRatingModal(false)}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        className="bg-[#FFFFFF] rounded-lg shadow-lg p-6 w-full max-w-lg"
      >
        <div className="flex flex-col gap-5 items-center p-8">
          <GiPartyPopper size={40} color="orange" />
          <h1 className="font-bold">
            Thank You for your feedback! It helps us improve and recognize great
            instructors.
          </h1>
        </div>
      </Modal>
      <ToastContainer/>
    </div>
  );
};

export default MyBookings;
