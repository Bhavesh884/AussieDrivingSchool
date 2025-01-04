import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { FaBars, FaCaretDown, FaFilter, FaSearch, FaTh } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";
import { GoArrowLeft } from "react-icons/go";
import axios from "../../axios";
import { useLocation } from "react-router-dom";
import Testimonials from "../Learner/LearnerProfile.jsx";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { useLoading } from "../../LoadingContext.jsx";
import { useProfileImage } from "../../utils/ProfileImageContext";
import { BookingDetailModal } from "./AllBookings";

ReactModal.setAppElement("#root");

const transactionData = [
  {
    transactionId: "TXN1234GHIU",
    date: "2024-10-01",
    amount: 150.5,
    paymentMethod: "Credit Card",
  },
  {
    transactionId: "TXN5678EFGH",
    date: "2024-10-02",
    amount: 75.2,
    paymentMethod: "PayPal",
  },
  {
    transactionId: "TXN9101IJKL",
    date: "2024-10-03",
    amount: 220.0,
    paymentMethod: "Debit Card",
  },
  {
    transactionId: "TXN1121MNOP",
    date: "2024-10-04",
    amount: 450.75,
    paymentMethod: "Bank Transfer",
  },
  {
    transactionId: "TXN3141QRST",
    date: "2024-10-05",
    amount: 300.3,
    paymentMethod: "Cash",
  },
];

