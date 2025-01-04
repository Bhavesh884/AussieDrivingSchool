import React, { useEffect, useState } from "react";
import { FaBars, FaCaretDown, FaFilter, FaSearch, FaTh } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import ReactModal from "react-modal";
import { GoArrowLeft } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { LuReply } from "react-icons/lu";
import axios from "../../axios";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { useLoading } from "../../LoadingContext";
import { useProfileImage } from "../../utils/ProfileImageContext";

export const permissionDescriptions = {
  User_Management: {
    "View Users": "View user details and activity.",
    "Edit User Information": "Update user profile data.",
    "Ban/Unban Account": "Restrict or restore user access.",
    "Reset Password": "Change user password upon request.",
  },
  Query_and_Support: {
    "View Queries": "Access all incoming queries.",
    "Accept/Reject Queries": "Decline Query outcome (approve or reject).",
    "Assign Queries": "Allocate queries to specific support staff.",
    "Resolve Queries": "Mark queries as resolved or follow up.",
  },
  Instructor_management: {
    "Add New Instructor": "Add profiles for new instructors.",
    "Edit Instructor Information":
      "Upload instructor details or availiability.",
    "View Instructor Performance": "Access performance reports and analytics.",
    "Assign Bookings": "Manage and assign booking schedules.",
  },
  Booking_Payments: {
    "Approve Bookings": "Confirm or modify bookings.",
    "Refund Payments": "Process payment refunds when necessary.",
    "View Earning Reports": "Access financial reports.",
    "Issue Invoices": "Generate and issue invoices.",
  },
  Roles_and_Permission: {
    "Create New Role": "Define and assign new role categories.",
    "Edit Role Permissions": "Remove roles that are no longer needed.",
    "Delete Roles": "Remove roles that are no longer needed.",
    "Assign Roles": "Allocate roles to users or team members.",
  },
};
// Full list of permissions for all categories
export const allPermissions = {
  User_Management: [
    "View Users",
    "Edit User Information",
    "Ban/Unban Account",
    "Reset Password",
  ],
  Query_and_Support: [
    "View Queries",
    "Accept/Reject Queries",
    "Resolve Queries",
    "Assign Queries",
  ],
  Instructor_management: [
    "Add New Instructor",
    "Edit Instructor Information",
    "View Instructor Performance",
    "Assign Bookings",
  ],
  Booking_Payments: [
    "Approve Bookings",
    "View Earning Reports",
    "Refund Payments",
    "Issue Invoices",
  ],
  Roles_and_Permission: [
    "Create New Role",
    "Edit Role Permissions",
    "Delete Roles",
    "Assign Roles",
  ],
};

