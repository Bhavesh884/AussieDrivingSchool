import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
//import react icons
import { FaCamera } from "react-icons/fa";
import { FaPlus, FaChevronRight, FaArrowRight } from "react-icons/fa6";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { GoArrowLeft } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import Select from "react-select";
import { MdDone } from "react-icons/md";
import axios from "../../axios";
import { passwordInstructions } from "../Auth/LearnerSignUp";
import ImageUploader from "../ImageSetup/ImageUploader";
import Modal from "../ImageSetup/Modal";
import { Country, City, State } from "country-state-city";
import { handleUploadImage } from "../ImageSetup/HandleImageUpload";
import { SetProfileImg } from "../ImageSetup/ProfileImgUpload";
import { useLoading } from "../../LoadingContext";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";

const VisitorForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [profileImg, setProfileImg] = useState(null);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [documentOption, setDocumentOption] = useState("");
  const [vehicleDocumentOption, setVehicleDocumentOption] = useState({
    index: null,
    field: "",
  });
  const isInstructor = localStorage.getItem("isInstructor");
  const isLearner = localStorage.getItem("isLearner");
  const isAdmin = localStorage.getItem("isAdmin");
  const isEmployee = localStorage.getItem("isEmployee");

  const location = useLocation();
  const queryDetails = location.state?.queryDetails;
  console.log("queryDetails", queryDetails);
  //states for selecting location
  const countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  const navigate = useNavigate();

  if (queryDetails) {
  }
  // personal details fields
  const [personalDetails, setPersonalDetails] = useState({
    first_name: "",
    last_name: "",
    phone_number: "", // Mobile number
    gender: "",
    date_of_birth: "", // Date of birth (calendar input)
    email: "", // Email address
    pincode: "", // Pincode (ZIP code)
    locality: "", // Locality or area of residence
    password: "",
  });
  //language options
  const options = [
    { value: "English", label: "English" },
    { value: "Epanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Hindi", label: "Hindi" },
    { value: "Bengali", label: "Bengali" },
    { value: "Japanese", label: "Japanese" },
    { value: "Arabic", label: "Arabic" },
  ];

  // license fields
  const [licenseDetails, setLicenseDetails] = useState({
    license_number: "",
    license_issue_state: "",
    license_expiry_date: "",
    license_type: "",
    training_certificate: "",
  });

  // vehicle fields
  const [vehicleDetails, setVehicleDetails] = useState([
    {
      vehicle_company: "",
      vehicle_model: "",
      vehicle_year: "",
      vehicle_registration_no: "",
      vehicle_registration_document: "",
      vehicle_insurance_document: "",
    },
  ]);
  // document fields
  const [documentDetails, setDocumentDetails] = useState({
    police_check: "",
    children_check: "",
    identity_proof: "",
    address_proof: "",
    qualification_certificate: "",
  });
  // other fields
  const [experienceDetails, setExperienceDetails] = useState({
    experience: "",
    available_days: "",
    description: "",
  });

  useEffect(() => {
    if (country) {
      setStateData(State.getStatesOfCountry(country.isoCode));
      setState(); // Reset state when country changes
      setCity(); // Reset city when country changes
    }
  }, [country]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (state) {
      setCityData(City.getCitiesOfState(country.isoCode, state.isoCode));
      setCity(); // Reset city when state changes
    }
  }, [state, country]);

  useEffect(() => {
    if (queryDetails) {
      setProfileImg(queryDetails.profileImg);
      //Mapping personal details
      const relevantFields = Object.keys(personalDetails);
      const updatedDetails = relevantFields.reduce((acc, key) => {
        if (queryDetails[key] !== undefined) {
          acc[key] = queryDetails[key];
        }
        return acc;
      }, {});
      setPersonalDetails((prevDetails) => ({
        ...prevDetails,
        ...updatedDetails,
      }));

      // Mapping languages
      if (queryDetails?.language_spoken) {
        const prefilledLanguages = queryDetails.language_spoken.map(
          (language) => ({
            value: language,
            label: language,
          })
        );
        setSelectedLanguages(prefilledLanguages);
      }
      //Mapping license fields
      const licenseFields = Object.keys(licenseDetails);
      const updatedLicenseDetails = licenseFields.reduce((acc, key) => {
        if (queryDetails[key] !== undefined) {
          acc[key] = queryDetails[key];
        }
        return acc;
      }, {});
      setLicenseDetails((prevDetails) => ({
        ...prevDetails,
        ...updatedLicenseDetails,
      }));

      //Mapping vehicle fields
      if (
        Array.isArray(queryDetails.vehicle) &&
        queryDetails.vehicle.length > 0
      ) {
        const updatedVehicleDetails = queryDetails.vehicle.map((vehicle) => ({
          vehicle_company: vehicle.Company || "",
          vehicle_model: vehicle.Model || "",
          vehicle_year: vehicle.Year || "",
          vehicle_registration_no: vehicle.Registration_number || "",
          vehicle_registration_document:
            vehicle.Vehicle_Registration_document || "",
          vehicle_insurance_document: vehicle.Insurance_document || "",
        }));
        setVehicleDetails(updatedVehicleDetails);
      }

      // experience field
      const updatedExperienceDetails = {
        experience: queryDetails.experience || "",
        available_days: queryDetails.available_days || "",
        description: queryDetails.description || "",
      };
      setExperienceDetails(updatedExperienceDetails);

      //Additional Document Fields
      const doucmentsFields = Object.keys(documentDetails);
      const updatedDocumentDetails = doucmentsFields.reduce((acc, key) => {
        if (queryDetails[key] !== undefined) {
          acc[key] = queryDetails[key];
        }
        return acc;
      }, {});
      setDocumentDetails((prevDetails) => ({
        ...prevDetails,
        ...updatedDocumentDetails,
      }));

      //city
      // if (queryDetails?.country) {

      //   const prefilledCountry = Country.getAllCountries().find(
      //     (c) => c.name === queryDetails.country
      //   );

      //   const prefilledState = prefilledCountry
      //     ? State.getStatesOfCountry(prefilledCountry.isoCode).find(
      //         (s) => s.name === queryDetails.state
      //       )
      //     : null;

      //   const prefilledCity = prefilledState
      //     ? City.getCitiesOfState(
      //         prefilledCountry.isoCode,
      //         prefilledState.isoCode
      //       ).find((c) => c.name === queryDetails.city)
      //     : null;

      //   // Set the state variables
      //   setCountry(prefilledCountry || null);
      //   setState(prefilledState || null);
      //   setCity(prefilledCity || null);

      //   // Populate state and city dropdowns
      //   if (prefilledCountry) {
      //     setStateData(State.getStatesOfCountry(prefilledCountry.isoCode));
      //   }
      //   if (prefilledState) {
      //     setCityData(
      //       City.getCitiesOfState(
      //         prefilledCountry.isoCode,
      //         prefilledState.isoCode
      //       )
      //     );
      //   }
      // }

      const selectedCountry = countryData.find(
        (c) => c.name === queryDetails.country
      );
      console.log("selectedCountry", selectedCountry);
      setCountry(selectedCountry);

      if (selectedCountry) {
        // Populate stateData and set the state
        const states = State.getStatesOfCountry(selectedCountry.isoCode);
        setStateData(states);

        const selectedState = states.find((s) => s.name === queryDetails.state);
        console.log("selectedState", selectedState);
        setState(selectedState.name);

        if (selectedState) {
          // Populate cityData and set the city
          const cities = City.getCitiesOfState(
            selectedCountry.isoCode,
            selectedState.isoCode
          );

          setCityData(cities);

          const selectedCity = cities.find((c) => c.name === queryDetails.city);
          console.log("selectedCity", selectedCity);
          setCity(selectedCity);
        }
      }
    }
  }, [queryDetails, countryData]);

  useEffect(() => {
    if (isLearner !== null) navigate("/");
    else if (isInstructor !== null) navigate("/instructorpage");
    else if (isAdmin !== null) navigate("/admindashboard");
    else if (isEmployee !== null) navigate("/admindashboard");
  }, []);

  // function for Validations
  const validate = async () => {
    let formErrors = {};
    if (currentStep === 1) {
      // First name validation
      if (!personalDetails.first_name.trim()) {
        formErrors.first_name = "First name is required";
      }
      // last name validation
      if (!personalDetails.last_name.trim()) {
        formErrors.last_name = "Last name is required";
      }
      // Phone number validation (basic example for 10 digits)
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(personalDetails.phone_number)) {
        formErrors.phone_number = "Phone number must be 10 digits";
      }

      // country,state and city validation
      if (country === "Select Country" || !country) {
        formErrors.country = "Please select your country";
      }
      if (state === "Select a state" || !state) {
        formErrors.state = "Please select your state";
      }
      if (city === "Select a City" || !city) {
        formErrors.city = "Please select your city";
      }

      // Date of birth validation
      if (!personalDetails.date_of_birth) {
        formErrors.date_of_birth = "Date of birth is required";
      }

      // Email validation (basic)
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!personalDetails.email) {
        formErrors.email = "Please enter your email address";
      } else if (!emailPattern.test(personalDetails.email)) {
        formErrors.email = "Invalid email address";
      } else {
        const checkEmailExists = async () => {
          // Check email existence in the database
          try {
            // check email exist in user table
            const response = await axios.get(
              `users?filter[email][_eq]=${personalDetails.email}`
            );
            // check email exists in query table
            const response2 = await axios.get(
              `items/queries?filter[email][_eq]=${personalDetails.email}`
            );
            const result = response2.data.data;
            console.log("result:", result);

            if (
              response.data.data.length > 0 ||
              (result.length > 0 &&
                (result[0].status === "Pending" ||
                  result[0].status === "Accepted" ||
                  (!queryDetails && result[0].status === "Rejected")))
            ) {
              formErrors.email = "Email already exists";
            } else {
              console.log("something went wrong");
            }
          } catch (error) {
            console.error("Error checking email:", error);
            formErrors.email = "Error validating email";
          }
        };
        await checkEmailExists();
      }

      //gender validation
      if (!personalDetails.gender) {
        formErrors.gender = "Please select your gender";
      }
      // Pincode validation (5 to 6 digits as an example)
      const pincodePattern = /^[0-9]{5,6}$/;
      if (!pincodePattern.test(personalDetails.pincode)) {
        formErrors.pincode = "Pincode must be 5 or 6 digits";
      }
      // language  validation
      if (languageData.length === 0) {
        formErrors.languageError = "Please select atleast one language";
      }
      //password validations
      if (
        personalDetails.password.length < 8 ||
        !/[A-Z]/.test(personalDetails.password) ||
        !/[a-z]/.test(personalDetails.password) ||
        !/[0-9]/.test(personalDetails.password) ||
        !/[!@#$%^&*(),.?":{}|<>]/.test(personalDetails.password) ||
        /\s/.test(personalDetails.password)
      ) {
        formErrors.password =
          "Password must fulfilling the following criteria.";
      }
      // match passwords
      if (confirmPassword !== personalDetails.password) {
        formErrors.confirmPassword = "Passwords do not match!!";
      }
    } else if (currentStep === 2) {
      // License number validation
      if (!licenseDetails.license_number.trim()) {
        formErrors.license_number = "License number is required";
      }
      // License issuing state validation
      if (
        !licenseDetails.license_issue_state ||
        licenseDetails.license_issue_state === "Select a state"
      ) {
        formErrors.license_issue_state = "Please select a license issue state";
      }
      // License expiry date validation
      if (!licenseDetails.license_expiry_date) {
        formErrors.license_expiry_date = "License expiry date is required";
      }
      // License type validation
      if (!licenseDetails.license_type) {
        formErrors.license_type = "Please select the license type";
      }

      vehicleDetails.forEach((vehicle, index) => {
        const vehicleErrors = {}; // Create a nested object for each vehicle's errors

        if (!vehicle.vehicle_company) {
          vehicleErrors.vehicle_company = "Vehicle Company Name is Required";
        }
        if (!vehicle.vehicle_year) {
          vehicleErrors.vehicle_year = "Vehicle Year is Required";
        }
        if (!vehicle.vehicle_model) {
          vehicleErrors.vehicle_model = "Vehicle Model is Required";
        }
        if (!vehicle.vehicle_registration_no) {
          vehicleErrors.vehicle_registration_no =
            "Vehicle Registration Number is Required";
        }
        if (!vehicle.vehicle_registration_document) {
          vehicleErrors.vehicle_registration_document =
            "Vehicle Registration Document is Required";
        }
        if (!vehicle.vehicle_insurance_document) {
          vehicleErrors.vehicle_insurance_document =
            "Vehicle Insurance Document is Required";
        }

        // Only add errors for this vehicle if there are any
        if (Object.keys(vehicleErrors).length > 0) {
          formErrors[index] = vehicleErrors;
        }
      });
    } else if (currentStep === 3) {
      // validation for experience
      if (
        experienceDetails.experience === "Select Experience" ||
        !experienceDetails.experience
      ) {
        formErrors.experience = "Please select experience level";
      }
    } else if (currentStep === 4) {
      if (!documentDetails.police_check) {
        formErrors.police_check = "Document is Required";
      }
      if (!documentDetails.children_check) {
        formErrors.children_check = "Document is Required";
      }
      if (!documentDetails.identity_proof) {
        formErrors.identity_proof = "Document is Required";
      }
      if (!documentDetails.address_proof) {
        formErrors.address_proof = "Document is Required";
      }
      if (!documentDetails.qualification_certificate) {
        formErrors.qualification_certificate = "Document is Required";
      }
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const checkEmail = (e) => {
    const email = e.target.value;
    console.log("Email entered:", email);
  };

  const handleLanguageChange = (selectedOptions) => {
    setSelectedLanguages(selectedOptions || []);
  };
  const selectedLanguageOptions = () => {
    return selectedLanguages.map((option) => option.value);
  };
  const languageData = selectedLanguageOptions();

  const formData = {
    ...personalDetails,
    ...licenseDetails,
    ...documentDetails,
    ...experienceDetails,
    language_spoken: languageData,
    profileImg: profileImg,
    country: country?.name,
    city: city?.name,
    state: state?.name,
  };

  // Function to handle personal details for Step 1
  const handlePersonalDetailChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({
      ...personalDetails,
      [name]: value,
    });
  };

  //  Function to handle vehicle details Step 2
  const handleVehicleInputChange = (index, field, value) => {
    const updatedVehicles = [...vehicleDetails];
    updatedVehicles[index][field] = value;
    setVehicleDetails(updatedVehicles);
  };

  const handleVehicleFileChange = (event, index, fieldName) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehicleDetails((prevDetails) => {
          const updatedDetails = [...prevDetails];
          updatedDetails[index] = {
            ...updatedDetails[index],
            [fieldName]: reader.result,
          };
          return updatedDetails;
        });

        // Store the current vehicle's index and field being updated
        setVehicleDocumentOption({ index, field: fieldName });
        setShowModal(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const handleVehicleCroppedImage = (url) => {
    console.log("Cropped image URL:", url);
    setShowModal(false);

    // Update the specific vehicle's field
    setVehicleDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[vehicleDocumentOption.index] = {
        ...updatedDetails[vehicleDocumentOption.index],
        [vehicleDocumentOption.field]: url,
      };
      return updatedDetails;
    });
  };
  const closeVehicleModal = () => {
    setShowModal(false);

    if (vehicleDocumentOption.index !== null && vehicleDocumentOption.field) {
      setVehicleDetails((prevDetails) => {
        const updatedDetails = [...prevDetails];
        updatedDetails[vehicleDocumentOption.index] = {
          ...updatedDetails[vehicleDocumentOption.index],
          [vehicleDocumentOption.field]: null, // Reset the specific field to null
        };
        return updatedDetails;
      });
    }
  };
  const previewVehicleDocument = (index, documentName) => {
    const url = vehicleDetails[index]?.[documentName];
    if (url) {
      window.open(url, "_blank");
    } else {
      handleError("No Document Uploaded");
    }
  };

  //add new vehicle
  const addNewVehicle = () => {
    setVehicleDetails([
      ...vehicleDetails,
      {
        vehicle_company: "",
        vehicle_model: "",
        vehicle_year: "",
        vehicle_registration_no: "",
        vehicle_registration_document: "",
        vehicle_insurance_document: "",
      },
    ]);
  };
  // remove vehicle
  const removeVehicle = (index) => {
    const updatedVehicles = vehicleDetails.filter((_, i) => i !== index);
    setVehicleDetails(updatedVehicles);
  };

  //  Function to handle license details in Step 2
  const handleLicenseInputChange = (e) => {
    const { name, value } = e.target;
    setLicenseDetails({
      ...licenseDetails,
      [name]: value,
    });
  };

  // Function to handle document uploads for Step 4
  const handleDocumentFileChange = (event) => {
    setDocumentOption(event.target.name);
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentDetails((prevDetails) => ({
          ...prevDetails,
          [event.target.name]: reader.result,
        }));
        setShowModal(true);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleCroppedImage = (url) => {
    console.log("Cropped image URL:", url);
    setShowModal(false);
    setDocumentDetails({
      ...documentDetails,
      [documentOption]: url,
    });
  };
  const closeModal = () => {
    setShowModal(false);
    setDocumentDetails({
      ...documentDetails,
      [documentOption]: null,
    });
  };
  const previewAdditionalDocument = (documentName) => {
    const url = documentDetails[documentName];
    if (url) {
      window.open(url, "_blank");
    } else {
      handleError("No Document Uploaded");
    }
  };

  // Move to the next step
  const nextStep = async () => {
    try {
      if (await validate()) {
        setCurrentStep(currentStep + 1);
        // console.log("Form submitted");
      } else {
        console.log("Validations not match!!");
      }
    } catch (error) {
      console.log("Validations not match!!", error);
    }
  };

  // Move to the previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  const { setIsLoading } = useLoading();

  // function to submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (await validate()) {
        // update the rejected user query
        if (queryDetails?.id) {
          const response = await axios.patch(
            `items/queries/${queryDetails.id}`,
            { ...formData, status: "Pending" }
          );

          console.log("Data updated successfully:", response.data);

          // Iterate through each vehicle in the array
          for (const vehicle of vehicleDetails) {
            // Find the matching vehicle in queryDetails.vehicle
            const matchedVehicle = queryDetails.vehicle.find(
              (v) => v.Registration_number === vehicle.vehicle_registration_no
            );

            // If a match is found, prepare the updated data
            if (matchedVehicle) {
              const updatedVehicleData = {
                Company: vehicle.vehicle_company,
                Model: vehicle.vehicle_model,
                Year: vehicle.vehicle_year,
                Registration_number: vehicle.vehicle_registration_no,
                Vehicle_Registration_document:
                  vehicle.vehicle_registration_document,
                Insurance_document: vehicle.vehicle_insurance_document,
              };

              // Send PATCH request to update the vehicle
              await axios.patch(
                `items/Vehicles/${matchedVehicle.id}`,
                updatedVehicleData
              );

              console.log(
                `Vehicle with ID ${matchedVehicle.id} updated successfully.`
              );
            } else {
              console.warn(
                `No matching vehicle found for registration number ${vehicle.vehicle_registration_no}.`
              );
            }
          }
          navigate("/");
          handleSuccess(
            "Form Submitted Successfully!! You will be notified once admin approve your request"
          );
        }

        //post new user query
        else {
          const response = await axios.post("items/queries", formData);
          console.log("Data posted successfully:", response.data);
          const queryId = response.data.data.id;
          console.log("query id is", queryId);

          for (const vehicle of vehicleDetails) {
            const vehicleData = {
              Company: vehicle.vehicle_company,
              Model: vehicle.vehicle_model,
              Year: vehicle.vehicle_year,
              Registration_number: vehicle.vehicle_registration_no,
              Vehicle_Registration_document:
                vehicle.vehicle_registration_document,
              Insurance_document: vehicle.vehicle_insurance_document,
              Status: "Pending",
              owner: null, // Since the instructor is not created yet
              query: queryId,
            };

            // Post each vehicle detail to the vehicle table
            const vehicleResponse = await axios.post(
              "items/Vehicles",
              vehicleData
            );
            console.log(
              "Vehicle data posted successfully:",
              vehicleResponse.data
            );
          }

          navigate("/");
          handleSuccess(
            "Form Submitted Successfully!! You will be notified once admin approve your request"
          );
        }
      }
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("formData:", formData);

  const steps = [
    "Personal Details",
    "License & Vehicle Details",
    "Experience & Availability",
    "Additional Documents",
    "Describe Yourself",
  ];

  return (
    <div>
      <div className="text-[#001C51] text-3xl font-extrabold  px-24 h-[100px] bg-white items-center flex">
        <Link to="/">Startup</Link>
      </div>
      <hr></hr>
      <div className="flex justify-between items-center my-2 px-5 md:px-16 w-full">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={index}
              className={`${
                isCurrent
                  ? "block"
                  : "hidden sm:flex justify-center items-center w-full"
              } flex justify-center items-center w-full`}
            >
              {/* numbers */}
              <div
                className={`flex items-center justify-center  w-7 h-7 rounded-full border 
              ${isCompleted ? "border-green-500" : "border-blue-500"}
              ${
                isCurrent
                  ? "bg-blue-500 text-white border-blue-500"
                  : "text-blue-500"
              }`}
              >
                {isCompleted ? (
                  <span className="text-green-500">
                    <MdDone className="shrink-0" />
                  </span>
                ) : (
                  <span className="shrink-0">{stepNumber}</span>
                )}
              </div>

              {/* Step Name */}
              <span className="ml-2 text-xs text-[#202224] font-semibold ">
                {step}
              </span>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <FaChevronRight className="text-gray-300" />
              )}
            </div>
          );
        })}
      </div>

      <hr className="mx-5 md:mx-16"></hr>

      <form
        className="flex w-full px-10 sm:px-14 md:px-20 lg:px-28"
        onSubmit={handleSubmit}
      >
        {currentStep === 1 && (
          <div className="my-10 w-full">
            <Link to="/rolesignup">
              <GoArrowLeft size={28} />
            </Link>
            <h1 className="font-bold text-black text-2xl sm:text-3xl mt-10">
              Personal Details
            </h1>
            <h1 className="mt-5 text-[#202224]">
              Provide your basic information and location to get started.
            </h1>
            <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div className="col-span-2 flex flex-col items-start mt-8">
                <span className="text-[#202224] font-semibold text-sm">
                  Profile image{" "}
                </span>

                <div className="">
                  <SetProfileImg
                    profileImg={profileImg}
                    setProfileImg={setProfileImg}
                  />
                </div>

                {/* {queryDetails.profileImg && (
                  <SetProfileImg
                    profileImg={queryDetails.profileImg}
                    setProfileImg={setProfileImg}
                  />
                )} */}
              </div>

              {/* First name */}
              <div className="">
                <label className="block text-sm text-[#202224] font-semibold">
                  First Name <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none"
                  placeholder="Enter your name"
                  value={personalDetails.first_name}
                  onChange={handlePersonalDetailChange}
                />
                {errors.first_name && (
                  <p className="text-sm text-red-500 ml-1">
                    {errors.first_name}
                  </p>
                )}
              </div>
              {/* Last name */}
              <div className="">
                <label className="block text-sm text-[#202224] font-semibold">
                  Last Name <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none"
                  placeholder="Enter your name"
                  value={personalDetails.last_name}
                  onChange={handlePersonalDetailChange}
                />
                {errors.last_name && (
                  <p className="text-sm text-red-500 ml-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
              {/* Date of birth */}
              <div className="">
                <label className="block text-sm text-[#202224] font-semibold">
                  Date of Birth <span className="text-red-500"> *</span>
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  name="date_of_birth"
                  value={personalDetails.date_of_birth}
                  onChange={handlePersonalDetailChange}
                ></input>
                {errors.date_of_birth && (
                  <p className="text-sm text-red-500 ml-1">
                    {errors.date_of_birth}
                  </p>
                )}
              </div>
              {/* Mobile Number */}
              <div>
                <label className="block text-sm text-[#202224] font-semibold">
                  Mobile Number <span className="text-red-500"> *</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  name="phone_number"
                  value={personalDetails.phone_number}
                  onChange={handlePersonalDetailChange}
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
                {errors.phone_number && (
                  <p className="text-sm text-red-500 ml-1">
                    {errors.phone_number}
                  </p>
                )}
              </div>
              {/* Email */}
              <div>
                <label className="block text-sm text-[#202224] font-semibold">
                  Email <span className="text-red-500"> *</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  name="email"
                  value={personalDetails.email}
                  onChange={handlePersonalDetailChange}
                  onBlur={checkEmail}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 ml-1">{errors.email}</p>
                )}
              </div>
              {/* Gender */}
              <div>
                <label className="block text-sm text-[#202224]  font-semibold">
                  Gender <span className="text-red-500"> *</span>
                </label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  name="gender"
                  value={personalDetails.gender}
                  onChange={handlePersonalDetailChange}
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
              {/* country */}
              <div>
                <label className="block text-sm text-[#202224] font-semibold">
                  Country <span className="text-red-500"> *</span>
                </label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  name="country"
                  value={country?.isoCode || ""}
                  onChange={(e) =>
                    setCountry(
                      countryData.find((c) => c.isoCode === e.target.value)
                    )
                  }
                >
                  <option value="">Select Country</option>
                  {countryData.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-sm text-red-500 ml-1">{errors.country}</p>
                )}
              </div>
              {/* state */}
              <div>
                <label className="block text-sm text-[#202224] font-semibold">
                  State <span className="text-red-500"> *</span>
                </label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  name="state"
                  value={state?.isoCode || ""}
                  onChange={(e) =>
                    setState(
                      stateData.find((s) => s.isoCode === e.target.value)
                    )
                  }
                  disabled={!stateData.length}
                >
                  <option value="">Select a state</option>
                  {stateData.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-sm text-red-500 ml-1">{errors.state}</p>
                )}
              </div>
              {/* city */}
              <div>
                <label className="block text-sm text-[#202224] font-semibold">
                  City <span className="text-red-500"> *</span>
                </label>
                <select
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  name="city"
                  value={city?.name || ""}
                  onChange={(e) =>
                    setCity(cityData.find((c) => c.name === e.target.value))
                  }
                  disabled={!cityData.length}
                >
                  <option value="">Select a city</option>
                  {cityData.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-sm text-red-500 ml-1">{errors.city}</p>
                )}
              </div>
              {/* pin code */}
              <div>
                <label className="block text-sm text-[#202224] font-semibold">
                  Pin code <span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  name="pincode"
                  placeholder="Pincode"
                  value={personalDetails.pincode}
                  onChange={handlePersonalDetailChange}
                />
                {errors.pincode && (
                  <p className="text-sm text-red-500 ml-1">{errors.pincode}</p>
                )}
              </div>
              {/* language */}
              <div>
                <label className="block text-sm text-[#202224] font-semibold">
                  Select Language <span className="text-red-500"> *</span>
                </label>
                <Select
                  isMulti
                  name="languages"
                  options={options}
                  value={selectedLanguages}
                  onChange={handleLanguageChange}
                  className="mt-1"
                  classNamePrefix="select"
                />
                {errors.languageError && (
                  <p className="text-sm text-red-500 ml-1">
                    {errors.languageError}
                  </p>
                )}
              </div>
              {/* Locality */}
              <div>
                <label className="block text-sm text-[#202224] font-semibold">
                  Locality (Optional)
                </label>
                <input
                  type="text"
                  placeholder=""
                  name="locality"
                  value={personalDetails.locality}
                  onChange={handlePersonalDetailChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>

              {/* password field */}
              <div className="relative my-3">
                <label className="block text-sm text-[#202224] font-semibold">
                  Password <span className="text-red-500"> *</span>
                </label>
                <button
                  type="button"
                  className="absolute right-0 top-1 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={personalDetails.password}
                  onChange={handlePersonalDetailChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  placeholder="New password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 ml-1">{errors.password}</p>
                )}
                <p className="text-base text-gray-500">
                  Password should match the following criteria:
                </p>
                <ul className="list-disc">
                  {passwordInstructions.map((rules, index) => (
                    <li key={index} className="text-sm text-gray-400">
                      {rules}
                    </li>
                  ))}
                </ul>
              </div>
              {/* confirm password field  */}
              <div className="mb-6 relative">
                <label
                  className="block text-sm text-[#202224] font-semibold"
                  htmlFor="confirmPassword"
                >
                  Confirm Password <span className="text-red-500"> *</span>
                </label>
                <button
                  type="button"
                  className="absolute right-0 top-1 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 ml-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Next button */}
            <div className="mt-10 flex justify-end">
              <button
                className="bg-[#2B6BE7] px-6 py-2 text-white text-sm rounded-md flex items-center gap-3 "
                type="button"
                onClick={nextStep}
              >
                Next
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="w-full">
            <h1 className="font-bold text-black text-2xl sm:text-3xl mt-10">
              License and Vehicle Details
            </h1>
            <h1 className="mt-5 text-[#202224]">
              Provide your basic information and location to get started.
            </h1>
            <div className="mt-5 ">
              <h1 className="font-extrabold text-[#202224] text-xl my-5">
                License Information
              </h1>

              <div className="sm:grid sm:grid-cols-2 gap-6">
                {/* license no */}
                <div className="w-full">
                  <label className="block text-sm text-[#202224] font-semibold">
                    Driver’s License Number{" "}
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="text"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none"
                    name="license_number"
                    placeholder="Driver’s License Number"
                    value={licenseDetails.license_number}
                    onChange={handleLicenseInputChange}
                  />
                  {errors.license_number && (
                    <p className="text-sm text-red-500 ml-1">
                      {errors.license_number}
                    </p>
                  )}
                </div>

                {/* license issuing state */}
                <div className="w-full mt-3 sm:mt-0">
                  <label className="block text-sm text-[#202224] font-semibold">
                    License Issuing State (Dropdown){" "}
                    <span className="text-red-500"> *</span>
                  </label>
                  <select
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none"
                    name="license_issue_state"
                    value={licenseDetails.license_issue_state}
                    onChange={handleLicenseInputChange}
                  >
                    <option value="">Select a state</option>
                    <option value="State1">State1</option>
                    <option value="State2">State2</option>
                  </select>
                  {errors.license_issue_state && (
                    <p className="text-sm text-red-500 ml-1">
                      {errors.license_issue_state}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:flex sm:mt-4 gap-5 w-full">
                {/* expiry date */}
                <div className="w-full mt-3 sm:mt-0">
                  <label className="block text-sm text-[#202224] font-semibold">
                    License Expiry Date <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="date"
                    placeholder="Date"
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none "
                    name="license_expiry_date"
                    value={licenseDetails.license_expiry_date}
                    onChange={handleLicenseInputChange}
                  />
                  {errors.license_expiry_date && (
                    <p className="text-sm text-red-500 ml-1">
                      {errors.license_expiry_date}
                    </p>
                  )}
                </div>

                {/* license type */}
                <div className="w-full mt-3 sm:mt-0">
                  <label className="block text-sm text-[#202224] font-semibold">
                    License Type (Manual/Automatic/Both)
                  </label>
                  <select
                    className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none"
                    name="license_type"
                    value={licenseDetails.license_type}
                    onChange={handleLicenseInputChange}
                  >
                    <option value="">Select License Type</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Both">Both</option>
                  </select>
                  {errors.license_type && (
                    <p className="text-sm text-red-500 ml-1">
                      {errors.license_type}
                    </p>
                  )}
                </div>
              </div>
              {/* Certificate */}
              <h1 className="mt-3 text-[#202224] font-semibold">
                Certificate IV in Training and Assessment
              </h1>

              <div className="flex space-x-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="training_certificate"
                    value="Yes"
                    checked={licenseDetails.training_certificate === "Yes"}
                    onChange={handleLicenseInputChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="training_certificate"
                    value="No"
                    checked={licenseDetails.training_certificate === "No"}
                    onChange={handleLicenseInputChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>

              <h1 className="font-extrabold text-[#202224] text-xl my-5">
                Vehicle Information
              </h1>

              {vehicleDetails.map((vehicle, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mt-10">
                    <h1 className="text-[#202224]  font-bold">
                      Vehicle {index + 1} Details
                    </h1>
                    {index !== 0 && (
                      <RiDeleteBinLine
                        className="hover:cursor-pointer"
                        onClick={() => removeVehicle(index)}
                      />
                    )}
                  </div>

                  <div className="sm:flex mt-5 gap-5 w-full">
                    {/*  Vehicle Company*/}
                    <div className="w-full">
                      <label className="block text-sm text-[#202224] font-semibold">
                        Vehicle Company <span className="text-red-500"> *</span>
                      </label>
                      <input
                        type="text"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none"
                        name="vehicle_company"
                        placeholder=""
                        value={vehicle.vehicle_company}
                        onChange={(e) =>
                          handleVehicleInputChange(
                            index,
                            "vehicle_company",
                            e.target.value
                          )
                        }
                      />
                      {errors[index]?.vehicle_company && (
                        <p className="text-sm text-red-500 ml-1">
                          {errors[index].vehicle_company}
                        </p>
                      )}
                    </div>

                    {/* Vehicle Model */}
                    <div className="w-full mt-3 sm:mt-0">
                      <label className="block text-sm text-[#202224] font-semibold">
                        Vehicle Model <span className="text-red-500"> *</span>
                      </label>
                      <input
                        type="text"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none"
                        name="vehicle_model"
                        value={vehicle.vehicle_model}
                        onChange={(e) =>
                          handleVehicleInputChange(
                            index,
                            "vehicle_model",
                            e.target.value
                          )
                        }
                        placeholder="Vehicle Model"
                      />
                      {errors[index]?.vehicle_model && (
                        <p className="text-sm text-red-500 ml-1">
                          {errors[index].vehicle_model}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:flex mt-3 gap-5 w-full ">
                    {/* Vehicle Year */}
                    <div className="w-full">
                      <label className="block text-sm text-[#202224] font-semibold">
                        Vehicle Year <span className="text-red-500"> *</span>
                      </label>
                      <input
                        type="text"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none"
                        name="vehicle_year"
                        placeholder=""
                        value={vehicle.vehicle_year}
                        onChange={(e) =>
                          handleVehicleInputChange(
                            index,
                            "vehicle_year",
                            e.target.value
                          )
                        }
                      />
                      {errors[index]?.vehicle_year && (
                        <p className="text-sm text-red-500 ml-1">
                          {errors[index].vehicle_year}
                        </p>
                      )}
                    </div>

                    {/*  Vehicle Registration Number */}
                    <div className="w-full mt-3 sm:mt-0">
                      <label className="block text-sm text-[#202224] font-semibold">
                        Vehicle Registration Number{" "}
                        <span className="text-red-500"> *</span>
                      </label>
                      <input
                        type="text"
                        className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none"
                        name="vehicle_registration_no"
                        placeholder=""
                        value={vehicle.vehicle_registration_no}
                        onChange={(e) =>
                          handleVehicleInputChange(
                            index,
                            "vehicle_registration_no",
                            e.target.value
                          )
                        }
                      />
                      {errors[index]?.vehicle_registration_no && (
                        <p className="text-sm text-red-500 ml-1">
                          {errors[index].vehicle_registration_no}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:flex mt-3 gap-5 w-full ">
                    <Modal
                      className="w-full h-full overflow-scroll"
                      show={showModal}
                      onClose={closeVehicleModal}
                    >
                      <ImageUploader
                        image={
                          vehicleDocumentOption.index !== null &&
                          vehicleDocumentOption.field
                            ? vehicleDetails[vehicleDocumentOption.index][
                                vehicleDocumentOption.field
                              ]
                            : null
                        }
                        handleUploadImage={handleUploadImage}
                        filename="cropped_image.jpg"
                        onCropped={handleVehicleCroppedImage}
                        aspectRatio={16 / 9} // Change this to 1 for square, 16/9 for landscape, or 9/16 for portrait
                      />
                    </Modal>

                    {/* Registration Documents */}
                    <div className="w-full">
                      <label
                        className="block text-sm text-[#202224] font-semibold"
                        htmlFor="vehicle_registration_document"
                      >
                        Upload Vehicle Registration Document{" "}
                        <span className="text-red-500"> *</span>
                      </label>
                      <div className="flex flex-col items-center justify-center mt-1 w-full">
                        {/* Custom Label acting as Button */}
                        <label
                          htmlFor={`vehicle_registration_document_${index}`}
                          className="cursor-pointer w-full p-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
                        >
                          {vehicle.vehicle_registration_document ? (
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
                        <div className="w-full">
                          <input
                            type="file"
                            id={`vehicle_registration_document_${index}`}
                            name="vehicle_registration_document"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) =>
                              handleVehicleFileChange(
                                e,
                                index,
                                "vehicle_registration_document"
                              )
                            }
                          />
                          {errors[index]?.vehicle_registration_document && (
                            <p className="text-sm text-red-500 ml-1">
                              {errors[index].vehicle_registration_document}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          previewVehicleDocument(
                            index,
                            "vehicle_registration_document"
                          )
                        }
                        className={`ml-1 text-gray-700 text-sm ${!vehicle.vehicle_registration_document &&
                          "hidden"}`}
                      >
                        Preview file
                      </button>
                    </div>

                    {/* Insurance Documents */}
                    <div className="w-full mt-3 sm:mt-0">
                      <label
                        className="block text-sm text-[#202224] font-semibold"
                        htmlFor="vehicle_insurance_document"
                      >
                        Upload Vehicle Insurance Document{" "}
                        <span className="text-red-500"> *</span>
                      </label>
                      <div className="flex flex-col items-center justify-center mt-1 w-full">
                        {/* Custom Label acting as Button */}
                        <label
                          htmlFor={`vehicle_insurance_document_${index}`}
                          className="cursor-pointer w-full p-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
                        >
                          {vehicle.vehicle_insurance_document ? (
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
                        <div className="w-full">
                          <input
                            type="file"
                            id={`vehicle_insurance_document_${index}`}
                            name="vehicle_insurance_document"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) =>
                              handleVehicleFileChange(
                                e,
                                index,
                                "vehicle_insurance_document"
                              )
                            }
                          />
                          {errors[index]?.vehicle_insurance_document && (
                            <div className="text-sm text-red-500 ml-1 ">
                              {errors[index].vehicle_insurance_document}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          previewVehicleDocument(
                            index,
                            "vehicle_insurance_document"
                          )
                        }
                        className={`ml-1 text-gray-700 text-sm text-start ${!vehicle.vehicle_insurance_document &&
                          "hidden"}`}
                      >
                        Preview file
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                className="px-3  py-2 flex items-center gap-3 rounded-md bg-slate-200 mt-6 border border-gray-50"
                onClick={addNewVehicle}
              >
                <span className="text-gray-500">
                  <FaPlus />
                </span>
                <span>Add New Vehicle</span>
              </button>
            </div>

            {/*Prev and Next button */}
            <div className="flex justify-end gap-10 my-10">
              <button className="text-sm" type="button" onClick={prevStep}>
                Back
              </button>
              <button
                className="bg-[#2B6BE7] px-6 py-2 text-white text-sm rounded-md flex items-center gap-3 "
                type="button"
                onClick={nextStep}
              >
                Next
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          // Experience & Availability
          <div className="w-full">
            <h1 className="font-bold text-black text-2xl sm:text-3xl mt-10">
              Experience & Availability
            </h1>
            <h1 className="mt-5">
              Share your teaching experience and availability schedule.
            </h1>
            <div className="sm:flex mt-10 gap-5 w-full ">
              {/* Years of Experience*/}
              <div className="w-full">
                <label className="block text-sm text-[#202224] font-semibold">
                  Years of Experience <span className="text-red-500"> *</span>
                </label>
                <select
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none"
                  name="experience"
                  value={experienceDetails.experience}
                  onChange={(e) =>
                    setExperienceDetails({
                      ...experienceDetails,
                      experience: e.target.value,
                    })
                  }
                >
                  <option value="">Select Experience</option>
                  <option value="Less than 1 year">less than 1 year</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </select>
                {errors.experience && (
                  <p className="text-sm text-red-500 ml-1">
                    {errors.experience}
                  </p>
                )}
              </div>

              {/*  Available Days (Optional)*/}
              <div className="w-full mt-3 sm:mt-0">
                <label className="block text-sm text-[#202224] font-semibold">
                  Available Days (Optional)
                </label>
                <input
                  type="text"
                  className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none"
                  name="available_days"
                  value={experienceDetails.available_days}
                  onChange={(e) =>
                    setExperienceDetails({
                      ...experienceDetails,
                      available_days: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Back and Next buttons */}

            <div className="flex justify-end gap-10 my-10">
              <button className="text-sm" type="button" onClick={prevStep}>
                Back
              </button>
              <button
                className="bg-[#2B6BE7] px-6 py-2 text-white text-sm rounded-md flex items-center gap-3 "
                type="button"
                onClick={nextStep}
              >
                Next
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="w-full">
            <h1 className="font-bold text-black text-2xl sm:text-3xl mt-10">
              Additional Documents
            </h1>
            <h1 className="mt-5">
              Upload any necessary documents for further review.
            </h1>

            <div className="sm:grid sm:grid-cols-2 gap-6 mt-10">
              {/* National Police Check */}

              <div className="w-full">
                <label className="block text-sm text-[#202224] font-semibold">
                  Upload National Police Check{" "}
                  <span className="text-red-500"> *</span>
                </label>
                <div className="flex flex-col items-center justify-center mt-1 w-full">
                  {/* Custom Label acting as Button */}
                  <label
                    htmlFor="police_check"
                    className="cursor-pointer w-full p-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
                  >
                    {documentDetails.police_check ? (
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
                  <div className="w-full">
                    <input
                      id="police_check"
                      type="file"
                      className="hidden"
                      name="police_check"
                      accept="image/*"
                      onChange={handleDocumentFileChange}
                    />
                    {errors.police_check && (
                      <p className="text-sm text-red-500 ml-1">
                        {errors.police_check}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => previewAdditionalDocument("police_check")}
                  className={`ml-1 text-gray-700 text-sm ${!documentDetails.police_check &&
                    "hidden"} `}
                >
                  Preview file
                </button>
              </div>

              <Modal
                className="w-full h-full overflow-scroll"
                show={showModal}
                onClose={closeModal}
              >
                <ImageUploader
                  image={documentDetails[documentOption]}
                  handleUploadImage={handleUploadImage}
                  filename="cropped_image.jpg"
                  onCropped={handleCroppedImage}
                  aspectRatio={16 / 9} // Change this to 1 for square, 16/9 for landscape, or 9/16 for portrait
                />
              </Modal>

              {/* Working with Children Check */}
              <div className="w-full mt-3 sm:mt-0">
                <label className="block text-sm text-[#202224] font-semibold">
                  Working with Children Check{" "}
                  <span className="text-red-500"> *</span>
                </label>
                <div className="flex flex-col items-center justify-center mt-1 w-full">
                  {/* Custom Label acting as Button */}
                  <label
                    htmlFor="children_check"
                    className="cursor-pointer w-full p-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
                  >
                    {documentDetails.children_check ? (
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
                  <div className="w-full">
                    <input
                      type="file"
                      className="hidden"
                      id="children_check"
                      name="children_check"
                      accept="image/*,.pdf"
                      onChange={handleDocumentFileChange}
                    />
                    {errors.children_check && (
                      <p className="text-sm text-red-500 ml-1">
                        {errors.children_check}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => previewAdditionalDocument("children_check")}
                  className={`ml-1 text-gray-700 text-sm ${!documentDetails.children_check &&
                    "hidden"} `}
                >
                  Preview file
                </button>
              </div>

              {/* Proof of Identity */}
              <div className="w-full mt-3 sm:mt-0">
                <label className="block text-sm text-[#202224] font-semibold">
                  Upload Proof of Identity{" "}
                  <span className="text-red-500"> *</span>
                </label>
                <div className="flex flex-col items-center justify-center mt-1 w-full">
                  {/* Custom Label acting as Button */}
                  <label
                    htmlFor="identity_proof"
                    className="cursor-pointer w-full p-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
                  >
                    {documentDetails.identity_proof ? (
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
                  <div className="w-full">
                    <input
                      id="identity_proof"
                      type="file"
                      className="hidden"
                      name="identity_proof"
                      accept="image/*,.pdf"
                      onChange={handleDocumentFileChange}
                    />
                    {errors.identity_proof && (
                      <p className="text-sm text-red-500 ml-1">
                        {errors.identity_proof}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => previewAdditionalDocument("identity_proof")}
                  className={`ml-1 text-gray-700 text-sm ${!documentDetails.identity_proof &&
                    "hidden"} `}
                >
                  Preview file
                </button>
              </div>

              {/* Proof of Address */}
              <div className="w-full mt-3 sm:mt-0">
                <label className="block text-sm text-[#202224] font-semibold">
                  Upload Proof of Address{" "}
                  <span className="text-red-500"> *</span>
                </label>
                <div className="flex flex-col items-center justify-center mt-1 w-full">
                  {/* Custom Label acting as Button */}
                  <label
                    htmlFor="address_proof"
                    className="cursor-pointer w-full p-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
                  >
                    {documentDetails.address_proof ? (
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
                  <div className="w-full">
                    <input
                      id="address_proof"
                      type="file"
                      className="hidden"
                      name="address_proof"
                      accept="image/*,.pdf"
                      onChange={handleDocumentFileChange}
                    />
                    {errors.address_proof && (
                      <p className="text-sm text-red-500 ml-1">
                        {errors.address_proof}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => previewAdditionalDocument("address_proof")}
                  className={`ml-1 text-gray-700 text-sm ${!documentDetails.address_proof &&
                    "hidden"} `}
                >
                  Preview file
                </button>
              </div>

              {/* Qualifications Certificate */}
              <div className="w-full mt-3 sm:mt-0">
                <label className="block text-sm text-[#202224] font-semibold">
                  Upload Qualifications Certificate{" "}
                  <span className="text-red-500"> *</span>
                </label>
                <div className="flex flex-col items-center justify-center mt-1 w-full">
                  {/* Custom Label acting as Button */}
                  <label
                    htmlFor="qualification_certificate"
                    className="cursor-pointer w-full p-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50"
                  >
                    {documentDetails.qualification_certificate ? (
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
                  <div className="w-full">
                    <input
                      id="qualification_certificate"
                      type="file"
                      className="hidden"
                      name="qualification_certificate"
                      accept="image/*,.pdf"
                      onChange={handleDocumentFileChange}
                    />
                    {errors.qualification_certificate && (
                      <p className="text-sm text-red-500 ml-1">
                        {errors.qualification_certificate}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    previewAdditionalDocument("qualification_certificate")
                  }
                  className={`ml-1 text-gray-700 text-sm ${!documentDetails.qualification_certificate &&
                    "hidden"} `}
                >
                  Preview file
                </button>
              </div>
            </div>

            {/* next and prev button */}
            <div className="flex justify-end gap-10 my-10">
              <button className="text-sm" type="button" onClick={prevStep}>
                Back
              </button>
              <button
                className="bg-[#2B6BE7] px-6 py-2 text-white text-sm rounded-md flex items-center gap-3 "
                type="button"
                onClick={nextStep}
              >
                Next
                <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="w-full">
            <h1 className="font-bold text-black text-2xl sm:text-3xl mt-10">
              Describe Yourself
            </h1>
            <h1 className="mt-5">
              Tell us a little about yourself in a few words.
            </h1>
            <div className="mt-5">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[#202224]"
              >
                A Few Words About You (150-200 characters)
              </label>
              <textarea
                id="description"
                name="description"
                rows="8"
                value={experienceDetails.description}
                onChange={(e) =>
                  setExperienceDetails({
                    ...experienceDetails,
                    description: e.target.value,
                  })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                placeholder="I am an experienced driving instructor with a passion for teaching and..."
              />
            </div>

            {/* prev and submit button */}
            <div className="flex justify-end gap-10 my-10">
              <button className="text-sm" onClick={prevStep}>
                Back
              </button>
              <button
                className="bg-[#2B6BE7] px-6 text-sm py-2 text-white rounded-md"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
      <ToastContainer />
    </div>
  );
};

export default VisitorForm;
