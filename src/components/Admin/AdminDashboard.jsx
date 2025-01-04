import React, { useEffect, useState } from "react";
import { AiFillDashboard } from "react-icons/ai";
import { SiClockify } from "react-icons/si";
import { LuLayoutDashboard } from "react-icons/lu";
import { PiListBulletsBold } from "react-icons/pi";
import { FaListCheck } from "react-icons/fa6";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { PiNotebookBold } from "react-icons/pi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import AllInstructors from "./AllInstructors";
import AdminQueries from "./AdminQueries";
import AllStudents from "./AllStudents";
import Dashboard from "./Dasboard";
import AllBookings from "./AllBookings";
import AllNotifications from "./AllNotifications";
import RolesAndPermissions, { AddNewRole } from "./RolesAndPermissions";
import AllEmployees, { AddEmployeeForm } from "./AllEmployees";
import ReactModal from "react-modal";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { generateAccessToken } from "../../utils/generateAccessToken";
import axios from "../../axios";
import { useProfileImage } from "../../utils/ProfileImageContext";

const AdminDashboard = () => {
  // State management
  const { adminTab, setAdminTab } = useOutletContext();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [addEmployeeFormOpen, setAddEmployeeFormOpen] = useState(false);
  const [addNewRoleOpen, setNewRoleOpen] = useState(false);
 const {empPermissions, setEmpPermissions} = useProfileImage();
  const navigate = useNavigate();

  // handle admin logout
  const handleAdminLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    localStorage.clear()
    navigate("/login");
  };
// fetch employee Roles and permissions
  const fetchEmployeeRoles = async()=>{
    try {
      const response = await axios(`items/Employee?filter[id][_eq]=${localStorage.getItem("employeeId")}&&fields=*,roles.*`)
      const result = response.data.data;
      setEmpPermissions(result[0]);
    } catch (error) {
      console.log("error",error)
    }
  }
  const isInstructor = localStorage.getItem("isInstructor");
  const isLearner = localStorage.getItem("isLearner");
  const isAdmin = localStorage.getItem("isAdmin");
  const isEmployee = localStorage.getItem("isEmployee");

  const checkRoutes = () =>{
    if (isLearner !== null) return navigate("/");
    else if (isInstructor !== null) return navigate("/instructorpage");
    else if (isAdmin !== null) return navigate("/admindashboard");
    else if (isEmployee !== null) return navigate("/admindashboard");
    else {
      return navigate("/")
    }
  }

  useEffect(() => {
    checkRoutes();
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    if (!accessToken && refreshToken) {
      generateAccessToken();
    }
    fetchEmployeeRoles();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <div className="bg-white text-neutral-1000 w-full md:w-64 p-4 md:flex-col justify-between fixed md:relative bottom-0 md:bottom-auto z-10 md:z-auto border-r border-solid border-neutral-100 hidden md:flex">
        <div>
          <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 w-full justify-around border-b border-solid border-neutral-100 pb-4">
            <button
              onClick={() => setAdminTab("Dashboard")}
              className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                adminTab === "Dashboard" ? "bg-secondary-400 text-white" : ""
              }`}
              >
              <SiClockify className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Dashboard</span>
            </button>
            <button
              onClick={() => setAdminTab("Instructors")}
              className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                adminTab === "Instructors" ? "bg-secondary-400 text-white" : ""
              }`}
            >
              <LuLayoutDashboard className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Instructors</span>
            </button>
            <button
              onClick={() => setAdminTab("Students")}
              className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                adminTab === "Students" ? "bg-secondary-400 text-white" : ""
              }`}
            >
              <FaRegHeart className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Students</span>
            </button>
            <button
              onClick={() => setAdminTab("Bookings")}
              className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                adminTab === "Bookings" ? "bg-secondary-400 text-white" : ""
              }`}
            >
              <PiListBulletsBold className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Bookings</span>
            </button>
            {/* <button
              onClick={() => setAdminTab("Inbox")}
              className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                adminTab === "Inbox" ? "bg-secondary-400 text-white" : ""
              }`}
            >
              <HiOutlineChatAlt2 className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Inbox</span>
            </button> */}
            <button
              onClick={() => setAdminTab("queries")}
              className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                adminTab === "queries" ? "bg-secondary-400 text-white" : ""
              }`}
            >
              <PiNotebookBold className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Queries</span>
            </button>
          </div>
          <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 w-full justify-around border-b border-solid border-neutral-100 py-6">
            <button
              onClick={() => setAdminTab("Employees")}
              className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                adminTab === "Employees" ? "bg-secondary-400 text-white" : ""
              }`}
            >
              <FaListCheck className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Employees</span>
            </button>
            <button
              onClick={() => setAdminTab("Permissions")}
              className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                adminTab === "Permissions" ? "bg-secondary-400 text-white" : ""
              }`}
            >
              <FaListCheck className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Roles & Permissions</span>
            </button>
          </div>
          <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-4 w-full justify-around py-4">
            {/* <button
              onClick={() => setAdminTab("Settings")}
              className={`flex items-center justify-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg ${
                adminTab === "Settings" ? "bg-secondary-400 text-white" : ""
              }`}
            >
              <IoSettingsOutline className="w-5 h-5 shrink-0" />
              <span className="hidden md:block">Settings</span>
            </button> */}
             <button
                  className={`flex items-center md:justify-start space-x-2 md:space-x-4 w-full px-4 py-2 rounded-lg  ${
                    adminTab === "Notifications" ? "bg-secondary-400 text-white" : ""
                  }
              `}
              onClick={() => setAdminTab("Notifications")}
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
      <div className="w-full md:w-[75%] overflow-y-scroll mb-10">
        {/* dashboard */}
        {adminTab === "Dashboard" && <Dashboard />}
        {/* other things on dashboard ----------------------------------------------------------- */}
        {(adminTab === "Home" || adminTab === "Instructors") && (
          <AllInstructors />
        )}
        {adminTab === "Bookings" && <AllBookings />}
        {adminTab === "queries" && <AdminQueries />}
        {adminTab === "Students" && <AllStudents />}
        {adminTab === "Notifications" && <AllNotifications/>}
        {adminTab === "Permissions" && (
          <>
            {!addNewRoleOpen ? (
              <RolesAndPermissions setNewRoleOpen={setNewRoleOpen} />
            ) : (
              <AddNewRole setNewRoleOpen={setNewRoleOpen} />
            )}
          </>
        )}
        {adminTab === "Employees" && (
          <>
            {!addEmployeeFormOpen ? (
              <AllEmployees setAddEmployeeFormOpen={setAddEmployeeFormOpen} />
            ) : (
              <AddEmployeeForm
                setAddEmployeeFormOpen={setAddEmployeeFormOpen}
              />
            )}
          </>
        )}
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
              onClick={handleAdminLogout} // Call confirmLogout to navigate to login
              className="bg-[#EE6055] text-[#FFFFFF] px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </ReactModal>
      </div>
    </div>
  );
};

export default AdminDashboard;
