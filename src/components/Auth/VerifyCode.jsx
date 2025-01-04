import React, { useState, useEffect } from "react";
import backgroundimg from "../../assets/Images/background.png";
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";

function VerifyCode() {
  const [code, setCode] = useState("");

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleVerify = () => {
    console.log("Verifying code: ", code);
  };

  const isCodeValid = code.trim() !== "";
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
        <div className="flex justify-start">
          <Link to="/forgotpassword">
            <GoArrowLeft className="h-5 w-5 text-gray-500" />
          </Link>
        </div>
        <div className="px-5 py-24 sm:px-14">
          <h2 className="text-xl font-semibold font-Poppins text-center text-[#333333]">
            Verify Code
          </h2>
          <p className="text-center text-[#333333] font-Avenir text-sm my-4">
            An authentication code has been sent to your email.
          </p>

          {/* code field */}
          <div className="mt-5">
            <label className="block text-sm font-Poppins text-[#666666]">
              Enter code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter code"
              className="mt-1 w-full p-2 border-gray-300 border focus:outline-none rounded-md  "
            />
          </div>
          {/* Resend code */}
          <div className="my-3">
            <span className="text-sm text-[#666666] hover:text-indigo-700">
              Didn't receive a code?
            </span>
            <span className="underline text-[#000000] text-sm font-semibold">
              {" "}
              Resend
            </span>
          </div>
          {/* verify button */}
          <Link to="/setpassword">
            <button
              onClick={handleVerify}
              className={`w-full p-2 text-white py-2 rounded-full transition-all  ${
                isCodeValid
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isCodeValid}
            >
              Verify
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyCode;
