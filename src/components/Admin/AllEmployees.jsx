import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { GoArrowLeft } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import {
  FaBars,
  FaCaretDown,
  FaFilter,
  FaSearch,
  FaTh,
  FaCamera,
} from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import { IoReturnUpBack } from "react-icons/io5";
import { LuReply } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import { permissionDescriptions, allPermissions } from "./RolesAndPermissions";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import {
  ProfileImgUpload,
  SetProfileImg,
} from "../ImageSetup/ProfileImgUpload";
import { useLoading } from "../../LoadingContext";
import { useProfileImage } from "../../utils/ProfileImageContext";

const EmployeeDetailModal = ({
  setEmployeeDetailModalOpen,
  employeeInfo,
  fetchAllEmployees,
}) => {
  const [deleteEmployeeModal, setDeleteEmployeeModal] = useState(false);
  const [editEmployeeModalOpen, setEditEmployeeModalOpen] = useState(false);
  const [rolesList, setRolesList] = useState([]);
  const { setEmployeeProfileImg, empPermissions } = useProfileImage();
  const [employeeDetails, setEmployeeDetails] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    phoneNumber: "",
    email: "",
    role: "",
  });
  const [empProfileImg, setProfileImg] = useState(
    employeeInfo[0].user.profileImg
  );
  const {
    first_name,
    last_name,
    gender,
    profileImg,
    phoneNumber,
    email,
  } = employeeInfo[0]?.user;

  const { setIsLoading } = useLoading();
  // function to delete employee
  const deleteEmployee = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `items/Employee/${employeeInfo[0].id}`
      );
      if (response.status === 204) {
        handleSuccess("Employee Deleted Successfully");
        setEmployeeDetailModalOpen(false);
        fetchAllEmployees();
      }
    } catch (error) {
      handleError("Error in Deleting Employee");
    } finally {
      setIsLoading(false);
    }
  };
  // edit employee
  const editEmployee = (info) => {
    setEmployeeDetails({
      first_name: info?.user?.first_name || "",
      last_name: info?.user?.last_name || "",
      gender: info?.user?.gender || "",
      phoneNumber: info?.user?.phoneNumber || "",
      email: info?.user?.email || "",
      role: info?.roles?.id || "",
      //profileImg: info?.user?.profileImg || ""
    });
    setEditEmployeeModalOpen(true);
  };
  const handleEditPermission = (info) => {
    if (empPermissions) {
      if (
        empPermissions.roles.User_Management.includes("Edit User Information")
      ) {
        editEmployee(info);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      editEmployee(info);
    }
  };
  //save employee details
  const saveEmployeeDetails = async (employeeinfo) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`items/Employee/${employeeinfo.id}`, {
        roles: employeeDetails.role,
      });

      const userDetails = {
        first_name: employeeDetails.first_name,
        last_name: employeeDetails.last_name,
        email: employeeDetails.email,
        gender: employeeDetails.gender,
        phoneNumber: employeeDetails.phoneNumber,
      };
      await axios.patch(`users/${employeeinfo?.user?.id}`, userDetails);
      handleSuccess("Changes Saved Successfully");
      setEditEmployeeModalOpen(false);
      setEmployeeDetailModalOpen(false);
      fetchAllEmployees();
    } catch (error) {
      handleError("Error in Updating Changes");
    } finally {
      setIsLoading(false);
    }
  };
  // update profile Img
  const updateProfileImage = async (profileImg) => {
    try {
      setIsLoading(true);
      await axios.patch(`users/${employeeInfo[0]?.user?.id}`, {
        profileImg: profileImg,
      });
      setEmployeeProfileImg(profileImg);
    } catch (error) {
      handleError("Error in Updating Profile Image");
    } finally {
      setIsLoading(false);
    }
  };
  const [permissions, setPermissions] = useState({
    User_Management: employeeInfo[0]?.roles?.User_Management || [],
    Query_and_Support: employeeInfo[0]?.roles?.Query_and_Support || [],
    Instructor_management: employeeInfo[0]?.roles?.Instructor_management || [],
    Booking_Payments: employeeInfo[0]?.roles?.Booking_Payments || [],
    Roles_and_Permission: employeeInfo[0]?.roles?.Roles_and_Permission || [],
  });

  const renderCheckboxes = (categoryName) => {
    if (!permissions[categoryName]) {
      return <div>No permissions available</div>;
    }
    return allPermissions[categoryName].map((permission) => (
      <div className="flex gap-3 my-3" key={permission}>
        <input
          type="checkbox"
          checked={permissions[categoryName]?.includes(permission)}
          disabled
          className="hidden"
        />

        <span
          className={`w-4 h-4 inline-block border-2 rounded-sm ${
            permissions[categoryName]?.includes(permission)
              ? `bg-secondary-500 border-secondary-500`
              : "bg-gray-200 border-gray-300"
          }`}
        ></span>

        <div>
          <span className="font-semibold text-neutral-800">{permission}: </span>
          <span>{permissionDescriptions[categoryName][permission]}</span>
        </div>
      </div>
    ));
  };

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const response = await axios(
        "items/EmployeePermissions?fields=id,role_name"
      );
      setRolesList(response.data.data); // Update the state with fetched roles
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);
  return (
    <div>
      <GoArrowLeft
        size={28}
        className="hover:cursor-pointer"
        onClick={() => setEmployeeDetailModalOpen(false)}
      />
      <div className="border border-neutral-100 rounded-lg mt-8 mb-20">
        {/* profile section */}
        <div className="flex justify-between p-4">
          <div className="flex gap-4 items-start">
            <img
              className="w-14 h-14 rounded-full border-2 border-white object-cover shrink-0"
              src={employeeInfo[0]?.user.profileImg}
              alt="Employee Avatar"
            ></img>
            <div>
              <div className="font-semibold text-lg">
                {first_name} {last_name}
              </div>
              <div className="font-semibold text-sm">
                {employeeInfo[0]?.roles?.role_name
                  ? employeeInfo[0]?.roles?.role_name
                  : "-----"}
              </div>
              <button className="px-6 rounded-full text-success-300 border border-success-300 mt-2 text-sm">
                Active
              </button>
            </div>
          </div>

          <FaRegEdit
            size={22}
            onClick={() => handleEditPermission(employeeInfo[0])}
            className="cursor-pointer shrink-0"
            title="edit details"
          />
        </div>
        <hr className="border-neutral-100"></hr>
        <div className="flex">
          <div className="border-r-2 border-neutral-100 w-72">
            {/* Personal details */}
            <div className="p-4 text-sm">
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Phone Number
              </h3>
              <p className="font-poppins text-[#202224]">{phoneNumber}</p>

              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Email Address
              </h3>
              <p className="font-poppins text-[#202224]">{email}</p>

              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Gender
              </h3>
              <p className="font-poppins text-[#202224]">{gender}</p>
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Position
              </h3>
              <p className="font-poppins text-[#202224]">
                {employeeInfo[0]?.roles?.role_name
                  ? employeeInfo[0]?.roles?.role_name
                  : "-----"}
              </p>
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Status
              </h3>
              <p className="font-poppins text-[#202224]">Active</p>
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Joining Date
              </h3>
              <p className="font-poppins text-[#202224]">12/10/2023</p>
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Employee ID
              </h3>
              <p className="font-poppins text-[#202224]">
                {employeeInfo[0]?.id}
              </p>
              <h3 className="font-semibold  font-poppins text-[#000000] mt-4">
                Last Login Date
              </h3>
              <p className="font-poppins text-[#202224]">12/10/2024</p>
            </div>
          </div>

          <div className="w-full">
            {/*  Permissions */}
            <div className="text-2xl font-bold font-poppins text-secondary-500 p-4">
              Permissions
            </div>
            <hr className="border-neutral-100"></hr>

            <div className="m-5">
              {/* User Management Section */}
              <div className="font-semibold text-[#202224] text-xl">
                User Management
              </div>
              <div className="text-sm ">
                {renderCheckboxes("User_Management")}
              </div>

              {/* Query and Support Section */}
              <div className="font-semibold text-[#202224] text-xl">
                Query & Support Management
              </div>
              <div className="text-sm">
                {renderCheckboxes("Query_and_Support")}
              </div>

              {/* Instructor Management Section */}
              <div className="font-semibold text-[#202224] text-xl">
                Instructor Management
              </div>
              <div className="text-sm">
                {renderCheckboxes("Instructor_management")}
              </div>

              {/* Booking & Payments Section */}
              <div className="font-semibold text-[#202224] text-xl">
                Booking & Payments
              </div>
              <div className="text-sm">
                {renderCheckboxes("Booking_Payments")}
              </div>

              {/* Roles and Permission Section */}
              <div className="font-semibold text-[#202224] text-xl">
                Roles & Permision Management
              </div>
              <div className="text-sm">
                {renderCheckboxes("Roles_and_Permission")}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Butttons */}
      <div className="flex gap-5 bg-white py-5 fixed bottom-0 w-full">
        <button
          className="bg-error-200 rounded-md px-8 py-2 text-white transition-colors duration-200 hover:bg-error-300"
          onClick={() => setDeleteEmployeeModal(true)}
        >
          Delete Profile
        </button>
        <button
          className="bg-neutral-300 rounded-md text-white px-8 py-2 transition-colors duration-200 hover:bg-neutral-400"
          onClick={() => setEmployeeDetailModalOpen(false)}
        >
          Close
        </button>
      </div>
      {/* Delete modal to delete employee */}
      <ReactModal
        isOpen={deleteEmployeeModal}
        onRequestClose={() => setDeleteEmployeeModal(false)}
        contentLabel="Delete Role Modal"
        className="w-100 bg-[#FFFFFF] p-6 rounded-lg shadow-lg"
        overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[99999]"
      >
        <h2 className="text-lg font-semibold mb-4">
          Are you sure you want to delete this role?
        </h2>
        <div className="flex justify-end">
          <button
            className="bg-[#EE6055] text-[#FFFFFF] px-8 py-2 rounded-md hover:bg-red-700"
            onClick={deleteEmployee}
          >
            Yes
          </button>
          <button
            onClick={() => setDeleteEmployeeModal(false)}
            className="ml-4 bg-[#B7B7B7] text-[#FFFFFF] px-8 py-2 rounded-md hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </ReactModal>

      {/* edit employee info modal */}
      <ReactModal
        isOpen={editEmployeeModalOpen}
        contentLabel="Delete Role Modal"
        className="w-100 bg-[#FFFFFF] p-6 rounded-lg shadow-lg"
        overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[99999]"
      >
        <div>
          <div className="flex justify-between">
            <h1 className="text-[#202224] text-2xl font-semibold my-2">
              Edit Employee Details
            </h1>
            <IoMdClose
              size={23}
              className="text-gray-500 cursor-pointer"
              onClick={() => setEditEmployeeModalOpen(false)}
            />
          </div>
          <div>
            {/* Profile Photo Section */}
            <div className="flex justify-center mb-6">
              <ProfileImgUpload
                profileImg={empProfileImg}
                setProfileImg={setProfileImg}
                updateProfileImage={updateProfileImage}
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* first_name */}
              <div>
                <label className="block text-sm text-[#4C4C4C] font-semibold">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className="border border-[#E2E2E2] focus:outline-none rounded-md px-4 py-2 w-full"
                  name="first_name"
                  value={employeeDetails.first_name}
                  onChange={(e) =>
                    setEmployeeDetails({
                      ...employeeDetails,
                      first_name: e.target.value,
                    })
                  }
                />
              </div>
              {/* last_name */}
              <div>
                <label className="block text-sm text-[#4C4C4C] font-semibold">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className="border border-[#E2E2E2] focus:outline-none rounded-md px-4 py-2 w-full"
                  name="last_name"
                  value={employeeDetails.last_name}
                  onChange={(e) =>
                    setEmployeeDetails({
                      ...employeeDetails,
                      last_name: e.target.value,
                    })
                  }
                />
              </div>
              {/* email */}
              <div>
                <label className="block  text-sm text-[#4C4C4C] font-semibold">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  className="border border-[#E2E2E2] focus:outline-none rounded-md px-4 py-2 w-full"
                  name="email"
                  value={employeeDetails.email}
                  onChange={(e) =>
                    setEmployeeDetails({
                      ...employeeDetails,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              {/* phoneNumber */}
              <div>
                <label className="block  text-sm text-[#4C4C4C] font-semibold">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="border border-[#E2E2E2] focus:outline-none rounded-md px-4 py-2 w-full"
                  name="phoneNumber"
                  value={employeeDetails.phoneNumber}
                  onChange={(e) =>
                    setEmployeeDetails({
                      ...employeeDetails,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>
              {/* Gender */}
              <div>
                <label className="block text-sm text-[#4C4C4C] font-semibold">
                  Gender
                </label>
                <select
                  className="border border-[#E2E2E2] focus:outline-none rounded-md px-4 py-2 w-full"
                  name="gender"
                  value={employeeDetails.gender}
                  onChange={(e) =>
                    setEmployeeDetails({
                      ...employeeDetails,
                      gender: e.target.value,
                    })
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  {/* Add options here */}
                </select>
              </div>
              {/* Roles dropdown */}
              <div>
                <label className="block text-sm text-[#4C4C4C] font-semibold">
                  Position
                </label>
                <select
                  id="position"
                  className="border border-[#E2E2E2] focus:outline-none  rounded-md px-4 py-2 w-full"
                  value={employeeDetails.role}
                  onChange={(e) =>
                    setEmployeeDetails({
                      ...employeeDetails,
                      role: e.target.value,
                    })
                  }
                >
                  {rolesList.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* save button */}
          <button
            className="bg-secondary-300 rounded-md px-8 mt-4 py-2 text-white transition-colors duration-200 hover:bg-secondary-400"
            onClick={() => saveEmployeeDetails(employeeInfo[0])}
          >
            Save Changes
          </button>
        </div>
      </ReactModal>
      <ToastContainer />
    </div>
  );
};

const AllEmployees = ({ setAddEmployeeFormOpen }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [isEmployeeDetailModalOpen, setEmployeeDetailModalOpen] = useState(
    false
  );
  const [allEmployees, setAllEmployees] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [modalDateOpen, setModalDateOpen] = useState(false);
  const { empPermissions } = useProfileImage();
  const { setIsLoading } = useLoading();
  // fetching all employees data
  const fetchAllEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await axios("items/Employee?fields=*,roles.*,user.*");
      setAllEmployees(response.data.data);
    } catch (error) {
      console.log("error in fetching employee data", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const viewEmployeeProfile = async (employeeId) => {
    try {
      setIsLoading(true);
      const response = await axios(
        `items/Employee?filter[id]=${employeeId}&fields=*,user.*,roles.*`
      );
      setEmployeeInfo(response.data.data);
      setEmployeeDetailModalOpen(true);
    } catch (error) {
      console.log("error in fetching employee info", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewEmployeePermission = (employeeId) => {
    if (empPermissions) {
      if (
        empPermissions.roles.User_Management.includes("View Users") ||
        empPermissions.id === employeeId
      ) {
        viewEmployeeProfile(employeeId);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      viewEmployeeProfile(employeeId);
    }
  };

  const addNewEmployee = () => {
    setAddEmployeeFormOpen(true);
  };

  const handleAddEmployeePermission = () => {
    if (empPermissions) {
      if (empPermissions.roles.Roles_and_Permission.includes("Assign Roles")) {
        addNewEmployee();
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      addNewEmployee();
    }
  };

  const handleDateFilter = (e) => {
    setDateFilter(e.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setDateFilter("");
  };

  const filteredData = allEmployees.filter((data) => {
    const searchFilter =
      searchTerm === "" ||
      data?.user?.first_name.toLowerCase().includes(searchTerm.toLowerCase());
    const date = dateFilter
      ? new Date(data.date_created) >= new Date(dateFilter)
      : true;
    return searchFilter && date;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6 items-center">
        <div className="font-bold text-desk-h-6 font-sans">Employees</div>
        <div className="flex gap-4 items-center">
          <button
            className="bg-[#2B6BE7] cursor-pointer w-full text-white rounded-lg m py-2 px-8 mr-4 font-poppins"
            onClick={handleAddEmployeePermission}
          >
            Add New Employee
          </button>
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
      <div className="lg:flex items-center justify-between mt-5">
        <div className="flex items-center bg-gray-100 rounded-md px-4 py-2 w-[50%] border border-solid border-neutral-100">
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
          <div className="flex items-center gap-3 font-semibold font-poppins text-desk-b-3 text-neutral-600">
            <FaFilter className="mr-2 shrink-0" />
            <div>All</div>
            <FaCaretDown className="shrink-0" />
          </div>
          <button
            onClick={() => setModalDateOpen(true)}
            className="p-3 flex gap-1 items-center relative font-semibold font-poppins text-desk-b-3 text-neutral-600"
          >
            <FaFilter className="mr-2 shrink-0" />
            {dateFilter ? `Date: ${dateFilter}` : "Date"}
            <FaCaretDown className="shrink-0" />
          </button>
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
        <div className="mt-10 flex flex-wrap gap-3 gap-y-6 ">
          {filteredData.map((employee) => {
            const {
              profileImg,
              first_name,
              last_name,
              email,
              phoneNumber,
              gender,
            } = employee?.user;
            // const { role_name } = employee?.roles;
            const role_name = employee?.roles?.role_name ?? "----";

            return (
              <div
                key={employee.id}
                className="w-[235px] p-4 rounded-lg shadow-md border border-solid border-slate-200 flex flex-col"
              >
                <img
                  className="h-14 w-14 rounded-full shrink-0 object-cover self-center"
                  src={profileImg}
                  alt={first_name}
                />
                <div className="mt-3 font-semibold text-center font-poppins text-desk-b-2">
                  {first_name} {last_name}
                </div>
                <div className="mt-4 text-center font-poppins text-desk-b-3 text-neutral-600">
                  {role_name}
                </div>
                <div className="mt-4 text-center font-poppins text-desk-b-3 text-neutral-600">
                  {email}
                </div>
                <button
                  className="bg-[#2B6BE7] cursor-pointer w-full text-white rounded-lg mt-3 py-2 font-poppins"
                  onClick={() => handleViewEmployeePermission(employee.id)}
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 hidden sm:block">
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-center py-5 px-4 uppercase font-semibold text-sm">
                    Name
                  </th>
                  <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                    Position
                  </th>
                  <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                    Email
                  </th>
                  <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left py-5 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((employee) => (
                  <tr key={employee.id} className="border-t border-gray-200">
                    <td className="py-3 px-4 flex items-center">
                      <img
                        src={employee?.user?.profileImg}
                        alt={employee?.user?.first_name}
                        className="w-10 h-10 rounded-full mr-8 object-cover shrink-0"
                      />
                      <span className="font-medium text-blue-600">
                        {employee?.user?.first_name} {employee?.user?.last_name}
                      </span>
                    </td>
                    <td className="py-3 px-4">{employee?.roles?.role_name}</td>
                    <td className="py-3 px-4">{employee?.user?.email}</td>
                    <td className="py-3 px-4">
                      <span>Active</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-blue-500 text-white py-2 px-6 rounded-md"
                        onClick={() =>
                          handleViewEmployeePermission(employee.id)
                        }
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Date Filter Modal */}
      <ReactModal
        isOpen={modalDateOpen}
        onRequestClose={() => setModalDateOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Select Date</h3>
        <input
          type="date"
          value={dateFilter}
          onChange={handleDateFilter}
          className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setModalDateOpen(false)}
            className="text-gray-700 px-4 py-2 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => setModalDateOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Apply
          </button>
        </div>
      </ReactModal>

      {/* Employee Detail Modal */}
      <ReactModal
        isOpen={isEmployeeDetailModalOpen}
        onRequestClose={() => setEmployeeDetailModalOpen(false)}
        className="bg-white shadow-lg px-10 pt-5 w-full md:w-4/5 lg:w-8/12 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-20"
      >
        <EmployeeDetailModal
          setEmployeeDetailModalOpen={setEmployeeDetailModalOpen}
          employeeInfo={employeeInfo}
          fetchAllEmployees={fetchAllEmployees}
        />
      </ReactModal>
      <ToastContainer />
    </div>
  );
};

export const AddEmployeeForm = ({ setAddEmployeeFormOpen }) => {
  const [employeeInfo, setEmployeeInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    phoneNumber: "",
  });
  const [rolesList, setRolesList] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [errors, setErrors] = useState({});
  const [profileImg, setProfileImg] = useState("");
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  // Fetch roles from API when component mounts

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const response = await axios(
        "items/EmployeePermissions?fields=id,role_name"
      );
      setRolesList(response.data.data); // Update the state with fetched roles
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formValidation = () => {
    let valid = true;
    let errorMessages = {};
    // Validate first name
    if (!employeeInfo.first_name) {
      errorMessages.first_name = "First name is required";
      valid = false;
    }

    // Validate last name
    if (!employeeInfo.last_name) {
      errorMessages.last_name = "Last name is required";
      valid = false;
    }

    // Validate email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!employeeInfo.email || !emailPattern.test(employeeInfo.email)) {
      errorMessages.email = "Please enter a valid email address";
      valid = false;
    }

    // Validate gender
    if (!employeeInfo.gender) {
      errorMessages.gender = "Gender is required";
      valid = false;
    }

    // Phone number validation (basic example for 10 digits)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(employeeInfo.phoneNumber)) {
      errorMessages.phoneNumber = "Phone number must be 10 digits";
      valid = false;
    }

    // Validate role selection
    if (!selectedRole || selectedRole === "Select Position") {
      errorMessages.selectedRole = "Please select a role";
      valid = false;
    }
    setErrors(errorMessages);
    return valid;
  };

  // Handle dropdown change
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "Add New Position") {
      //navigate('/addnewposition')
    } else {
      setSelectedRole(value); // Update selected role
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeInfo({
      ...employeeInfo,
      [name]: value,
    });
  };
  const submitEmployeeData = async () => {
    if (!formValidation()) return;

    if (selectedRole === "Add New Position") {
      console.log("Please select a valid position.");
      return;
    }
    const password = employeeInfo.first_name + employeeInfo.last_name + 1234;
    const userInfo = {
      profileImg: profileImg,
      first_name: employeeInfo.first_name,
      last_name: employeeInfo.last_name,
      email: employeeInfo.email,
      gender: employeeInfo.gender,
      phoneNumber: employeeInfo.phoneNumber,
      password: password,
      isEmployee: true,
    };

    try {
      setIsLoading(true);
      const userResponse = await axios.post("users", userInfo);
      const userId = userResponse.data.data.id;
      const employeeResponse = await axios.post("items/Employee", {
        user: userId,
        roles: selectedRole,
      });
      handleSuccess("Employee Created Successfully");
      setAddEmployeeFormOpen(false);
    } catch (error) {
      if (error.response.status === 400) {
        handleError("This email already exists.Try with another email");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="min-h-screen bg-white rounded-lg shadow-lg ">
      <header className="w-full max-w-3xl flex gap-4 items-center mb-8 p-5">
        <LuReply
          className="text-lg font-bold hover:cursor-pointer"
          size={25}
          onClick={() => setAddEmployeeFormOpen(false)}
        />
        <h1 className="text-[#202224] text-2xl font-semibold">
          Add New Employee
        </h1>
      </header>

      <div className="mx-32">
        {/* Profile Photo Section */}
        <div className="flex justify-center mb-6">
          <SetProfileImg
            profileImg={profileImg}
            setProfileImg={setProfileImg}
          />
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-12">
          {/* first_name */}
          <div>
            <label className="block text-sm text-[#4C4C4C] font-semibold">
              First Name
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              className="border border-[#E2E2E2] focus:outline-none rounded-md px-4 py-2 w-full"
              name="first_name"
              value={employeeInfo.first_name}
              onChange={handleInputChange}
            />
            {errors.first_name && (
              <p className="text-sm text-red-500 ml-1">{errors.first_name}</p>
            )}
          </div>
          {/* last_name */}
          <div>
            <label className="block text-sm text-[#4C4C4C] font-semibold">
              Last Name
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              className="border border-[#E2E2E2] focus:outline-none rounded-md px-4 py-2 w-full"
              name="last_name"
              value={employeeInfo.last_name}
              onChange={handleInputChange}
            />
            {errors.last_name && (
              <p className="text-sm text-red-500 ml-1">{errors.last_name}</p>
            )}
          </div>
          {/* email */}
          <div>
            <label className="block  text-sm text-[#4C4C4C] font-semibold">
              Email
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="email"
              placeholder="Enter email"
              className="border border-[#E2E2E2] focus:outline-none rounded-md px-4 py-2 w-full"
              name="email"
              value={employeeInfo.email}
              onChange={handleInputChange}
            />
            {errors.email && (
              <p className="text-sm text-red-500 ml-1">{errors.email}</p>
            )}
          </div>
          {/* phoneNumber */}
          <div>
            <label className="block  text-sm text-[#4C4C4C] font-semibold">
              Phone Number
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              className="border border-[#E2E2E2] focus:outline-none rounded-md px-4 py-2 w-full"
              name="phoneNumber"
              value={employeeInfo.phoneNumber}
              onChange={handleInputChange}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500 ml-1">{errors.phoneNumber}</p>
            )}
          </div>
          {/* Gender */}
          <div>
            <label className="block text-sm text-[#4C4C4C] font-semibold">
              Gender
              <span className="text-red-500"> *</span>
            </label>
            <select
              className="border border-[#E2E2E2] focus:outline-none rounded-md px-4 py-2 w-full"
              name="gender"
              value={employeeInfo.gender}
              onChange={handleInputChange}
            >
              <option>Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              {/* Add options here */}
            </select>
            {errors.gender && (
              <p className="text-sm text-red-500 ml-1">{errors.gender}</p>
            )}
          </div>
          {/* Roles dropdown */}
          <div>
            <label className="block text-sm text-[#4C4C4C] font-semibold">
              Position
              <span className="text-red-500"> *</span>
            </label>
            <select
              id="position"
              className="border border-[#E2E2E2] focus:outline-none  rounded-md px-4 py-2 w-full"
              value={selectedRole}
              onChange={handleChange}
            >
              <option>Select Position</option>
              {rolesList.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role_name}
                </option>
              ))}
              <option>Add New Position</option>
            </select>
            {errors.selectedRole && (
              <p className="text-sm text-red-500 ml-1">{errors.selectedRole}</p>
            )}
          </div>
        </div>

        {/* Add Now Button */}
        <div className="flex justify-center mt-10">
          <button
            className="bg-[#2B6BE7] text-[#FFFFFF] px-16 py-2 rounded-md"
            onClick={submitEmployeeData}
          >
            Add Now
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default AllEmployees;