const RolesAndPermissionModal = ({
  setPermissionModalOpen,
  roleInfo,
  fetchAllRoles,
}) => {
  const [editPermissions, setEditPermissions] = useState(false);
  const [deleteRoleModal, setDeleteRoleModal] = useState(false);
  const [deleteModalForEmployee, setDeleteModalForEmployees] = useState(false);
  const { empPermissions } = useProfileImage();
  const [permissions, setPermissions] = useState({
    User_Management: roleInfo.User_Management,
    Query_and_Support: roleInfo.Query_and_Support,
    Instructor_management: roleInfo.Instructor_management,
    Booking_Payments: roleInfo.Booking_Payments,
    Roles_and_Permission: roleInfo.Roles_and_Permission,
  });
  const [role_name, setRoleName] = useState(roleInfo.role_name);
  const [description, setDescription] = useState(roleInfo.description);
  const [errors, setErrors] = useState({});

  // handle validations
  const formValidation = () => {
    let valid = true;
    let errorMessages = {};
    // Validate first name
    if (!role_name) {
      errorMessages.role_name = "Role name can't remain empty";
      valid = false;
    }
    setErrors(errorMessages);
    return valid;
  };

  const { setIsLoading } = useLoading();
  //function to delete role with no associated user
  const DeleteRole = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `items/EmployeePermissions/${roleInfo.id}`
      );
      setPermissionModalOpen(false);
      handleSuccess("Role Deleted Successfully");
      fetchAllRoles();
    } catch (error) {
      handleError("Error in Deleting the Role");
    } finally {
      setIsLoading(false);
    }
  };

  // handle delete modal based on associated employees
  const handleDeleteRole = () => {
    if (roleInfo.employees.length > 0) {
      setDeleteModalForEmployees(true);
    } else {
      setDeleteRoleModal(true);
    }
  };
  const handleDeleteRolePermission = () => {
    if (empPermissions) {
      if (empPermissions.roles.Roles_and_Permission.includes("Delete Roles")) {
        handleDeleteRole();
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      handleDeleteRole();
    }
  };
  // Handle permission change when checkbox is toggled
  const handlePermissionChange = (categoryName, permission) => {
    setPermissions((prevPermissions) => {
      const newPermissions = { ...prevPermissions };
      if (newPermissions[categoryName].includes(permission)) {
        // Remove permission if it's already selected
        newPermissions[categoryName] = newPermissions[categoryName].filter(
          (p) => p !== permission
        );
      } else {
        // Add permission if it's not selected
        newPermissions[categoryName].push(permission);
      }
      return newPermissions;
    });
  };

  const renderCheckboxes = (categoryName) => {
    return allPermissions[categoryName].map((permission) => (
      <div className="flex gap-3 my-3" key={permission}>
        <input
          type="checkbox"
          checked={permissions[categoryName]?.includes(permission)}
          onChange={() => handlePermissionChange(categoryName, permission)}
          disabled={!editPermissions}
          className="hidden"
        />
        <span
          className={`w-4 h-4 inline-block border-2 rounded-sm ${editPermissions &&
            "hover:cursor-pointer"}   ${
            permissions[categoryName]?.includes(permission)
              ? `bg-secondary-500 border-secondary-500`
              : "bg-gray-200 border-gray-300"
          }`}
          onClick={
            editPermissions
              ? () => handlePermissionChange(categoryName, permission)
              : null
          }
        ></span>
        <div>
          <span className="font-semibold text-neutral-800">{permission}: </span>
          <span>{permissionDescriptions[categoryName][permission]}</span>
        </div>
      </div>
    ));
  };

  const editRoleAndPermissions = async () => {
    const editedRolesAndPermissions = {
      User_Management: permissions.User_Management,
      Query_and_Support: permissions.Query_and_Support,
      Instructor_management: permissions.Instructor_management,
      Booking_Payments: permissions.Booking_Payments,
      Roles_and_Permission: permissions.Roles_and_Permission,
      role_name: role_name,
      description: description,
    };
    if (!formValidation()) return;
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `items/EmployeePermissions/${roleInfo.id}`,
        editedRolesAndPermissions
      );
      handleSuccess("Changes Saved Sucessfully");
      window.location.reload();
    } catch (error) {
      handleError("Error in Updating the Changes");
    } finally {
      setIsLoading(false);
    }
  };

  const allowEditPermission = () => {
    if (empPermissions) {
      if (
        empPermissions.roles.Roles_and_Permission.includes(
          "Edit Role Permissions"
        )
      ) {
        setEditPermissions(!editPermissions);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      setEditPermissions(!editPermissions);
    }
  };
  return (
    <div>
      <GoArrowLeft
        size={28}
        className="hover:cursor-pointer"
        onClick={() => setPermissionModalOpen(false)}
      />
      <div className="border border-neutral-100 rounded-lg mt-8 mb-20">
        {/* profile section */}
        <div className="flex justify-between p-4">
          <div>
            <div className="font-semibold text-lg">{roleInfo.role_name}</div>
            <button className="px-6 rounded-full text-success-300 border border-success-300 mt-2 text-sm">
              {roleInfo.employees.length} Active
            </button>
          </div>
        </div>
        <hr className="border-neutral-100"></hr>
        <div className="flex">
          <div className="border-r-2 border-neutral-100 w-72">
            {/* Personal details */}
            <div className="p-4 text-sm">
              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Status
              </h3>
              <p className="font-poppins text-[#202224]">Active</p>

              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Creation Date
              </h3>
              <p className="font-poppins text-[#202224]">12/10/2024</p>

              <h3 className="font-semibold font-poppins text-[#000000] mt-4">
                Active Assigned Users
              </h3>
              <p className="font-poppins text-[#202224]">
                {roleInfo.employees.length}
              </p>
            </div>
          </div>

          <div className="w-full">
            {/*  Permissions */}
            <div className="flex justify-between items-center m-4">
              <div className="text-2xl font-bold font-poppins text-secondary-500 ">
                {editPermissions ? "Edit Roles And Permissions" : "Permissions"}
              </div>
              <FaRegEdit
                size={20}
                className="hover:cursor-pointer"
                onClick={allowEditPermission}
              />
            </div>
            <hr className="border-neutral-100"></hr>

            {editPermissions && (
              <div className="grid grid-cols-2 gap-10 m-5">
                {/* Role name */}
                <div>
                  <label className="text-neutral-800 text-sm font-semibold block">
                    Edit Role/Position Name
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    className="focus:outline-none border rounded-md p-2 w-full mt-1"
                    value={role_name}
                    placeholder={roleInfo.role_name}
                    onChange={(e) => setRoleName(e.target.value)}
                  ></input>
                  {errors.role_name && (
                    <p className="text-sm text-red-500 ml-1">
                      {errors.role_name}
                    </p>
                  )}
                </div>
                {/* Description */}
                <div>
                  <label className="text-neutral-800 text-sm font-semibold block">
                    Edit Description(optional)
                  </label>
                  <input
                    type="text"
                    className="focus:outline-none border rounded-md p-2 w-full mt-1"
                    placeholder={roleInfo.description}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></input>
                </div>
              </div>
            )}
            <div className="m-5">
              {/* User Management Section */}
              <div className="font-semibold text-[#202224] text-xl">
                User Management
              </div>
              <div className="text-sm">
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

            {/* Assigned Users */}
            <hr></hr>
            <div className="text-2xl font-bold font-poppins text-secondary-500 p-5">
              Assigned Users
            </div>
            {roleInfo.employees.length ? (
              roleInfo.employees.map((employee) => (
                <div className="m-5 text-sm" key={employee.id}>
                  <div className="font-semibold">
                    {employee.user.first_name} {employee.user.last_name}
                  </div>
                  <div>{employee.status}</div>
                  <div>{employee.user.email}</div>
                  <div>Last Login: February 1,2024</div>
                </div>
              ))
            ) : (
              <p className="text-center m-5">No users assigned yet</p>
            )}
          </div>
        </div>
      </div>
      {/* Action Butttons */}
      {editPermissions ? (
        <div className="bg-white py-5 fixed bottom-0 w-full">
          <button
            className="bg-secondary-400 rounded-md px-8 py-2 text-white transition-colors duration-200 hover:bg-secondary-300"
            onClick={editRoleAndPermissions}
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="flex gap-5 bg-white py-5 fixed bottom-0 w-full">
          <button
            className="bg-error-200 rounded-md px-8 py-2 text-white transition-colors duration-200 hover:bg-error-300"
            onClick={handleDeleteRolePermission}
          >
            Delete Role
          </button>
          <button
            className="bg-neutral-300 rounded-md text-white px-8 py-2 transition-colors duration-200 hover:bg-neutral-400"
            onClick={() => setPermissionModalOpen(false)}
          >
            Close
          </button>
        </div>
      )}

      {/* Delete modal for no assigned employee */}
      <ReactModal
        isOpen={deleteRoleModal}
        onRequestClose={() => setDeleteRoleModal(false)}
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
            onClick={DeleteRole}
          >
            Yes
          </button>
          <button
            onClick={() => setDeleteRoleModal(false)}
            className="ml-4 bg-[#B7B7B7] text-[#FFFFFF] px-8 py-2 rounded-md hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </ReactModal>

      {/* Delete modal for assigned employee */}
      <ReactModal
        isOpen={deleteModalForEmployee}
        onRequestClose={() => setDeleteModalForEmployees(false)}
        contentLabel="Delete Role Modal"
        className="w-100 bg-[#FFFFFF] p-6 rounded-lg shadow-lg"
        overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[99999]"
      >
        <div className="text-lg flex justify-center text-center font-semibold mb-4  w-96">
          This role has associated employees. Deleting this role will also
          delete all its associated employees. Are you sure you want to proceed?{" "}
        </div>
        <div className="flex justify-center mt-5">
          <button
            onClick={DeleteRole}
            className="bg-[#EE6055] text-[#FFFFFF] px-8 py-2 rounded-md hover:bg-red-700"
          >
            Delete Role
          </button>
          <button
            onClick={() => setDeleteModalForEmployees(false)}
            className="ml-4 bg-[#B7B7B7] text-[#FFFFFF] px-8 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </ReactModal>
      <ToastContainer />
    </div>
  );
};

