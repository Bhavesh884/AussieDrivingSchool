import React, { useState, useEffect } from "react";
import backgroundimg from "../../assets/Images/background.png";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaCamera, FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Cookies from "js-cookie";
import axios from "../../axios";
import Modal from "../ImageSetup/Modal";
import ImageUploader from "../ImageSetup/ImageUploader";
import { Country, City, State } from "country-state-city";
import { handleUploadImage } from "../ImageSetup/HandleImageUpload";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { useLoading } from "../../LoadingContext";

//password instructions
export const passwordInstructions = [
  "Password must be at least 8 characters long.",
  "Password must include at least one uppercase letter.",
  "Password must include at least one lowercase letter.",
  "Password must include at least one number.",
  "Password must include at least one special character.",
  "Password must not contain spaces.",
];
const LearnerSignUp = () => {
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  //states for selecting location
  const countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);

  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
        setShowModal(true);
      };
      // reader.readAsDataURL(file);
      reader.readAsDataURL(event.target.files[0]);
      setShowEditOptions(false);
    }
  };

  const handleCroppedImage = (url) => {
    console.log("Cropped image URL:", url);
    setShowModal(false); // Close the modal after getting the URL
    setProfileImg(url); // Reset the image state
  };

  const closeModal = () => {
    setShowModal(false);
    setProfileImg(null); // Reset the image state when modal is closed
  };

  const handleRemoveImage = () => {
    setProfileImg(null);
    setShowEditOptions(false); // Close the dropdown after removing
  };

  const toggleEditOptions = () => {
    setShowEditOptions((prev) => !prev);
  };

  const [learnerDetails, setLearnerDetails] = useState({
    first_name: "",
    last_name: "",
    phoneNumber: "",
    email: "",
    gender: "",
    pincode: "",
    locality: "",
    date_of_birth: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  console.log("learnerDetails :", learnerDetails);
  const isFormValid =
    learnerDetails.first_name.trim() !== "" &&
    learnerDetails.last_name.trim() !== "" &&
    learnerDetails.phoneNumber.trim() !== "" &&
    learnerDetails.date_of_birth !== "" &&
    learnerDetails.email.trim() !== "" &&
    learnerDetails.password.trim() !== "" &&
    learnerDetails.gender !== "" &&
    learnerDetails.pincode !== "" &&
    city !== "" &&
    state !== "" &&
    confirmPassword !== "";

  // Validations
  const isValidate = () => {
    let formErrors = {};

    // Phone number validation (basic example for 10 digits)
    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(learnerDetails.phoneNumber)) {
      formErrors.phoneNumber = "Phone number must be 10 digits";
    }
    // State validation
    if (state === "Select a State" || !state) {
      formErrors.state = "Please select a state";
    }
    if (city === "Select a City" || !city) {
      formErrors.city = "Please select a city";
    }
    if (country === "Select Country" || !city) {
      formErrors.country = "Please select country";
    }

    if (learnerDetails.gender === "Select Gender" || !learnerDetails.gender) {
      formErrors.gender = "Please select your gender";
    }
    // Date of birth validation
    if (!learnerDetails.date_of_birth) {
      formErrors.date_of_birth = "Date of birth is required";
    }
    // Email validation (basic)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(learnerDetails.email)) {
      formErrors.email = "Invalid email address";
    }
    // Pincode validation (5 to 6 digits as an example)
    const pincodePattern = /^[0-9]{5,6}$/;
    if (!pincodePattern.test(learnerDetails.pincode)) {
      formErrors.pincode = "Pincode must be 5 or 6 digits";
    }

    //password validations
    if (
      learnerDetails.password.length < 8 ||
      !/[A-Z]/.test(learnerDetails.password) ||
      !/[a-z]/.test(learnerDetails.password) ||
      !/[0-9]/.test(learnerDetails.password) ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(learnerDetails.password) ||
      /\s/.test(learnerDetails.password)
    ) {
      formErrors.password =
        "Password is not fulfilling the following criteria.";
    }
    // match passwords
    if (confirmPassword !== learnerDetails.password) {
      formErrors.confirmPassword = "Passwords do not match!!";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleInputFieldChange = (e) => {
    const { name, value } = e.target;
    setLearnerDetails({
      ...learnerDetails,
      [name]: value,
    });
  };

  const { setIsLoading } = useLoading();
  //login learner after signup
  const learnerLogin = async () => {
    try {
      setIsLoading(true);
      const loginDetails = {
        email: learnerDetails.email,
        password: learnerDetails.password,
      };
      const loginResponse = await axios.post("auth/login", loginDetails);
      const { access_token, refresh_token } = loginResponse.data.data;
      Cookies.set("access_token", access_token, {
        expires: 1,
        //secure:true,
        sameSite: "Strict",
        path: "/",
      });
      Cookies.set("refresh_token", refresh_token, {
        expires: 7,
        //secure:true,
        sameSite: "Strict",
        path: "/",
      });
      navigate("/");
    } catch (error) {
      handleError("Error in Logging Learner");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Signup form
  const submitSignUpForm = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!isValidate()) return;
      const payload = {
        ...learnerDetails, // Spread learner details
        isLearner: true,
        profileImg: profileImg,
        city: city.name,
        state: state.name,
      };
      const response = await axios.post("users", payload);
      const userData = response.data.data;
      const userId = userData.id;
      localStorage.setItem("userId", userId);
      localStorage.setItem("isLearner", userData.isLearner);

      const learnerResponse = await axios.post("items/Learner", {
        user_id: userId,
      });
      const learnerData = learnerResponse.data.data;
      localStorage.setItem("LearnerId", learnerData.id);
      await learnerLogin();
      handleSuccess("User Registered Successfully!!");
    } catch (error) {
      handleError("Error in Registering User");
    } finally {
      setIsLoading(false);
    }
  };

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
 
  useEffect(()=>{
    if(localStorage.getItem("isLearner") !== null) navigate("/")
    else if(localStorage.getItem("isInstructor") !== null) navigate("/instructorpage")
  else if (localStorage.getItem("isAdmin") !== null) navigate("/admindashboard")
  else if (localStorage.getItem("isEmployee") !== null) navigate("/admindashboard")
  },[])

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundimg})` }}
    >
      <div className="bg-[#FFFFFF] py-8 px-10 rounded-lg shadow-lg w-[550px]">
        {/* close button */}
        <div className="flex justify-end">
          <Link to="/rolesignup">
            <IoMdClose className="h-5 w-5 text-gray-500" />
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        <form onSubmit={submitSignUpForm} className="overflow-scroll h-[450px]">
          <div className="flex justify-center">
            <div className="relative w-24 h-24 mb-5">
              {/* Profile Image or Placeholder */}
              <label
                // htmlFor="profile-pic-upload"
                className="relative w-full h-full rounded-full overflow-hidden cursor-pointer"
              >
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-full">
                    <FaCamera className="text-gray-500" size={24} />
                  </div>
                )}
              </label>

              {/* Edit Icon */}
              <div
                onClick={toggleEditOptions}
                className="absolute bottom-1 right-3 bg-gray-200 p-1 rounded-full cursor-pointer shadow-md hover:bg-gray-300 h-5 w-5 flex items-center"
              >
                <MdEdit className="text-gray-600" />
              </div>
              {/* Edit Options Dropdown */}
              {showEditOptions && (
                <div className="absolute left-20 bottom-3 transform translate-y-full mt-2 bg-white border border-gray-300 rounded shadow-lg p-1 w-40">
                  {!profileImg ? (
                    <button
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                      onClick={() =>
                        document.getElementById("profile-pic-upload").click()
                      }
                    >
                      Upload Image
                    </button>
                  ) : (
                    <>
                      <button
                        className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                        onClick={() =>
                          document.getElementById("profile-pic-upload").click()
                        }
                      >
                        Upload Other Image
                      </button>
                      <button
                        className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-500 text-sm"
                        onClick={handleRemoveImage}
                      >
                        Remove Image
                      </button>
                    </>
                  )}
                </div>
              )}
              {/* Hidden File Input */}
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <Modal
            className="w-full h-full overflow-scroll"
            show={showModal}
            onClose={closeModal}
          >
            <ImageUploader
              image={profileImg}
              handleUploadImage={handleUploadImage}
              filename="cropped_image.jpg"
              onCropped={handleCroppedImage}
              aspectRatio={16 / 9} // Change this to 1 for square, 16/9 for landscape, or 9/16 for portrait
            />
          </Modal>

          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 gap-3">
            {/* First name */}
            <div className="">
              <label className="block text-sm text-[#666666] ">
                First Name  <span className="text-red-500"> *</span>
              </label>
              <input
                type="text"
                name="first_name"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none"
                placeholder="Enter your name"
                value={learnerDetails.first_name}
                onChange={handleInputFieldChange}
              />
            </div>
            {/* Last name */}
            <div className="">
              <label className="block text-sm text-[#666666] ">Last Name <span className="text-red-500"> *</span></label>
              <input
                type="text"
                name="last_name"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none"
                placeholder="Enter your name"
                value={learnerDetails.last_name}
                onChange={handleInputFieldChange}
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm text-[#666666] ">Email  <span className="text-red-500"> *</span></label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                name="email"
                value={learnerDetails.email}
                onChange={handleInputFieldChange}
              />
              {errors.email && (
                <p className="text-sm text-red-500 ml-1">{errors.email}</p>
              )}
            </div>
            {/* Mobile Number */}
            <div>
              <label className="block text-sm text-[#666666] ">
                Mobile Number  <span className="text-red-500"> *</span>
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                name="phoneNumber"
                value={learnerDetails.phoneNumber}
                onChange={handleInputFieldChange}
                pattern="[0-9]{10}"
                maxLength="10"
              />
              {errors.phone_number && (
                <p className="text-sm text-red-500 ml-1">
                  {errors.phone_number}
                </p>
              )}
            </div>
            {/* Date of birth */}
            <div className="">
              <label className="block text-sm text-[#666666] ">
                Date of Birth{" "}  <span className="text-red-500"> *</span>
              </label>
              <input
                type="date"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                name="date_of_birth"
                value={learnerDetails.date_of_birth}
                onChange={handleInputFieldChange}
              ></input>
              {errors.date_of_birth && (
                <p className="text-sm text-red-500 ml-1">
                  {errors.date_of_birth}
                </p>
              )}
            </div>
            {/* gender */}
            <div>
              <label className="block text-sm text-[#666666] ">Gender  <span className="text-red-500"> *</span></label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                name="gender"
                value={learnerDetails.gender}
                onChange={handleInputFieldChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-sm text-red-500 ml-1">{errors.gender}</p>
              )}
            </div>

            {/* country */}
            <div>
              <label className="block text-sm text-[#666666]">Country  <span className="text-red-500"> *</span></label>
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
              <label className="block text-sm text-[#666666]">State  <span className="text-red-500"> *</span></label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                name="state"
                value={state?.isoCode || ""}
                onChange={(e) =>
                  setState(stateData.find((s) => s.isoCode === e.target.value))
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
              <label className="block text-sm text-[#666666]">City  <span className="text-red-500"> *</span></label>
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
              <label className="block text-sm text-[#666666] ">Pin code  <span className="text-red-500"> *</span></label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
                name="pincode"
                placeholder="Pincode"
                value={learnerDetails.pincode}
                onChange={handleInputFieldChange}
              />
              {errors.pincode && (
                <p className="text-sm text-red-500 ml-1">{errors.pincode}</p>
              )}
            </div>
            {/* Locality */}
            <div>
              <label className="block text-sm text-[#666666] ">
                Locality (Optional)
              </label>
              <input
                type="text"
                placeholder=""
                name="locality"
                value={learnerDetails.locality}
                onChange={handleInputFieldChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>
          {/* password field */}
          <div className="relative my-3">
            <label className="block text-sm text-[#666666]">Password  <span className="text-red-500"> *</span></label>
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
              value={learnerDetails.password}
              onChange={handleInputFieldChange}
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none"
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
                  - {rules}
                </li>
              ))}
            </ul>
          </div>
          {/* confirm password field  */}
          <div className="mb-6 relative">
            <label
              className="block text-sm text-[#666666]"
              htmlFor="confirmPassword"
            >
              Confirm Password{" "}  <span className="text-red-500"> *</span>
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
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 ml-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Signup button */}
          <button
            type="submit"
            className={`w-full p-2 text-white py-2 rounded-full transition-all ${
              isFormValid
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            Sign Up
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LearnerSignUp;
