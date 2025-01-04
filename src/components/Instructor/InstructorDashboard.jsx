import React, { useEffect, useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { SiClockify } from "react-icons/si";
import { PiListBulletsBold } from "react-icons/pi";
import { PiNotebookBold } from "react-icons/pi";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import AllStudents from "../Admin/AllStudents";
import AllBookings from "../Admin/AllBookings";
import AllNotifications from "../Admin/AllNotifications";
import Earnings from "./Earning";
import Schedule from "./Schedule";
import Dashboard from "./Dashboard";
import ReactModal from "react-modal";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import InstructorProfile from "./InstructorProfile";
import Availability from "./Availablity";
import { useOutletContext } from "react-router-dom";
import LessonManager from "./LessonManager";
import PackageManager from "./PackageManager";
import { RiTodoLine } from "react-icons/ri";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { AiOutlineSchedule } from "react-icons/ai";
import { generateAccessToken } from "../../utils/generateAccessToken";
import ChatBotComponent from "../Landing/ChatBotComponent";

const InstructorDashboard = () => {
  // State management
  const { instructorTab, setInstructorTab } = useOutletContext();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // Instructor logout
  const handleInstructorLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    localStorage.clear();
    navigate("/instructorpage");
  };

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    if (!accessToken && refreshToken) {
      generateAccessToken();
    }
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <div className="bg-white text-neutral-1000 w-full md:w-64 p-4 md:flex-col justify-between fixed md:relative bottom-0 md:bottom-auto z-10 md:z-auto border-r border-solid border-neutral-100 hidden md:flex overflow-scroll">
          <div>
            <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 w-full justify-around border-b border-solid border-neutral-100 pb-4">
              <button
                onClick={() => setInstructorTab("Dashboard")}
                className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                  instructorTab === "Dashboard"
                    ? "bg-secondary-400 text-white"
                    : ""
                }`}
              >
                <SiClockify className="w-5 h-5 shrink-0" />
                <span className="hidden md:block">Dashboard</span>
              </button>
              <button
                onClick={() => setInstructorTab("Profile")}
                className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                  instructorTab === "Profile"
                    ? "bg-secondary-400 text-white"
                    : ""
                }`}
              >
                <FaRegCircleUser className="w-5 h-5 shrink-0" />
                <span className="hidden md:block">Profile</span>
              </button>

              <button
                onClick={() => setInstructorTab("Students")}
                className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                  instructorTab === "Students"
                    ? "bg-secondary-400 text-white"
                    : ""
                }`}
              >
                <FaRegHeart className="w-5 h-5 shrink-0" />
                <span className="hidden md:block">Students</span>
              </button>
              <button
                onClick={() => setInstructorTab("Bookings")}
                className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                  instructorTab === "Bookings"
                    ? "bg-secondary-400 text-white"
                    : ""
                }`}
              >
                <PiListBulletsBold className="w-5 h-5 shrink-0" />
                <span className="hidden md:block">Bookings</span>
              </button>
              <button
                onClick={() => setInstructorTab("Availablity")}
                className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                  instructorTab === "Availablity"
                    ? "bg-secondary-400 text-white"
                    : ""
                }`}
              >
                <RiCalendarScheduleLine className="w-5 h-5 shrink-0" />
                <span className="hidden md:block">Availability</span>
              </button>
              <button
                onClick={() => setInstructorTab("Lesson")}
                className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                  instructorTab === "Lesson"
                    ? "bg-secondary-400 text-white"
                    : ""
                }`}
              >
                <RiTodoLine className="w-5 h-5 shrink-0" />
                <span className="hidden md:block">Lesson Manager</span>
              </button>
              <button
                onClick={() => setInstructorTab("Package")}
                className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                  instructorTab === "Package"
                    ? "bg-secondary-400 text-white"
                    : ""
                }`}
              >
                <PiNotebookBold className="w-5 h-5 shrink-0" />
                <span className="hidden md:block">Package Manager</span>
              </button>
              <button
                onClick={() => setInstructorTab("Schedule")}
                className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                  instructorTab === "Schedule"
                    ? "bg-secondary-400 text-white"
                    : ""
                }`}
              >
                <AiOutlineSchedule className="w-5 h-5 shrink-0" />
                <span className="hidden md:block">Schedule</span>
              </button>
              {/* <button
              onClick={() => setInstructorTab("Inbox")}
              className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                instructorTab === "Inbox" ? "bg-secondary-400 text-white" : ""
              }`}
            >
              <HiOutlineChatAlt2 className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Inbox</span>
            </button> */}
            </div>
            <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 w-full justify-around border-b border-solid border-neutral-100 py-6">
              <button
                onClick={() => setInstructorTab("Earning")}
                className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                  instructorTab === "Earning"
                    ? "bg-secondary-400 text-white"
                    : ""
                }`}
              >
                <FaDollarSign className="w-5 h-5 shrink-0" />
                <span className="hidden md:block">Earnings</span>
              </button>
            </div>
            <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 w-full justify-around py-4">
              <button
                className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg  ${
                  instructorTab === "Notifications"
                    ? "bg-secondary-400 text-white"
                    : ""
                }
              `}
                onClick={() => setInstructorTab("Notifications")}
              >
                <IoMdNotificationsOutline className="w-6 h-6" />
                <span className="block">Notifications</span>
              </button>
              <button
                onClick={() => setLogoutModalOpen(true)}
                className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                  isLogoutModalOpen ? "bg-secondary-400 text-white" : ""
                }`}
              >
                <BiLogOut className="w-5 h-5 shrink-0" />
                <span className="hidden md:block">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-[75%] overflow-y-scroll mb-10">
          {instructorTab === "Dashboard" && <Dashboard />}
          {instructorTab === "Profile" && <InstructorProfile />}
          {instructorTab === "Students" && <AllStudents />}
          {instructorTab === "Bookings" && <AllBookings />}
          {instructorTab === "Earning" && <Earnings />}
          {instructorTab === "Availablity" && <Availability />}
          {instructorTab === "Lesson" && <LessonManager />}
          {instructorTab === "Package" && <PackageManager />}
          {instructorTab === "Notifications" && <AllNotifications />}
          {instructorTab === "Schedule" && <Schedule />}
          {/* logout modal */}
          <ReactModal
            isOpen={isLogoutModalOpen}
            onRequestClose={() => setLogoutModalOpen(false)}
            className="bg-[#FFFFFF] rounded-lg  w-100 shadow-lg p-6 z-[999999]"
            overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[999999]"
          >
            <h3 className="text-xl font-semibold text-center mb-4">
              Are you sure you want to Log out?
            </h3>
            <div className="flex justify-center mt-4 space-x-6">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="ml-4 bg-[#B7B7B7] text-[#FFFFFF] px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleInstructorLogout} // Call confirmLogout to navigate to login
                className="bg-[#EE6055] text-[#FFFFFF] px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
               
          </ReactModal>
        </div>
      </div>
      <ChatBotComponent />
    </>
  );
};

export default InstructorDashboard;