export const BookingCard = ({ booking, learner }) => {
  const [isBookingDetailModalOpen, setBookingDetailModalOpen] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState([]);
  const [lessonsTaken, setLessonsTaken] = useState("");
  const { setIsLoading } = useLoading();
  // function to fetch full booking details by id
  const viewBookingProfile = async (bookingId) => {
    try {
      setIsLoading(true);
      //API for fetching student detail by Id
      const response = await axios(
        `items/Booking?fields=*,package.Instructor.id,package.Instructor.user_id.*,package.lessons.*,package.lessons.Lessons_id.*,learner.user_id.*,package.*,Availibility.*&filter[id]=${bookingId}`
      );
      const Data = await response.data;
      setSelectedBookingDetails(Data.data);
      setBookingDetailModalOpen(true);

      const lessonsCompleted = await axios(
        `items/Lesson_Completed?filter[booking][_eq]=${bookingId}`
      );
      const lessontaken = lessonsCompleted.data.data;
      setLessonsTaken(lessontaken.length);
    } catch (error) {
      console.log("error in fetching details", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const {
    first_name,
    last_name,
    profileImg,
  } = booking?.package?.Instructor?.user_id;
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col  items-center border border-solid border-neutral-100 w-[230px] shrink-0">
      <div className="flex justify-center mb-4">
        <img
          className="w-12 h-12 rounded-full border-2 border-white shadow-lg -mr-4 z-10 object-cover"
          src={profileImg}
          alt="Instructor Avatar"
        />
        <img
          className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
          src={learner.profileImg}
          alt="Learner Avatar"
        />
      </div>
      <h2 className="font-semibold text-center mb-5">{booking.id}</h2>
      <div className="w-full">
        <p className="font-semibold flex w-full justify-between mb-2 font-poppins text-gray-500 text-desk-b-3">
          Instructor:{" "}
          <span className="font-normal text-black">
            {first_name} {last_name}
          </span>
        </p>
        <p className="font-semibold flex w-full justify-between mb-2 text-gray-500 text-desk-b-3">
          Learner:{" "}
          <span className="font-normal text-black">
            {learner.first_name} {learner.last_name}
          </span>
        </p>
        <p className="font-semibold flex w-full justify-between shrink-0 mb-2 text-gray-500 text-desk-b-3">
          Date:{" "}
          <span className="font-normal shrink-0 text-black">
            {new Date(booking?.date_created).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </p>
        <p className="font-semibold flex w-full justify-between mb-2 text-gray-500 text-desk-b-3">
          Package Type:{" "}
          <span className="font-normal text-black">
            {booking?.package?.name}
          </span>
        </p>
        <p className="font-semibold flex w-full justify-between mb-2 text-gray-500 text-desk-b-3">
          Session Fee:{" "}
          <span className="font-normal text-black">
            ${booking?.package?.price}
          </span>
        </p>
      </div>

      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full"
        onClick={() => viewBookingProfile(booking.id)}
      >
        View Details
      </button>
      <ReactModal
        isOpen={isBookingDetailModalOpen}
        onRequestClose={() => setBookingDetailModalOpen(false)}
        className="bg-white shadow-lg px-10 pt-5 w-full md:w-4/5 lg:w-8/12 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-20"
      >
        <BookingDetailModal
          setBookingDetailModalOpen={setBookingDetailModalOpen}
          selectedBookingDetails={selectedBookingDetails}
          lessonsTaken={lessonsTaken}
        />
      </ReactModal>
    </div>
  );
};

export const StudentDetailModal = ({
  setModalStudentDetailOpen,
  selectedStudentDetails,
  handleViewStudentprofile,
}) => {
  const currlocation = useLocation();
  let data;
  if (location.pathname === "/admindashboard") {
    data = selectedStudentDetails[0]?.user_id;
  } else {
    data = selectedStudentDetails[0]?.learner?.user_id;
  }

  const [isBanModalOpen, setBanModalOpen] = useState(false);
  const [isUnbanModalOpen, setUnbanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lessonStatuses, setLessonStatuses] = useState({});
  const [completedLessons, setCompletedLessons] = useState([]);
  const testimonialsPerPage = 2;
  const { setIsLoading } = useLoading();
  const { empPermissions } = useProfileImage();
  // function to ban student account
  const banAccount = async (studentId) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`items/Learner/${studentId}`, {
        isLearnerBan: true,
        ban_reason: banReason,
      });
      handleSuccess("Account Banned Successfully");
      setBanModalOpen(false);
      setBanReason("");
      handleViewStudentprofile(studentId);
    } catch (error) {
      handleError("Error in Banning Account");
    } finally {
      setIsLoading(false);
    }
  };
  const unBanAccount = async (studentId) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`items/Learner/${studentId}`, {
        isLearnerBan: false,
        ban_reason: "",
      });
      handleSuccess("Account Unbanned Successfully");
      setUnbanModalOpen(false);
      setBanReason("");
      handleViewStudentprofile(studentId);
    } catch (error) {
      handleError("Error in Unbanning Account");
    } finally {
      setIsLoading(false);
    }
  };
  const handleBanPermission = () => {
    if (empPermissions) {
      if (empPermissions.roles.User_Management.includes("Ban/Unban Account")) {
        setBanModalOpen(true);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      setBanModalOpen(true);
    }
  };

  const handleUnBanPermission = () => {
    if (empPermissions) {
      if (empPermissions.roles.User_Management.includes("Ban/Unban Account")) {
        setUnbanModalOpen(true);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      setUnbanModalOpen(true);
    }
  };
  const fetchLessonStatuses = async () => {
    try {
      const response = await axios.get(
        `items/Lesson_Completed?filter[booking][_eq]=${selectedStudentDetails[0].id}`
      );
      const statuses = response.data.data;
      setCompletedLessons(statuses);
      const statusMap = statuses.reduce((acc, status) => {
        acc[status.lesson] = status.status; // Map lesson ID to its status
        return acc;
      }, {});
      setLessonStatuses(statusMap);

      markBookingCompleted();
    } catch (error) {
      console.error("Error fetching lesson statuses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //mark lesson completed
  const postLessonStatus = async (lessonId) => {
    try {
      setIsLoading(true);
      const payload = {
        learner: selectedStudentDetails[0].learner.id,
        booking: selectedStudentDetails[0].id,
        lesson: lessonId,
        status: "Completed",
      };
      await axios.post("items/Lesson_Completed", payload);
      fetchLessonStatuses();

      setLessonStatuses((prevStatuses) => ({
        ...prevStatuses,
        [lessonId]: "Completed",
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const markBookingCompleted = async () => {
    try {
      if (
        completedLessons.length ===
          selectedStudentDetails[0]?.package?.lessons.length - 1 &&
        (selectedStudentDetails[0]?.status === "pending" ||
          selectedStudentDetails[0]?.status === "Pending")
      ) {
        await axios.patch(`items/Booking/${selectedStudentDetails[0]?.id}`, {
          status: "Completed",
        });
        handleSuccess("Booking Completed Successfully");
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  useEffect(() => {
    fetchLessonStatuses();
  }, []);

  let ratings;
  if (location.pathname === "/admindashboard") {
    ratings = selectedStudentDetails[0].ratings;
  } else {
    ratings = selectedStudentDetails[0].learner.ratings;
  }
  const filteredTestimonials = ratings.filter(
    (testimonial) => testimonial?.Reviews
  );

  const length = filteredTestimonials?.length;
  const totalPages = Math.ceil(length / testimonialsPerPage);

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

  //Bookings cards
  const [currentBookingPage, setCurrentBookingPage] = useState(1);
  const bookingsPerPage = 3;

  let totalBookingPages = 0;
  if (location.pathname === "/admindashboard") {
    totalBookingPages = Math.ceil(
      selectedStudentDetails[0].booking.length / bookingsPerPage
    );
  }

  // Handle the next and previous page toggles
  const nextBookingsPage = () => {
    if (currentBookingPage < totalBookingPages) {
      setCurrentBookingPage(currentBookingPage + 1);
    }
  };

  const prevBookingsPage = () => {
    if (currentBookingPage > 1) {
      setCurrentBookingPage(currentBookingPage - 1);
    }
  };

  return (
    <div>
      <GoArrowLeft
        size={28}
        className="hover:cursor-pointer"
        onClick={() => setModalStudentDetailOpen(false)}
      />
      <div className="border border-neutral-100 rounded-lg mt-8 mb-20">
        {/* profile section */}
        <div className="p-4">
          <div className="flex gap-4 items-start">
            <img
              src={data.profileImg}
              className="w-16 h-16 rounded-full object-cover"
            ></img>
            <div>
              <h1 className="font-bold text-2xl">
                {data.first_name} {data.last_name}
              </h1>
              <div className="flex gap-1 mt-2">
                <span>
                  <HiLocationMarker size={20} />
                </span>
                <span className="text-sm">
                  {data.city}, {data.state}
                </span>
              </div>
              <button className="px-6 rounded-full text-success-300 border border-success-300 mt-2 text-sm">
                Active
              </button>
            </div>
          </div>
        </div>
        <hr className="border-neutral-100"></hr>

        <div className="flex flex-col sm:flex-row">
          {/* Personal details */}
          <div className="border-b sm:border-b-0 sm:border-r-2 border-neutral-100 p-4 text-sm sm:w-72">
            <div>
              <div className="font-bold">Date of Birth</div>
              <div className="">{data.date_of_birth}</div>
            </div>
            <div>
              <div className="font-bold mt-4">Phone Number</div>
              <div>{data.phoneNumber}</div>
            </div>
            <div>
              <div className="font-bold mt-4">Email Address</div>
              <div>{data.email}</div>
            </div>

            <div className="font-bold mt-4">Location</div>
            <div>
              <p>
                {data.city}, {data.state}
              </p>
              <p>Pincode : {data.pincode}</p>
              <p>{data.locality && data.locality}</p>
            </div>

            <div className="font-bold mt-4">Date Joined</div>
            <div>
              {location.pathname === "/admindashboard"
                ? selectedStudentDetails[0]?.Joining_date
                : selectedStudentDetails[0]?.learner?.Joining_date}
            </div>
            <div className="font-bold mt-4">Last Active Date</div>
            <div>
              {" "}
              {location.pathname === "/admindashboard"
                ? selectedStudentDetails[0]?.Last_active_date
                : selectedStudentDetails[0]?.learner?.Last_active_date}
            </div>
          </div>

          {/* transaction table */}
          <div className="w-full p-4 px-6 overflow-hidden">
            <h2 className="text-2xl font-bold text-secondary-500">
              Transactions
            </h2>
            <div className="border border-neutral-100 rounded-lg mt-5 overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-neutral-100">
                    <th className="px-3 py-3 text-start">Transaction ID</th>
                    <th className="px-3 py-3 text-start">Date</th>
                    <th className="px-3 py-3 text-start">Amount</th>
                    <th className="py-3 px-3 text-start">Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionData.map((data) => (
                    <tr key={data.transactionId} className=" text-sm">
                      <td className="px-4 py-4 font-bold border-b">
                        {data.transactionId}
                      </td>
                      <td className="px-4 py-4 border-b">{data.date}</td>
                      <td className="px-4 py-4 border-b">{data.amount}</td>
                      <td className="px-4 py-4 border-b">
                        {data.paymentMethod}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <hr className="border-neutral-100"></hr>
        {/* booking section */}
        {currlocation.pathname === "/admindashboard" && (
          <div className="p-4">
            <div className="text-2xl font-bold text-secondary-500 my-2">
              Bookings
            </div>
            {selectedStudentDetails[0].booking.length !== 0 ? (
              <div>
                <div className="flex overflow-x-scroll space-x-3 gap-3 my-5 w-full">
                  {selectedStudentDetails[0].booking.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      learner={selectedStudentDetails[0]?.user_id}
                    />
                  ))}
                </div>

                <div className="flex items-end w-full justify-end space-x-5 my-5 mt-8">
                  <div className="flex justify-center space-x-2 ">
                    {[...Array(totalBookingPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentBookingPage(i + 1)}
                        className={`h-7 w-7 text-gray-500  ${
                          currentBookingPage === i + 1
                            ? "bg-black text-white rounded-full"
                            : ""
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <div>
                    <button className="py-2 px-4 rounded-l-lg border bg-slate-50 hover:bg-slate-100">
                      <FaAngleLeft
                        onClick={prevBookingsPage}
                        className={`${
                          currentBookingPage === 1 ? "text-gray-500" : ""
                        }`}
                      />
                    </button>
                    <button className="py-2 px-4 rounded-r-lg border bg-slate-50 hover:bg-slate-100">
                      <FaAngleRight
                        onClick={nextBookingsPage}
                        className={`${
                          currentBookingPage === totalBookingPages
                            ? "text-gray-500"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center text-gray-500 font-semibold text-lg">
                No Bookings Yet
              </div>
            )}
          </div>
        )}
        {/* lesson progress tracking */}
        {currlocation.pathname === "/instructordashboard" && (
          <div className="p-4">
            <div className="text-2xl font-bold text-secondary-500">
              Lesson Progress Tracking
            </div>
            <div className="border border-neutral-100 rounded-lg mt-5">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-neutral-100 ">
                    <th className=" py-3 "></th>
                    <th className="px-3 py-3 text-start">Lesson</th>
                    <th className="px-3 py-3 text-start">Description</th>
                    <th className="px-3 py-3 text-start">Lesson Status</th>
                    <th className="px-3 py-3 text-start"></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudentDetails[0]?.package?.lessons.map(
                    (data, index) => (
                      <tr key={data.id} className="text-sm">
                        <td className="px-4 py-4 border-b">{index + 1}</td>
                        <td className="px-3 py-4 border-b">
                          {data?.Lessons_id?.lesson_name}
                        </td>
                        <td className="px-3 py-4 border-b ">
                          {data?.Lessons_id?.lesson_description}
                        </td>
                        <td className="px-2 py-4 border-b">
                          <button
                            className={`px-6 rounded-full text-sm font-semibold py-1 ${
                              lessonStatuses[data?.Lessons_id?.id] ===
                              "Completed"
                                ? "text-success-300 border border-success-300"
                                : "text-gray-500 border border-gray-500"
                            }`}
                          >
                            {lessonStatuses[data?.Lessons_id?.id] ===
                            "Completed"
                              ? "Completed"
                              : "Upcoming"}
                          </button>
                        </td>
                        <td className="px-2 py-4 border-b">
                          <button
                            className={`px-6 rounded-md text-sm font-semibold py-1 text-white border border-success-300 bg-success-300 ${
                              lessonStatuses[data?.Lessons_id?.id] ===
                              "Completed"
                                ? " "
                                : " hover:bg-success-400"
                            } `}
                            disabled={
                              lessonStatuses[data?.Lessons_id?.id] ===
                              "Completed"
                            }
                            onClick={() =>
                              postLessonStatus(data?.Lessons_id?.id)
                            }
                          >
                            {lessonStatuses[data?.Lessons_id?.id] ===
                            "Completed"
                              ? "Completed"
                              : "Mark Complete"}
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <hr className="border-neutral-100"></hr>
        {/* testimonials */}
        <div className="bg-white rounded-lg shadow-lg p-2 md:p-8 px-10 max-w-5xl border border-solid border-slate-200 m-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
            Testimonials
          </h2>
          {currentTestimonials.length > 0 ? (
            <div>
              {currentTestimonials?.map((testimonial) => (
                <div className="bg-white rounded-lg p-6 mb-6 border border-solid border-slate-300">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-700">{testimonial?.Reviews}</p>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={testimonial?.given_to?.user_id?.profileImg}
                      alt={testimonial?.given_to?.user_id?.first_name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <span>
                        {testimonial?.Given_by?.user_id?.first_name}{" "}
                        {testimonial?.Given_by?.user_id?.last_name} to{" "}
                      </span>
                      <span className="font-semibold">
                        {testimonial?.given_to?.user_id?.first_name}{" "}
                        {testimonial?.given_to?.user_id?.last_name}
                      </span>
                      <p className="text-gray-500 text-sm">
                        {" "}
                        {new Date(testimonial?.date_created).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
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
              No Reviews Given Yet
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {currlocation.pathname === "/admindashboard" && (
        <div className="flex gap-5 bg-white py-5 fixed bottom-0 w-full z-20">
          {selectedStudentDetails[0]?.isLearnerBan === "true" ? (
            <button
              className="bg-green-400 rounded-md px-8 py-2 text-white transition-colors duration-200"
              onClick={handleUnBanPermission}
            >
              Unban Account
            </button>
          ) : (
            <button
              className="bg-error-200 rounded-md px-8 py-2 text-white transition-colors duration-200 hover:bg-error-300"
              onClick={handleBanPermission}
            >
              Ban Account
            </button>
          )}

          <button
            className="bg-neutral-300 rounded-md text-white px-8 py-2 transition-colors duration-200 hover:bg-neutral-400"
            onClick={() => setModalStudentDetailOpen(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ban student modal */}
      <ReactModal
        isOpen={isBanModalOpen}
        onRequestClose={() => setBanModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 z-[999999] m-7"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[999999]"
      >
        <h3 className="text-lg font-semibold ">
          {" "}
          Are you sure you want to ban this account?
        </h3>

        <p className=" text-gray-900 text-sm mt-2">
          Please provide reason to ban this account.
        </p>
        <textarea
          className="w-full border px-3 py-2 border-gray-300 rounded mt-2 outline-none  transition-shadow shadow-sm text-gray-700 bg-gray-50resize-vertical"
          placeholder="Provide the reason for banning the account..."
          rows="5"
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
        ></textarea>
        <div className="flex justify-end mt-4">
          <button
            className="bg-[#EE6055] text-[#FFFFFF] px-4 text-sm rounded-md hover:bg-red-700"
            onClick={() => banAccount(selectedStudentDetails[0].id)}
          >
            Ban Account
          </button>
          <button
            onClick={() => setBanModalOpen(false)}
            className="text-gray-700 px-4 py-2 mr-2"
          >
            Cancel
          </button>
        </div>
      </ReactModal>

      {/* Unban student modal */}
      <ReactModal
        isOpen={isUnbanModalOpen}
        onRequestClose={() => setUnbanModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 z-[999999] m-7"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[999999]"
      >
        <h3 className="text-lg font-semibold mb-4">
          {" "}
          Are you sure you want to Unban this account?
        </h3>

        <div className="flex justify-end mt-4">
          <button
            className="bg-[#EE6055] text-[#FFFFFF] px-4 text-sm rounded-md hover:bg-red-700"
            onClick={() => unBanAccount(selectedStudentDetails[0].id)}
          >
            Unban Account
          </button>
          <button
            onClick={() => setUnbanModalOpen(false)}
            className="text-gray-700 px-4 py-2 mr-2"
          >
            Cancel
          </button>
        </div>
      </ReactModal>

      <ToastContainer />
    </div>
  );
};

const StudentCards = ({ student, handleViewStudentprofile }) => {
  const { empPermissions } = useProfileImage();

  const handleViewProfilePermission = (studentId) => {
    if (empPermissions) {
      if (empPermissions.roles.User_Management.includes("View Users")) {
        handleViewStudentprofile(studentId);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      handleViewStudentprofile(studentId);
    }
  };
  return (
    <div
      key={student.id}
      className="w-[235px] p-4 rounded-lg shadow-md border border-solid border-slate-200 flex flex-col"
    >
      <img
        className="h-14 w-14 rounded-full shrink-0 object-cover self-center"
        src={
          location.pathname === "/admindashboard"
            ? student?.user_id?.profileImg
            : student?.learner?.user_id?.profileImg
        }
      />
      <div className="mt-3 font-semibold text-center font-poppins text-desk-b-2">
        {location.pathname === "/admindashboard"
          ? student?.user_id?.first_name
          : student?.learner?.user_id?.first_name}{" "}
        {location.pathname === "/admindashboard"
          ? student?.user_id?.last_name
          : student?.learner?.user_id?.last_name}
      </div>
      <div className="flex items-center justify-between mt-4 font-poppins text-desk-b-3 text-neutral-600">
        <div className="font-semibold">Phone:</div>
        <div>
          {location.pathname === "/admindashboard"
            ? student?.user_id?.phoneNumber
            : student?.learner?.user_id?.phoneNumber}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 text-desk-b-3 text-neutral-600 font-poppins">
        <div className="font-semibold">City:</div>
        <div>
          {location.pathname === "/admindashboard"
            ? student?.user_id?.city
            : student?.learner?.user_id?.city}
        </div>
      </div>
      <button
        className="bg-[#2B6BE7] cursor-pointer w-full text-white rounded-lg mt-5 py-2 font-poppins"
        onClick={() => handleViewProfilePermission(student?.id)}
      >
        View Details
      </button>
    </div>
  );
};

const AllStudents = () => {
  const [isLessonStatusModalOpen, setIsLessonStatusModalOpen] = useState(false);
  const [isEnrolledDateModalOpen, setIsEnrolledDateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [lessonStatus, setLessonStatus] = useState("All");
  const [enrolledDate, setEnrolledDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalStudentDetailOpen, setModalStudentDetailOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState([]);
  const [selectedStudentDetails, setSelectedStudentDetails] = useState("");
  // state for instructor dashboard
  const [instructorStudents, setInstructorStudents] = useState([]);
  const { empPermissions } = useProfileImage();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { setIsLoading } = useLoading();
  // get all students data
  const getAllStudents = async () => {
    try {
      setIsLoading(true);
      //API for fetching all Students data
      if (location.pathname === "/admindashboard") {
        const response = await axios(
          "items/Learner?fields=*,user_id.first_name,user_id.last_name,user_id.profileImg,user_id.phoneNumber,user_id.city,booking.status,booking.lesson.Lesson_Status,booking.lesson.Pending_Lesson"
        );
        const studentsData = await response.data;
        setStudentDetails(studentsData.data);
        setLoading(false);
      }
      // API for fetching instructor student's data
      else if (location.pathname === "/instructordashboard") {
        const instructorId = localStorage.getItem("instructorId");
        const response = await axios(
          `items/Booking?filter[package].[Instructor][_eq]=${instructorId}&fields=id,date_created,learner.id,learner.date_created,learner.user_id.profileImg,learner.user_id.first_name,learner.user_id.last_name,learner.user_id.phoneNumber,learner.user_id.city`
        );
        setInstructorStudents(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("error in fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  const handleViewStudentprofile = async (studentId) => {
    try {
      setIsLoading(true);
      if (location.pathname === "/admindashboard") {
        const response = await axios(
          `items/Learner?fields=*,user_id.*,booking.*,booking.package.Instructor.user_id.first_name,booking.package.Instructor.user_id.last_name,booking.package.Instructor.user_id.profileImg,booking.lesson.*,booking.package.*,ratings.*,ratings.given_to.user_id.profileImg,ratings.given_to.user_id.first_name,ratings.given_to.user_id.last_name,ratings.Given_by.user_id.first_name,ratings.Given_by.user_id.last_name&filter[id]=${studentId}`
        );
        const Data = await response.data;
        setSelectedStudentDetails(Data.data);
        setModalStudentDetailOpen(true);
      } else if (location.pathname === "/instructordashboard") {
        const response = await axios(
          `items/Booking?fields=*,package.Instructor.id,package.Instructor.user_id.*,learner.ratings.*,learner.ratings.given_to.user_id.profileImg,learner.ratings.given_to.user_id.first_name,learner.ratings.given_to.user_id.last_name,learner.ratings.Given_by.user_id.first_name,learner.ratings.Given_by.user_id.last_name,package.lessons.*,package.lessons.Lessons_id.*,learner.*,learner.Joining_date,learner.Last_active_date,learner.user_id.*,package.*&filter[id]=${studentId}`
        );
        const Data = await response.data;
        setSelectedStudentDetails(Data.data);
        setModalStudentDetailOpen(true);
      }
    } catch (error) {
      handleError("Error in Fetching Details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfilePermission = (studentId) => {
    if (empPermissions) {
      if (empPermissions.roles.User_Management.includes("View Users")) {
        handleViewStudentprofile(studentId);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      handleViewStudentprofile(studentId);
    }
  };
  const handleResetFilters = () => {
    setLessonStatus("All");
    setEnrolledDate("");
    setSearchTerm("");
  };
  // All Students
  const filteredAllStudents = studentDetails.filter((student) => {
    const fullName = `${student?.user_id?.first_name || ""} ${student?.user_id
      ?.last_name || ""}`.trim();

    const lessonFilter =
      lessonStatus === "All" || student.lession_status === lessonStatus;

    const enrolledDateFilter =
      !enrolledDate || new Date(student.date_created
        ) >= new Date(enrolledDate);

    const searchFilter =
      searchTerm === "" ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase());

    return lessonFilter && enrolledDateFilter && searchFilter;
  });
  // Instructor Students
  const filteredInstructorStudents = instructorStudents.filter((student) => {
    const fullName = `${student?.learner?.user_id?.first_name || ""} ${
      student?.learner?.user_id?.last_name || ""
    }`.trim();

    const lessonFilter =
      lessonStatus === "All" || student.lession_status === lessonStatus;

    const enrolledDateFilter = !enrolledDate || new Date(student.learner.date_created) >= new Date(enrolledDate);

    const searchFilter =
      searchTerm === "" ||
      fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return lessonFilter && enrolledDateFilter && searchFilter;
  });

  const studentsList =
    location.pathname === "/instructordashboard"
      ? filteredInstructorStudents || []
      : filteredAllStudents;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6 items-center">
        <div className="font-bold text-desk-h-6 font-sans">Students</div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${
              viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <FaTh className="w-5 h-5 shrink-0" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 hidden sm:block ${
              viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <FaBars className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>
      <div className="lg:flex items-center justify-between mt-5">
        <div className="flex items-center bg-gray-100 rounded-md px-4 py-2 w-full sm:w-96 border border-solid border-neutral-100">
          <FaSearch className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 bg-transparent focus:outline-none text-neutral-600 w-full"
          />
        </div>
        <div className="mt-4 lg:mt-0 flex items-center gap-7 cursor-pointer">
          <div
            className="flex items-center gap-3 font-semibold font-poppins text-desk-b-3 text-neutral-600"
            onClick={() => setIsLessonStatusModalOpen(true)}
          >
            <FaFilter className="mr-2 shrink-0" />
            <div>{lessonStatus}</div>
            <FaCaretDown className="shrink-0" />
          </div>

          <div
            className="flex items-center gap-3 font-semibold font-poppins text-desk-b-3 text-neutral-600"
            onClick={() => setIsEnrolledDateModalOpen(true)}
          >
            <div>Enrolled Date</div>
            <FaCaretDown className="shrink-0" />
          </div>

          <button
            onClick={handleResetFilters}
            className="text-error-300 px-4 py-2 flex gap-1 items-center font-poppins text-desk-b-2"
          >
            <BiReset className="shrink-0" />
            Reset Filters
          </button>
        </div>
      </div>
      {viewMode === "grid" ? (
        loading ? (
          <div className="flex text-center justify-center text-gray-400 text-3xl font-bold mt-20">
            loading...
          </div>
        ) : (
          <div className="mt-10 flex flex-wrap gap-3 justify-center sm:justify-normal gap-y-6 ">
            {studentsList.map((student) => (
              <StudentCards
                key={student.id}
                student={student}
                handleViewStudentprofile={handleViewStudentprofile}
              />
            ))}
          </div>
        )
      ) : (
        <div className="p-4 mt-8 hidden sm:block">
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-center py-5 px-4 uppercase font-semibold text-sm">
                    Name
                  </th>
                  <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                    Phone Number
                  </th>
                  <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                    City
                  </th>

                  <th className="text-left py-5 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {studentsList.map((student, index) => (
                  <tr key={student.id} className="border-t border-gray-200">
                    <td className="py-3 px-4 flex items-center">
                      <img
                        src={
                          location.pathname === "/admindashboard"
                            ? student?.user_id?.profileImg
                            : student?.learner?.user_id?.profileImg
                        }
                        className="w-10 h-10 rounded-full mr-8 object-cover"
                      />
                      <span className="font-medium text-blue-600">
                        {location.pathname === "/admindashboard"
                          ? student?.user_id?.first_name
                          : student?.learner?.user_id?.first_name}{" "}
                        {location.pathname === "/admindashboard"
                          ? student?.user_id?.last_name
                          : student?.learner?.user_id?.last_name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {location.pathname === "/admindashboard"
                        ? student?.user_id?.phoneNumber
                        : student?.learner?.user_id?.phoneNumber}
                    </td>

                    <td className="py-3 px-4">
                      {location.pathname === "/admindashboard"
                        ? student?.user_id?.city
                        : student?.learner?.user_id?.city}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                        onClick={() => handleViewProfilePermission(student.id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lesson Status Modal */}
      <ReactModal
        isOpen={isLessonStatusModalOpen}
        onRequestClose={() => setIsLessonStatusModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Select Lesson Status</h3>
        <div className="flex flex-wrap gap-2">
          {["All", "Ongoing", "Scheduled"].map((status) => (
            <button
              key={status}
              onClick={() => setLessonStatus(status)}
              className={`px-4 py-2 rounded-full ${
                lessonStatus === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsLessonStatusModalOpen(false)}
            className="text-gray-700 px-4 py-2 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsLessonStatusModalOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Apply Now
          </button>
        </div>
      </ReactModal>
      {/* Enrolled Date Modal */}
      <ReactModal
        isOpen={isEnrolledDateModalOpen}
        onRequestClose={() => setIsEnrolledDateModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Select Enrolled Date</h3>
        <input
          type="date"
          value={enrolledDate}
          onChange={(e) => setEnrolledDate(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsEnrolledDateModalOpen(false)}
            className="text-gray-700 px-4 py-2 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsEnrolledDateModalOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Apply Now
          </button>
        </div>
      </ReactModal>
      {/* Student Full Detail Modal */}
      <ReactModal
        isOpen={modalStudentDetailOpen}
        onRequestClose={() => setModalStudentDetailOpen(false)}
        className="bg-white shadow-lg px-5 sm:px-10 pt-5  w-full md:w-4/5 lg:w-8/12 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end"
      >
        <StudentDetailModal
          setModalStudentDetailOpen={setModalStudentDetailOpen}
          selectedStudentDetails={selectedStudentDetails}
          handleViewStudentprofile={handleViewStudentprofile}
        />
      </ReactModal>
      <ToastContainer />
    </div>
  );
};

export default AllStudents;
