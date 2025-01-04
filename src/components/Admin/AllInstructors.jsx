import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { FaSearch, FaFilter, FaTh, FaBars, FaCaretDown } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { HiLocationMarker } from "react-icons/hi";
import { GoArrowLeft } from "react-icons/go";
import { FcFolder } from "react-icons/fc";
import axios from "../../axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { handleError, handleSuccess } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";
import { useLoading } from "../../LoadingContext";
import { Testimonials } from "../Learner/FindInstructors";
import { useProfileImage } from "../../utils/ProfileImageContext";
import { BookingDetailModal } from "./AllBookings";

export const BookingCard = ({ booking }) => {
  const [isBookingDetailModalOpen, setBookingDetailModalOpen] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState([]);
  const [lessonsTaken, setLessonsTaken] = useState("");
  const { setIsLoading } = useLoading();
  // function to fetch full booking details by id
  const viewBookingProfile = async (bookingId) => {
    try {
      setIsLoading(true);
      //API for fetching student detail by Id
      const response = await axios(
        `items/Booking?fields=*,package.Instructor.id,package.Instructor.user_id.*,package.lessons.*,package.lessons.Lessons_id.*,learner.user_id.*,package.*,Availibility.*&filter[id]=${bookingId}`
      );
      const Data = await response.data;
      setSelectedBookingDetails(Data.data);
      setBookingDetailModalOpen(true);

      const lessonsCompleted = await axios(
        `items/Lesson_Completed?filter[booking][_eq]=${bookingId}`
      );
      const lessontaken = lessonsCompleted.data.data;
      setLessonsTaken(lessontaken.length);
    } catch (error) {
      console.log("error in fetching details", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const { first_name, last_name, profileImg } = booking?.learner?.user_id;
  return (
    <div className="bg-white shadow-lg rounded-lg p-4  flex flex-col justify-between items-center border border-solid border-neutral-100 w-[350px] overflow-scroll">
      <div className="flex justify-center mb-4">
        <img
          className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover shrink-0"
          src={profileImg}
          alt="Learner Avatar"
        />
      </div>
      <h2 className="font-semibold text-center mb-5">{booking.id}</h2>
      <div className="w-full">
        <p className="font-semibold flex w-full gap-5 justify-between mb-2 text-gray-500 text-desk-b-3">
          <span className="text-wrap text-end">Learner:</span>
          <span className="font-normal text-black">
            {first_name} {last_name}
          </span>
        </p>
        <p className="font-semibold flex w-full justify-between shrink-0 mb-2 text-gray-500 text-desk-b-3">
          Date:{" "}
          <span className="font-normal shrink-0 text-black">
            {new Date(booking?.date_created).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </p>
        <p className="font-semibold flex w-full justify-between mb-2 text-gray-500 text-desk-b-3">
          Package Type:{" "}
          <span className="font-normal text-black">
            {booking?.package?.name}
          </span>
        </p>
        <p className="font-semibold flex w-full justify-between mb-2 text-gray-500 text-desk-b-3">
          Session Fee:{" "}
          <span className="font-normal text-black">
            ${booking?.package?.price}
          </span>
        </p>
      </div>

      <button
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full"
        onClick={() => viewBookingProfile(booking.id)}
      >
        View Details
      </button>
      <ReactModal
        isOpen={isBookingDetailModalOpen}
        onRequestClose={() => setBookingDetailModalOpen(false)}
        className="bg-white shadow-lg px-10 pt-5 w-full md:w-4/5 lg:w-8/12 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-20"
      >
        <BookingDetailModal
          setBookingDetailModalOpen={setBookingDetailModalOpen}
          selectedBookingDetails={selectedBookingDetails}
          lessonsTaken={lessonsTaken}
        />
      </ReactModal>
    </div>
  );
};

export const InstructorDetailModal = ({
  setModalInstructorDetailOpen,
  selectedInstructorDetails,
  instructorBookings,
  handleViewprofile,
}) => {
  const {
    first_name,
    last_name,
    phoneNumber,
    email,
    city,
    state,
    pincode,
    locality,
    date_of_birth,
    profileImg,
  } = selectedInstructorDetails[0]?.user_id;

  const [isBanModalOpen, setBanModalOpen] = useState(false);
  const [isUnbanModalOpen, setUnbanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [packages, setPackages] = useState([]);
  const { setIsLoading } = useLoading();
  const { empPermissions } = useProfileImage();

  const approvedVehicles = selectedInstructorDetails[0].vehicle.filter(
    (vehicle) => vehicle.is_vehicle_approved === "true"
  );

  const fetchAllPackages = async () => {
    try {
      const response = await axios(
        `/items/Packages?filter[Instructor][_eq]=${selectedInstructorDetails[0].id}&fields=*,lessons.*,lessons.Lessons_id.*`
      );
      setPackages(response.data.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    fetchAllPackages();
  }, []);

  const handleBanPermission = () => {
    if (empPermissions) {
      if (empPermissions.roles.User_Management.includes("Ban/Unban Account")) {
        setBanModalOpen(true);
      } else {
        handleError("You dont have permission to perform this action!!");
      }
    } else {
      setBanModalOpen(true);
    }
  };

  const handleUnBanPermission = () => {
    if (empPermissions) {
      if (empPermissions.roles.User_Management.includes("Ban/Unban Account")) {
        setUnbanModalOpen(true);
      } else {
        handleError("You dont have permission to perform this action!!");
      }
    } else {
      setUnbanModalOpen(true);
    }
  };
  // function to ban instructor account
  const banAccount = async (InstructorId) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`items/Instructor/${InstructorId}`, {
        is_ban: true,
        ban_reason: banReason,
      });
      handleSuccess("Account banned successfully.");
      setBanModalOpen(false);
      setBanReason("");
      handleViewprofile(InstructorId);
    } catch (error) {
      handleError("Error in Banning Account");
    } finally {
      setIsLoading(false);
    }
  };
  // function to unban instructor account
  const unbanAccount = async (InstructorId) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`items/Instructor/${InstructorId}`, {
        is_ban: false,
        ban_reason: "",
      });
      handleSuccess("Account unbanned successfully");
      setUnbanModalOpen(false);
      setBanReason("");
      handleViewprofile(InstructorId);
    } catch (error) {
      handleError("Error in Unbanning Account");
    } finally {
      setIsLoading(false);
    }
  };

  // open vehicle documents
  const openVehicleDocument = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      handleError("No Document Uploaded");
    }
  };

  // open additional documents
  const openAdditionalDocument = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      handleError("No Document Uploaded");
    }
  };

  //booking toggles

  const [currentBookingPage, setCurrentBookingPage] = useState(1);
  const bookingsPerPage = 3;

  const totalBookingPages = Math.ceil(
    instructorBookings.length / bookingsPerPage
  );
  const bookingCardstartIndex = (currentBookingPage - 1) * bookingsPerPage;

  // Handle the next and previous page toggles
  const nextBookingsPage = () => {
    if (currentBookingPage < totalBookingPages) {
      setCurrentBookingPage(currentBookingPage + 1);
    }
  };

  const prevBookingsPage = () => {
    if (currentBookingPage > 1) {
      setCurrentBookingPage(currentBookingPage - 1);
    }
  };

  // revenew graph data.....................
  const dataForYearRevenew = [
    { name: "Jan", totalRevenue: 20, netProfit: -10 },
    { name: "Feb", totalRevenue: 15, netProfit: -5 },
    { name: "Mar", totalRevenue: 22, netProfit: 0 },
    { name: "Apr", totalRevenue: 30, netProfit: 5 },
    { name: "May", totalRevenue: 40, netProfit: 10 },
    { name: "Jun", totalRevenue: 35, netProfit: 8 },
    { name: "Jul", totalRevenue: 50, netProfit: 20 },
    { name: "Aug", totalRevenue: 45, netProfit: 15 },
    { name: "Sep", totalRevenue: 55, netProfit: 22 },
    { name: "Oct", totalRevenue: 60, netProfit: 25 },
    { name: "Nov", totalRevenue: 58, netProfit: 24 },
    { name: "Dec", totalRevenue: 65, netProfit: 30 },
  ];

  const dataForMonthRevenew = [
    { name: "Week 1", totalRevenue: 10, netProfit: -5 },
    { name: "Week 2", totalRevenue: 15, netProfit: 0 },
    { name: "Week 3", totalRevenue: 18, netProfit: 3 },
    { name: "Week 4", totalRevenue: 22, netProfit: 5 },
  ];

  const dataForWeekRevenew = [
    { name: "Mon", totalRevenue: 2, netProfit: -1 },
    { name: "Tue", totalRevenue: 3, netProfit: 0 },
    { name: "Wed", totalRevenue: 5, netProfit: 1 },
    { name: "Thu", totalRevenue: 7, netProfit: 2 },
    { name: "Fri", totalRevenue: 10, netProfit: 5 },
    { name: "Sat", totalRevenue: 8, netProfit: 4 },
    { name: "Sun", totalRevenue: 9, netProfit: 4 },
  ];

  const overallDataRevenew = [
    { name: "2021", totalRevenue: 500, netProfit: 200 },
    { name: "2022", totalRevenue: 600, netProfit: 250 },
    { name: "2023", totalRevenue: 700, netProfit: 300 },
    { name: "2024", totalRevenue: 800, netProfit: 350 },
  ];
  const [selectedDataRevenew, setselectedDataRevenew] = useState(
    dataForYearRevenew
  );
  const [activeTimeframe, setActiveTimeframe] = useState("thisYear");

  const handleTimeframeChange = (event) => {
    const selectedTimeframe = event.target.value;
    setActiveTimeframe(selectedTimeframe);
    switch (selectedTimeframe) {
      case "thisWeek":
        setselectedDataRevenew(dataForWeekRevenew);
        break;
      case "thisMonth":
        setselectedDataRevenew(dataForMonthRevenew);
        break;
      case "thisYear":
        setselectedDataRevenew(dataForYearRevenew);
        break;
      case "overall":
        setselectedDataRevenew(overallDataRevenew);
        break;
      default:
        setselectedDataRevenew(dataForYearRevenew);
    }
  };

  // diversity graph-------------------------------

  const dataForYearForDiversity = [
    { name: "Jan", male: 30, female: 20 },
    { name: "Feb", male: 25, female: 15 },
    { name: "Mar", male: 35, female: 25 },
    { name: "Apr", male: 40, female: 30 },
    { name: "May", male: 28, female: 20 },
    { name: "Jun", male: 33, female: 22 },
    { name: "Jul", male: 40, female: 30 },
    { name: "Aug", male: 38, female: 28 },
    { name: "Sep", male: 42, female: 32 },
    { name: "Oct", male: 50, female: 35 },
    { name: "Nov", male: 55, female: 38 },
    { name: "Dec", male: 60, female: 40 },
  ];

  const dataForMonthForDiversity = [
    { name: "Week 1", male: 10, female: 5 },
    { name: "Week 2", male: 15, female: 7 },
    { name: "Week 3", male: 18, female: 9 },
    { name: "Week 4", male: 20, female: 10 },
  ];

  const dataForWeekForDiversity = [
    { name: "Mon", male: 3, female: 2 },
    { name: "Tue", male: 4, female: 3 },
    { name: "Wed", male: 5, female: 4 },
    { name: "Thu", male: 6, female: 5 },
    { name: "Fri", male: 7, female: 5 },
    { name: "Sat", male: 8, female: 6 },
    { name: "Sun", male: 9, female: 6 },
  ];

  const overallDataForDiversity = [
    { name: "2019", male: 400, female: 300 },
    { name: "2020", male: 450, female: 350 },
    { name: "2021", male: 500, female: 400 },
    { name: "2022", male: 550, female: 450 },
    { name: "2023", male: 600, female: 500 },
  ];

  const [selectedDataForDiversity, setSelectedDataForDiversity] = useState(
    dataForYearForDiversity
  );
  const [timeframeForDiversity, setTimeframeForDiversity] = useState(
    "This Year"
  );
  const handleTimeframeChangeForDiversity = (event) => {
    const selectedTimeframe = event.target.value;
    setTimeframeForDiversity(selectedTimeframe);

    switch (selectedTimeframe) {
      case "This Week":
        setSelectedDataForDiversity(dataForWeekForDiversity);
        break;
      case "This Month":
        setSelectedDataForDiversity(dataForMonthForDiversity);
        break;
      case "This Year":
        setSelectedDataForDiversity(dataForYearForDiversity);
        break;
      case "Overall":
        setSelectedDataForDiversity(overallDataForDiversity);
        break;
      default:
        setSelectedDataForDiversity(dataForYearForDiversity);
    }
  };

  // States for each card's time filter
  const [websiteVisitsFilter, setWebsiteVisitsFilter] = useState("This Month");
  const [sessionDurationFilter, setSessionDurationFilter] = useState(
    "This Month"
  );

  // Data for each filter (replace with your actual data)
  const websiteVisitsData = {
    "This Week": 15000,
    "This Month": 50000,
    "This Year": 600000,
    Overall: 3000000,
  };

  const sessionDurationData = {
    "This Week": 5000,
    "This Month": 15000,
    "This Year": 180000,
    Overall: 900000,
  };

  // Handler for changing website visits filter
  const handleWebsiteVisitsFilterChange = (e) => {
    setWebsiteVisitsFilter(e.target.value);
  };

  // Handler for changing session duration filter
  const handleSessionDurationFilterChange = (e) => {
    setSessionDurationFilter(e.target.value);
  };
  // Sample data for each time filter
  const dataByWeek = [
    { name: "Sunday", rate: 45 },
    { name: "Monday", rate: 50 },
    { name: "Tuesday", rate: 55 },
    { name: "Wednesday", rate: 60 },
    { name: "Thursday", rate: 62 },
    { name: "Friday", rate: 65 },
    { name: "Saturday", rate: 70 },
  ];

  const dataByMonth = [
    { name: "Week 1", rate: 50 },
    { name: "Week 2", rate: 55 },
    { name: "Week 3", rate: 60 },
    { name: "Week 4", rate: 65 },
  ];

  const dataByYear = [
    { name: "January", rate: 45 },
    { name: "February", rate: 50 },
    { name: "March", rate: 55 },
    { name: "April", rate: 60 },
    { name: "May", rate: 62 },
    { name: "June", rate: 65 },
    { name: "July", rate: 67 },
    { name: "August", rate: 70 },
    { name: "September", rate: 72 },
    { name: "October", rate: 75 },
    { name: "November", rate: 78 },
    { name: "December", rate: 80 },
  ];

  const dataOverall = [
    { name: "2019", rate: 40 },
    { name: "2020", rate: 45 },
    { name: "2021", rate: 50 },
    { name: "2022", rate: 55 },
    { name: "2023", rate: 60 },
  ];

  // State to manage selected time filter and the corresponding data
  const [timeFilter, setTimeFilter] = useState("Year");
  const [chartData, setChartData] = useState(dataByYear);

  // Handler to update chart data based on the selected filter
  const handleTimeFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setTimeFilter(selectedFilter);

    switch (selectedFilter) {
      case "Month":
        setChartData(dataByMonth);
        break;
      case "Year":
        setChartData(dataByYear);
        break;
      case "Overall":
        setChartData(dataOverall);
        break;
      default:
        setChartData(dataByWeek);
        break;
    }
  };
  return (
    <div>
      <GoArrowLeft
        size={28}
        className="hover:cursor-pointer"
        onClick={() => setModalInstructorDetailOpen(false)}
      />
      <div className="border border-neutral-100 rounded-lg mt-8 mb-20">
        {/* profile section */}
        <div className="p-4">
          <div className="flex gap-4 items-start">
            <img
              src={profileImg}
              className="w-16 h-16 rounded-full object-cover shrink-0"
            ></img>

            <div>
              <h1 className="font-bold text-2xl">
                {first_name} {last_name}
              </h1>
              <div className="flex gap-1 ">
                <span>
                  <HiLocationMarker size={20} />
                </span>
                <span className="text-sm">
                  {city},{state}
                </span>
              </div>
              <button className="px-6 rounded-full text-success-300 border border-success-300 mt-2 text-sm">
                {selectedInstructorDetails[0].Availibility}
              </button>
            </div>
          </div>
        </div>
        <hr className="border-neutral-100"></hr>

        <div className="flex flex-col sm:flex-row">
          <div className="sm:border-r-2 border-neutral-100 w-full sm:w-72">
            {/* Personal details */}
            <div className="p-4 text-sm">
              <div className="font-bold mt-4">Phone Number</div>
              <div>{phoneNumber}</div>
              <div className="font-bold mt-4">Email Address</div>
              <div>{email}</div>
              <div className="font-bold mt-4">Date of Birth</div>
              <div className="">{date_of_birth}</div>
              <div className="font-bold mt-4">Experience</div>
              <div className="">{selectedInstructorDetails[0]?.Experience}</div>
              <div className="font-bold mt-4">Languages Spoken</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedInstructorDetails[0]?.language_spoken ? (
                  selectedInstructorDetails[0]?.language_spoken.map(
                    (language) => (
                      <span
                        key={language}
                        className="p-1 bg-slate-200 border border-gray-300 rounded-md"
                      >
                        {language}
                      </span>
                    )
                  )
                ) : (
                  <div>Not Provided</div>
                )}
              </div>
              <div className="font-bold mt-4">Last Active Date</div>
              <div>{selectedInstructorDetails[0]?.Last_active_date}</div>
              <div className="font-bold mt-4">Location</div>
              <div>
                {city},{state}
              </div>
              <div>Pincode,{pincode}</div>
              <div>{locality}</div>
              <div className="font-bold mt-4">Date Joined</div>
              <div>{selectedInstructorDetails[0]?.Joining_date}</div>
            </div>
            <hr className="border-neutral-100"></hr>

            <div className="p-4 text-sm">
              <div className="font-bold mt-4 text-lg">Statistics</div>
              <div className="font-bold mt-4">Total Lessons Conducted </div>
              <div>150 Lessons</div>
              <div className="font-bold mt-4">Total Hours Taught</div>
              <div>300 Hours</div>
              <div className="font-bold mt-4">Student Ratings</div>
              <div className="">4.8/5 Stars</div>
              <div className="font-bold mt-4">Number of Reviews</div>
              <div className="">45 Reviews</div>
              <div className="font-bold mt-4">Approval Rate</div>
              <div className="">95%</div>
              <div className="font-bold mt-4">Cancellation Rate</div>
              <div>3%</div>
            </div>
            <hr className="border-neutral-100 sm:hidden"></hr>
          </div>

          <div className="w-full">
            {/* License Details */}
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">
                License and Certification Information
              </h2>
              <div className="text-sm">
                <div className="font-bold mt-4">Driver’s License Number</div>
                <div>{selectedInstructorDetails[0].License_number}</div>
                <div className="font-bold mt-4">License Issuing State</div>
                <div>{selectedInstructorDetails[0].License_Issuing_state}</div>
                <div className="font-bold mt-4">License Expiry Date</div>
                <div>{selectedInstructorDetails[0].License_expiry_date}</div>
                <div className="font-bold mt-4">License Type</div>
                <div>{selectedInstructorDetails[0].License_type}</div>
                <div className="font-bold mt-4">
                  Certificate IV in Training and Assessment
                </div>
                <div>{selectedInstructorDetails[0].Certified_in_training}</div>
              </div>
            </div>
            <hr className="border-neutral-100 my-5"></hr>
            {/* Vehicle Information */}
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">
                Vehicle Information
              </h2>
              {approvedVehicles.map((vehicleInfo, index) => (
                <div className="text-sm" key={vehicleInfo.id}>
                  <div className="font-bold mt-4 text-lg">
                    Vehicle {index + 1} Details
                  </div>
                  <div className="font-bold mt-4">Vehicle Make</div>
                  <div>{vehicleInfo.Company}</div>
                  <div className="font-bold mt-4">Vehicle Model</div>
                  <div>{vehicleInfo.Model}</div>
                  <div className="font-bold mt-4">Vehicle Year</div>
                  <div>{vehicleInfo.Year}</div>
                  <div className="font-bold mt-4">
                    Vehicle Registration Number{" "}
                  </div>
                  <div>{vehicleInfo.Registration_number}</div>

                  <div className="flex flex-wrap my-5 gap-10">
                    {/* registration document */}
                    <div className="w-28">
                      <p className="font-semibold text-sm">
                        Vehicle Registration Document
                      </p>
                      <button
                        className="h-20 w-full rounded-md bg-slate-300"
                        onClick={() =>
                          openVehicleDocument(
                            vehicleInfo.Vehicle_Registration_document
                          )
                        }
                      >
                        <FcFolder className="w-full h-full " />
                      </button>
                    </div>
                    {/* insurance document */}
                    <div className="w-28">
                      <p className="font-semibold text-sm">
                        Vehicle Insurance Document
                      </p>
                      <button
                        className="h-20 w-full rounded-md bg-slate-300"
                        onClick={() =>
                          openVehicleDocument(vehicleInfo.Insurance_document)
                        }
                      >
                        <FcFolder className="w-full h-full " />
                      </button>
                    </div>
                  </div>
                  <div
                    className={`${index < approvedVehicles.length - 1 &&
                      "border-b mt-5 border-gray-300"}`}
                  ></div>
                </div>
              ))}
            </div>
            <hr className="border-neutral-100 my-5"></hr>
            {/* Additional Documents */}
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">
                Additional Documents
              </h2>

              <div className="flex flex-wrap my-5 gap-10">
                {/* Police check */}
                <div className="w-28">
                  <p className="font-semibold text-sm">National Police Check</p>
                  <button
                    className="h-20 w-full rounded-md bg-slate-300 mt-5"
                    onClick={() =>
                      openAdditionalDocument(
                        selectedInstructorDetails[0]?.National_police_check
                      )
                    }
                  >
                    <FcFolder className="w-full h-full " />
                  </button>
                </div>
                {/* Children Check */}
                <div className="w-28">
                  <p className="font-semibold text-sm">
                    Working with Children Check
                  </p>
                  <button
                    className="h-20 w-full rounded-md bg-slate-300 mt-5"
                    onClick={() =>
                      openAdditionalDocument(
                        selectedInstructorDetails[0]
                          ?.Working_with_children_check
                      )
                    }
                  >
                    <FcFolder className="w-full h-full " />
                  </button>
                </div>
                {/* Proof of Identity */}
                <div className="w-28">
                  <p className="font-semibold text-sm">Proof of Identity</p>
                  <button
                    className="h-20 w-full rounded-md bg-slate-300 mt-9"
                    onClick={() =>
                      openAdditionalDocument(
                        selectedInstructorDetails[0]?.Proof_of_identity
                      )
                    }
                  >
                    <FcFolder className="w-full h-full " />
                  </button>
                </div>
                {/* Proof of Address */}
                <div className="w-28">
                  <p className="font-semibold text-sm">Proof of Address</p>
                  <button
                    className="h-20 w-full rounded-md bg-slate-300 mt-5"
                    onClick={() =>
                      openAdditionalDocument(
                        selectedInstructorDetails[0]?.Proof_of_address
                      )
                    }
                  >
                    <FcFolder className="w-full h-full " />
                  </button>
                </div>
                {/* Qualifications Certificate (Certificate IV) */}
                <div className="w-28">
                  <p className="font-semibold text-sm">
                    Qualifications Certificate (Certificate IV)
                  </p>
                  <button
                    className="h-20 w-full rounded-md  mt-1 bg-slate-300"
                    onClick={() =>
                      openAdditionalDocument(
                        selectedInstructorDetails[0]?.Qualification_certificate
                      )
                    }
                  >
                    <FcFolder className="w-full h-full " />
                  </button>
                </div>
              </div>
            </div>
            <hr className="border-neutral-100 my-5"></hr>
            {/* Self Description */}
            <div className="p-4 px-6">
              <h2 className="text-2xl font-bold text-secondary-500">
                Self Description
              </h2>
              <div
                className={`text-sm mt-4 ${!selectedInstructorDetails[0]
                  .Self_description &&
                  "text-center text-gray-500 font-semibold"}`}
              >
                {selectedInstructorDetails[0].Self_description
                  ? selectedInstructorDetails[0].Self_description
                  : "No Description Provided"}
              </div>
            </div>
          </div>
        </div>
        <hr className="border-neutral-100"></hr>
        {/* Pricing Plans */}
        <div className="p-4">
          <div className="text-2xl font-bold text-secondary-500 my-2">
            Pricing Plans
          </div>
          {/* Cards */}
          {packages.length > 0 ? (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white  rounded-lg p-4 duration-300 border-2 border-neutral-100  flex my-5 overflow-scroll space-y-5 h-[380px] w-full border-solid"
              >
                <div className="flex-1 overflow-y-auto">
                  <h2 className="text-xl border-b border-solid border-slate-300 font-bold text-blue-500 mb-2 pb-3">
                    {pkg.name}
                  </h2>
                  <p className="text-gray-600 mb-1">
                    <strong>Type:</strong> {pkg.Plan_Type}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Price:</strong> ${pkg.price}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Duration:</strong> {pkg.duration} hours
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Discount:</strong> {pkg.Discount}%
                  </p>
                  {pkg.Description && (
                    <p className="text-gray-600 mb-2">
                      <strong>Description:</strong> {pkg.Description}
                    </p>
                  )}
                  {pkg.lessons.length > 0 && (
                    <div className="mb-2">
                      <p className="text-gray-700 font-semibold mb-1">
                        Lessons:
                      </p>
                      <ul className="list-disc list-inside text-gray-600">
                        {pkg.lessons.map(
                          (lesson, index) =>
                            lesson.Lessons_id && (
                              <li key={index}>
                                <span className="font-semibold">
                                  {lesson.Lessons_id.lesson_name}
                                </span>
                                : {lesson.Lessons_id.lesson_description}
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 font-semibold text-lg text-center">
              No Package Available
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
        </div>
        <hr className="border-neutral-100"></hr>
        {/* Bookings details */}

        <div className="p-4">
          <div className="text-2xl font-bold text-secondary-500 my-2">
            Bookings
          </div>
          {instructorBookings.length !== 0 ? (
            <div>
              <div className="flex overflow-x-scroll space-x-3 gap-3 my-5">
                {instructorBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>

              <div className="flex items-end w-full justify-end space-x-5 my-5 mt-8">
                <div className="flex justify-center space-x-2 ">
                  {[...Array(totalBookingPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentBookingPage(i + 1)}
                      className={`h-7 w-7 text-gray-500  ${
                        currentBookingPage === i + 1
                          ? "bg-black text-white rounded-full"
                          : ""
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <div>
                  <button
                    className={`py-2 px-4 rounded-l-lg border bg-slate-50 hover:bg-slate-100  ${
                      currentBookingPage === 1 ? "text-gray-500" : ""
                    }`}
                    onClick={prevBookingsPage}
                  >
                    <FaAngleLeft />
                  </button>
                  <button
                    className={`py-2 px-4 rounded-r-lg border bg-slate-50 hover:bg-slate-100 ${
                      currentBookingPage === totalBookingPages
                        ? "text-gray-500"
                        : ""
                    }`}
                    onClick={nextBookingsPage}
                  >
                    <FaAngleRight />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 font-semibold text-lg text-center">
              No Bookings Yet
            </div>
          )}
        </div>

        <hr className="border-neutral-100"></hr>
        {/*Testimonials*/}
        <div className="m-5">
          <Testimonials testimonials={selectedInstructorDetails[0].ratings} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-5 bg-white py-5 fixed bottom-0 w-full z-20">
        {selectedInstructorDetails[0]?.is_ban === "true" ? (
          <button
            className="bg-green-400 rounded-md px-8 py-2 text-white transition-colors duration-200"
            onClick={handleUnBanPermission}
          >
            Unban Account
          </button>
        ) : (
          <button
            className="bg-error-200 rounded-md px-8 py-2 text-white transition-colors duration-200 hover:bg-error-300"
            onClick={handleBanPermission}
          >
            Ban Account
          </button>
        )}

        <button
          className="bg-neutral-300 rounded-md text-white px-8 py-2 transition-colors duration-200 hover:bg-neutral-400"
          onClick={() => setModalInstructorDetailOpen(false)}
        >
          Close
        </button>
      </div>
      {/* ban instructor modal */}
      <ReactModal
        isOpen={isBanModalOpen}
        onRequestClose={() => setBanModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 z-[999999] m-7"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[999999]"
      >
        <h3 className="text-lg font-semibold ">
          {" "}
          Are you sure you want to ban this account?
        </h3>

        <p className=" text-gray-900 text-sm mt-2">
          Please provide reason to ban this account.
        </p>
        <textarea
          className="w-full border px-3 py-2 border-gray-300 rounded mt-2 outline-none  transition-shadow shadow-sm text-gray-700 bg-gray-50resize-vertical"
          placeholder="Provide the reason for banning the account..."
          rows="5"
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
        ></textarea>

        <div className="flex justify-end mt-4">
          <button
            className="bg-[#EE6055] text-[#FFFFFF] px-4 text-sm rounded-md hover:bg-red-700"
            onClick={() => banAccount(selectedInstructorDetails[0].id)}
          >
            Ban Account
          </button>
          <button
            onClick={() => setBanModalOpen(false)}
            className="text-gray-700 px-4 py-2 mr-2"
          >
            Cancel
          </button>
        </div>
      </ReactModal>

      {/* Unban instructor modal */}
      <ReactModal
        isOpen={isUnbanModalOpen}
        onRequestClose={() => setUnbanModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6 z-[999999] m-7"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[999999]"
      >
        <h3 className="text-lg font-semibold mb-4">
          {" "}
          Are you sure you want to Unban this account?
        </h3>

        <div className="flex justify-end mt-4">
          <button
            className="bg-[#EE6055] text-[#FFFFFF] px-4 text-sm rounded-md hover:bg-red-700"
            onClick={() => unbanAccount(selectedInstructorDetails[0].id)}
          >
            Unban Account
          </button>
          <button
            onClick={() => setUnbanModalOpen(false)}
            className="text-gray-700 px-4 py-2 mr-2"
          >
            Cancel
          </button>
        </div>
      </ReactModal>
      <ToastContainer />
    </div>
  );
};
const AllInstructors = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [modalInstructorDetailOpen, setModalInstructorDetailOpen] = useState(
    false
  );
  const [instructorDetails, setInstructorDetails] = useState([]);
  const [instructorBookings, setInstructorBookings] = useState([]);
  const [selectedInstructorDetails, setSelectedInstructorDetails] = useState(
    null
  );
  const { empPermissions } = useProfileImage();
  const { setIsLoading } = useLoading();

  const getInstructors = async () => {
    try {
      setIsLoading(true);
      //API for fetching all instructor details
      const response = await axios("api/getallinstructors");
      const instructorData = response.data;
      setInstructorDetails(instructorData.data);
    } catch (error) {
      console.log("error in fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewprofile = async (instructorId) => {
    try {
      setIsLoading(true);
      //API for fetching instructor detail by Id
      const response = await axios(
        `items/Instructor?fields=*,user_id.*,user_id.city,user_id.state,user_id.locality,user_id.pincode,vehicle.*,ratings.*,ratings.Given_by.user_id.first_name,ratings.Given_by.user_id.last_name,ratings.Given_by.user_id.profileImg&filter[id]=${instructorId}`
      );
      const instructorData = await response.data;
      setSelectedInstructorDetails(instructorData.data);

      // Api for fetching instructor bookings detail
      const result = await axios(
        `items/Booking?filter[package].[Instructor][_eq]=${instructorId}&fields=id,date_created,package.name,package.price,learner.user_id.profileImg,learner.user_id.first_name,learner.user_id.last_name,package.Instructor.user_id.profileImg,learner.user_id.profileImg,learner.user_id.first_name,learner.user_id.last_name,package.Instructor.user_id.first_name,package.Instructor.user_id.last_name`
      );

      setInstructorBookings(result.data.data);
      setModalInstructorDetailOpen(true);
    } catch (error) {
      console.log("error in fetching details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfilePermission = (instructorId) => {
    if (empPermissions) {
      if (empPermissions.roles.User_Management.includes("View Users")) {
        handleViewprofile(instructorId);
      } else {
        handleError("You don't have permission to perform this action!!");
      }
    } else {
      handleViewprofile(instructorId);
    }
  };
  useEffect(() => {
    getInstructors();
  }, []);

  // Filter instructors based on search term, experience, and availability
  const filteredInstructors = instructorDetails.filter((instructor) => {
    return (
      instructor?.user_id?.first_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (!selectedExperience || instructor.Experience === selectedExperience) &&
      (!selectedAvailability ||
        instructor.Availibility === selectedAvailability) &&
      (instructor?.user_id?.gender === genderFilter || !genderFilter)
    );
  });

  // Clear all filters
  const clearFilters = () => {
    setSelectedExperience("");
    setSelectedAvailability("");
    setSearchTerm("");
    setGenderFilter("");
  };

  return (
    <div className="flex-grow bg-white p-6 overflow-scroll">
      {/* heading */}
      <div className="flex justify-between">
        <div className="text-desk-h-6 font-sans font-bold">Instructors</div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 ${
              viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <FaTh className="w-5 h-5 shrink-0" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 ${
              viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <FaBars className="w-5 h-5 shrink-0" />
          </button>
        </div>
      </div>
      {/* Header with Search and Filters */}
      <div className="flex flex-col lg:flex-row justify-between my-6">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 rounded-md px-4 py-2 w-full sm:w-96 border border-solid border-neutral-100">
          <FaSearch className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 bg-transparent focus:outline-none text-neutral-600 w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row mt-5 lg:mt-0 justify-between">
          {/* Filters and View Model */}
          <div className="flex items-center gap-4 m-3 sm:m-0 w-96 lg:w-80 overflow-x-scroll">
            <button
              className="flex gap-1 items-center  px-4 py-2"
              onClick={() => setIsAvailabilityModalOpen(true)}
            >
              <FaFilter className="mr-2 shrink-0" />
              <span className="font-semibold font-poppins text-desk-b-3 text-neutral-600">
                Availability{" "}
              </span>
              <FaCaretDown className="shrink-0" />
            </button>
            <button
              className="flex gap-1 items-center  px-4 py-2"
              onClick={() => setIsExperienceModalOpen(true)}
            >
              <span className="font-semibold font-poppins text-desk-b-3 text-neutral-600">
                Experience
              </span>
              <FaCaretDown className="shrink-0" />
            </button>
            <button onClick={() => setGenderFilter("male")}>
              <div className="font-semibold font-poppins text-desk-b-3 text-neutral-600 w-28">
                Male Instructor
              </div>
            </button>
            <button onClick={() => setGenderFilter("female")}>
              <div className="font-semibold font-poppins text-desk-b-3 text-neutral-600 w-32">
                Female Instructor
              </div>
            </button>
          </div>

          <button
            onClick={clearFilters}
            className="text-error-300 px-4 py-2 flex gap-1 items-center"
          >
            <BiReset className="shrink-0" />
            Reset Filters
          </button>
        </div>
      </div>
      {/* Instructor Cards */}
      {viewMode === "grid" ? (
        <div className=" ">
          <div className="flex flex-wrap justify-center sm:justify-normal gap-3 min-h-fit max-h-fit gap-y-6">
            {filteredInstructors.map((instructor) => {
              const {
                first_name,
                last_name,
                city,
                phoneNumber,
                profileImg,
              } = instructor?.user_id;

              return (
                <div
                  key={instructor.id}
                  className="bg-white min-w-[23%] shadow-md rounded-lg p-4 flex  flex-col items-center relative border border-solid border-neutral-100 shrink-0"
                >
                  <div className="">
                    <img
                      src={profileImg}
                      alt={first_name}
                      className="w-14 h-14 rounded-full object-cover object-center shrink-0"
                    />

                    {/* Status Indicator */}
                    <span
                      className={`absolute top-2 right-3 w-3 h-3 rounded-full ${
                        instructor.Availibility === "Active"
                          ? "bg-green-400 text-green-800"
                          : instructor.Availibility === "onLeave"
                          ? "bg-yellow-400 text-red-800"
                          : "bg-red-400 text-red-800"
                      }`}
                    ></span>
                  </div>
                  <h3 className="mt-3 font-semibold font-poppins text-desk-b-2 ">
                    {first_name} {last_name}
                  </h3>
                  <div className="pt-2 w-full font-poppins text-desk-b-3 text-neutral-600">
                    <div className="text-gray-500 w-full flex justify-between mb-2">
                      <strong className="font-semibold">Phone: </strong>{" "}
                      {phoneNumber}
                    </div>
                    <div className="text-gray-500 w-full flex justify-between">
                      <strong className="font-semibold">Location:</strong>{" "}
                      {city}
                    </div>
                  </div>
                  <button
                    className="w-full mt-4 bg-secondary-400 text-white py-2 px-4 rounded-md"
                    onClick={() => handleViewProfilePermission(instructor.id)}
                  >
                    View Profile
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 hidden sm:block">
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-center py-5 px-4 uppercase font-semibold text-sm">
                    Name
                  </th>
                  <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                    Phone Number
                  </th>
                  <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                    Location
                  </th>
                  <th className="text-left py-5 px-4 uppercase font-semibold text-sm">
                    Status
                  </th>
                  <th className="text-left py-5 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredInstructors.map((instructor) => (
                  <tr key={instructor.id} className="border-t border-gray-200">
                    <td className="py-3 px-4 flex items-center">
                      <img
                        src={instructor?.user_id?.profileImg}
                        alt={instructor?.user_id?.first_name}
                        className="w-10 h-10 rounded-full mr-8 object-cover shrink-0"
                      />
                      <span className="font-medium text-blue-600">
                        {instructor?.user_id?.first_name}{" "}
                        {instructor?.user_id?.last_name}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {instructor?.user_id?.phoneNumber}
                    </td>
                    <td className="py-3 px-4">{instructor?.user_id?.city}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-md text-sm  ${
                          instructor.Availibility === "Active"
                            ? "bg-green-100 text-green-800"
                            : instructor.Availibility === "onLeave"
                            ? "bg-yellow-100 text-red-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {instructor.Availibility}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="bg-blue-500 text-white py-2 px-6 rounded-md"
                        onClick={() =>
                          handleViewProfilePermission(instructor.id)
                        }
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Experience Filter Modal */}
      <ReactModal
        isOpen={isExperienceModalOpen}
        onRequestClose={() => setIsExperienceModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Select Experience Level</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "less than 1 year",
            "1-3 years",
            "3-5 years",
            "5-10 years",
            "10+ years",
          ].map((experience) => (
            <button
              key={experience}
              onClick={() => setSelectedExperience(experience)}
              className={`px-4 py-2 rounded-full ${
                selectedExperience === experience
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {experience}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsExperienceModalOpen(false)}
            className="text-gray-700 px-4 py-2 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsExperienceModalOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Apply Now
          </button>
        </div>
      </ReactModal>
      {/* Availability Filter Modal */}
      <ReactModal
        isOpen={isAvailabilityModalOpen}
        onRequestClose={() => setIsAvailabilityModalOpen(false)}
        className="bg-white rounded-lg shadow-lg p-6"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h3 className="text-lg font-bold mb-4">Select Availability</h3>
        <div className="flex flex-wrap gap-2">
          {["Active", "Inactive", "On Leave"].map((availability) => (
            <button
              key={availability}
              onClick={() => setSelectedAvailability(availability)}
              className={`px-4 py-2 rounded-full ${
                selectedAvailability === availability
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {availability}
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsAvailabilityModalOpen(false)}
            className="text-gray-700 px-4 py-2 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsAvailabilityModalOpen(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Apply Now
          </button>
        </div>
      </ReactModal>
      {/* Instructor Full Detail Modal */}
      <ReactModal
        isOpen={modalInstructorDetailOpen}
        onRequestClose={() => setModalInstructorDetailOpen(false)}
        className="bg-white shadow-lg px-5 md:px-10 pt-5 w-full md:w-4/5 lg:w-8/12 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end"
      >
        <InstructorDetailModal
          setModalInstructorDetailOpen={setModalInstructorDetailOpen}
          selectedInstructorDetails={selectedInstructorDetails}
          instructorBookings={instructorBookings}
          handleViewprofile={handleViewprofile}
        />
      </ReactModal>
      <ToastContainer />
    </div>
  );
};

export default AllInstructors;
