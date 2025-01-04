import React from "react";
import MyBookings from "./LearnersBookings";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaTriangleExclamation } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import Modal from "react-modal";
import axios from "../../axios";
import { ProfileImgUpload } from "../ImageSetup/ProfileImgUpload";
import { useProfileImage } from "../../utils/ProfileImageContext";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { useLoading } from "../../LoadingContext";
import { set } from "date-fns";

const TestimonialCard = ({ testimonial, fetchBookingData }) => {
  const [deleteModalOpen, setDeleteModalOPen] = useState(false);
  //delete Reviews
  const { setIsLoading } = useLoading();
  const deleteTestimonial = async (id) => {
    try {
      setIsLoading(true);
      console.log("id", id);
      await axios.delete(`items/Instructor_Rating/${id}`);
      setDeleteModalOPen(false);
      fetchBookingData();
      handleSuccess("Testimonial Deleted Successfully!!");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-lg p-6 mb-6 border border-solid border-slate-300">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-700">{testimonial?.Reviews}</p>
        <RiDeleteBin6Line
          onClick={() => setDeleteModalOPen(true)}
          className="hover:cursor-pointer"
        />
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
            {new Date(testimonial?.date_created).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      {deleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#FFFFFF] rounded-xl p-6 w-80 shadow-lg">
            <div className="flex flex-col items-center">
              <FaTriangleExclamation className="text-red-500" size={25} />
              <h2 className="text-lg font-semibold text-[#202224] mt-4">
                Delete Testimonial?
              </h2>
              <p className="text-sm text-[#202224] text-center mt-2">
                Are you sure you want to delete this testimonial? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setDeleteModalOPen(false)}
                className="w-full mr-2 py-2 text-[#FFFFFF] bg-[#B7B7B7] rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTestimonial(testimonial?.id)}
                className="w-full ml-2 py-2 text-[#FFFFFF] bg-[#EE6055] rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Testimonials = ({ ratings, fetchBookingData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 2;
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 md:p-8 px-10 max-w-5xl w-full border border-solid border-slate-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
        Testimonials
      </h2>
      {currentTestimonials.length > 0 ? (
        <div>
          {currentTestimonials?.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              fetchBookingData={fetchBookingData}
            />
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
  );
};

const LearnerProfile = () => {
  const [profileImg, setProfileImg] = useState("");
  const [bookingDetails, setBookingDetails] = useState([]);
  const bookingSectionRef = useRef(null);
  const [personalDetailModalOpen, setPersonalDetailModalOpen] = useState(false);
  const location = useLocation();
  const [personalDetails, setPersonalDetails] = useState({
    email: "",
    phoneNumber: "",
    date_of_birth: "",
  });
  const { setLearnerProfileImg } = useProfileImage();
  const { setIsLoading } = useLoading();

  //fetch learner's personal and booking details
  const fetchBookingData = async () => {
    try {
      const learnerId = localStorage.getItem("LearnerId");
      setIsLoading(true);
      const response = await axios(
        `api/getlearnerdetails?learnerId=${learnerId}`
      );
      const learnerData = response.data.data;
      setBookingDetails(learnerData);
      setProfileImg(learnerData[0].user_id.profileImg);
    } catch (error) {
      console.log("error in getting booking data", response.data);
    } finally {
      setIsLoading(false);
    }
  };
  // open personal detail modal
  const openPersonalDetailModal = (learnerInfo) => {
    console.log("learnerInfo :", learnerInfo);
    setPersonalDetails({
      email: learnerInfo?.user_id?.email || "",
      phoneNumber: learnerInfo?.user_id?.phoneNumber || "",
      date_of_birth: learnerInfo?.user_id?.date_of_birth || "",
    });
    setPersonalDetailModalOpen(true);
  };
  //save personal details
  const savePersonalDetails = async () => {
    try {
      setIsLoading(true);

      await axios.patch(
        `users/${bookingDetails[0]?.user_id?.id}`,
        personalDetails
      );
      handleSuccess("Changes Saved Successfully");
      await fetchBookingData();
      setPersonalDetailModalOpen(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  // update profile Img
  const updateProfileImage = async (profileImg) => {
    try {
      setIsLoading(true);
      await axios.patch(`users/${bookingDetails[0]?.user_id?.id}`, {
        profileImg: profileImg,
      });
      setLearnerProfileImg(profileImg);
    } catch (error) {
      console.log("error in updating profile image", error);
      handleError("Error in Updating Profile Image");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
    if (location.state?.scrollToBooking) {
      bookingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <>
      <div className="flex flex-col items-center min-h-screen p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Profile
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-2 md:p-8 px-10 max-w-5xl w-full border border-solid border-slate-200">
          <div className="flex items-center gap-6 sm:gap-0 flex-wrap sm:flex-nowrap justify-between mb-6 border-b border-solid border-gray-200 py-4">
            <div className="flex items-center">
              <ProfileImgUpload
                profileImg={profileImg}
                setProfileImg={setProfileImg}
                updateProfileImage={updateProfileImage}
              />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {bookingDetails[0]?.user_id?.first_name}{" "}
                  {bookingDetails[0]?.user_id?.last_name}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <h1 className="font-semibold text-lg">Details</h1>
            <FaRegEdit
              size={20}
              onClick={() => openPersonalDetailModal(bookingDetails[0])}
              className="hover:cursor-pointer"
            />
          </div>

          <h1 className="mt-3 font-semibold">Email</h1>
          <h1>{bookingDetails[0]?.user_id?.email}</h1>
          <h1 className="mt-3 font-semibold">Phone Number</h1>
          <h1>{bookingDetails[0]?.user_id?.phoneNumber}</h1>
          <h1 className="mt-3 font-semibold">Date of birth</h1>
          <h1>{bookingDetails[0]?.user_id?.date_of_birth}</h1>
        </div>

        {/* <MyBookings /> */}
        <div ref={bookingSectionRef}>
          <MyBookings
            bookingDetails={bookingDetails}
            fetchBookingData={fetchBookingData}
          />
        </div>

        {/* testimonials */}
        {bookingDetails[0]?.ratings && (
          <Testimonials
            ratings={bookingDetails[0]?.ratings}
            fetchBookingData={fetchBookingData}
          />
        )}
      </div>
      {/* edit personal detail modal */}
      <Modal
        isOpen={personalDetailModalOpen}
        className="bg-white p-6 rounded-lg shadow-lg w-full mx-5 sm:w-[550px] max-w-5xl"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-[#202224] font-bold">Edit Details</h2>
            <button
              onClick={() => setPersonalDetailModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoMdClose className="text-gray-500" size={28} />
            </button>
          </div>
          <p className="text-sm text-[#202224] my-6">
            Provide accurate and updated information.
          </p>

          <form className="space-y-2">
            {/* Email */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Email
              </label>
              <input
                className="p-3 border border-gray-300 rounded-lg focus:outline-none"
                value={personalDetails.email}
                onChange={(e) =>
                  setPersonalDetails({
                    ...personalDetails,
                    email: e.target.value,
                  })
                }
              ></input>
            </div>
            <hr></hr>
            {/* Phone Number */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                value={personalDetails.phoneNumber}
                onChange={(e) =>
                  setPersonalDetails({
                    ...personalDetails,
                    phoneNumber: e.target.value,
                  })
                }
              />
            </div>
            <hr></hr>
            {/*  Date of Birth */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                value={personalDetails.date_of_birth}
                onChange={(e) =>
                  setPersonalDetails({
                    ...personalDetails,
                    date_of_birth: e.target.value,
                  })
                }
              />
            </div>
          </form>
          {/* save/cancel buttons */}
          <div className="flex justify-start space-x-5 mt-5">
            <button
              type="submit"
              className="px-16 py-2 bg-[#2B6BE7] text-[#FFFFFF] rounded-lg hover:bg-blue-600"
              onClick={savePersonalDetails}
            >
              Save
            </button>
            <button
              type="button"
              className="px-16 py-2 bg-[#B7B7B7] text-[#FFFFFF] rounded-lg hover:bg-gray-400"
              onClick={() => setPersonalDetailModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default LearnerProfile;
