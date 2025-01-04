import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserCircle, FaSearch, FaDollarSign } from "react-icons/fa";
import { SiClockify } from "react-icons/si";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiListBulletsBold } from "react-icons/pi";
import { FaListCheck, FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { PiNotebookBold } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import Dashboard from "../Admin/Dasboard";
import AdminDashboard from "../Admin/AdminDashboard";
import Modal from "react-modal";
import { CgBookmark } from "react-icons/cg";
import { CgDollar } from "react-icons/cg";
import Cookies from "js-cookie";
import axios from "../../axios";
import { generateAccessToken } from "../../utils/generateAccessToken";
import Notifications from "./Notifications.jsx";
import { useProfileImage } from "../../utils/ProfileImageContext";
import { handleError } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";

function AdminNavBar({
  instructorTab,
  setInstructorTab,
  adminTab,
  setAdminTab,
}) {
  const [sideBar, setSideBar] = useState(false);
  const [instructorInfo, setInstructorInfo] = useState([]);
  const [adminInfo, setAdminInfo] = useState([]);
  const [notificationModal, setNotificationModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toggleMenu = () => {
    setSideBar(!sideBar);
  };
  const { instructorProfileImg, setInstructorProfileImg,employeeProfileImg,setEmployeeProfileImg } = useProfileImage();


  //handle logout
  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    if (location.pathname === "/instructordashboard") {
      navigate("/instructorpage");
    } else if (location.pathname === "/admindashboard") {
      navigate("/login");
    }
  };

  // get Admin data
  const getAdminData = async () => {
    try {
      const adminUserId = localStorage.getItem("userId");
      const accessToken = Cookies.get("access_token");
      const response = await axios(`users?filter[id][_eq]=${adminUserId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
     
      const result = response.data.data;
      setAdminInfo(result);
      setEmployeeProfileImg(result[0].profileImg);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Attempting to refresh...");
        await generateAccessToken(); // Refresh token
        await getAdminData(); // Retry fetching learner data
      } else {
        console.error("Error fetching admin data:", error);
      }
    }
  };
  // get instructor data
  const getInstructorData = async () => {
    try {
      const instructorId = localStorage.getItem("instructorId");
      const accessToken = Cookies.get("access_token");
      const response = await axios(
        `items/Instructor?filter[id][_eq]=${instructorId}&&fields=*,user_id.*`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const result = response.data.data;
      setInstructorInfo(result);
      setInstructorProfileImg(result[0].user_id.profileImg);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Attempting to refresh...");
        await generateAccessToken(); // Refresh token
        await getInstructorData(); // Retry fetching learner data
      } else {
        console.error("Error fetching instructor data:", error);
      }
    }
  };

  const fetchData = async () => {
    try {
      if (location.pathname === "/instructordashboard") {
        getInstructorData();
      } else {
        getAdminData();
      }
    } catch (error) {
      console.error("Error loading data:", error.message);
      handleError("Error loading data:");
    }
  };

  const checkTokensAndFetchData = async () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    if (!accessToken && refreshToken) {
      await generateAccessToken();
    }
    fetchData();
  };

  const isInstructor = localStorage.getItem("isInstructor");
  const isLearner = localStorage.getItem("isLearner");
  const isAdmin = localStorage.getItem("isAdmin");
  const isEmployee = localStorage.getItem("isEmployee");

  const checkRoutes = () =>{
    if (isLearner !== null) return navigate("/");
    else if (isAdmin !== null) return navigate("/admindashboard");
    else if (isEmployee !== null) return navigate("/admindashboard");
  }

  useEffect(() => {
    checkRoutes();
  if(isInstructor || isLearner || isAdmin || isEmployee){
    checkTokensAndFetchData();
    }
  }, []);



  return (
    <div className="w-full flex justify-between items-center gap-5 lg:gap-0 bg-white px-5 md:px-20 h-[100px] border-b">
      {/* Startup */}
      <div className="text-[#001C51] text-2xl xs:text-3xl font-extrabold lg:text-4xl">
        {location.pathname === "/instructordashboard" ? (
          <Link to="/instructorpage">ADS</Link>
        ) : (
          <span>ADS</span>
        )}
      </div>

      <div className="flex items-center">
        <div className="flex gap-5 items-center ">
          <div className="flex items-center bg-gray-100 rounded-l-full rounded-r-full px-2 md:px-4 py-1 md:py-2 border border-solid border-neutral-100">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 bg-transparent focus:outline-none text-neutral-600 "
            />
          </div>

          <IoMdNotificationsOutline
            className="h-6 w-6 shrink-0 hidden md:block hover:cursor-pointer"
            onClick={() => setNotificationModal(true)}
          />
          {location.pathname === "/instructordashboard" ? (
            !instructorInfo[0]?.user_id?.profileImg ? (
              <FaRegCircleUser className="w-5 h-5" />
            ) : (
              <img
                src={instructorProfileImg}
                alt={instructorInfo[0]?.user_id?.first_name}
                className="h-8 w-8 rounded-full shrink-0 hidden md:block object-cover"
              ></img>
            )
          ) : !adminInfo[0]?.profileImg ? (
            <FaRegCircleUser className="w-5 h-5" />
          ) : (
            <img
              src={employeeProfileImg}
              // src={adminInfo[0]?.profileImg}
              alt={adminInfo[0]?.first_name}
              className="h-8 w-8 rounded-full shrink-0 hidden md:block object-cover"
            ></img>
          )}

          <GiHamburgerMenu
            className="md:hidden shrink-0 hover:cursor-pointer"
            size={25}
            onClick={() => (sideBar ? setSideBar(false) : setSideBar(true))}
          />
        </div>
        {sideBar &&
          (location.pathname === "/admindashboard" ? (
            <div
              className={`h-full sm:w-[300px] xs:w-[350px] fixed right-0 top-0 bg-white p-8 lg:hidden z-[99999] shadow-md drop-shadow-md transition-transform duration-300 overflow-scroll`}
            >
              <div className="cursor-pointer mb-5" onClick={toggleMenu}>
                <IoMdClose size={25} />
              </div>
              <div>
                <div className="flex-col space-y-4 w-full justify-around border-b border-solid border-neutral-100 pb-4">
                  <button
                    // onClick={() => (setAdminTab("Dashboard"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-4 w-full px-4 py-2 rounded-lg `}
                  >
                    <img
                      src={employeeProfileImg}
                      alt={adminInfo[0]?.first_name}
                      className="h-8 w-8 shrink-0 rounded-full object-cover"
                    ></img>
                    <span className="block">Profile</span>
                  </button>
                  <button
                    onClick={() => (setAdminTab("Dashboard"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-4 w-full px-4 py-2 rounded-lg ${
                      adminTab === "Dashboard"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <SiClockify className="w-5 h-5" />
                    <span className="block">Dashboard</span>
                  </button>
                  <button
                    onClick={() => (setAdminTab("Instructors"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      adminTab === "Instructors"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <LuLayoutDashboard className="w-5 h-5" />
                    <span className="block">Instructors</span>
                  </button>
                  <button
                    onClick={() => (setAdminTab("Students"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      adminTab === "Students"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <FaRegHeart className="w-5 h-5" />
                    <span className="block">Students</span>
                  </button>
                  <button
                    onClick={() => (setAdminTab("Bookings"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      adminTab === "Bookings"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <PiListBulletsBold className="w-5 h-5" />
                    <span className="block">Bookings</span>
                  </button>
                  {/* <button
                  onClick={() => (setAdminTab("Inbox"), toggleMenu())}
                  className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                    adminTab === "Inbox" ? "bg-secondary-400 text-white" : ""
                  }`}
                >
                  <HiOutlineChatAlt2 className="w-5 h-5" />
                  <span className="block">Inbox</span>
                </button> */}
                  <button
                    onClick={() => (setAdminTab("queries"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      adminTab === "queries"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <PiNotebookBold className="w-5 h-5" />
                    <span className="block">Queries</span>
                  </button>
                </div>
                <div className="flex-col space-y-4 w-full justify-around border-b border-solid border-neutral-100 py-6">
                  <button
                    onClick={() => (setAdminTab("Employees"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      adminTab === "Employees"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <FaListCheck className="w-5 h-5" />
                    <span className="block">Employees</span>
                  </button>
                  <button
                    onClick={() => (setAdminTab("Permissions"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      adminTab === "Permissions"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <FaListCheck className="w-5 h-5" />
                    <span className="block">Roles & Permissions</span>
                  </button>
                </div>

                <div className="flex-col space-x-0 space-y-4 w-full justify-around py-4">
                  <button
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      adminTab === "Notifications"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }
              `}
                    onClick={() => (setAdminTab("Notifications"), toggleMenu())}
                  >
                    <IoMdNotificationsOutline className="w-6 h-6 shrink-0" />
                    <span className="block">Notifications</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg `}
                  >
                    <BiLogOut className="w-5 h-5" />
                    <span className="block">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`h-full w-[300px] xs:w-[350px] fixed right-0 top-0 bg-white p-8 lg:hidden z-[99999] shadow-md drop-shadow-md overflow-scroll `}
            >
              <div className="cursor-pointer mb-5" onClick={toggleMenu}>
                <IoMdClose size={25} />
              </div>
              <div>
                <div className="flex-col space-x-0 space-y-4 w-full justify-around border-b border-solid border-neutral-100 pb-4">
                  <button
                    onClick={() => (setInstructorTab("Profile"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      instructorTab === "Profile"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <img
                      src={instructorProfileImg}
                      alt={instructorInfo[0]?.user_id?.first_name}
                      className="h-8 w-8 shrink-0 rounded-full object-cover"
                    ></img>
                    <span className="block">Profile</span>
                  </button>
                  <button
                    onClick={() => (
                      setInstructorTab("Dashboard"), toggleMenu()
                    )}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      instructorTab === "Dashboard"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <SiClockify className="w-5 h-5" />
                    <span className="block">Dashboard</span>
                  </button>
                  <button
                    onClick={() => (setInstructorTab("Students"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      instructorTab === "Students"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <FaRegHeart className="w-5 h-5" />
                    <span className="block">Students</span>
                  </button>
                  <button
                    onClick={() => (setInstructorTab("Bookings"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      instructorTab === "Bookings"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <PiListBulletsBold className="w-5 h-5" />
                    <span className="block">Bookings</span>
                  </button>
                  <button
                    onClick={() => (
                      setInstructorTab("Availablity"), toggleMenu()
                    )}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      instructorTab === "Availablity"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <PiNotebookBold className="w-5 h-5" />
                    <span className="block">Availability</span>
                  </button>
                  <button
                    onClick={() => (setInstructorTab("Lesson"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      instructorTab === "Lesson"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <PiNotebookBold className="w-5 h-5" />
                    <span className="block">Lesson Manager</span>
                  </button>
                  <button
                    onClick={() => (setInstructorTab("Package"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      instructorTab === "Package"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <PiNotebookBold className="w-5 h-5" />
                    <span className="block">Package Manager</span>
                  </button>

                  <button
                    onClick={() => (setInstructorTab("Schedule"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      instructorTab === "Schedule"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <PiNotebookBold className="w-5 h-5" />
                    <span className="block">Schedule</span>
                  </button>
                  <button
                    onClick={() => (setInstructorTab("Inbox"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      instructorTab === "Inbox"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <HiOutlineChatAlt2 className="w-5 h-5" />
                    <span className="block">Inbox</span>
                  </button>
                </div>
                <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 w-full justify-around border-b border-solid border-neutral-100 py-6">
                  <button
                    onClick={() => (setInstructorTab("Earning"), toggleMenu())}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                      instructorTab === "Earning"
                        ? "bg-secondary-400 text-white"
                        : ""
                    }`}
                  >
                    <FaDollarSign className="w-5 h-5" />
                    <span className="block">Earnings</span>
                  </button>
                </div>
                <div className="flex-col space-x-0 space-y-4 w-full justify-around py-4">
                  <button
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg 
              `}
                    onClick={() => (
                      setInstructorTab("Notifications"), toggleMenu()
                    )}
                  >
                    <IoMdNotificationsOutline className="w-6 h-6" />
                    <span className="block">Notifications</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg `}
                  >
                    <BiLogOut className="w-5 h-5" />
                    <span className="block">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        {sideBar && <div className="fixed inset-0" onClick={toggleMenu}></div>}

        <Modal
          isOpen={notificationModal}
          onRequestClose={() => setNotificationModal(false)}
          overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[999999999999999]"
          className="bg-[#FFFFFF] rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-lg outline-none z-[999999999999999]"
        >
          {<Notifications setNotificationModal={setNotificationModal} />}
        </Modal>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AdminNavBar;
