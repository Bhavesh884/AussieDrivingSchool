import React, { useState } from "react";
import backgroundimg from "../../assets/Images/background.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "../../axios";
import { useRef } from "react";
import { handleError } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { useLoading } from "../../LoadingContext";
import ReactModal from "react-modal";
import { useEffect } from "react";

const LoginModal = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [queryEmail, setQueryEmail] = useState("");
  const [queryDetails, setQueryDetails] = useState();
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);
  const [errors, setErrors] = useState({
    email: "", // Error for email
    password: "", // Error for password
    login: "", // Error for login
  });
  const [acceptEmailModal, setAcceptEmailModal] = useState(false);
  const navigate = useNavigate();

  const isInstructor = localStorage.getItem("isInstructor");
  const isLearner = localStorage.getItem("isLearner");
  const isAdmin = localStorage.getItem("isAdmin");
  const isEmployee = localStorage.getItem("isEmployee");

  const handleEmailSubmit = async () => {
    try {
      const response = await axios(
        `items/queries?filter[status]=Rejected&&filter[email]=${queryEmail}&&fields=*,vehicle.*`
      );
      const queryData = response.data.data;
      //if data exists then navigate to visitor form
      if (queryData.length > 0) {
        setQueryDetails(queryData[0]);
        navigate("/visitorform", { state: { queryDetails: queryData[0] } });
      } else {
        handleError("Can't Proceed. No Query Found for this Email");
      }
    } catch (error) {}
    // setAcceptEmailModal(false);
  };

  //email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const { setIsLoading } = useLoading();
  const instructorData = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await axios(
        `items/Instructor?filter[user_id][_eq]=${userId}&&fields=*,vehicle.*,user_id.*`
      );
      localStorage.setItem("instructorId", response.data.data[0].id);
    } catch (error) {
      console.log("erors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const learnerData = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await axios(
        `items/Learner?filter[user_id][_eq]=${userId}&&fields=*,user_id.*`
      );
      localStorage.setItem("LearnerId", response.data.data[0].id);
    } catch (error) {
      console.log("errors:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const employeeData = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await axios(
        `items/Employee?filter[user][_eq]=${userId}&&fields=*,user.*`
      );
      localStorage.setItem("employeeId", response.data.data[0].id);
    } catch (error) {
      console.log("errors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // submit login details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", login: "" });

    if (!validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      return;
    }
    try {
      setIsLoading(true);
      const loginResponse = await axios.post("auth/login", { email, password });
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
      const userResponse = await axios.get("users/me", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const user = userResponse.data.data; // Get user details

      if (user.isInstructor === "true") {
        localStorage.setItem("isInstructor", user.isInstructor);
        localStorage.setItem("userId", user.id);
        await instructorData();
        navigate("/instructordashboard");
      } else if (user.isAdmin === "true") {
        navigate("/admindashboard");
        localStorage.setItem("userId", user.id);
        localStorage.setItem("isAdmin", user.isAdmin);
      } else if (user.isLearner === "true") {
        localStorage.setItem("userId", user.id);
        localStorage.setItem("isLearner", user.isLearner);
        await learnerData();
        navigate("/");
      } else if (user.isEmployee === "true") {
        localStorage.setItem("userId", user.id);
        localStorage.setItem("isEmployee", user.isEmployee);
        await employeeData();
        navigate("/admindashboard");
      } else {
        handleError("User is neither an Admin nor an Instructor");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // setErrors((prev) => ({
        //   ...prev,
        //   login: "Invalid email or password!!",
        // }));
        handleError("This user is not verified");
      } else {
        setErrors((prev) => ({
          ...prev,
          login: "An unexpected error occurred!! Please try again",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleSubmit();
  };

  const handleEmailKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      passwordRef.current.focus();
    }
  };

  // handle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";
  const enableQueryEmailBtn = queryEmail.trim() !== "";

  useEffect(() => {
    if (isLearner !== null) navigate("/");
    else if (isInstructor !== null) navigate("/instructorpage");
    else if (isAdmin !== null) navigate("/admindashboard");
    else if (isEmployee !== null) navigate("/admindashboard");
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center px-[5vw]"
      style={{ backgroundImage: `url(${backgroundimg})` }}
    >
      <div className="bg-[#FFFFFF] p-5 rounded-xl shadow-lg w-full xs:w-[500px]">
        {/* close button */}
        <div className="flex justify-end">
          <Link to="/">
            <IoMdClose className="h-5 w-5 text-gray-500" />
          </Link>
        </div>
        <h2 className="text-xl font-semibold text-center text-[#333333] mb-4 mt-10 sm:mt-4">
          Log in
        </h2>
        <form className="xs:px-5 sm:px-14" onSubmit={handleSubmit}>
          {/* Email field */}
          {errors.login && (
            <p className="font-medium text-red-600 text-center mb-3">
              {errors.login}
            </p>
          )}
          <div className="">
            <label className="block text-sm text-[#666666]">
              Your Email <span className="text-red-500"> *</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleEmailKeyDown}
              className={`mt-1 p-2 w-full border border-[#66666659] rounded-lg focus:outline-none ${errors.email &&
                "border-red-300"}`}
            />
            {errors.email && (
              <p className="text-sm text-red-400 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Password field*/}
          <div className="relative mt-3">
            <label className="block text-sm text-[#666666]">
              Your Password <span className="text-red-500"> *</span>
            </label>
            <button
              type="button"
              className="absolute right-0 top-1 text-gray-500 "
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              ref={passwordRef}
              className="mt-1 p-2 w-full border border-[#66666659] rounded-md focus:outline-none"
            />
          </div>
          {/* forgot password */}
          <div className="text-right mb-5">
            <Link
              to="/forgotpassword"
              className="underline text-[#111111] text-sm"
            >
              Forgot password?
            </Link>
          </div>

          {/* login button */}
          <button
            type="submit"
            className={`w-full p-2 text-white py-2 rounded-full transition-all ${
              isFormValid
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            Log in
          </button>
          {/* signup text */}
          <div className="text-right text-sm mt-5">
            <Link to="/rolesignup" className="underline text-[#111111]">
              Don’t have an account?
            </Link>
            <Link to="/rolesignup" className="text-secondary-400 font-semibold">
              Sign Up
            </Link>
          </div>
        </form>

        <div className="mb-16 my-6 xs:px-5 sm:px-14 sm:mb-12">
          {/* OR */}
          <div className="flex items-center mb-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          <button
            className="bg-white border border-gray-400 hover:bg-gray-200 transition-all shrink-0 w-full text-gray-700 p-2 rounded-full flex gap-2 items-center justify-center"
            onClick={() => setAcceptEmailModal(true)}
          >
            Resubmit Your Query
          </button>
        </div>
      </div>
      {/* Email Modal */}
      <ReactModal
        isOpen={acceptEmailModal}
        onRequestClose={() => {
          setAcceptEmailModal(false);
          setQueryEmail("");
        }}
        className="bg-white rounded-lg shadow-lg p-6 w-96"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <div className="relative">
          <IoMdClose
            className="absolute top-0 right-0 text-gray-500 hover:cursor-pointer"
            size={20}
            onClick={() => {
              setAcceptEmailModal(false);
              setQueryEmail("");
            }}
          />

          {/* Modal Content */}
          <h2 className="text-lg font-semibold mb-4">Enter Your Email</h2>
          <p className="text-sm text-gray-600 mb-4">
            Please provide your email address to continue.
          </p>
          <input
            type="email"
            value={queryEmail}
            onChange={(e) => setQueryEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none"
            placeholder="Enter your email"
          />
          <button
            onClick={handleEmailSubmit}
            className={` ${
              enableQueryEmailBtn
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            } text-white px-4 py-2 rounded w-full`}
            disabled={!enableQueryEmailBtn}
          >
            Submit
          </button>
        </div>
      </ReactModal>
      <ToastContainer />
    </div>
  );
};

export default LoginModal;
