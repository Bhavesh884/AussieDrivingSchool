import React from "react";
import { Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";

const SignUp = () => {
  useEffect(()=>{
    if(localStorage.getItem("isLearner") !== null) navigate("/")
    else if(localStorage.getItem("isInstructor") !== null) navigate("/instructorpage")
  else if (localStorage.getItem("isAdmin") !== null) navigate("/admindashboard")
  },[])
  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center px-[10vw] bg-[url('https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] ">
      <div className="bg-[#0000]/60 rounded-xl shadow-lg p-10 w-full xs:w-[550px]  h-[550px] relative flex flex-col items-center justify-center px-10 sm:px-14 text-white border border-slate-200 ">
        {/* Close Button */}
        <div className="absolute top-4 right-4 border bg-black/60 border-slate-200 p-1 rounded-md">
          <Link to="/login">
            <IoMdClose className="h-5 w-5 text-white font-bold" />
          </Link>
        </div>

        {/* Main Content */}
        <div className="">
          <h1 className="text-4xl font-semibold text-center mb-8">
            Aussie Driving SChool
          </h1>
          <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
          <p className="text-white text-center mt-2">
            Do you want to sign up as a learner or instructor?
          </p>

          {/* Buttons */}
          <div className="flex justify-center mt-6 gap-4">
            <Link to="/learnersignup">
              <button className="bg-blue-600 text-white px-10 py-2 rounded-full hover:bg-blue-700 transition">
                Learner
              </button>
            </Link>
            <Link to="/visitorform">
              <button className="bg-yellow-400 text-white px-10 py-2 rounded-full hover:bg-yellow-500 transition">
                Instructor
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
