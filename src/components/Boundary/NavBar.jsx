import React, { useState, useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";
import {
  IoMdBookmarks,
  IoMdClose,
  IoMdInformationCircleOutline,
  IoMdLogOut,
  IoMdNotificationsOutline,
} from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdLogout } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminNavBar from "./AdminNavBar";
import axios from "../../axios";
import Cookies from "js-cookie";
import { generateAccessToken } from "../../utils/generateAccessToken";
import { useProfileImage } from "../../utils/ProfileImageContext";
import Notifications from "./Notifications";
import Modal from "react-modal";
import {
  IoPersonCircleSharp,
  IoPricetags,
  IoSpeedometer,
} from "react-icons/io5";

const LoginButton = () => {
  return (
    <div>
      <Link to="/login">
        <button className="hidden lg:block bg-[#fec720] hover:bg-yellow-400 rounded-full px-7 py-2 font-semibold text-lg">
          Login
        </button>
      </Link>
    </div>
  );
};

const NavBar = ({ instructorTab, setInstructorTab, adminTab, setAdminTab }) => {
  const [sideBar, setSideBar] = useState(false);
  const [instructorInfo, setInstructorInfo] = useState([]);
  const [learnerInfo, setLearnerInfo] = useState([]);
  const [notificationModal, setNotificationModal] = useState(false);
  const [isInstructorDropdownOpen, setIsInstructorDropdownOpen] = useState(
    false
  );
  const [isLearnerDropdownOpen, setIsLearnerDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    instructorProfileImg,
    setInstructorProfileImg,
    learnerProfileImg,
    setLearnerProfileImg,
  } = useProfileImage();

  //instructor profile dropdown
  const handleInstructorDropdown = () => {
    setIsInstructorDropdownOpen((prev) => !prev);
  };
  const navigateToDashboard = () => {
    navigate("/instructordashboard");
    setIsInstructorDropdownOpen(false);
  };

  //handle logout
  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setSideBar(false);
    if (location.pathname === "/instructorpage") {
      setIsInstructorDropdownOpen(false);
      setInstructorInfo(null);
    } else if (
      location.pathname === "/learnerpage" ||
      location.pathname === "/" ||
      location.pathname === "/learnerprofile"
    ) {
      setIsLearnerDropdownOpen(false);
      setLearnerInfo(null);
      navigate("/");
    }
  };
  //get instructor data
  const getInstructorData = async () => {
    try {
      const instructorId = localStorage.getItem("instructorId");
      const accessToken = Cookies.get("access_token");
      const response = await axios(
        `items/Instructor?filter[id][_eq]=${instructorId}&&fields=*,user_id.*`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const instructorData = response.data.data;
      setInstructorInfo(instructorData);
      setInstructorProfileImg(instructorData[0].user_id.profileImg);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Attempting to refresh...");
        await generateAccessToken(); // Refresh token
        await getInstructorData(); // Retry fetching learner data
      } else {
        console.error("Error fetching instructor data:", error);
      }
    }
  };
  //get learner data
  const getLearnerData = async () => {
    try {
      const learnerId = localStorage.getItem("LearnerId");
      const accessToken = Cookies.get("access_token");
      const response = await axios(
        `items/Learner?filter[id][_eq]=${learnerId}&fields=*,user_id.*`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const learnerData = response.data.data;
      setLearnerInfo(learnerData);
      setLearnerProfileImg(learnerData[0].user_id.profileImg);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token expired. Attempting to refresh...");
        await generateAccessToken(); // Refresh token
        await getLearnerData(); // Retry fetching learner data
      } else {
        console.error("Error fetching learner data:", error);
      }
    }
  };

  const fetchData = async () => {
    try {
      if (localStorage.getItem("isLearner")) {
        getLearnerData();
      } else if (localStorage.getItem("isInstructor")) {
        getInstructorData();
      }
    } catch (error) {
      console.error("Error loading data:", error.message);
    }
  };

  const checkTokensAndFetchData = async () => {
    const accessToken = Cookies.get("access_token");
    const refreshToken = Cookies.get("refresh_token");
    if (!accessToken && refreshToken) {
      generateAccessToken();
    }
    fetchData(); // Fetch data after ensuring token validity
  };
  useEffect(() => {
    checkTokensAndFetchData();
    // const handleClickOutside = (event) => {
    //   if (!event.target.closest(".dropdown")) {
    //     setIsInstructorDropdownOpen(true);
    //   }
    // };
    // document.addEventListener("click", handleClickOutside);
    // return () => {
    //   document.removeEventListener("click", handleClickOutside);
    // };
  }, []);

  if (
    location.pathname === "/admindashboard" ||
    location.pathname === "/instructordashboard"
  ) {
    return (
      <AdminNavBar
        instructorTab={instructorTab}
        setInstructorTab={setInstructorTab}
        adminTab={adminTab}
        setAdminTab={setAdminTab}
      />
    );
  }

  console.log("instructor info :", instructorInfo);
  console.log("learner info :", learnerInfo);

  return (
    <nav className="h-[100px] bg-white">
      <div className="flex justify-between items-center h-full  px-6 md:px-12 lg:px-16">
        <div className="text-[#001C51] text-3xl font-extrabold">
          <Link
            to={`${
              localStorage.getItem("instructorId") !== null
                ? "/instructorpage"
                : "/"
            }`}
          >
            ADS
          </Link>
        </div>
        <div className="hidden lg:flex gap-10 text-[#1E0E62]">
          <div
            className={`${
              location.pathname === "/instructorpage" ||
              location.pathname === "/getpackages"
                ? ""
                : "hidden"
            }`}
          >
            <Link
              to={
                localStorage.getItem("isInstructor") ? "/getpackages" : "/login"
              }
            >
              Pricing
            </Link>
          </div>
          {(location.pathname === "/" ||
            location.pathname === "/learnerpage" ||
            location.pathname === "/learnerprofile") && (
            <div>
              {(() => {
                const profilePath = localStorage.getItem("isLearner")
                  ? "/learnerprofile"
                  : "/login";
                return (
                  <>
                    <Link to={profilePath}>My Profile</Link>
                    <Link
                      to={profilePath}
                      className="ml-10"
                      state={{ scrollToBooking: true }}
                    >
                      My Bookings
                    </Link>
                  </>
                );
              })()}
            </div>
          )}
          <div>
            <a href="#">About</a>
          </div>
        </div>

        {(location.pathname === "/instructorpage" ||
          location.pathname === "/getpackages") &&
          (localStorage.getItem("isInstructor") ? (
            <div className="hidden lg:flex gap-3 items-center">
              <p className="font-semibold">
                {instructorInfo[0]?.user_id?.first_name}{" "}
                {instructorInfo[0]?.user_id?.last_name}
              </p>
              <img
                src={instructorProfileImg}
                alt={instructorInfo[0]?.user_id?.first_name}
                className="w-10 h-10 rounded-full object-cover object-center hover:cursor-pointer"
                onClick={handleInstructorDropdown}
              />
              {isInstructorDropdownOpen && (
                <div className="absolute right-6 mt-32 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <ul className="flex flex-col text-sm text-gray-700">
                    <li>
                      <button
                        className="w-full text-center px-4 py-2 hover:bg-gray-100"
                        onClick={navigateToDashboard}
                      >
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-center px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <LoginButton />
          ))}

        {(location.pathname === "/learnerpage" ||
          location.pathname === "/" ||
          location.pathname === "/learnerprofile") &&
          (localStorage.getItem("isLearner") ? (
            loading ? (
              <img
                src="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
                className="hidden lg:block w-12 h-12"
              ></img>
            ) : (
              <div className="flex gap-3 items-center">
                <IoMdNotificationsOutline
                  className="h-6 w-6 shrink-0 hidden lg:block hover:cursor-pointer"
                  onClick={() => setNotificationModal(true)}
                />
                <Modal
                  isOpen={notificationModal}
                  onRequestClose={() => setNotificationModal(false)}
                  overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[999999999999999]"
                  className="bg-[#FFFFFF] rounded-xl w-11/12 md:w-1/2 lg:w-1/3 shadow-lg outline-none z-[999999999999999]"
                >
                  {
                    <Notifications
                      setNotificationModal={setNotificationModal}
                    />
                  }
                </Modal>
                <div className="hidden lg:flex gap-3 items-center">
                  <p className="font-semibold">
                    {learnerInfo[0]?.user_id?.first_name}{" "}
                    {learnerInfo[0]?.user_id?.last_name}
                  </p>
                  <img
                    src={learnerProfileImg}
                    alt={learnerInfo[0]?.user_id?.first_name}
                    className="w-10 h-10 rounded-full object-cover object-center hover:cursor-pointer"
                    onClick={() =>
                      setIsLearnerDropdownOpen(!isLearnerDropdownOpen)
                    }
                  />
                  {isLearnerDropdownOpen && (
                    <div className="absolute right-6 mt-28 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <ul className="flex flex-col text-sm text-gray-700">
                        <li>
                          <Link to="/learnerprofile">
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => setIsLearnerDropdownOpen(false)}
                            >
                              My Profile
                            </button>
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            <LoginButton />
          ))}

        <div className="block lg:hidden">
          <GiHamburgerMenu
            onClick={() => (sideBar ? setSideBar(false) : setSideBar(true))}
            className="h-8 w-8 hover:cursor-pointer"
          />
        </div>
      </div>

      {/* Side bar */}
      {sideBar && (
        <div className="h-full w-[300px] fixed right-0 top-0 bg-white shadow-lg p-6 lg:hidden animate-slide-in">
          <IoMdClose
            className="h-6 w-6 text-gray-700 hover:text-red-500 transition-transform transform hover:scale-110 cursor-pointer"
            onClick={() => setSideBar(false)}
          />

          <div className="flex flex-col items-center space-y-4 mt-6">
            {(location.pathname === "/learnerpage" ||
              location.pathname === "/" ||
              location.pathname === "/learnerprofile") &&
              (localStorage.getItem("isLearner") ? (
                <div className="flex flex-col items-center">
                  <img
                    src={learnerProfileImg}
                    alt={learnerInfo[0]?.user_id?.first_name}
                    className="w-16 h-16 rounded-full border-2 border-[#FFC10C] object-cover hover:shadow-md cursor-pointer"
                  />
                  <p className="mt-2 text-lg font-semibold text-gray-800">
                    {learnerInfo[0]?.user_id?.first_name}{" "}
                    {learnerInfo[0]?.user_id?.last_name}
                  </p>
                </div>
              ) : (
                <Link to="/login">
                  <button className="bg-[#FFC10C] hover:bg-yellow-500 transition-colors duration-300 rounded-full px-8 py-3 mt-8 font-semibold text-lg text-white shadow-lg">
                    Login
                  </button>
                </Link>
              ))}

            {(location.pathname === "/instructorpage" ||
              location.pathname === "/getpackages") &&
              (localStorage.getItem("isInstructor") ? (
                <div className="flex flex-col items-center">
                  <img
                    src={instructorProfileImg}
                    alt={instructorInfo[0]?.user_id?.first_name}
                    className="w-16 h-16 rounded-full border-2 border-[#FFC10C] object-cover hover:shadow-md cursor-pointer"
                  />
                  <p className="mt-2 text-lg font-semibold text-gray-800">
                    {instructorInfo[0]?.user_id?.first_name}{" "}
                    {instructorInfo[0]?.user_id?.last_name}
                  </p>
                </div>
              ) : (
                <Link to="/login">
                  <button className="bg-[#FFC10C] hover:bg-yellow-500 transition-colors duration-300 rounded-full px-8 py-3 mt-8 font-semibold text-lg text-white shadow-lg">
                    Login
                  </button>
                </Link>
              ))}

            <nav className="w-full flex flex-col gap-6 mt-10 font-medium text-gray-700">
              {(location.pathname === "/" ||
                location.pathname === "/learnerprofile") && (
                <>
                  <Link
                    to={
                      localStorage.getItem("isLearner")
                        ? "/learnerprofile"
                        : "/login"
                    }
                    onClick={() => setSideBar(false)}
                    className="flex items-center gap-3 hover:text-blue-500 transition-colors duration-300"
                  >
                    <IoPersonCircleSharp className="w-6 h-6" /> My Profile
                  </Link>
                  <div
                    onClick={() => setNotificationModal(true)}
                    className="flex items-center gap-3 cursor-pointer hover:text-blue-500 transition-colors duration-300"
                  >
                    <IoMdNotificationsOutline className="w-6 h-6" />{" "}
                    Notifications
                  </div>
                  <Link
                    to={
                      localStorage.getItem("isLearner")
                        ? "/learnerprofile"
                        : "/login"
                    }
                    onClick={() => setSideBar(false)}
                    state={{ scrollToBooking: true }}
                    className="flex items-center gap-3 hover:text-blue-500 transition-colors duration-300"
                  >
                    <IoMdBookmarks className="w-6 h-6" /> My Bookings
                  </Link>
                </>
              )}

              {(location.pathname === "/instructorpage" ||
                location.pathname === "/getpackages") && (
                <>
                  <Link
                    to={
                      localStorage.getItem("isInstructor")
                        ? "/instructordashboard"
                        : "/login"
                    }
                    onClick={() => setSideBar(false)}
                    className="flex items-center gap-3 hover:text-blue-500 transition-colors duration-300"
                  >
                    <IoSpeedometer className="w-6 h-6" /> Dashboard
                  </Link>
                  <Link
                    to={
                      localStorage.getItem("isInstructor")
                        ? "/getpackages"
                        : "/login"
                    }
                    onClick={() => setSideBar(false)}
                    className="flex items-center gap-3 hover:text-blue-500 transition-colors duration-300"
                  >
                    <IoPricetags className="w-6 h-6" /> Pricing
                  </Link>
                </>
              )}

              <Link
                to="#"
                className="flex items-center gap-3 hover:text-blue-500 transition-colors duration-300"
              >
                <IoMdInformationCircleOutline className="w-6 h-6" /> About
              </Link>

              {(localStorage.getItem("isLearner") ||
                localStorage.getItem("isInstructor")) && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-red-500 hover:text-red-700 transition-colors duration-300"
                >
                  <IoMdLogOut className="w-6 h-6" /> Logout
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};
export default NavBar;
