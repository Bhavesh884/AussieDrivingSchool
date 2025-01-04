import React, { useState, useEffect } from "react";
import backgroundimg from "../../assets/Images/background.png";
import { FcGoogle } from "react-icons/fc";
import { MdFacebook } from "react-icons/md";
import { GoArrowLeft } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const isEmailValid = email.trim() !== "";
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    email: "",
    submitPassword: "",
  });

  // validation
  const validation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address.",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };
  // submit email
  const handleSubmit = async () => {
    if (!validation()) {
      return;
    }
    navigate("/verifycode");
  };

  useEffect(() => {
    if (localStorage.getItem("isLearner") !== null) navigate("/");
    else if (localStorage.getItem("isInstructor") !== null)
      navigate("/instructorpage");
    else if (localStorage.getItem("isAdmin") !== null)
      navigate("/admindashboard");
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center px-[5vw]"
      style={{ backgroundImage: `url(${backgroundimg})` }}
    >
      <div className="bg-[#FFFFFF] p-5 rounded-xl shadow-lg w-full xs:w-[500px]">
        {/* back arrow */}
        <div className="">
          <Link to="/login">
            <GoArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
        </div>
        <div className="px-5 my-16 sm:px-14 sm:mb-12 sm:mt-5">
          {/* title */}
          <h2 className="text-xl font-semibold text-[#333333] text-center mb-6">
            Forgot your Password?
          </h2>
          {/* Instructional text */}
          <p className="text-[#333333] font-Avenir text-sm text-center mb-6">
            Don't worry, happens to all of us. Enter your email below to recover
            your password.
          </p>
          {/* Email input */}
          <div className="mb-4">
            <label className="block text-sm font-Poppins  text-[#666666]">
              Your Email <span className="text-red-500"> *</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`mt-1 w-full p-2 border border-gray-300 rounded-lg focus:outline-none ${errors.email &&
                "border-red-300"}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-sm text-red-400 ml-1">{errors.email}</p>
            )}
          </div>
          {/* Submit Button */}

          <button
            onClick={handleSubmit}
            className={`w-full p-2 text-white py-2 rounded-full transition-all  ${
              isEmailValid
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isEmailValid}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
