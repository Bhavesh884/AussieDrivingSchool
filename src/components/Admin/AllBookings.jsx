import React, { useEffect, useState } from "react";
import { BiReset } from "react-icons/bi";
import { FaBars, FaCaretDown, FaFilter, FaSearch, FaTh } from "react-icons/fa";
import ReactModal from "react-modal";
import { GoArrowLeft } from "react-icons/go";
import { HiLocationMarker } from "react-icons/hi";
import Modal from "react-modal";
import axios from "../../axios";
import { useLocation } from "react-router-dom";
import { useLoading } from "../../LoadingContext";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { useProfileImage } from "../../utils/ProfileImageContext";

// Modal Custom Styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export const BookingDetailModal = ({
  setBookingDetailModalOpen,
  selectedBookingDetails,
  lessonsTaken,
}) => {
  const {
    first_name,
    last_name,
    profileImg,
    phoneNumber,
    email,
  } = selectedBookingDetails[0]?.package?.Instructor?.user_id;
  const [cancleBookingModalOpen, setCancelBookingModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const location = useLocation();

  //Cancel Booking
  const cancelBooking = async (bookingId) => {
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
        `items/Booking/${bookingId}`,
        cancelDetails
      );
      handleSuccess("Booking cancelled successfully.");
      setCancelBookingModalOpen(false);
      viewBookingProfile(bookingId);
      setCancelReason("");
      // handleViewprofile(InstructorId);
    } catch (error) {
      handleError("Error in Cancel Booking");
    }
  };

  return (
    <div>
      <GoArrowLeft
        size={28}
        className="hover:cursor-pointer"
        onClick={() => setBookingDetailModalOpen(false)}
      />
      <div className="border border-neutral-100 rounded-lg mt-8 mb-20">
        {/* profile section */}
        <div className="p-4">
          <div className="flex gap-4 items-start">
            <div className="flex">
              <img
                className={`w-12 h-12 rounded-full border-2 border-white shadow-lg -mr-4 z-10 object-cover ${
                  location.pathname === "/instructordashboard" ? "hidden" : ""
                }`}
                src={profileImg}
                alt="Instructor Avatar"
              ></img>

              <img
                className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
                src={selectedBookingDetails[0]?.learner?.user_id?.profileImg}
                alt="Learner Avatar"
              ></img>
            </div>
            <div>
              <div
                className={`flex gap-1 ${
                  location.pathname === "/instructordashboard" ? "hidden" : ""
                } `}
              >
                <span className="font-semibold">Instructor:</span>
                <span className="">
                  {first_name} {last_name}
                </span>
              </div>
              <div className="flex gap-1 mt-1">
                <span className="font-semibold">Learner:</span>
                <span className="">
                  {selectedBookingDetails[0]?.learner?.user_id.first_name}{" "}
                  {selectedBookingDetails[0]?.learner?.user_id.last_name}
                </span>
              </div>
              <button className="px-6 rounded-full text-success-300 border border-success-300 mt-2 text-sm">
                {selectedBookingDetails[0]?.status}
              </button>
            </div>
          </div>
        </div>
        <hr className="border-neutral-100"></hr>

        <div className="flex">
          <div className="border-r-2 border-neutral-100 w-72">
            {/* Personal details */}
            <div className="p-4 text-sm">
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Booking ID
              </h3>
              <p className="font-poppins text-[#202224]">
                {selectedBookingDetails[0].id}
              </p>
              <div
                className={`${
                  location.pathname === "/instructordashboard" ? "hidden" : ""
                }`}
              >
                <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                  Instructor Name
                </h3>
                <p className="font-poppins text-[#202224]">
                  {first_name} {last_name}
                </p>
              </div>
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Learner Name
              </h3>
              <p className="font-poppins text-[#202224]">
                {selectedBookingDetails[0]?.learner?.user_id.first_name}{" "}
                {selectedBookingDetails[0]?.learner?.user_id.last_name}
              </p>
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Date of Booking
              </h3>
              <p className="font-poppins text-[#202224]">
                {/* {selectedBookingDetails[0]?.start_date} */}

                {new Date(
                  selectedBookingDetails[0]?.date_created
                ).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Package Type
              </h3>
              <p className="font-poppins text-[#202224]">
                {selectedBookingDetails[0]?.package?.name}
              </p>
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Number of Lessons
              </h3>
              <p className="font-poppins text-[#202224]">
                {selectedBookingDetails[0]?.package?.lessons.length}
              </p>
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Lessons Taken
              </h3>
              <p className="font-poppins text-[#202224]">{lessonsTaken}</p>
            </div>
          </div>

          <div className="w-full">
            {/*  Booking Information */}
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold font-poppins text-secondary-500">
                Booking Information
              </h2>
              <div className="text-sm">
                <div className="font-bold mt-4 font-poppins">Package Type</div>
                <div>{selectedBookingDetails[0]?.package?.name}</div>
                <div className="font-bold mt-4">Package Price</div>
                <div>${selectedBookingDetails[0]?.package?.price}</div>
                <div className="font-bold mt-4">Payment Status</div>
                <div>Paid</div>
                <div className="font-bold mt-4">Payment Method</div>
                <div>Credit Card</div>
              </div>
            </div>
            <hr className="border-neutral-100 my-3"></hr>
            {/* Additional Details */}
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">
                Additional Details
              </h2>
              <div className="text-sm">
                <div
                  className={`${
                    location.pathname === "/instructordashboard" ? "hidden" : ""
                  }`}
                >
                  <div className="font-bold mt-4 font-poppins">
                    Instructor Contact
                  </div>
                  <div>{phoneNumber}</div>
                  <div className="font-bold mt-4">Instructor Email</div>
                  <div>{email}</div>
                </div>
                <div className="font-bold mt-4">Learner Contact</div>
                <div>
                  {selectedBookingDetails[0]?.learner?.user_id.phoneNumber}
                </div>
                <div className="font-bold mt-4">Learner Email</div>
                <div>{selectedBookingDetails[0]?.learner?.user_id.email}</div>
              </div>
            </div>
            <hr className="border-neutral-100 my-3"></hr>
            {/* Notes */}
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">Notes</h2>
              <div className="text-sm">
                <div className="font-bold mt-4 font-poppins">
                  Special Requests
                </div>
                <div>Please provide an automatic vehicle</div>
                <div className="font-bold mt-4">Instructor Comments</div>
                <div>
                  Learner is progressing well,recommended focusing on parallel
                  parking in the next lesson.{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Butttons */}
      <div className="flex gap-5 bg-white py-5 fixed bottom-0 w-full">
        <button
          className={`bg-error-200 rounded-md px-8 py-2 text-white transition-colors duration-200 ${
            selectedBookingDetails[0]?.is_canceled === "true"
              ? "bg-error-100"
              : "hover:bg-error-300"
          }`}
          onClick={() => setCancelBookingModalOpen(true)}
          disabled={selectedBookingDetails[0]?.is_canceled === "true"}
        >
          {selectedBookingDetails[0]?.is_canceled === "true"
            ? "Booking Cancelled"
            : "Cancel Booking"}
        </button>
        <button
          className="bg-neutral-300 rounded-md text-white px-8 py-2 transition-colors duration-200 hover:bg-neutral-400"
          onClick={() => setBookingDetailModalOpen(false)}
        >
          Close
        </button>
      </div>
      {/* cancel booking modal */}
      <ReactModal
        isOpen={cancleBookingModalOpen}
        onRequestClose={() => setCancelBookingModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 z-[999999] m-7"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[999999]"
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
            onClick={() => cancelBooking(selectedBookingDetails[0].id)}
          >
            Cancel Booking
          </button>
          <button
            onClick={() => setCancelBookingModalOpen(false)}
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

const AllBookings = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [isBookingDetailModalOpen, setBookingDetailModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [allBookingDetails, setAllBookingDetails] = useState([]);
  const [instructorBookings, setInstructorBookings] = useState([]);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState([]);
  const [lessonsTaken, setLessonsTaken] = useState("");
  const location = useLocation();
  const { setIsLoading } = useLoading();
  const { empPermissions } = useProfileImage();
  //get all bookings
  const getAllBookings = async () => {
    try {
      setIsLoading(true);
      if (location.pathname === "/admindashboard") {
        //API for fetching all Students data
        const response = await axios(
          "items/Booking?fields=*,package.Instructor.id,package.Instructor.user_id.first_name,package.Instructor.user_id.last_name,package.Instructor.user_id.profileImg,learner.user_id.profileImg,learner.user_id.first_name,learner.user_id.last_name,start_date,package.*"
        );

        const bookingsData = await response.data.data;
        setAllBookingDetails(bookingsData);
      } else if (location.pathname === "/instructordashboard") {
        const instructorId = localStorage.getItem("instructorId");
        if (instructorId) {
          const response = await axios(
            `items/Booking?filter[package].[Instructor][_eq]=${instructorId}&fields=id,date_created,package.name,package.price,learner.user_id.profileImg,learner.user_id.first_name,learner.user_id.last_name,package.Instructor.user_id.profileImg,learner.user_id.profileImg,learner.user_id.first_name,learner.user_id.last_name,package.Instructor.user_id.first_name,package.Instructor.user_id.last_name`
          );
          setInstructorBookings(response.data.data);
          // setLoading(false)
        }
      }
    } catch (error) {
      console.log("error in fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleViewBookingPermission = (bookingId) => {
    if (empPermissions) {
      if (empPermissions.roles.User_Management.includes("View Users")) {
        viewBookingProfile(bookingId);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      viewBookingProfile(bookingId);
    }
  };
  useEffect(() => {
    getAllBookings();
  }, []);

  // Date Filter
  const handleDateFilter = (date) => {
    setSelectedDate(date);
  };

  // Package Filter
  const handlePackageFilter = (packageType) => {
    setSelectedPackage(packageType);
  };

  const clearFilters = () => {
    setSelectedDate("");
    setSelectedPackage("");
    setSearchTerm("");
  };
  // filter all bookings
  const filteredData = (location.pathname === "/admindashboard"
    ? allBookingDetails
    : instructorBookings
  ).filter((booking) => {
    //search filter
    const searchFilter =
      booking?.package?.Instructor?.user_id?.first_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking?.package?.Instructor?.user_id?.last_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking?.learner?.user_id?.first_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking?.learner?.user_id?.last_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    // package filter
    const packageFilter = selectedPackage
      ? booking?.package?.Plan_Type === selectedPackage.toLowerCase()
      : true;

    //booking date filter
    const bookingDateFilter = selectedDate
      ? new Date(booking.date_created) >= new Date(selectedDate)
      : true;

    return searchFilter && packageFilter && bookingDateFilter;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-desk-h-6 font-sans ">Bookings</h1>
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
            className={`p-2 ${
              viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <FaBars className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>

      <div className="">
        <div className="flex flex-col lg:flex-row justify-between mb-12">
          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 rounded-md px-4 py-2 w-full sm:w-96 border border-solid border-neutral-100">
            <FaSearch className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 w-full bg-transparent focus:outline-none text-neutral-600"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4 items-center mt-5 lg:mt-0">
            <button
              onClick={() => setIsDateModalOpen(true)}
              className="flex gap-3 bg-transparent items-center font-semibold font-poppins text-desk-b-3 text-neutral-600"
            >
              <FaFilter className="mr-2 shrink-0" />
              Date Filter
              <FaCaretDown className="shrink-0" />
            </button>
            <button
              onClick={() => setIsPackageModalOpen(true)}
              className="flex items-center gap-3 font-semibold font-poppins text-desk-b-3 text-neutral-600 bg-transparent"
            >
              {selectedPackage ? selectedPackage : "Package Filter"}
              <FaCaretDown className="shrink-0" />
            </button>
            <button
              onClick={clearFilters}
              className="text-error-300 px-4 py-2 flex gap-1 items-center"
            >
              <BiReset className="shrink-0" />
              Reset Filters
            </button>
          </div>
        </div>

        {/* Date Filter Modal */}
        <ReactModal
          isOpen={isDateModalOpen}
          onRequestClose={() => setIsDateModalOpen(false)}
          className="bg-white rounded-lg shadow-lg p-6 z-[999999]"
          overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[999999]"
        >
          <h3 className="text-lg font-bold mb-4">Select Date</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsDateModalOpen(false)}
              className="text-gray-700 px-4 py-2 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsDateModalOpen(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
            >
              Apply Date Filter
            </button>
          </div>
        </ReactModal>

        {/* Package Filter Modal */}
        <ReactModal
          isOpen={isPackageModalOpen}
          onRequestClose={() => setIsPackageModalOpen(false)}
          className="bg-white rounded-lg shadow-lg p-6 z-[999999]"
          overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[999999]"
        >
          <h3 className="text-lg font-bold mb-4">Select Package</h3>
          <div className="flex flex-wrap gap-2">
            {["Standard Plan", "Premium Plan"].map((pkg) => (
              <button
                key={pkg}
                className={`px-4 py-2 rounded-full ${
                  selectedPackage === pkg
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setSelectedPackage(pkg)}
              >
                {pkg}
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsPackageModalOpen(false)}
              className="text-gray-700 px-4 py-2 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsPackageModalOpen(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
            >
              Apply Package Filter
            </button>
          </div>
        </ReactModal>
        {/* Booking Detail Modal */}
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

        {/* Booking Cards */}

        {viewMode === "grid" && filteredData.length > 0 ? (
          <div className="flex justify-center sm:justify-normal gap-3 gap-y-6 flex-wrap">
            {filteredData.map((booking) => (
              <div
                key={booking.id}
                className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between items-center border border-solid border-neutral-100 w-[235px]"
              >
                <div className="flex justify-center mb-4">
                  <img
                    className={`w-12 h-12 rounded-full border-2 border-white shadow-lg -mr-4 z-10 object-cover ${
                      location.pathname === "/instructordashboard"
                        ? "hidden"
                        : ""
                    }`}
                    src={booking?.package?.Instructor?.user_id?.profileImg}
                    alt="Instructor Avatar"
                  />
                  <img
                    className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover"
                    src={booking?.learner?.user_id?.profileImg}
                    alt="Learner Avatar"
                  />
                </div>
                <h2 className="font-semibold text-center mb-5">{booking.id}</h2>
                <div className="w-full">
                  <p
                    className={`font-semibold flex w-full justify-between mb-2 font-poppins text-gray-500 text-desk-b-3 ${
                      location.pathname === "/instructordashboard"
                        ? "hidden"
                        : ""
                    }`}
                  >
                    Instructor:{" "}
                    <span className="font-normal text-black">
                      {booking?.package?.Instructor?.user_id?.first_name}{" "}
                      {booking?.package?.Instructor?.user_id?.last_name}
                    </span>
                  </p>
                  <p className="font-semibold flex w-full justify-between mb-2 text-gray-500 text-desk-b-3">
                    Learner:{" "}
                    <span className="font-normal text-black">
                      {booking?.learner?.user_id?.first_name}{" "}
                      {booking?.learner?.user_id?.last_name}
                    </span>
                  </p>
                  <p className="font-semibold flex w-full justify-between shrink-0 mb-2 text-gray-500 text-desk-b-3">
                    Booking Date:{" "}
                    <span className="font-normal shrink-0 text-black">
                      {new Date(booking?.date_created).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
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
                  onClick={() => handleViewBookingPermission(booking.id)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden sm:block">
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-full bg-white">
                <thead className="">
                  <tr>
                    <th
                      className={`text-center py-5 px-4 uppercase font-semibold text-sm  ${
                        location.pathname === "/instructordashboard"
                          ? "hidden"
                          : ""
                      }`}
                    >
                      Instructor
                    </th>
                    <th className="text-center py-5 px-4 uppercase font-semibold text-sm">
                      Learner
                    </th>
                    <th className="text-left py-5 uppercase font-semibold text-sm">
                      Booking Date
                    </th>
                    <th className="text-center py-5 uppercase font-semibold text-sm">
                      Package Type
                    </th>
                    <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                      Session Fee
                    </th>
                    <th className="text-left py-5 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((booking) => (
                    <tr key={booking.id} className="border-t border-gray-200">
                      <td
                        className={` flex py-3 px-4 uppercase font-semibold text-sm  ${
                          location.pathname === "/instructordashboard"
                            ? "hidden"
                            : ""
                        }`}
                      >
                        <img
                          src={booking?.instructor?.user_id?.profileImg}
                          alt="Instructor Avatar"
                          className="w-10 h-10 rounded-full mr-8 object-cover"
                        />
                        <span className="font-medium text-blue-600">
                          {booking?.instructor?.user_id?.first_name}{" "}
                          {booking?.instructor?.user_id?.last_name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <img
                          src={booking?.learner?.user_id?.profileImg}
                          alt="Learner Avatar"
                          className="w-10 h-10 rounded-full mr-4 object-cover"
                        />
                        <span className="font-medium text-blue-600">
                          {booking?.learner?.user_id?.first_name}{" "}
                          {booking?.learner?.user_id?.last_name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(booking?.date_created).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="py-3 px-4">{booking?.package?.name}</td>
                      <td className="py-3 px-4">${booking?.package?.price}</td>
                      <td className="py-3 px-4">
                        <button
                          className="bg-blue-500 text-white py-2 px-4 rounded-md"
                          onClick={() =>
                            handleViewBookingPermission(booking.id)
                          }
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
      </div>
      <ToastContainer />
    </div>
  );
};

export default AllBookings;
