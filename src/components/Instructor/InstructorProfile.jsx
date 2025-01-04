import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { FcFolder } from "react-icons/fc";
import { FiUpload } from "react-icons/fi";
import { Testimonials } from "../Learner/FindInstructors";
import { generateAccessToken } from "../../utils/generateAccessToken";
import ReactModal from "react-modal";
import Cookies from "js-cookie";
import axios from "../../axios";
import { ProfileImgUpload } from "../ImageSetup/ProfileImgUpload";
import { openVehicleDocument } from "../Admin/AdminQueries";
import Modal from "../ImageSetup/Modal";
import { handleUploadImage } from "../ImageSetup/HandleImageUpload";
import ImageUploader from "../ImageSetup/ImageUploader";
import AdminNavBar from "../Boundary/AdminNavBar";
import { useProfileImage } from "../../utils/ProfileImageContext";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { useLoading } from "../../LoadingContext";
import { set } from "date-fns";

const InstructorProfile = () => {
  const [InstructorInfo, setInstructorInfo] = useState([]);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [personalDetailModalOpen, setPersonalDetailModalOpen] = useState(false);
  const [addVehicleModalOpen, setAddVehicleModalOpen] = useState(false);
  const [newAddedVehicle, setNewAddedVehicle] = useState([]);
  const [description, setDescription] = useState();
  const [loading, setLoading] = useState(true);
  const [personalDetails, setPersonalDetails] = useState({
    selfDescription: "",
    city: "",
    state: "",
    pincode: "",
    locality: "",
    experience: "",
  });
  const vehicleInitialState = {
    Company: "",
    Model: "",
    Year: "",
    Registration_number: "",
    Vehicle_Registration_document: "",
    Insurance_document: "",
  };
  const [vehicleDetails, setVehicleDetails] = useState(vehicleInitialState);
  const [vehicleDocumentName, setVehicleDocumentName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const { instructorProfileImg, setInstructorProfileImg } = useProfileImage();

  const { setIsLoading } = useLoading();
  // function to fetch instructor details
  const fetchInstructorData = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await axios(
        `items/Instructor?filter[user_id][_eq]=${userId}&&fields=*,vehicle.*,user_id.*,ratings.*,ratings.Given_by.user_id.first_name,ratings.Given_by.user_id.last_name,ratings.Given_by.user_id.profileImg`
      );
      const result = response.data.data;
      setInstructorInfo(result);
      setProfileImg(result[0].user_id.profileImg);

      const vehicleResponse = await axios(
        `items/Vehicles?filter[owner][_eq]=${localStorage.getItem(
          "instructorId"
        )}&filter[vehicle_approval_status][_eq]=pending`
      );
      setNewAddedVehicle(vehicleResponse.data.data);
      setLoading(false);
    } catch (error) {
      console.log("errors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("InstructorInfo:", InstructorInfo[0]);

  //update description
  const saveDescription = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `items/Instructor/${InstructorInfo[0]?.id}`,
        { Self_description: description }
      );
      handleSuccess("Changes Saved Successfully");
      await fetchInstructorData();
      setDescriptionModalOpen(false);
    } catch (error) {
      handleError("Error in Saving Changes");
    } finally {
      setIsLoading(false);
    }
  };
  //update personal details
  const savePersonalDetails = async () => {
    try {
      setIsLoading(true);
      const instructorDetails = {
        Experience: personalDetails.experience,
      };
      await axios.patch(
        `items/Instructor/${InstructorInfo[0]?.id}`,
        instructorDetails
      );

      // Update the user's pincode
      const userDetails = {
        pincode: personalDetails.pincode,
      };
      await axios.patch(
        `users/${InstructorInfo[0]?.user_id?.id}`, // Use the linked user_id to update the user table
        userDetails
      );
      handleSuccess("Changes Saved Successfully");
      await fetchInstructorData();
      setPersonalDetailModalOpen(false);
    } catch (error) {
      handleError("Error in Saving Changes");
    } finally {
      setIsLoading(false);
    }
  };
  // open personal detail modal
  const openPersonalDetailModal = (info) => {
    console.log("info :", info);
    setPersonalDetails({
      city: info?.user_id?.city || "",
      state: info?.user_id?.state || "",
      pincode: info?.user_id?.pincode || "",
      locality: info?.user_id?.locality || "",
      experience: info?.Experience, // Default experience value
    });
    setPersonalDetailModalOpen(true);
  };
  // open description modal
  const openDescriptionModal = (selfDescription) => {
    setDescription(selfDescription);
    setDescriptionModalOpen(true);
  };
  // update profile Img
  const updateProfileImage = async (profileImg) => {
    try {
      setIsLoading(true);
      await axios.patch(`users/${InstructorInfo[0]?.user_id?.id}`, {
        profileImg: profileImg,
      });
      setInstructorProfileImg(profileImg);
    } catch (error) {
      handleError("Error in Updating Profile Image");
    } finally {
      setIsLoading(false);
    }
  };
  //delete vehicle
  const deleteVehicle = async (vehicleId) => {
    try {
      setIsLoading(true);
      const accessToken = Cookies.get("access_token");
      await axios.delete(`items/Vehicles/${vehicleId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchInstructorData();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Attempting to refresh...");
        await generateAccessToken();
        await fetchInstructorData();
      } else {
        console.log("error in deleting pending vehicle:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const [errors,setErrors] = useState({});

  const validateVehicleInfo = () =>{
    let formErrors = {};
    if(!vehicleDetails.Company){
      formErrors.company = "Company Name is Required"
    }
    if(!vehicleDetails.Model){
      formErrors.model = "Model is Required"
    }
    if(!vehicleDetails.Year){
      formErrors.year = "Year is Required"
    }
    if(!vehicleDetails.Registration_number){
      formErrors.reg_num = "Registration Number is Required"
    }
    if(!vehicleDetails.Vehicle_Registration_document){
      formErrors.reg_doc = "Registration Document is Required"
    }
    if(!vehicleDetails.Insurance_document){
      formErrors.insurance_doc = "Insurance Document is Required"
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0
  }
  //Add new Vehicle
  const addNewVehicle = async (e) => {
    e.preventDefault();
    if(!validateVehicleInfo()) return;
    try {
      setIsLoading(true);
      const instructorId = localStorage.getItem("instructorId");
      const newVehicle = {
        Company: vehicleDetails.Company,
        Model: vehicleDetails.Model,
        Year: vehicleDetails.Year,
        Registration_number: vehicleDetails.Registration_number,
        Vehicle_Registration_document:
          vehicleDetails.Vehicle_Registration_document,
        Insurance_document: vehicleDetails.Insurance_document,
        Status: "Accepted",
        vehicle_approval_status: "pending",
        owner: instructorId,
      };
      const response = await axios.post("items/Vehicles", newVehicle);
      fetchInstructorData();
      setAddVehicleModalOpen(false);
      setVehicleDetails(vehicleInitialState);
      handleSuccess("Vehicle Added Successfully")

    } catch (error) {
      console.log("error in posting vehicle:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadVehicleDocument = (event) => {
    setVehicleDocumentName(event.target.name);
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehicleDetails((prevDetails) => ({
          ...prevDetails,
          [event.target.name]: reader.result,
        }));
        setShowModal(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const previewVehicleDocument = (vehicleDocumentName) => {
    const url = vehicleDetails[vehicleDocumentName];
    if (url) {
      window.open(url, "_blank");
    } else {
      handleError("No Document Uploaded");
    }
  };
  const handleCroppedImage = (url) => {
    console.log("Cropped image URL:", url);
    setShowModal(false);
    setVehicleDetails({
      ...vehicleDetails,
      [vehicleDocumentName]: url,
    });
  };
  const closeModal = () => {
    setShowModal(false);
    setVehicleDetails({
      ...vehicleDetails,
      [vehicleDocumentName]: null,
    });
  };

  //filter approved vehicles
  const approvedVehicles = InstructorInfo[0]?.vehicle.filter(
    (vehicle) => vehicle.is_vehicle_approved === "true"
  );

  useEffect(() => {
    fetchInstructorData();
  }, []);

  return loading ? (
    <div className="flex text-center justify-center text-gray-400 text-3xl font-bold mt-20">
      loading..
    </div>
  ) : (
    <div>
      <h1 className="text-2xl font-bold mx-5 my-8">Profile</h1>
      <div className="border border-neutral-100 rounded-lg m-5">
        {/* profile section */}
        <div className="p-4">
          <div className="flex gap-4 items-start">
            <ProfileImgUpload
              profileImg={profileImg}
              setProfileImg={setProfileImg}
              updateProfileImage={updateProfileImage}
            />
            <div>
              <h1 className="font-bold text-2xl">
                {InstructorInfo[0]?.user_id?.first_name}{" "}
                {InstructorInfo[0]?.user_id?.last_name}
              </h1>
              <div className="flex gap-1 ">
                <span>
                  <HiLocationMarker size={20} />
                </span>
                <span className="text-sm">
                  {InstructorInfo[0]?.user_id?.city},{" "}
                  {InstructorInfo[0]?.user_id?.state}
                </span>
              </div>
              <button className="px-6 rounded-full text-success-300 border border-success-300 mt-2 text-sm hover:cursor-default">
                {InstructorInfo[0]?.Availibility}
              </button>
            </div>
          </div>
        </div>
        <hr className="border-neutral-100"></hr>
        <div>
          <div className="flex">
            <div className="border-r-2 border-neutral-100 w-80">
              {/* Personal details */}
              <div className="p-4 text-sm">
                <div className="flex justify-between">
                  <h1 className="font-semibold text-xl">Details</h1>
                  <FaRegEdit
                    size={20}
                    onClick={() => openPersonalDetailModal(InstructorInfo[0])}
                    className="hover:cursor-pointer"
                  />
                </div>
                <div className="font-bold mt-4">Experience</div>
                <div className="">{InstructorInfo[0]?.Experience}</div>
                <div className="font-bold mt-4">Location</div>
                <div>
                  {InstructorInfo[0]?.user_id?.city},{" "}
                  {InstructorInfo[0]?.user_id?.state}
                </div>
                <div>Pincode : {InstructorInfo[0]?.user_id?.pincode}</div>
                <div>
                  {InstructorInfo[0]?.user_id?.locality &&
                    InstructorInfo[0]?.user_id?.locality}
                </div>
              </div>
              <hr className="border-neutral-100"></hr>

              <div className="p-4 text-sm">
                <div className="font-bold mt-4">Statistics</div>
                <div className="font-bold mt-4">Total Lessons Conducted </div>
                <div>150 Lessons</div>
                <div className="font-bold mt-4">Total Hours Taught</div>
                <div>300 Hours</div>
                <div className="font-bold mt-4">Student Ratings</div>
                <div className="">4.8/5 Stars</div>
                <div className="font-bold mt-4">Number of Reviews</div>
                <div className="">45 Reviews</div>
                <div className="font-bold mt-4">Approval Rate</div>
                <div className="">95%</div>
                <div className="font-bold mt-4">Cancellation Rate</div>
                <div>3%</div>
              </div>
            </div>

            <div className="w-full">
              {/* Self Description */}
              <div className="p-4 px-6">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-bold text-secondary-500">
                    Self Description
                  </h2>
                  <FaRegEdit
                    size={20}
                    className="hover:cursor-pointer"
                    onClick={() =>
                      openDescriptionModal(InstructorInfo[0]?.Self_description)
                    }
                  />
                </div>
                {InstructorInfo[0]?.Self_description ? (
                  <div className="text-sm mt-4">
                    {InstructorInfo[0]?.Self_description}
                  </div>
                ) : (
                  <div className="font-medium text-gray-500 my-3 text-center text-lg">
                    No Description Provided
                  </div>
                )}
              </div>
              <hr className="border-neutral-100"></hr>
              {/* Vehicle Information */}
              <div className="p-4 px-6">
                <h2 className="text-2xl font-bold text-secondary-500">
                  My Vehicles
                </h2>
                <h1 className="my-5 text-success-400 font-semibold text-lg">
                  Approved Vehicles
                </h1>
                {/* approved vehicles */}
                {approvedVehicles.map((vehicleInfo, index) => (
                  <div className={`text-sm`} key={vehicleInfo.id}>
                    <div className="font-bold mt-4 text-lg">
                      Vehicle {index + 1} Details
                    </div>
                    <div className="font-bold mt-4">Vehicle Company</div>
                    <div>{vehicleInfo.Company}</div>
                    <div className="font-bold mt-4">Vehicle Model</div>
                    <div>{vehicleInfo.Model}</div>
                    <div className="font-bold mt-4">Vehicle Year</div>
                    <div>{vehicleInfo.Year}</div>
                    <div className="font-bold mt-4">
                      Vehicle Registration Number{" "}
                    </div>
                    <div>{vehicleInfo.Registration_number}</div>
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
                              vehicleInfo.Vehicle_Registration_document
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
                            openVehicleDocument(vehicleInfo.Insurance_document)
                          }
                        >
                          <FcFolder className="w-full h-full " />
                        </button>
                      </div>
                    </div>
                    <div
                      className={`${index < approvedVehicles.length - 1 &&
                        "border-b mt-5 border-gray-300"}`}
                    ></div>
                  </div>
                ))}
                {/* pending vehicles */}
                <p
                  className={`mt-5 text-error-400 font-semibold text-lg ${
                    newAddedVehicle.length ? " " : "hidden"
                  }`}
                >
                  Pending Approval{" "}
                </p>
                {newAddedVehicle.map((vehicleInfo, index) => (
                  <div className="text-sm" key={vehicleInfo.id}>
                    <div className="flex justify-between mt-4  items-center">
                      <p className="font-bold text-lg">
                        Vehicle {index + 1} Details
                      </p>
                      <RiDeleteBin6Line
                        onClick={() => deleteVehicle(vehicleInfo.id)}
                        className="hover:cursor-pointer"
                        size={18}
                        title="Delete"
                      />
                    </div>

                    <div className="font-bold mt-4">Vehicle Company</div>
                    <div>{vehicleInfo.Company}</div>
                    <div className="font-bold mt-4">Vehicle Model</div>
                    <div>{vehicleInfo.Model}</div>
                    <div className="font-bold mt-4">Vehicle Year</div>
                    <div>{vehicleInfo.Year}</div>
                    <div className="font-bold mt-4">
                      Vehicle Registration Number{" "}
                    </div>
                    <div>{vehicleInfo.Registration_number}</div>
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
                              vehicleInfo.Vehicle_Registration_document
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
                            openVehicleDocument(vehicleInfo.Insurance_document)
                          }
                        >
                          <FcFolder className="w-full h-full " />
                        </button>
                      </div>
                    </div>
                    <div
                      className={`${index < newAddedVehicle.length - 1 &&
                        "border-b mt-5 border-gray-300"}`}
                    ></div>
                  </div>
                ))}

                <button
                  className="px-3  py-2 flex items-center gap-3 rounded-md bg-slate-50 text-neutral-600 mt-6 border border-neutral-100 hover:bg-slate-100 "
                  onClick={() => setAddVehicleModalOpen(true)}
                >
                  <span className="text-gray-500">
                    <FaPlus />
                  </span>
                  <span>Add New Vehicle</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* edit description modal */}
      <ReactModal
        isOpen={descriptionModalOpen}
        onRequestClose={() => setDescriptionModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-[#FFFFFF] rounded-lg shadow-lg w-[650px] p-6 ">
          <div className="flex justify-between">
            <h2 className="text-3xl text-[#202224] font-bold">
              Self Description
            </h2>
            <button
              onClick={() => setDescriptionModalOpen(false)}
              className="text-gray-500 
                     hover:text-gray-700"
            >
              <IoMdClose size={28} className="text-gray-500" />
            </button>
          </div>

          <div className="">
            <p className="text-[#202224] mt-3 text-sm">
              Tell learners a bit about yourself! Highlight your teaching style,
              experience, and what makes you a great instructor.
            </p>

            <h3 className="text-lg font-semibold text-[#202224] mt-3">
              {" "}
              Personal Overview{" "}
            </h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded mt-4 outline-none"
              placeholder="Enter your description"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="flex justify-start gap-3 mt-4">
              <button
                className="px-11 py-2 bg-[#2B6BE7] text-[#FFFFFF] rounded-md hover:bg-blue-600"
                onClick={saveDescription}
              >
                Save
              </button>
              <button
                onClick={() => setDescriptionModalOpen(false)}
                className="px-10 py-2 bg-[#B7B7B7] text-[#FFFFFF] rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </ReactModal>

      {/* edit personal detail modal */}
      <ReactModal
        isOpen={personalDetailModalOpen}
        className="bg-white p-6 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="w-[550px]">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-[#202224] font-bold">Details</h2>
            <button
              onClick={() => setPersonalDetailModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoMdClose className="text-gray-500" size={28} />
            </button>
          </div>
          <p className="text-sm text-[#202224] my-6">
            Provide accurate and updated information about your teaching
            experience and location. This helps learners connect with you
            better.
          </p>

          <form className="space-y-2">
            {/* experience */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Years of Experience
              </label>
              <select
                className="p-3 border border-gray-300 rounded-lg focus:outline-none"
                value={personalDetails.experience} // Prefilled value
                onChange={(e) =>
                  setPersonalDetails({
                    ...personalDetails,
                    experience: e.target.value,
                  })
                }
              >
                <option>{personalDetails.experience}</option>
                {/* <option value="Less than 1 year">less than 1 year</option>
              <option value="1-3 years">1-3 years</option>
        <option value="3-5 years">3-5 years</option>
        <option value="5-10 years">5-10 years</option>
        <option value="10+ years">10+ years</option>  */}
                {[
                  "less than 1 year",
                  "1-3 years",
                  "3-5 years",
                  "5-10 years",
                  "10+ years",
                ].map(
                  (value) =>
                    value !== personalDetails.experience && (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    )
                )}
              </select>
            </div>
            <hr></hr>
            {/* state */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                State
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                placeholder="New South Wales"
                defaultValue="New South Wales"
              />
            </div>
            <hr></hr>
            {/* city */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                City
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                placeholder="Sydney"
                defaultValue="Sydney"
              />
            </div>
            <hr></hr>
            {/* pincode */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Pin Code
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                value={personalDetails.pincode}
                onChange={(e) =>
                  setPersonalDetails({
                    ...personalDetails,
                    pincode: e.target.value,
                  })
                }
              />
            </div>
            <hr></hr>

            {/* locality */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Locality (Optional)
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                value={personalDetails.locality}
                placeholder="locality"
                onChange={(e) =>
                  setPersonalDetails({
                    ...personalDetails,
                    locality: e.target.value,
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
              className="px-16 py-2 bg-[#B7B7B7] text-[#FFFFFF] rounded-lg hover:bg-gray-300"
              onClick={() => setPersonalDetailModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </ReactModal>
      {/* Add new vehicle modal */}
      <ReactModal
        isOpen={addVehicleModalOpen}
        className="bg-white p-6 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="w-[480px] md:w-[550px] h-[500px] overflow-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-[#202224] font-bold">
              Add New Vehicle
            </h2>
            <button
              onClick={() => {
                setAddVehicleModalOpen(false);
                setVehicleDetails(vehicleInitialState);
                setErrors({});
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <IoMdClose className="text-gray-500" size={28} />
            </button>
          </div>
          <p className="text-sm text-[#202224] my-6">
            Provide accurate and complete information about your vehicle. This
            ensures a smooth and reliable experience for learners and helps
            build trust.
          </p>
          <form className="space-y-2" onSubmit={addNewVehicle}>
            {/* company */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Vehicle Company
              </label>
              <div>
              <input
                type="text"
                value={vehicleDetails.Company}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                onChange={(e) =>
                  setVehicleDetails({
                    ...vehicleDetails,
                    Company: e.target.value,
                  })
                }
              />
               {errors.company && (
                <p className="text-sm text-red-500 ml-1">
                  {errors.company}
                </p>
              )}
              </div>
            </div>
            <hr></hr>
            {/* Model */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Vehicle Model
              </label>
              <div>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                value={vehicleDetails.Model}
                onChange={(e) =>
                  setVehicleDetails({
                    ...vehicleDetails,
                    Model: e.target.value,
                  })
                }
              />
               {errors.model && (
                <p className="text-sm text-red-500 ml-1">
                  {errors.model}
                </p>
              )}
              </div>
            </div>
            <hr></hr>
            {/* year */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Vehicle Year
              </label>
              <div>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                value={vehicleDetails.Year}
                onChange={(e) =>
                  setVehicleDetails({ ...vehicleDetails, Year: e.target.value })
                }
              />
              {errors.year && (
                <p className="text-sm text-red-500 ml-1">
                  {errors.year}
                </p>
              )}
              </div>
            </div>
            <hr></hr>
            {/* registration number */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Vehicle Registration Number
              </label>
              <div>
              <input
                type="text"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
                value={vehicleDetails.Registration_number}
                onChange={(e) =>
                  setVehicleDetails({
                    ...vehicleDetails,
                    Registration_number: e.target.value,
                  })
                }
              />
              {errors.reg_num && (
                <p className="text-sm text-red-500 ml-1">
                  {errors.reg_num}
                </p>
              )}
              </div>
            </div>
            <hr></hr>
            {/* registration document */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Upload Vehicle Registration Document
              </label>
              <div className="flex flex-col mt-1 w-full">
                {/* Custom Label acting as Button */}
                <label
                  htmlFor="Vehicle_Registration_document"
                  className="cursor-pointer w-full p-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
                >
                  {vehicleDetails.Vehicle_Registration_document ? (
                    <p className="text-center text-gray-600">
                      Document Uploaded
                    </p>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-600">
                      <FiUpload />
                      <span className="ml-2">Upload Image</span>
                    </div>
                  )}
                </label>
                {/* Hidden File Input */}
                <input
                  id="Vehicle_Registration_document"
                  type="file"
                  className="hidden"
                  name="Vehicle_Registration_document"
                  accept="image/*"
                  onChange={uploadVehicleDocument}
                />
                 {errors.reg_doc && (
                <p className="text-sm text-red-500 ml-1">
                  {errors.reg_doc}
                </p>
              )}
                <button
                  type="button"
                  onClick={() =>
                    previewVehicleDocument("Vehicle_Registration_document")
                  }
                  className={`ml-1 text-gray-700 text-sm flex justify-start ${!vehicleDetails.Vehicle_Registration_document &&
                    "hidden"} `}
                >
                  Preview file
                </button>
              </div>
            </div>
            {/* crop image modal */}
            <Modal
              className="w-full h-full overflow-scroll"
              show={showModal}
              onClose={closeModal}
            >
              <ImageUploader
                image={vehicleDetails[vehicleDocumentName]}
                handleUploadImage={handleUploadImage}
                filename="cropped_image.jpg"
                onCropped={handleCroppedImage}
                aspectRatio={16 / 9} // Change this to 1 for square, 16/9 for landscape, or 9/16 for portrait
              />
            </Modal>
            <hr></hr>
            {/* insurance document */}
            <div className="grid grid-cols-2 items-center">
              <label className="block text-base font-semibold text-[#202224]">
                Upload Vehicle Insurance Document
              </label>
              <div className="flex flex-col  mt-1 w-full">
                {/* Custom Label acting as Button */}
                <label
                  htmlFor="Insurance_document"
                  className="cursor-pointer w-full p-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
                >
                  {vehicleDetails.Insurance_document ? (
                    <p className="text-center text-gray-600">
                      Document Uploaded
                    </p>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-600">
                      <FiUpload />
                      <span className="ml-2">Upload Image</span>
                    </div>
                  )}
                </label>
                {/* Hidden File Input */}
                <input
                  id="Insurance_document"
                  type="file"
                  className="hidden"
                  name="Insurance_document"
                  accept="image/*"
                  onChange={uploadVehicleDocument}
                />
                 {errors.insurance_doc && (
                <p className="text-sm text-red-500 ml-1">
                  {errors.insurance_doc}
                </p>
              )}
                <button
                  type="button"
                  onClick={() => previewVehicleDocument("Insurance_document")}
                  className={`ml-1 text-gray-700 text-sm flex justify-start ${!vehicleDetails.Insurance_document &&
                    "hidden"} `}
                >
                  Preview file
                </button>
              </div>
            </div>
            <hr></hr>
            {/* save/cancel buttons */}
            <div className="flex justify-start space-x-5 mt-10">
              <button
                type="submit"
                className="px-16 py-2 bg-[#2B6BE7] text-[#FFFFFF] rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                className="px-16 py-2 bg-[#B7B7B7] text-[#FFFFFF] rounded-lg hover:bg-gray-400"
                onClick={() => {
                  setAddVehicleModalOpen(false);
                  setVehicleDetails(vehicleInitialState);
                  setErrors({});
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </ReactModal>
      <div className="px-5">
        <Testimonials testimonials={InstructorInfo[0]?.ratings} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default InstructorProfile;
