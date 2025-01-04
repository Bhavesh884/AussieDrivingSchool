import React, { useEffect, useState } from "react";
import { FaSearch, FaTh, FaBars, FaFilter, FaCaretDown } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import { BiReset } from "react-icons/bi";
import { GoArrowLeft } from "react-icons/go";
import { HiLocationMarker } from "react-icons/hi";
import { FcFolder } from "react-icons/fc";
import { FaPlus } from "react-icons/fa6";
import ReactModal from "react-modal";
import axios from "../../axios";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { useLoading } from "../../LoadingContext";
import { useProfileImage } from "../../utils/ProfileImageContext";

//open Vehicle documents
export const openVehicleDocument = (url) => {
  if (url) {
    window.open(url, "_blank");
  } else {
    handleError("No Document Uploaded");
  }
};
const QueriesFullDetailModal = ({
  setModalFullDetailOpen,
  selectedQuerytDetails,
  getAllQueries,
  handleViewQueryProfile,
}) => {
  const [acceptQueryModal, setAcceptQueryModal] = useState(false);
  const [rejectQueryModalOpen, setRejectQueryModalOpen] = useState(false);
  const { setIsLoading } = useLoading();
  const { empPermissions } = useProfileImage();

  //approve vehicle
  const isVehicleApproved = async (vehicleId, currentStatus) => {
    try {
      setIsLoading(true);
      const newStatus = currentStatus === "true" ? "false" : "true";
      const response = await axios.patch(`items/Vehicles/${vehicleId}`, {
        is_vehicle_approved: newStatus,
      });
      handleViewQueryProfile(selectedQuerytDetails.id);
    } catch (error) {
      handleError("Error in Updating Status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleApprovalPermission = (vehicleId, currentStatus) => {
    if (empPermissions) {
      if (
        empPermissions.roles.Query_and_Support.includes("Accept/Reject Queries")
      ) {
        isVehicleApproved(vehicleId, currentStatus);
      } else {
        handleError("You dont have permission to perform this action!!");
      }
    } else {
      isVehicleApproved(vehicleId, currentStatus);
    }
  };
  // Accept Query
  const handleAcceptQuery = async () => {
    const userDetails = {
      first_name: selectedQuerytDetails?.first_name,
      profileImg: selectedQuerytDetails?.profileImg,
      last_name: selectedQuerytDetails?.last_name,
      email: selectedQuerytDetails?.email,
      date_of_birth: selectedQuerytDetails?.date_of_birth,
      phoneNumber: selectedQuerytDetails?.phone_number,
      city: selectedQuerytDetails?.city,
      state: selectedQuerytDetails?.state,
      locality: selectedQuerytDetails?.locality,
      pincode: selectedQuerytDetails?.pincode,
      password: selectedQuerytDetails.password,
      isInstructor: true, // Set isInstructor to true
    };

    try {
      setIsLoading(true);
      const response = await axios.post("users", userDetails);
      const userid = response.data.data.id;
      const instructorDetails = {
        user_id: userid,
        Experience: selectedQuerytDetails?.experience,
        License_number: selectedQuerytDetails?.license_number,
        License_Issuing_state: selectedQuerytDetails?.license_issue_state,
        License_expiry_date: selectedQuerytDetails?.license_expiry_date,
        License_type: selectedQuerytDetails?.license_type,
        Certified_in_training: selectedQuerytDetails?.training_certificate,
        Available_days: selectedQuerytDetails?.available_days,
        Self_description: selectedQuerytDetails?.description,
        National_police_check: selectedQuerytDetails?.police_check,
        Working_with_children_check: selectedQuerytDetails?.children_check,
        Qualification_certificate:
          selectedQuerytDetails?.qualification_certificate,
        Proof_of_address: selectedQuerytDetails?.address_proof,
        Proof_of_identity: selectedQuerytDetails?.identity_proof,
        language_spoken: selectedQuerytDetails?.language_spoken,
      };
      const instructorResponse = await axios.post(
        "items/Instructor",
        instructorDetails
      );
      if (instructorResponse.status === 200) {
        console.log(
          "User details sent to instructor table successfully:",
          instructorResponse.data
        );
      }
      const instructorId = instructorResponse.data.data.id;

      //posting instId to vehicle table
      updateVehicleInfo(instructorId, selectedQuerytDetails.id);

      const queryStatusResponse = await axios.patch(
        `items/queries/${selectedQuerytDetails.id}`,
        { status: "Accepted" }
      );
      handleSuccess("Query Accepted Successfully");
      setAcceptQueryModal(false);
      handleViewQueryProfile(selectedQuerytDetails.id);
      getAllQueries();
    } catch (error) {
      console.error("Error acceptiong query:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Accept QUery Permission
  const handleAcceptQueryPermission = () => {
    if (empPermissions) {
      if (
        empPermissions.roles.Query_and_Support.includes("Accept/Reject Queries")
      ) {
        setAcceptQueryModal(true);
      } else {
        handleError("You dont have permission to perform this action!!");
      }
    } else {
      setAcceptQueryModal(true);
    }
  };

  // update vehicle status
  const updateVehicleInfo = async (instructorId, queryId) => {
    try {
      setIsLoading(true);
      const vehicleResponse = await axios.get(
        `items/Vehicles?filter[query][_eq]=${queryId}`
      );
      const vehicles = vehicleResponse.data.data;

      for (const vehicle of vehicles) {
        if (vehicle.is_vehicle_approved === "true") {
          const vehicleUpdate = {
            owner: instructorId, // Link instructor ID
            Status: "Accepted", // Update status to accepted
          };
          const response = await axios.patch(
            `items/Vehicles/${vehicle.id}`,
            vehicleUpdate
          );
          if (response.status === 200) {
            console.log(`Vehicle ${vehicle.id} updated successfully!`);
          } else {
            console.error(`Failed to update vehicle ${vehicle.id}`);
          }
        } else {
          console.log(`Vehicle ${vehicle.id} not approved, skipping update.`);
        }
      }
    } catch (error) {
      console.error("Error updating vehicles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //Reject Query
  const handleRejectQuery = async () => {
    try {
      setIsLoading(true);
      const queryStatusResponse = await axios.patch(
        `items/queries/${selectedQuerytDetails.id}`,
        { status: "Rejected" }
      );
      handleSuccess("Query Rejected Successfully");
      setRejectQueryModalOpen(false);
      handleViewQueryProfile(selectedQuerytDetails.id);
      getAllQueries();
    } catch (error) {
      handleError("Failed to Reject Query");
    } finally {
      setIsLoading(false);
    }
  };

  //Reject Query Permission
  const handleRejectQueryPermission = () => {
    if (empPermissions) {
      if (
        empPermissions.roles.Query_and_Support.includes("Accept/Reject Queries")
      ) {
        setRejectQueryModalOpen(true);
      } else {
        handleError("You dont have permission to perform this action!!");
      }
    } else {
      setRejectQueryModalOpen(true);
    }
  };
  const openAdditionalDocument = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      handleError("No Document Provided");
    }
  };

  return (
    <div>
      <GoArrowLeft
        size={28}
        className="hover:cursor-pointer"
        onClick={() => setModalFullDetailOpen(false)}
      />
      <div className="border border-neutral-100 rounded-lg mt-8 mb-20">
        {/* profile section */}
        <div className="p-4">
          <div className="flex gap-4 items-start">
            <img
              src={selectedQuerytDetails.profileImg}
              alt="profileImg"
              className="w-16 h-16 rounded-full object-cover"
            ></img>
            <div>
              <h1 className="font-bold text-2xl">
                {selectedQuerytDetails.first_name}{" "}
                {selectedQuerytDetails.last_name}
              </h1>
              <div className="flex gap-1 ">
                <span>
                  <HiLocationMarker size={20} />
                </span>
                <span className="text-sm">
                  {selectedQuerytDetails.city},{selectedQuerytDetails.state}
                </span>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-neutral-100"></hr>

        <div className="">
          <div className="w-full">
            {/*  Personal Information */}
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold font-poppins text-secondary-500">
                Personal Details
              </h2>
              <div className="text-sm">
                <div className="font-bold mt-4 font-poppins">
                  {" "}
                  Date of Birth
                </div>
                <div>{selectedQuerytDetails?.date_of_birth}</div>
                <div className="font-bold mt-4"> Mobile Number</div>
                <div>{selectedQuerytDetails?.phone_number}</div>
                <div className="font-bold mt-4">Email</div>
                <div>{selectedQuerytDetails?.email}</div>
                <div className="font-bold mt-4">Experience</div>
                <div>{selectedQuerytDetails?.experience}</div>
                <div className="font-bold mt-4">Languages Spoken</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedQuerytDetails?.language_spoken ? (
                    selectedQuerytDetails?.language_spoken.map((language) => (
                      <span
                        key={language}
                        className="p-1 bg-slate-200 border border-gray-300 rounded-md"
                      >
                        {language}
                      </span>
                    ))
                  ) : (
                    <div>Not Provided</div>
                  )}
                </div>
              </div>
            </div>
            <hr className="border-neutral-100 my-3"></hr>

            {/* Location Details */}
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">
                Location Details
              </h2>
              <div className="text-sm">
                <div className="font-bold mt-4">City</div>
                <div>{selectedQuerytDetails?.city}</div>
                <div className="font-bold mt-4">Pin code</div>
                <div>{selectedQuerytDetails?.pincode}</div>
                <div className="font-bold mt-4"> State</div>
                <div>{selectedQuerytDetails?.state}</div>
                <div className="font-bold mt-4">Locality</div>
                <div>
                  {selectedQuerytDetails?.locality
                    ? selectedQuerytDetails?.locality
                    : "Not Provided"}
                </div>
              </div>
            </div>
            <hr className="border-neutral-100 my-3"></hr>
            {/* License and Certification Details */}
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">
                License and Certification Details
              </h2>
              <div className="text-sm">
                <div className="font-bold mt-4"> Driver’s License Number</div>
                <div>{selectedQuerytDetails.license_number}</div>
                <div className="font-bold mt-4">License Issuing State</div>
                <div>{selectedQuerytDetails.license_issue_state}</div>
                <div className="font-bold mt-4"> License Expiry Date</div>
                <div>{selectedQuerytDetails.license_expiry_date}</div>
                <div className="font-bold mt-4">License Type </div>
                <div>{selectedQuerytDetails.license_type}</div>
                <div className="font-bold mt-4">
                  {" "}
                  Certificate IV in Training and Assessment{" "}
                </div>
                <div>{selectedQuerytDetails.training_certificate}</div>
              </div>
            </div>
            <hr className="border-neutral-100 my-3"></hr>
            {/* Vehicle Details */}
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">
                Vehicle Information
              </h2>
              {selectedQuerytDetails.vehicle.map((vehicle, index) => {
                return (
                  <div key={vehicle.id}>
                    <div className="flex gap-3 mt-5 justify-between">
                      <div className="font-semibold text-lg">
                        Vehicle {index + 1} Details
                      </div>
                      <button
                        className={`border rounded-lg text-sm px-4 py-2 text-white font-semibold ${
                          vehicle.is_vehicle_approved === "true"
                            ? "bg-green-400 border-green-500 "
                            : "bg-secondary-400 hover:bg-secondary-500"
                        }`}
                        onClick={() =>
                          handleVehicleApprovalPermission(
                            vehicle.id,
                            vehicle.is_vehicle_approved
                          )
                        }
                      >
                        {vehicle.is_vehicle_approved === "true"
                          ? "Vehicle Approved"
                          : "Approve Vehicle?"}
                      </button>
                    </div>
                    <div className="text-sm">
                      <div className="font-bold mt-4"> Vehicle Company</div>
                      <div>{vehicle.Company}</div>
                      <div className="font-bold mt-4"> Vehicle Model</div>
                      <div>{vehicle.Model}</div>
                      <div className="font-bold mt-4"> Vehicle Year</div>
                      <div>{vehicle.Year}</div>
                      <div className="font-bold mt-4">
                        Vehicle Registration Number
                      </div>
                      <div>{vehicle.Registration_number}</div>

                      <div className="flex flex-wrap my-5 gap-10">
                        {/* registration document */}
                        <div className="w-28">
                          <p className="font-semibold text-sm">
                            Vehicle Registration Document
                          </p>
                          <button
                            className="h-20 w-full rounded-md bg-slate-300"
                            onClick={() =>
                              openVehicleDocument(
                                vehicle.Vehicle_Registration_document
                              )
                            }
                          >
                            <FcFolder className="w-full h-full " />
                          </button>
                        </div>
                        {/* insurance document */}
                        <div className="w-28">
                          <p className="font-semibold text-sm">
                            Vehicle Insurance Document
                          </p>
                          <button
                            className="h-20 w-full rounded-md bg-slate-300"
                            onClick={() =>
                              openVehicleDocument(vehicle.Insurance_document)
                            }
                          >
                            <FcFolder className="w-full h-full " />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${index <
                        selectedQuerytDetails.vehicle.length - 1 &&
                        "border-b mt-5 border-gray-300"}`}
                    ></div>
                  </div>
                );
              })}
            </div>
            <hr className="border-neutral-100 my-3"></hr>
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">
                Additional Documents
              </h2>
              <div className="flex flex-wrap my-5 gap-10">
                {/* Police check */}
                <div className="w-28">
                  <p className="font-semibold text-sm">National Police Check</p>
                  <button
                    className="h-20 w-full rounded-md bg-slate-300 mt-5"
                    onClick={() =>
                      openAdditionalDocument(selectedQuerytDetails.police_check)
                    }
                  >
                    <FcFolder className="w-full h-full " />
                  </button>
                </div>
                {/* Children Check */}
                <div className="w-28">
                  <p className="font-semibold text-sm">
                    Working with Children Check
                  </p>
                  <button
                    className="h-20 w-full rounded-md bg-slate-300 mt-5"
                    onClick={() =>
                      openAdditionalDocument(
                        selectedQuerytDetails.children_check
                      )
                    }
                  >
                    <FcFolder className="w-full h-full " />
                  </button>
                </div>
                {/* Proof of Identity */}
                <div className="w-28">
                  <p className="font-semibold text-sm">Proof of Identity</p>
                  <button
                    className="h-20 w-full rounded-md bg-slate-300 mt-9"
                    onClick={() =>
                      openAdditionalDocument(
                        selectedQuerytDetails.identity_proof
                      )
                    }
                  >
                    <FcFolder className="w-full h-full " />
                  </button>
                </div>
                {/* Proof of Address */}
                <div className="w-28">
                  <p className="font-semibold text-sm">Proof of Address</p>
                  <button
                    className="h-20 w-full rounded-md bg-slate-300 mt-5"
                    onClick={() =>
                      openAdditionalDocument(
                        selectedQuerytDetails.address_proof
                      )
                    }
                  >
                    <FcFolder className="w-full h-full " />
                  </button>
                </div>
                {/* Qualifications Certificate (Certificate IV) */}
                <div className="w-28">
                  <p className="font-semibold text-sm">
                    Qualifications Certificate (Certificate IV)
                  </p>
                  <button
                    className="h-20 w-full rounded-md  mt-1 bg-slate-300"
                    onClick={() =>
                      openAdditionalDocument(
                        selectedQuerytDetails.qualification_certificate
                      )
                    }
                  >
                    <FcFolder className="w-full h-full" />
                  </button>
                </div>
              </div>
            </div>
            <hr className="border-neutral-100 my-3"></hr>
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">
                Self Description
              </h2>
              {!selectedQuerytDetails.description ? (
                <div className="font-medium text-gray-500 my-3 text-center text-lg">
                  No Description Provided
                </div>
              ) : (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded mt-4 outline-none"
                  placeholder="Enter your description"
                  rows="3"
                  value={selectedQuerytDetails.description}
                  disabled
                ></textarea>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Action Butttons */}
      <div className="flex gap-5 bg-white py-5 fixed bottom-0 w-full">
        {/* accept query */}
        <button
          className={`bg-secondary-400 rounded-md text-white px-8 py-2 transition-colors duration-200 hover:bg-secondary-500 ${
            selectedQuerytDetails.status === "Accepted" ||
            selectedQuerytDetails.status === "Rejected"
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleAcceptQueryPermission}
          disabled={
            selectedQuerytDetails.status === "Accepted" ||
            selectedQuerytDetails.status === "Rejected"
          }
        >
          {selectedQuerytDetails.status === "Accepted" ? "Accepted" : "Accept"}
        </button>
        {/* reject query */}
        <button
          className={`bg-error-200 rounded-md px-8 py-2 text-white transition-colors duration-200 hover:bg-error-300 ${
            selectedQuerytDetails.status === "Accepted" ||
            selectedQuerytDetails.status === "Rejected"
              ? "opacity-50 cursor-not-allowed"
              : ""
          } `}
          onClick={handleRejectQueryPermission}
          disabled={
            selectedQuerytDetails.status === "Accepted" ||
            selectedQuerytDetails.status === "Rejected"
          }
        >
          {selectedQuerytDetails.status === "Rejected" ? "Rejected" : "Reject"}
        </button>
        <button
          className="bg-neutral-300 rounded-md text-white px-8 py-2 transition-colors duration-200 hover:bg-neutral-400"
          onClick={() => setModalFullDetailOpen(false)}
        >
          Cancel
        </button>
      </div>
      {/* Accept Query Modal */}
      <ReactModal
        isOpen={acceptQueryModal}
        onRequestClose={() => setAcceptQueryModal(false)}
        className="w-100 bg-[#FFFFFF] p-6 rounded-lg shadow-lg"
        overlayClassName="overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[99999]"
      >
        <h2 className="text-lg font-semibold mb-4">
          Are you sure you want to accept this query?
        </h2>
        <div className="flex justify-end">
          <button
            className="bg-secondary-400 text-[#FFFFFF] px-8 py-2 rounded-md"
            onClick={handleAcceptQuery}
          >
            Accept Query
          </button>
          <button
            onClick={() => setAcceptQueryModal(false)}
            className="ml-4 bg-[#B7B7B7] text-[#FFFFFF] px-8 py-2 rounded-md hover:bg-gray-400"
          >
            No
          </button>
        </div>
      </ReactModal>

      {/* Reject Application Modal */}
      <ReactModal
        isOpen={rejectQueryModalOpen}
        onRequestClose={() => setRejectQueryModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
        // shouldCloseOnOverlayClick={false}
      >
        <div className>
          <h2 className="font-semibold mb-4 font-poppins text-[#202224]">
            Are you sure you want to reject this application?
          </h2>
          <p className="text-[#202224] text-xs font-poppins italic mb-4">
            Please provide a reason for rejecting this instructor's application.
          </p>
          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block font-poppins text-[#202224]"
            >
              Select Rejection Reason
            </label>
            <select
              id="reason"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-[#FFFFFF] rounded-md shadow-sm focus:outline-none  sm:text-sm"
            >
              <option>Select Rejection Reason</option>
              <option>
                The visitor does not meet the necessary qualifications for the
                instructor role.
              </option>
              <option>
                The visitor lacks the required or preferred teaching or driving
                experience.
              </option>
              <option>
                The documents provided (license, certifications, etc.) were
                invalid or unverifiable.
              </option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="details"
              className="block font-poppins text-[#202224]"
            >
              Provide any additional details or clarification (optional)
            </label>
            <textarea
              id="details"
              rows="5"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
            ></textarea>
          </div>
          <div className="flex justify-start">
            <button
              className="bg-[#EE6055] text-[#FFFFFF] px-4 text-sm rounded-md hover:bg-red-700"
              onClick={handleRejectQuery}
            >
              Reject Application
            </button>
            <button
              className="ml-4 bg-[#B7B7B7] text-[#FFFFFF] px-4 text-sm  py-2 rounded-md hover:bg-gray-400"
              onClick={() => setRejectQueryModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </ReactModal>
      <ToastContainer />
    </div>
  );
};

const QueriesComponent = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewQuery, setViewQuery] = useState("instructors");
  const [dateFilter, setDateFilter] = useState("");
  const [modalStatusOpen, setModalStatusOpen] = useState(false);
  const [modalDateOpen, setModalDateOpen] = useState(false);
  const [modalFullDetailOpen, setModalFullDetailOpen] = useState(false);
  const [allQueryDetails, setAllQueryDetails] = useState([]);
  const [pendingVehicleQuery, setPendingVehicleQuery] = useState([]);
  const [pendingVehicles, setPendingVehicles] = useState([]);
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [selectedQuerytDetails, setSelectedQueryDetails] = useState("");
  const { empPermissions } = useProfileImage();
  const { setIsLoading } = useLoading();

  const getAllQueries = async () => {
    try {
      setIsLoading(true);
      if (viewQuery === "instructors") {
        //API for fetching all instructors Queries
        const response = await axios(
          "items/queries?fields=id,first_name,last_name,phone_number,city,status,profileImg"
        );
        const allQueriesData = await response.data;
        setAllQueryDetails(allQueriesData.data);
      } else {
        //API for fetching all Instructor Pending Vehicle Queries
        const result = await axios(
          "items/Instructor?filter[vehicle].[vehicle_approval_status][_eq]=pending&fields=id,user_id.first_name,user_id.last_name,user_id.profileImg,user_id.phoneNumber,user_id.city,vehicle.*"
        );
        const allInstructorData = await result.data;
        setPendingVehicleQuery(allInstructorData.data);
      }
    } catch (error) {
      console.log("error in fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewQueryProfile = async (queryId) => {
    try {
      setIsLoading(true);
      //API for fetching query detail by Id
      const response = await axios(`api/getquerydetails?queryId=${queryId}`);
      const data = await response.data;
      setSelectedQueryDetails(data.data[0]);
      setModalFullDetailOpen(true);
    } catch (error) {
      console.log("error in fetching details", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewQueryPermission = (queryId) => {
    if (empPermissions) {
      if (empPermissions?.roles?.Query_and_Support.includes("View Queries")) {
        handleViewQueryProfile(queryId);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      handleViewQueryProfile(queryId);
    }
  };

  const showVehicleQueries = async (instrutorId) => {
    try {
      setIsLoading(true);
      //API for fetching query detail by Id
      const response = await axios(
        `items/Vehicles?filter[vehicle_approval_status][_eq]=pending&filter[owner][_eq]=${instrutorId}&fields=*,owner.id,owner.user_id.first_name,owner.user_id.last_name,owner.user_id.profileImg,owner.user_id.city,owner.user_id.state`
      );
      const data = await response.data;
      setPendingVehicles(data.data);
      setVehicleModalOpen(true);
    } catch (error) {
      console.log("error in fetching details", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const showVehiclePermission = (instrutorId) => {
    if (empPermissions) {
      if (empPermissions?.roles?.Query_and_Support.includes("View Queries")) {
        showVehicleQueries(instrutorId);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      showVehicleQueries(instrutorId);
    }
  };

  //approve vehicle status
  const isNewVehicleApproved = async (vehicleId, ownerId) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`items/Vehicles/${vehicleId}`, {
        vehicle_approval_status: "accepted",
        is_vehicle_approved: "true",
      });
      handleSuccess("Vehicle Approved Successfully");
      showVehicleQueries(ownerId);
      getAllQueries();
    } catch (error) {
      handleError("Error in Updating Status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleApprovePermission = (vehicleId, ownerId) => {
    if (empPermissions) {
      if (
        empPermissions?.roles?.Query_and_Support.includes(
          "Accept/Reject Queries"
        )
      ) {
        isNewVehicleApproved(vehicleId, ownerId);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      isNewVehicleApproved(vehicleId, ownerId);
    }
  };

  // Reject Vehicle
  const rejectVehicle = async (vehicleId, ownerId) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`items/Vehicles/${vehicleId}`, {
        vehicle_approval_status: "rejected",
        is_vehicle_approved: "false",
      });
      handleSuccess("Vehicle Rejected Successfully");
      showVehicleQueries(ownerId);
      getAllQueries();
    } catch (error) {
      handleError("Error in Updating Status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehicleRejectPermission = (vehicleId, ownerId) => {
    if (empPermissions) {
      if (
        empPermissions?.roles?.Query_and_Support.includes(
          "Accept/Reject Queries"
        )
      ) {
        rejectVehicle(vehicleId, ownerId);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      rejectVehicle(vehicleId, ownerId);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleDateFilter = (e) => {
    setDateFilter(e.target.value);
    setModalDateOpen(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setDateFilter("");
  };
  
  const filteredData = allQueryDetails.filter((item) => {
    return (
      item.first_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "All" || item.status === statusFilter) &&
      (dateFilter ? new Date(item.date_created) >= new Date(dateFilter) : true)
    );
  });

  useEffect(() => {
    getAllQueries();
  }, [viewQuery]);

  return (
    <div className="p-6">
      {/* Header and Search Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Queries</h1>
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
            } ${viewQuery === "vehicles" && "hidden"}`}
          >
            <FaBars className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row space-x-4 justify-between mb-6">
        <div className="flex items-center bg-gray-100 rounded-md px-4 py-2 w-full sm:w-96 border border-solid border-neutral-100">
          <FaSearch className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            className="ml-2 bg-transparent focus:outline-none text-neutral-600 w-full"
          />
        </div>
        <div className="flex space-x-4 text-slate-600">
          <button
            onClick={() => setModalDateOpen(true)}
            className="p-3 flex gap-1 items-center relative font-semibold font-poppins text-desk-b-3 text-neutral-600"
          >
            <FaFilter className="mr-2 shrink-0" />
            {dateFilter ? `Date: ${dateFilter}` : "Date"}
            <FaCaretDown />
          </button>

          <button
            onClick={() => setModalStatusOpen(true)}
            className=" p-3 rounded-lg font-semibold font-poppins text-desk-b-3 text-neutral-600 flex gap-1 items-center bg-white "
          >
            {" "}
            Status: {statusFilter}
            <FaCaretDown />
          </button>

          <button
            onClick={resetFilters}
            className="text-error-300 px-4 py-2 flex gap-1 items-center font-poppins text-desk-b-3"
          >
            <BiReset />
            Reset Filters
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        <button
          className={`text-sm font-semibold ${
            viewQuery === "instructors" ? "text-black" : "text-gray-500"
          }`}
          onClick={() => setViewQuery("instructors")}
        >
          Instructors
        </button>
        <button
          className={`text-sm font-semibold ${
            viewQuery === "vehicles" ? "text-black" : "text-gray-500"
          }`}
          onClick={() => setViewQuery("vehicles")}
        >
          Vehicles
        </button>
      </div>
      {viewMode === "grid" ? (
        <div className="py-6">
          <div
            className="w-full flex justify-center
           sm:justify-normal flex-wrap gap-4 flex-grow"
          >
            {viewQuery === "instructors" ? (
              filteredData.map((query) => {
                const {
                  id,
                  first_name,
                  last_name,
                  city,
                  status,
                  phone_number,
                  profileImg,
                } = query;
                return (
                  <div
                    key={id}
                    className="relative w-[230px] border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="">
                        <img
                          src={profileImg}
                          alt={first_name}
                          className="w-10 h-10 rounded-full mr-4 object-cover"
                        />
                        <span
                          className={`absolute top-2 right-3 h-3 w-3 rounded-full ${
                            query.status === "Accepted"
                              ? "bg-green-400 text-green-800"
                              : query.status === "Pending"
                              ? "bg-yellow-400 text-yellow-800"
                              : "bg-red-400 text-red-800"
                          }`}
                        ></span>
                      </div>
                    </div>
                    <div className="text-center">
                      <h2 className="font-bold text-lg mb-2">
                        {first_name} {last_name}
                      </h2>
                      <div className="text-sm text-gray-600">
                        <p className="flex w-full justify-between mb-2">
                          <strong>Query ID:</strong> {id}
                        </p>
                        <p className="flex w-full justify-between mb-2">
                          <strong>Phone:</strong> {phone_number}
                        </p>
                        <p className="flex w-full justify-between mb-2">
                          <strong>Location:</strong> {city}
                        </p>
                        <p className="flex w-full justify-between mb-2">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`${
                              query.status === "Accepted"
                                ? " text-green-800"
                                : query.status === "Pending"
                                ? " text-yellow-800"
                                : " text-red-800"
                            }`}
                          >
                            {status}
                          </span>
                        </p>
                      </div>
                      <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition-colors duration-200"
                        onClick={() => handleViewQueryPermission(id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            ) : pendingVehicleQuery.length > 0 ? (
              pendingVehicleQuery.map((query) => {
                return (
                  <div
                    key={query.id}
                    className="relative w-[240px] border p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 bg-white"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="">
                        <img
                          src={query?.user_id?.profileImg}
                          alt={query?.user_id?.first_name}
                          className="w-10 h-10 rounded-full mr-4 object-cover"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <h2 className="font-bold text-lg mb-2">
                        {query?.user_id?.first_name} {query?.user_id?.last_name}
                      </h2>
                      <div className="text-sm text-gray-600">
                        <p className="flex w-full justify-between mb-2">
                          <strong>Phone:</strong> {query?.user_id?.phoneNumber}
                        </p>
                        <p className="flex w-full justify-between mb-2">
                          <strong>Location:</strong>
                          {query?.user_id?.city}
                        </p>
                      </div>
                      <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition-colors duration-200"
                        onClick={() => showVehiclePermission(query.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500 text-2xl text-center font-semibold mt-10 w-full">
                No Queries Yet!!
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4">
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
                    Location
                  </th>
                  <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left py-5 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((query) => (
                  <tr key={query.id} className="border-t border-gray-200">
                    <td className="py-3 px-4  flex items-center ">
                      {/* Replace the following with profileImage if available */}
                      <img
                        src={`https://i.pravatar.cc/150?u=${query.id}`}
                        alt={query.first_name}
                        className="w-10 h-10 rounded-full mr-20 object-cover shrink-0"
                      />
                      <div className="font-medium text-blue-600">
                        {query.first_name} {query.last_name}
                      </div>
                    </td>
                    <td className="py-3 px-4">{query.phone_number}</td>
                    <td className="py-3 px-4">{query.city}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-md text-sm ${
                          query.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : query.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {query.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="text-white focus:outline-none bg-secondary-400 py-2 px-4 rounded-md transition-colors duration-200"
                        onClick={() => handleViewQueryPermission(query.id)}
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

      {/* Query Status Modal */}
      <ReactModal
        isOpen={modalStatusOpen}
        onRequestClose={() => setModalStatusOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Select Query Status</h3>
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Accepted", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-4 py-2 rounded-full ${
                statusFilter === status
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
            onClick={() => setModalStatusOpen(false)}
            className="text-gray-700 px-4 py-2 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => setModalStatusOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Apply
          </button>
        </div>
      </ReactModal>

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

      {/* Personal Detail Modal */}
      <ReactModal
        isOpen={modalFullDetailOpen}
        onRequestClose={() => setModalFullDetailOpen(false)}
        className="bg-white shadow-lg px-5 md:px-10 pt-5 w-full md:w-4/5 lg:w-8/12  overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-40"
      >
        <QueriesFullDetailModal
          setModalFullDetailOpen={setModalFullDetailOpen}
          selectedQuerytDetails={selectedQuerytDetails}
          getAllQueries={getAllQueries}
          handleViewQueryProfile={handleViewQueryProfile}
        />
      </ReactModal>

      {/* Pending Vehicle Modal */}
      <ReactModal
        isOpen={vehicleModalOpen}
        onRequestClose={() => setVehicleModalOpen(false)}
        className="bg-white shadow-lg px-10 pt-5 w-full md:w-4/5 lg:w-8/12  overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-40"
      >
        <div>
          <GoArrowLeft
            size={28}
            className="hover:cursor-pointer"
            onClick={() => setVehicleModalOpen(false)}
          />
          <div className="border border-neutral-100 rounded-lg mt-8 mb-20">
            {/* profile section */}

            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">
                Pending Vehicle Information
              </h2>
              {pendingVehicles.length > 0 ? (
                pendingVehicles.map((vehicle, index) => {
                  return (
                    <div key={vehicle.id}>
                      <div className="flex gap-3 mt-5 justify-between">
                        <div className="font-semibold text-lg">
                          Vehicle {index + 1} Details
                        </div>
                        <div className="flex gap-5">
                          {/* Accept Vehicle button */}
                          <button
                            className="border border-success-300 transition-all rounded-lg text-sm p-2 text-white bg-success-300 hover:bg-success-400"
                            onClick={() =>
                              handleVehicleApprovePermission(
                                vehicle.id,
                                vehicle.owner.id
                              )
                            }
                          >
                            Approve Vehicle
                          </button>

                          {/* Reject Vehicle button */}
                          <button
                            className={`border border-error-300  bg-error-300 hover:bg-error-400 rounded-lg text-sm p-2 text-white`}
                            onClick={() =>
                              handleVehicleRejectPermission(
                                vehicle.id,
                                vehicle.owner.id
                              )
                            }
                          >
                            Reject Vehicle
                          </button>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="font-bold mt-4"> Vehicle Company</div>
                        <div>{vehicle.Company}</div>
                        <div className="font-bold mt-4"> Vehicle Model</div>
                        <div>{vehicle.Model}</div>
                        <div className="font-bold mt-4"> Vehicle Year</div>
                        <div>{vehicle.Year}</div>
                        <div className="font-bold mt-4">
                          Vehicle Registration Number
                        </div>
                        <div>{vehicle.Registration_number}</div>
                        <div className="flex flex-wrap my-5 gap-10">
                          {/* registration document */}
                          <div className="w-28">
                            <p className="font-semibold text-sm">
                              Vehicle Registration Document
                            </p>
                            <button
                              className="h-20 w-full rounded-md bg-slate-300"
                              onClick={() =>
                                openVehicleDocument(
                                  vehicle.Vehicle_Registration_document
                                )
                              }
                            >
                              <FcFolder className="w-full h-full " />
                            </button>
                          </div>
                          {/* insurance document */}
                          <div className="w-28">
                            <p className="font-semibold text-sm">
                              Vehicle Insurance Document
                            </p>
                            <button
                              className="h-20 w-full rounded-md bg-slate-300"
                              onClick={() =>
                                openVehicleDocument(vehicle.Insurance_document)
                              }
                            >
                              <FcFolder className="w-full h-full " />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`${index < pendingVehicles.length - 1 &&
                          "border-b mt-5 border-gray-300"}`}
                      ></div>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500 text-2xl text-center font-semibold my-10 w-full">
                  No Vehicle Queries
                </div>
              )}
            </div>
          </div>
        </div>
      </ReactModal>
      <ToastContainer />
    </div>
  );
};

export default QueriesComponent;
