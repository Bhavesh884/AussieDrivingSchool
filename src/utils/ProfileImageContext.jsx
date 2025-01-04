import React, { createContext, useState, useContext } from "react";

const ProfileImageContext = createContext();

export const ProfileImageProvider = ({ children }) => {
  const [instructorProfileImg, setInstructorProfileImg] = useState(null);
  const [learnerProfileImg, setLearnerProfileImg] = useState(null);
  const [employeeProfileImg, setEmployeeProfileImg] = useState(null);
  const [empPermissions, setEmpPermissions] = useState(null);
 
  return (
    <ProfileImageContext.Provider value={{ instructorProfileImg, setInstructorProfileImg,learnerProfileImg,setLearnerProfileImg,empPermissions,setEmpPermissions,employeeProfileImg,setEmployeeProfileImg}}>
      {children}
    </ProfileImageContext.Provider>
  );
};

export const useProfileImage = () => useContext(ProfileImageContext);
