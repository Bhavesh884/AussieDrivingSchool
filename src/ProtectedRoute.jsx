import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { handleError } from "./utils/Toastify";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const isInstructor = localStorage.getItem("isInstructor");
  const isLearner = localStorage.getItem("isLearner");
  const isAdmin = localStorage.getItem("isAdmin");
  const isEmployee = localStorage.getItem("isEmployee");

  const checkRoute = () => {
    if (isLearner !== null) return <Navigate to="/" />;
    else if (isInstructor !== null) return <Navigate to="/instructorpage" />;
    else if (isAdmin !== null) return <Navigate to="/admindashboard" />;
    else if (isEmployee !== null) return <Navigate to="/admindashboard" />;
  };

  // if (location.pathname === "/admindashboard") {
  //   return checkRoute();
  // } else
   if (
    location.pathname === "/instructorpage" ||
    location.pathname === "instructordashboard"
  ) {
   // checkRoute();
   if (!localStorage.getItem("isInstructor")) {
    return <Navigate to="/login" />;
  }
  }
  
  else if (location.pathname === "/learnerbookings") {
    if (!localStorage.getItem("LearnerId")) {
      return <Navigate to="/login" />;
    }
  } else if (location.pathname === "/learnerprofile") {
    if (!localStorage.getItem("LearnerId")) {
      return <Navigate to="/login" />;
    }
  }

  return children;
};

export default ProtectedRoute;
