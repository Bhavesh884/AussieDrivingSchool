import React, { useState } from "react";
import backgroundimg from "../../assets/Images/background.png";
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { IoMdClose } from "react-icons/io";

const UpdatePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundimg})` }}>
      <div className="bg-[#FFFFFF] p-8 rounded-lg shadow-lg  w-[500px]">
        {/* close button */}
        <div className="flex justify-end">
          <IoMdClose className="h-5 w-5 text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-[#2B6BE7] text-center mb-4">
          Welcome Leslie!
        </h2>
        <p className="text-[#000000] text-center mb-6">
          Let’s get started by updating your password for secure access.
        </p>
        <form>
          {/* Current Password */}
          <div className="px-8 py-4">
            <div className="mb-2 ">
              <label className="block text-[#4C4C4C] text-sm mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none  "
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-3 text-gray-500 focus:outline-none"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-2">
              <label className="block text-[#4C4C4C] text-sm mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none  "
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-3 text-gray-500 focus:outline-none"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-2">
              <label className="block text-[#4C4C4C] text-sm mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none  "
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-3 text-gray-500 focus:outline-none"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>


            <p className="text-xs text-gray-500 mb-2">
              Make sure your password is at least 8 characters long, including a
              mix of letters, numbers, and symbols.
            </p>
            <button
              type="submit"
              className="w-full bg-[#2B6BE7] text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Update Password
            </button>
          </div>
        </form>

      </div>

    </div>

  );
};

export default UpdatePassword;