const RolesAndPermissions = ({ setNewRoleOpen }) => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [allRoles, setAllRoles] = useState([]);
  const [roleInfo, setRoleInfo] = useState([]);
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false);
  const { empPermissions } = useProfileImage();
  const { setIsLoading } = useLoading();

  const fetchAllRoles = async () => {
    try {
      setIsLoading(true);
      const roleResponse = await axios("items/EmployeePermissions");
      setAllRoles(roleResponse.data.data);
    } catch (error) {
      console.log("error in fetching permissions", error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewRolesAndPermissions = async (roleId) => {
    try {
      setIsLoading(true);
      const roleData = await axios(
        `items/EmployeePermissions/${roleId}?fields=*,employees.id,employees.user.first_name,employees.user.last_name,employees.user.email,employees.status`
      );
      setRoleInfo(roleData.data.data);
      setPermissionModalOpen(true);
    } catch (error) {
      console.log("error in fetching info ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRolesAndPermission = (roleId) => {
    if (empPermissions) {
      if (empPermissions.roles.User_Management.includes("View Users")) {
        viewRolesAndPermissions(roleId);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      viewRolesAndPermissions(roleId);
    }
  };

  const handleAddRolePermission = () => {
    if (empPermissions) {
      if (
        empPermissions?.roles?.Roles_and_Permission.includes("Create New Role")
      ) {
        setNewRoleOpen(true);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      setNewRoleOpen(true);
    }
  };
  const filteredData = allRoles.filter((data) => {
    const searchFilter =
      searchTerm === "" ||
      data.role_name.toLowerCase().includes(searchTerm.toLowerCase());
    return searchFilter;
  });
  const handleResetFilters = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    fetchAllRoles();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6 items-center">
        <div className="font-bold text-desk-h-6 font-sans">
          Roles & Permissions
        </div>
        <div className="flex gap-4 items-center">
          <button
            className="bg-[#2B6BE7] cursor-pointer w-full text-white rounded-lg m py-2 px-8 mr-4 font-poppins"
            onClick={handleAddRolePermission}
          >
            Add New Role
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${
              viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <FaTh className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${
              viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="lg:flex items-center justify-between mt-5">
        <div className="flex items-center bg-gray-100 rounded-md px-4 py-2 w-[50%] border border-solid border-neutral-100">
          <FaSearch className="text-gray-500" />
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
            <FaFilter className="mr-2" />
            <div>All</div>
            <FaCaretDown />
          </div>

          <button
            onClick={handleResetFilters}
            className="text-error-300 px-4 py-2 flex gap-1 items-center font-poppins text-desk-b-2"
          >
            <BiReset />
            Reset Filters
          </button>
        </div>
      </div>
      {viewMode === "grid" ? (
        <div className="mt-10 flex flex-wrap gap-3 gap-y-6 ">
          {filteredData.map((role) => {
            return (
              <div
                key={role.id}
                className="w-[235px] p-4 rounded-lg shadow-md border border-solid border-slate-200 flex flex-col"
              >
                <div className="mt-3 font-semibold text-center font-poppins text-desk-b-2">
                  {role.role_name}
                </div>
                <div className="flex items-center justify-between mt-4 font-poppins text-desk-b-3 text-neutral-600">
                  <div className="font-semibold">Assigned Users:</div>
                  <div>{role.employees.length}</div>
                </div>
                <div className="flex items-center justify-between mt-4 text-desk-b-3 text-neutral-600 font-poppins">
                  <div className="font-semibold">Status:</div>
                  <div>Active</div>
                </div>
                <button
                  className="bg-[#2B6BE7] cursor-pointer w-full text-white rounded-lg mt-5 py-2 font-poppins"
                  onClick={() => handleViewRolesAndPermission(role.id)}
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 mt-8">
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-center py-5 px-4 uppercase font-semibold text-sm">
                    Position
                  </th>
                  <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                    Assigned Users
                  </th>
                  <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left py-5 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200">
                    <td className="py-3 px-4 text-center">{item?.role_name}</td>
                    <td className="py-3 px-4">{item?.employees.length}</td>
                    <td className="py-3 px-4">
                      <span>Active</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-blue-500 text-white py-2 px-6 rounded-md"
                        onClick={() => handleViewRolesAndPermission(item.id)}
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

      {/* Roles And Permission Modal */}
      <ReactModal
        isOpen={isPermissionModalOpen}
        onRequestClose={() => setPermissionModalOpen(false)}
        className="bg-white shadow-lg px-10 pt-5 w-full md:w-4/5 lg:w-8/12 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-20"
      >
        <RolesAndPermissionModal
          setPermissionModalOpen={setPermissionModalOpen}
          roleInfo={roleInfo}
          fetchAllRoles={fetchAllRoles}
        />
      </ReactModal>
      <ToastContainer />
    </div>
  );
};

export const AddNewRole = ({ setNewRoleOpen }) => {
  const [role_name, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [userManagement, setUserManagement] = useState([]);
  const [querySupport, setQuerySupport] = useState([]);
  const [instructorManagement, setInstructorManagement] = useState([]);
  const [bookingPayments, setBookingPayments] = useState([]);
  const [rolesAndPermission, setRolesAndPermission] = useState([]);
  const { setIsLoading } = useLoading();
  // handle validations
  const formValidation = () => {
    let valid = true;
    let errorMessages = {};
    // Validate first name
    if (!role_name) {
      errorMessages.role_name = "Role Name is Required";
      valid = false;
    }
    setErrors(errorMessages);
    return valid;
  };

  const handleCheckboxChange = (setFunction, value) => (e) => {
    if (e.target.checked) {
      setFunction((prev) => [...prev, value]);
    } else {
      setFunction((prev) => prev.filter((item) => item !== value));
    }
  };

  //add role
  const handleSubmit = async (e) => {
    e.preventDefault();
    const roleData = {
      role_name: role_name,
      description: description,
      User_Management: userManagement,
      Query_and_Support: querySupport,
      Instructor_management: instructorManagement,
      Booking_Payments: bookingPayments,
      Roles_and_Permission: rolesAndPermission,
    };
    if (!formValidation()) return;
    // Send the roleData to the backend (Directus API)
    try {
      setIsLoading(true);
      const response = await axios.post("items/EmployeePermissions", roleData);
      handleSuccess("Role created Successfully");
      setNewRoleOpen(false);
    } catch (error) {
      handleError("Error Creating Role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex gap-4 items-center mb-8 p-5">
        <LuReply
          className="text-lg font-bold hover:cursor-pointer"
          size={25}
          onClick={() => setNewRoleOpen(false)}
        />
        <h1 className="text-[#202224] text-2xl font-semibold">Add New Role</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-10 mx-7">
          {/* Role name */}
          <div>
            <label className="text-neutral-800 text-sm font-semibold block">
              Role/Position Name
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              className="focus:outline-none border rounded-md p-2 w-full mt-1"
              value={role_name}
              onChange={(e) => setRoleName(e.target.value)}
            ></input>
            {errors.role_name && (
              <p className="text-sm text-red-500 ml-1">{errors.role_name}</p>
            )}
          </div>
          {/* Description */}
          <div>
            <label className="text-neutral-800 text-sm font-semibold block">
              Description(optional)
            </label>
            <input
              type="text"
              className="focus:outline-none border rounded-md p-2 w-full mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></input>
          </div>
        </div>

        <div className="m-7 ">
          {/* User Management */}
          <div className="font-semibold text-[#202224] text-xl">
            User Management
          </div>
          <div className="grid grid-cols-2 text-sm">
            <div className="flex gap-3 my-3">
              <input
                type="checkbox"
                onChange={handleCheckboxChange(setUserManagement, "View Users")}
              />
              <div className="">
                <span className="font-semibold text-neutral-800 ">
                  View Users:{" "}
                </span>
                <span>View user details and activity.</span>
              </div>
            </div>
            <div className="flex gap-3 my-3">
              <input
                type="checkbox"
                onChange={handleCheckboxChange(
                  setUserManagement,
                  "Edit User Information"
                )}
              />
              <div className="">
                <span className="font-semibold text-neutral-800 ">
                  Edit User Information:{" "}
                </span>
                <span>Update user profile data.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                onChange={handleCheckboxChange(
                  setUserManagement,
                  "Ban/Unban Account"
                )}
              />
              <div className="">
                <span className="font-semibold text-neutral-800 ">
                  Ban/Unban Account:{" "}
                </span>
                <span>Restrict or restore user access.</span>
              </div>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                onChange={handleCheckboxChange(
                  setUserManagement,
                  "Reset Password"
                )}
              />
              <div className="">
                <span className="font-semibold text-neutral-800 ">
                  Reset Password:{" "}
                </span>
                <span>Change user password upon request.</span>
              </div>
            </div>
          </div>

          {/* Query and Support Management */}
          <div className="mt-8">
            <div className="font-semibold text-[#202224] text-xl">
              Query & Support Management
            </div>
            <div className="grid grid-cols-2">
              <div className="flex gap-3 my-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setQuerySupport,
                    "View Queries"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 font-poppins">
                    View Queries:{" "}
                  </span>
                  <span className="font-poppins">
                    Access all incoming queries.
                  </span>
                </div>
              </div>
              <div className="flex gap-3 my-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setQuerySupport,
                    "Accept/Reject Queries"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Accept/Reject Queries:{" "}
                  </span>
                  <span>Decline Query outcome (approve or reject).</span>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setQuerySupport,
                    "Assign Queries"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Assign Queries:{" "}
                  </span>
                  <span>Allocate queries to specific support staff.</span>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setQuerySupport,
                    "Resolve Queries"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Resolve Queries:{" "}
                  </span>
                  <span className="">
                    Mark queries as resolved or follow up.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor Management */}
          <div className="mt-8">
            <div className="font-semibold text-[#202224] text-xl">
              Instructor Management
            </div>
            <div className="grid grid-cols-2">
              <div className="flex gap-3 my-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setInstructorManagement,
                    "Add New Instructor"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Add New Instructor:{" "}
                  </span>
                  <span>Add profiles for new instructors.</span>
                </div>
              </div>
              <div className="flex gap-3 my-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setInstructorManagement,
                    "Edit Instructor Information"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Edit Instructor Information:{" "}
                  </span>
                  <span>Upload instructor details or availiability.</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setInstructorManagement,
                    "View Instructor Performance"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    View instructor Performance:{" "}
                  </span>
                  <span>Access performance reports and analytics.</span>
                </div>
              </div>
              <div className="flex gap-3 text-sm items-center">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setInstructorManagement,
                    "Assign Bookings"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Assign Bookings:{" "}
                  </span>
                  <span>Manage and assign booking schedules.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking & Payments */}
          <div className="mt-8">
            <div className="font-semibold text-[#202224] text-xl">
              Booking & Payments
            </div>
            <div className="grid grid-cols-2">
              <div className="flex gap-3 my-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setBookingPayments,
                    "Approve Bookings"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Approve Bookings:{" "}
                  </span>
                  <span>Confirm or modify bookings.</span>
                </div>
              </div>
              <div className="flex gap-3 my-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setBookingPayments,
                    "Refund Payments"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Refund Payments:{" "}
                  </span>
                  <span>Process payment refunds when necessary.</span>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setBookingPayments,
                    "View Earning Reports"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    View Earning Reports:{" "}
                  </span>
                  <span>Access financial reports.</span>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setBookingPayments,
                    "Issue Invoices"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Issue Invoices:{" "}
                  </span>
                  <span>Generate invoices for transactions.</span>
                </div>
              </div>
            </div>
          </div>

          {/*Role & Permission Management */}
          <div className="mt-8">
            <div className="font-semibold text-[#202224] text-xl">
              Role & Permission Management
            </div>
            <div className="grid grid-cols-2">
              <div className="flex gap-3 my-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setRolesAndPermission,
                    "Create New Role"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Create New Role:{" "}
                  </span>
                  <span>Define and assign new role categories.</span>
                </div>
              </div>
              <div className="flex gap-3 my-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setRolesAndPermission,
                    "Edit Role Permissions"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Edit Role Permissions:{" "}
                  </span>
                  <span>Remove roles that are no longer needed.</span>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setRolesAndPermission,
                    "Delete Roles"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Delete Roles:{" "}
                  </span>
                  <span>Remove roles that are no longer needed.</span>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <input
                  type="checkbox"
                  onChange={handleCheckboxChange(
                    setRolesAndPermission,
                    "Assign Roles"
                  )}
                />
                <div className="">
                  <span className="font-semibold text-neutral-800 ">
                    Assign Roles:{" "}
                  </span>
                  <span>Allocate roles to users or team members.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex bg-white mx-7 w-full">
          <button
            className="bg-secondary-400 rounded-md px-12 py-2 text-white transition-colors duration-200 hover:bg-secondary-600"
            type="submit"
          >
            Create Role
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RolesAndPermissions;
