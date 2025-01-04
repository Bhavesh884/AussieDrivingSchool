import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi"; // React icons
import { MdQueryStats } from "react-icons/md"; // React icons for queries
import { GrPieChart } from "react-icons/gr";
import axios from "../../axios";
import { MdOutlinePersonAddAlt } from "react-icons/md";
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
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../LoadingContext";

const SuccessRateChart = () => {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("Weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const processSuccessRateData = (bookings, timeframe) => {
    const now = new Date();
    const successRateData = [];
  
    if (timeframe === "Weekly") {
      const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weekData = weekDays.map((day) => ({
        name: day,
        successRate: 0,
      }));
  
      bookings.forEach((booking) => {
        const date = new Date(booking.date_created);
        const dayIndex = (date.getDay() + 6) % 7; // Adjust to make Sunday = 0
        const totalLessons = booking.package.lessons.length;
        const completedLessons = booking.lesson_completed.length;
  
        if (date >= new Date(now.setDate(now.getDate() - now.getDay() + 1))) {
          const successRate = ((completedLessons / totalLessons) * 100).toFixed(2); // Limit to 2 decimal places
          weekData[dayIndex].successRate += parseFloat(successRate);
        }
      });
  
      return weekData;
    }
  
    if (timeframe === "Monthly") {
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];
      const monthData = weeks.map((week) => ({
        name: week,
        successRate: 0,
      }));
  
      bookings.forEach((booking) => {
        const date = new Date(booking.date_created);
        const weekIndex = Math.floor((date.getDate() - 1) / 7);
        const totalLessons = booking.package.lessons.length;
        const completedLessons = booking.lesson_completed.length;
  
        if (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        ) {
          const successRate = ((completedLessons / totalLessons) * 100).toFixed(2); // Limit to 2 decimal places
          monthData[weekIndex].successRate += parseFloat(successRate);
        }
      });
  
      return monthData;
    }
  
    if (timeframe === "Yearly") {
      const months = Array.from({ length: 12 }, (_, i) => ({
        name: new Date(0, i).toLocaleString("default", { month: "short" }),
        successRate: 0,
      }));
  
      bookings.forEach((booking) => {
        const date = new Date(booking.date_created);
        const monthIndex = date.getMonth();
        const totalLessons = booking.package.lessons.length;
        const completedLessons = booking.lesson_completed.length;
  
        if (date.getFullYear() === now.getFullYear()) {
          const successRate = ((completedLessons / totalLessons) * 100).toFixed(2); // Limit to 2 decimal places
          months[monthIndex].successRate += parseFloat(successRate);
        }
      });
  
      return months;
    }
  
    return [];
  };
  const fetchData = async () => {
    try {
      const response = await axios.get("items/Booking?fields=*,package.lessons,lesson_completed,date_created");
      const bookings = response.data.data;

      const processedData = processSuccessRateData(bookings, timeframe);
      setChartData(processedData);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const averageSuccessRate = (
    chartData.reduce((acc, curr) => acc + curr.successRate, 0) / chartData.length
  ).toFixed(2);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-solid border-neutral-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Average Success Rate of Instructors
        </h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="p-2 border rounded-lg shadow-sm focus:outline-none"
        >
          <option value="Weekly">This Week</option>
          <option value="Monthly">This Month</option>
          <option value="Yearly">This Year</option>
        </select>
      </div>

      <div className="flex items-center">
        
        <span className="text-xl">Success Rate :{" "} </span>
        <span className="font-bold text-blue-600 mr-2 text-xl">
          {averageSuccessRate}
        </span>
      </div>
      <div className="w-[106%] sm:w-full ml-[-5.5vw] sm:ml-[-4vw] lg:ml-[-2vw]">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="successRate"
              stroke="#F6AD55"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
const WebsiteStats = () => {
  // States for each card's time filter
  const [websiteVisitsFilter, setWebsiteVisitsFilter] = useState("This Month");

  const [sessionDurationFilter, setSessionDurationFilter] = useState(
    "This Month"
  );
  const [sessionDurationData, setSessionDurationData] = useState({
    "This Week": 0,
    "This Month": 0,
    "This Year": 0,
    Overall: 0,
  });

  // Data for each filter (replace with your actual data)
  const websiteVisitsData = {
    "This Week": 15000,
    "This Month": 50000,
    "This Year": 600000,
    Overall: 3000000,
  };

 

  // Handler for changing website visits filter
  const handleWebsiteVisitsFilterChange = (e) => {
    setWebsiteVisitsFilter(e.target.value);
  };

  // Handler for changing session duration filter
  const handleSessionDurationFilterChange = (e) => {
    setSessionDurationFilter(e.target.value);
  };

 useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://3.6.180.229:8055/items/Booking?fields=*,package.*"
        );
        const bookings = response.data.data || [];

        // Get the current date
        const now = new Date();

        // Define time ranges
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(now.getDate() - 7);

        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        // Initialize duration counters
        let durations = {
          "This Week": 0,
          "This Month": 0,
          "This Year": 0,
          Overall: 0,
        };

        bookings.forEach((booking) => {
          const bookingDate = new Date(booking.date_created);
          const durationInMinutes = (booking.package?.duration || 0) * 60;

          // Add to overall
          durations.Overall += durationInMinutes;

          // Add to time-specific durations
          if (bookingDate >= oneWeekAgo) {
            durations["This Week"] += durationInMinutes;
          }
          if (bookingDate >= oneMonthAgo) {
            durations["This Month"] += durationInMinutes;
          }
          if (bookingDate >= oneYearAgo) {
            durations["This Year"] += durationInMinutes;
          }
        });

        setSessionDurationData(durations);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  

  return (
    <div className="h-full flex flex-col md:flex-row lg:flex-col gap-4  justify-between">
      {/* Card 1 - Total Website Visits */}
      <div className="bg-white p-6 rounded-lg shadow-md h-[50%] border border-solid border-neutral-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Total Website Visits</h2>
          <select
            value={websiteVisitsFilter}
            onChange={handleWebsiteVisitsFilterChange}
            className="text-gray-500 focus:outline-none bg-transparent"
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
            <option>Overall</option>
          </select>
        </div>
        <div className="flex items-end">
          <h1 className="text-5xl font-bold text-blue-600">
            {websiteVisitsData[websiteVisitsFilter].toLocaleString()}
          </h1>
        </div>
      </div>

      {/* Card 2 - Total Session Duration */}
      <div className="bg-white p-6 rounded-lg shadow-md h-[50%] border border-solid border-neutral-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Total Session Duration:</h2>
        <select
          value={sessionDurationFilter}
          onChange={handleSessionDurationFilterChange}
          className="text-gray-500 focus:outline-none bg-transparent"
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
          <option>Overall</option>
        </select>
      </div>
      <div className="flex items-end">
        <h1 className="text-5xl font-bold text-yellow-500">
          {sessionDurationData[sessionDurationFilter].toLocaleString()}
        </h1>
        <span className="text-lg ml-2">minutes</span>
      </div>
    </div>
    </div>
  );
};
const InstructorStatus = () => {
  const [instructorFilter, setInstructorFilter] = useState("In Total");
  const [instructorData, setInstructorData] = useState([]);
  const [activeInstructorData, setActiveInstructorData] = useState([]);
  const [totalInstructors, setTotalInstructors] = useState(0);
  const [activeInstructors, setActiveInstructors] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const { setIsLoading } = useLoading();
  // Function to fetch instructor data from API based on selected filter
  const fetchInstructorData = async (filter) => {
    const endpoint = `items/Instructor`;
    try {
      setIsLoading(true);
      const response = await axios.get(endpoint);
      const data = response.data.data;

      let filteredData;
      const currentDate = new Date();

      switch (filter) {
        case "This Week":
          filteredData = data.filter((instructor) => {
            const createdDate = new Date(instructor.date_created);
            return (
              createdDate >=
              new Date(currentDate.setDate(currentDate.getDate() - 7))
            );
          });
          break;
        case "This Month":
          filteredData = data.filter((instructor) => {
            const createdDate = new Date(instructor.date_created);
            return (
              createdDate.getMonth() === currentDate.getMonth() &&
              createdDate.getFullYear() === currentDate.getFullYear()
            );
          });
          break;
        case "This Year":
          filteredData = data.filter((instructor) => {
            const createdDate = new Date(instructor.date_created);
            return createdDate.getFullYear() === currentDate.getFullYear();
          });
          break;
        case "In Total":
        default:
          filteredData = data;
          break;
      }

      return filteredData;
    } catch (error) {
      console.error("Error fetching instructor data:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstructorFilterChange = async (e) => {
    const filter = e.target.value;
    setInstructorFilter(filter);

    // Fetch filtered instructor data based on the selected filter
    const data = await fetchInstructorData(filter);
    setInstructorData(data);

    // Filter active instructors
    const active = data.filter(
      (instructor) => instructor.Availibility === "Active"
    );
    setActiveInstructorData(active);

    // Update total and active instructor counts
    setTotalInstructors(data.length);
    setActiveInstructors(active.length);

    // Calculate percentage change in active instructors (if applicable)
    const previousActiveCount = 1128; // Placeholder for previous period active count
    setPercentageChange(
      ((active.length - previousActiveCount) / previousActiveCount) * 100
    );
  };

  // Fetch instructor data on mount with default filter (In Total)
  const fetchInstructorDetails = async () => {
    const data = await fetchInstructorData("In Total");
    setInstructorData(data);
    const active = data.filter(
      (instructor) => instructor.Availibility === "Active"
    );
    setActiveInstructorData(active);
    setTotalInstructors(data.length);
    setActiveInstructors(active.length);
  };

  useEffect(() => {
    fetchInstructorDetails();
  }, []);
  return (
    <div className="flex-grow bg-white shadow-md rounded-lg p-6 relative border border-neutral-100 w-full md:w-[calc(31%-0.5rem)]">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-pink-100 rounded-md">
          <MdOutlinePersonAddAlt className="text-pink-500 text-xl" />
        </div>
        <select
          className="bg-transparent text-gray-500 focus:outline-none"
          onChange={handleInstructorFilterChange}
          value={instructorFilter}
        >
          {["In Total", "This Week", "This Month", "This Year"].map(
            (option, index) => (
              <option key={index} value={option} className="text-black">
                {option}
              </option>
            )
          )}
        </select>
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <div className="text-gray-500">Instructors</div>
          <div className="text-2xl font-bold">{totalInstructors}</div>
        </div>
        <div className="flex gap-4">
          <div>
            <div className="text-gray-500">Active</div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{activeInstructors}</div>
              <div
                className={` text-${
                  percentageChange >= 0 ? "green" : "red"
                }-600 flex items-center`}
              >
                {percentageChange >= 0
                  ? `+${percentageChange.toFixed(2)}%`
                  : `${percentageChange.toFixed(2)}%`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const BookingStatus = () => {
  const [bookingFilter, setBookingFilter] = useState("In Total");
  const [bookingData, setBookingData] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState({
    pending: 0,
    completed: 0,
    total: 0,
  });
  const { setIsLoading } = useLoading();

  // Fetch booking data when the component mounts
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("items/Booking");
        const data = response.data.data;
        setBookingData(data);
        calculateBookings(data, bookingFilter);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookingData();
  }, []);

  // Recalculate bookings whenever the filter changes
  useEffect(() => {
    if (bookingData.length > 0) {
      calculateBookings(bookingData, bookingFilter);
    }
  }, [bookingFilter, bookingData]);

  // Function to calculate bookings based on the selected filter (week, month, year, or total)
  const calculateBookings = (data, filter) => {
    const currentDate = new Date();
    let bookingsCount = { pending: 0, completed: 0, total: 0 };

    // Helper function to check if the booking falls within the selected time range
    const isInTimeRange = (date) => {
      const bookingDate = new Date(date);
      switch (filter) {
        case "This Week":
          return (
            bookingDate >=
              new Date(
                currentDate.setDate(
                  currentDate.getDate() - currentDate.getDay()
                )
              ) && bookingDate <= new Date()
          );
        case "This Month":
          return (
            bookingDate.getMonth() === currentDate.getMonth() &&
            bookingDate.getFullYear() === currentDate.getFullYear()
          );
        case "This Year":
          return bookingDate.getFullYear() === currentDate.getFullYear();
        default:
          return true; // "In Total"
      }
    };

    // Count the bookings based on their status and time range
    data.forEach((booking) => {
      if (isInTimeRange(booking.date_created)) {
        bookingsCount.total += 1;
        if (booking.status === "Pending" || booking.status === "pending") {
          bookingsCount.pending += 1;
        } else if (booking.status === "Completed") {
          bookingsCount.completed += 1;
        }
      }
    });

    setFilteredBookings(bookingsCount);
  };

  // Handle the filter change
  const handleBookingFilterChange = (e) => {
    setBookingFilter(e.target.value);
  };

  return (
    <div
      className="flex-grow bg-white shadow-md rounded-lg p-6 relative border border-neutral-100 w-full 
    md:w-[calc(37%-0.5rem)]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-error-100 rounded-md">
          <FiTrendingUp className="text-red-500 text-xl" />
        </div>
        <select
          className="bg-transparent text-gray-500 focus:outline-none"
          onChange={handleBookingFilterChange}
          value={bookingFilter}
        >
          {["In Total", "This Week", "This Month", "This Year"].map(
            (option, index) => (
              <option key={index} value={option} className="text-black">
                {option}
              </option>
            )
          )}
        </select>
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <div className="text-gray-500">All Bookings</div>
          <div className="text-2xl font-bold">{filteredBookings.total}</div>
        </div>
        <div>
          <div className="text-gray-500">Pending</div>
          <div className="text-2xl font-bold">{filteredBookings.pending}</div>
        </div>
        <div>
          <div className="text-gray-500">Completed</div>
          <div className="flex gap-2">
            <div className="text-2xl font-bold">
              {filteredBookings.completed}
            </div>
            {filteredBookings.completed > 0 && (
              <div className="text-green-600 flex items-center">+10.03%</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
const RecentQueries = () => {
  const [allRecentqueries, setAllRecentQueries] = useState([]);
  const { setIsLoading } = useLoading();
  // Function to fetch queries data from the API
  const fetchRecentQueriesData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("items/queries"); // Replace with your actual API endpoint
      const allQueries = response.data.data;

      // Filter queries created in the last 20 days
      const last20Days = new Date();
      last20Days.setDate(last20Days.getDate() - 45);

      const recentQueries = allQueries.filter((query) => {
        const createdDate = new Date(query.date_created);
        return createdDate >= last20Days;
      });
      const sortedQueries = recentQueries.sort(
        (a, b) => new Date(b.date_created) - new Date(a.date_created)
      );
      setAllRecentQueries(sortedQueries);
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  useEffect(() => {
    fetchRecentQueriesData();
  }, []);

  return (
    <div className="flex-grow bg-white shadow-lg rounded-lg p-4 mx-auto border border-solid border-neutral-100 w-full md:w-[calc(37%-0.5rem)] overflow-scroll">
      <h3 className="text-xl font-semibold mb-4">Recent Queries</h3>
      {/* Scrollable container */}
      <div className="space-y-4 overflow-y-scroll max-h-[360px]">
        {allRecentqueries.length > 0 ? (
          allRecentqueries.map((query) => (
            <div
              key={query.id}
              className="flex justify-between items-center border-b pb-3"
            >
              {/* User info */}
              <div className="flex items-center space-x-4">
                <img
                  className="w-12 h-12 rounded-full object-cover"
                  src={
                    query.profileImg
                      ? query.profileImg
                      : "https://via.placeholder.com/48" // Placeholder image if profileImg is null
                  }
                  alt={`${query.first_name} ${query.last_name}`}
                />
                <div>
                  <div className="text-gray-500 text-sm">
                    {query.city}, {query.state}
                  </div>
                  <div className="font-bold text-gray-800">
                    {query.first_name} {query.last_name}
                  </div>
                </div>
              </div>
              {/* Date and status */}
              <div className="text-right">
                <div className="text-gray-400 text-sm">
                  {formatDate(query.date_created)}
                </div>
                <div
                  className={`px-2 py-1 text-sm rounded-lg ${
                    query.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : query.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {query.status}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">loading..</div>
        )}
      </div>
    </div>
  );
}

const BookingConversionRate = () => {
  const [selectedOption, setSelectedOption] = useState("This Month");
  const [groupedData, setGroupedData] = useState({});
  const [chartConversionData, setChartConversionData] = useState([]);
  const [hasData, setHasData] = useState(true);

  const COLORS = ["#facc15", "#3b82f6"]; // Yellow for Completed, Blue for Pending

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "items/Booking?fields=*"
        );
        const bookingData = response.data.data;
        const processedData = processBookingData(bookingData);
        setGroupedData(processedData);
        updateChartData(processedData[selectedOption]);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchData();
  }, []);

  const processBookingData = (data) => {
    const currentDate = new Date();

    const isWithinRange = (date, days) => {
      const targetDate = new Date(date);
      const diff = (currentDate - targetDate) / (1000 * 60 * 60 * 24); // Difference in days
      return diff <= days;
    };

    const result = {
      "This Week": { completed: 0, pending: 0 },
      "This Month": { completed: 0, pending: 0 },
      "This Year": { completed: 0, pending: 0 },
      Overall: { completed: 0, pending: 0 },
    };

    data.forEach((item) => {
      const dateCreated = new Date(item.date_created);
      const status = item.status?.toLowerCase();

      if (status === "completed") {
        result.Overall.completed++;
        if (isWithinRange(dateCreated, 7)) result["This Week"].completed++;
        if (isWithinRange(dateCreated, 30)) result["This Month"].completed++;
        if (isWithinRange(dateCreated, 365)) result["This Year"].completed++;
      } else if (status === "pending") {
        result.Overall.pending++;
        if (isWithinRange(dateCreated, 7)) result["This Week"].pending++;
        if (isWithinRange(dateCreated, 30)) result["This Month"].pending++;
        if (isWithinRange(dateCreated, 365)) result["This Year"].pending++;
      }
    });

    return result;
  };

  const updateChartData = (data) => {
    const formattedData = [
      { name: "Completed", value: data.completed },
      { name: "Pending", value: data.pending },
    ];

    // Check if there is any data to display
    const hasData = formattedData.some((item) => item.value > 0);
    setHasData(hasData);

    if (hasData) {
      setChartConversionData(formattedData);
    } else {
      setChartConversionData([]);
    }
  };

  const handleDropdownChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);
    updateChartData(groupedData[selected]);
  };

  return (
    <div className="flex-grow border border-solid border-neutral-100 p-6 rounded-lg bg-white shadow-lg overflow-visible w-full md:w-[calc(31%-0.5rem)]">
      <div className="w-full">
        <div className="flex justify-between items-start">
          <div className="w-1/2">
            <h3 className="text-lg font-semibold">Booking Conversion Rate</h3>
          </div>
          <div>
            <select
              value={selectedOption}
              onChange={handleDropdownChange}
              className="bg-transparent text-gray-500 border-none focus:outline-none"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
              <option>Overall</option>
            </select>
          </div>
        </div>

        {hasData ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartConversionData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={70}
                fill="#82ca9d"
                paddingAngle={5}
                label
              >
                {chartConversionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500 mt-12">
            No data available for the selected time range
          </div>
        )}

        {hasData && (
          <div className="flex justify-between items-center mt-4">
            {chartConversionData.map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                ></div>
                <div className="text-sm text-gray-500">{data.name}</div>
                <div className="font-bold text-gray-900">{data.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const BookingRevenue = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredRevenue, setFilteredRevenue] = useState(0);
  const [activeRevenue, setActiveRevenue] = useState(0);
  const [timeRange, setTimeRange] = useState("Year"); // Default to 'Year'

  // Fetch bookings data from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "items/Booking?fields=*,package.*"
        );
        setBookings(response.data.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // Calculate revenues based on selected time range
  useEffect(() => {
    const now = new Date();

    // Define time ranges
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    let startDate;
    switch (timeRange) {
      case "Week":
        startDate = oneWeekAgo;
        break;
      case "Month":
        startDate = oneMonthAgo;
        break;
      case "Year":
      default:
        startDate = oneYearAgo;
        break;
    }

    // Calculate revenue for completed bookings
    const completedRevenue = bookings
      .filter(
        (booking) =>
          booking.status === "Completed" &&
          new Date(booking.date_created) >= startDate &&
          new Date(booking.date_created) <= now
      )
      .reduce((total, booking) => total + parseFloat(booking.package?.price || 0), 0);

    // Calculate active revenue
    const activeRevenue = bookings
      .filter((booking) => booking.status === "Pending")
      .reduce((total, booking) => total + parseFloat(booking.package?.price || 0), 0);

    setFilteredRevenue(completedRevenue);
    setActiveRevenue(activeRevenue);
  }, [bookings, timeRange]);

  return (
    <div className="w-full h-[50%] bg-white shadow-lg rounded-lg p-6 relative border border-solid border-neutral-100">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-success-100 rounded-md">
          <FiDollarSign className="text-green-500 text-xl" />
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-2 focus:outline-none rounded-md bg-white text-gray-600"
        >
          <option value="Week">This Week</option>
          <option value="Month">This Month</option>
          <option value="Year">This Year</option>
        </select>
      </div>
      <div className="text-gray-500">Total Revenue</div>
      <div className="text-3xl font-bold">${filteredRevenue.toFixed(2)}</div>
      <div className="text-gray-500 text-sm mt-1">
        Revenue from Active Bookings: ${activeRevenue.toFixed(2)}
      </div>
    </div>
  );
};

const StudentEnrollment = () => {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("Yearly"); // Default timeframe
  const [loading, setLoading] = useState(true);
  const [totalStudents, setTotalStudents] = useState(0);
  const [error, setError] = useState(null);

  // API URL
  const apiUrl = `items/Booking?fields=*,learner.user_id.gender`;

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      const bookings = response.data.data;
      setTotalStudents(bookings);
      // Process data based on the selected timeframe
      const processedData = processChartData(bookings, timeframe);
      setChartData(processedData);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Process chart data based on the timeframe
  const processChartData = (bookings, timeframe) => {
    const now = new Date();

    if (timeframe === "Weekly") {
      // Weekly: Show days of the current week
      const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const weekData = weekDays.map((day) => ({
        name: day,
        male: 0,
        female: 0,
      }));

      bookings.forEach((booking) => {
        const date = new Date(booking.date_created);
        const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ...
        const gender = booking.learner.user_id.gender;
        const count = booking.lesson_completed.length;

        if (date >= new Date(now.setDate(now.getDate() - now.getDay()))) {
          // Include only bookings from this week
          if (gender === "Male") weekData[dayIndex].male += 1;
          if (gender === "Female") weekData[dayIndex].female += 1;
        }
      });

      return weekData;
    }

    if (timeframe === "Monthly") {
      // Monthly: Show weeks of the current month
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
      const monthData = weeks.map((week) => ({
        name: week,
        male: 0,
        female: 0,
      }));

      bookings.forEach((booking) => {
        const date = new Date(booking.date_created);
        const weekIndex = Math.floor(date.getDate() / 7); // Determine week number
        const gender = booking.learner.user_id.gender;

        if (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        ) {
          if (gender === "Male") monthData[weekIndex].male += 1;
          if (gender === "Female") monthData[weekIndex].female += 1;
        }
      });

      return monthData;
    }

    if (timeframe === "Yearly") {
      // Yearly: Show months of the year
      const months = Array.from({ length: 12 }, (_, i) => ({
        name: new Date(0, i).toLocaleString("default", { month: "short" }),
        male: 0,
        female: 0,
      }));

      bookings.forEach((booking) => {
        const date = new Date(booking.date_created);
        const monthIndex = date.getMonth(); // Month index (0 = Jan, 11 = Dec)
        const gender = booking.learner.user_id.gender;

        if (date.getFullYear() === now.getFullYear()) {
          if (gender === "Male") months[monthIndex].male += 1;
          if (gender === "Female") months[monthIndex].female += 1;
        }
      });

      return months;
    }

    return [];
  };

  // Fetch data whenever the timeframe changes
  useEffect(() => {
    fetchData();
  }, [timeframe]);

  // Render loading, error, or chart
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full md:w-[56%] p-6 px-4 lg:px-6 mt-8 md:mt-auto bg-white shadow-md rounded-lg border border-solid border-neutral-100">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Student Enrollment</h2>
          <div className="text-blue-600 text-2xl lg:text-3xl font-bold mt-2 mb-4">
            {totalStudents.length} Students
          </div>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <select
            id="timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="focus:outline-none"
          >
            <option value="Weekly">This Week</option>
            <option value="Monthly">This Month</option>
            <option value="Yearly">This Year</option>
          </select>
        </div>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="male" stackId="a" fill="#007bff" />
          <Bar dataKey="female" stackId="a" fill="#ffc107" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const RevenueGraph = () => {
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState("Weekly");
  const [bookingData,setBookingData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `items/Booking?fields=*,package.price,date_created`;


  const processRevenueData = (bookings, timeframe) => {
    const now = new Date();
  
    if (timeframe === "Weekly") {
      // Weekly: Show days of the current week
      const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const weekData = weekDays.map((day) => ({
        name: day,
        totalRevenue: 0,
        netProfit: 0,
      }));
  
      bookings.forEach((booking) => {
        const date = new Date(booking.date_created);
        const dayIndex = (date.getDay() + 6) % 7; // Adjust to make Monday = 0
        const price = parseFloat(booking.package.price);
  
        if (date >= new Date(now.setDate(now.getDate() - now.getDay() + 1))) {
          // Include only bookings from this week
          weekData[dayIndex].totalRevenue += price;
          weekData[dayIndex].netProfit = parseFloat((weekData[dayIndex].netProfit + price * 0.8).toFixed(2));
        }
      });
  
      return weekData;
    }
  
    if (timeframe === "Monthly") {
      // Monthly: Show weeks of the current month
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
      const monthData = weeks.map((week) => ({
        name: week,
        totalRevenue: 0,
        netProfit: 0,
      }));
  
      bookings.forEach((booking) => {
        const date = new Date(booking.date_created);
        const weekIndex = Math.floor((date.getDate() - 1) / 7); // Determine week number
        const price = parseFloat(booking.package.price);
  
        if (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        ) {
          monthData[weekIndex].totalRevenue += price;
          monthData[weekIndex].netProfit = parseFloat((monthData[weekIndex].netProfit + price * 0.8).toFixed(2));
  
        }
      });
  
      return monthData;
    }
  
    if (timeframe === "Yearly") {
      // Yearly: Show months of the year
      const months = Array.from({ length: 12 }, (_, i) => ({
        name: new Date(0, i).toLocaleString("default", { month: "short" }),
        totalRevenue: 0,
        netProfit: 0,
      }));
  
      bookings.forEach((booking) => {
        const date = new Date(booking.date_created);
        const monthIndex = date.getMonth(); // Month index (0 = Jan, 11 = Dec)
        const price = parseFloat(booking.package.price);
  
        if (date.getFullYear() === now.getFullYear()) {
          months[monthIndex].totalRevenue += price;
          months[monthIndex].netProfit = parseFloat((months[monthIndex].netProfit + price * 0.8).toFixed(2));
        }
      });
  
      return months;
    }
  
    return [];
  };

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get(apiUrl);
      const bookings = response.data.data;
      setBookingData(bookings)

      // Process data based on the selected timeframe
      const processedData = processRevenueData(bookings, timeframe);
      setChartData(processedData);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg border border-solid border-neutral-100 mt-8">
      <h3 className="text-2xl font-semibold">Revenue</h3>
      <div className="flex justify-between items-center mb-4">
        <div>
          {/* <div className="text-blue-600 text-4xl font-bold mt-2">$50,000</div> */}
          <div className="text-gray-500">{bookingData.length} Bookings</div>
        </div>

        {/* Timeframe buttons */}

        <select
          id="timeframe"
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          style={{ padding: "5px", fontSize: "16px" }}
        >
          <option value="Weekly">This Week</option>
          <option value="Monthly">This Month</option>
          <option value="Yearly">This Year</option>
        </select>
      </div>

      {/* Line Chart */}
      <div className="w-[106%] sm:w-full ml-[-5.5vw] sm:ml-[-4vw] lg:ml-[-2vw]">
      <ResponsiveContainer  height={300} width={"100%"}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="#007bff"
            activeDot={{ r: 8 }}
            name="Total Revenue"
          />
          <Line
            type="monotone"
            dataKey="netProfit"
            stroke="#ffcc00"
            name="Net Profit"
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
};
const Dashboard = () => {
  const navigate = useNavigate();

  // Handle dropdown change
  const dropdownOptions = ["This Week", "This Month", "This Year", "In Total"];
  const Dropdown = () => (
    <select className="bg-transparent text-gray-500 focus:outline-none">
      {dropdownOptions.map((option, index) => (
        <option key={index} value={option} className="text-black">
          {option}
        </option>
      ))}
    </select>
  );
  //states for total users
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("In Total"); // Default to Overall
  const [allUsers, setAllUsers] = useState([]);
  const { setIsLoading } = useLoading();
  // Function to fetch and calculate the total number of users
  const fetchTotalNumberOfUsers = async () => {
    try {
      setIsLoading(true);
      const instructorRes = await axios.get("items/Instructor");
      const learnerRes = await axios.get("items/Learner");
      const empRes = await axios.get("items/Employee");

      const instructors = instructorRes.data.data;
      const learners = learnerRes.data.data;
      const employee = empRes.data.data;

      const combinedUsers = [...instructors, ...learners, ...employee];

      setAllUsers(combinedUsers); // Store all users for later filtering
      calculateUsers("In Total", combinedUsers); // Initial calculation for Overall
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateUsers = (filter, users) => {
    const currentDate = new Date();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    let filteredUsers = users;

    if (filter === "This Week") {
      filteredUsers = users.filter(
        (user) => new Date(user.date_created) > oneWeekAgo
      );
    } else if (filter === "This Month") {
      filteredUsers = users.filter(
        (user) => new Date(user.date_created) > oneMonthAgo
      );
    } else if (filter === "This Year") {
      filteredUsers = users.filter(
        (user) => new Date(user.date_created) > oneYearAgo
      );
    }

    // Update total users count based on the filter
    setTotalUsers(filteredUsers.length);

    // Example for new users (adjust as necessary, this assumes we're showing weekly new users as an example)
    setNewUsers(filteredUsers.length); // You can refine this for different calculations
  };

  // Handle dropdown change
  const handleDropdownChangeForUsers = (e) => {
    const selectedOption = e.target.value;
    setSelectedFilter(selectedOption); // Update selected filter
    calculateUsers(selectedOption, allUsers); // Recalculate users based on selection
  };

  //---------------Query Status Data---------------

  const [acceptedCount, setAcceptedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rateChange, setRateChange] = useState(0);
  const [selectedQueryFilter, setSelectedQueryFilter] = useState("In Total"); // Default filter
  const [allQueries, setAllQueries] = useState([]);

  // Fetch queries data
  const fetchQueriesData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("items/queries"); // Replace with your API endpoint
      const queries = response.data.data;

      setAllQueries(queries); // Store all queries
      calculateQueries("In Total", queries); // Initial calculation
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to calculate accepted and pending queries based on filter
  const calculateQueries = (filter, queries) => {
    const currentDate = new Date();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(currentDate.getDate() - 14);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(currentDate.getMonth() - 2);

    let currentPeriodQueries = queries;
    let previousPeriodQueries = queries;

    // Filter based on selected period
    if (filter === "This Week") {
      currentPeriodQueries = queries.filter(
        (query) => new Date(query.date_created) > oneWeekAgo
      );
      previousPeriodQueries = queries.filter(
        (query) =>
          new Date(query.date_created) > twoWeeksAgo &&
          new Date(query.date_created) <= oneWeekAgo
      );
    } else if (filter === "This Month") {
      currentPeriodQueries = queries.filter(
        (query) => new Date(query.date_created) > oneMonthAgo
      );
      previousPeriodQueries = queries.filter(
        (query) =>
          new Date(query.date_created) > twoMonthsAgo &&
          new Date(query.date_created) <= oneMonthAgo
      );
    }

    // Count Accepted and Pending queries
    const accepted = currentPeriodQueries.filter(
      (query) => query.status === "Accepted"
    ).length;
    const pending = currentPeriodQueries.filter(
      (query) => query.status === "Pending"
    ).length;

    setAcceptedCount(accepted);
    setPendingCount(pending);

    // Calculate rate change
    const previousAccepted = previousPeriodQueries.filter(
      (query) => query.status === "Accepted"
    ).length;

    const rate =
      previousAccepted > 0
        ? ((accepted - previousAccepted) / previousAccepted) * 100
        : 0;

    setRateChange(rate.toFixed(2)); // Round to 2 decimal places
  };

  // Handle dropdown change
  const dropdownChangeForQueryStatus = (e) => {
    const selectedOption = e.target.value;
    setSelectedQueryFilter(selectedOption);
    calculateQueries(selectedOption, allQueries);
  };

  useEffect(() => {
    fetchTotalNumberOfUsers();
    fetchQueriesData();
  }, []);

  //--------------------------------------------------------------

  // booking conversion data
  const conversionDataOptions = {
    "This Week": [
      { name: "Bookings", value: 1750, color: "#facc15" }, // Yellow
      { name: "Unbooked", value: 750, color: "#3b82f6" }, // Blue
    ],
    "This Month": [
      { name: "Bookings", value: 8000, color: "#facc15" },
      { name: "Unbooked", value: 2000, color: "#3b82f6" },
    ],
    "This Year": [
      { name: "Bookings", value: 90000, color: "#facc15" },
      { name: "Unbooked", value: 10000, color: "#3b82f6" },
    ],
    Overall: [
      { name: "Bookings", value: 300000, color: "#facc15" },
      { name: "Unbooked", value: 50000, color: "#3b82f6" },
    ],
  };
  const [selectedOption, setSelectedOption] = useState("This Week");
  const [chartConversionData, setchartConversionData] = useState(
    conversionDataOptions[selectedOption]
  );

  const handleDropdownChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);
    setchartConversionData(conversionDataOptions[selected]);
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

  const handleTimeframeChange = (timeframe) => {
    setActiveTimeframe(timeframe);
    switch (timeframe) {
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

  return (
    <div className="w-full min-h-screen pl-6 pr-10 mt-6 mb-12 ">
      <div className="flex flex-col gap-6">
        {/* First Row - 3 Main Cards */}
        <div className="flex flex-wrap justify-between gap-4">
          {/* Total Users Filter */}
          <div className="flex-grow bg-white shadow-md rounded-lg p-6 relative border border-neutral-100 w-full md:w-[calc(31%-0.5rem)]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-secondary-100 rounded-md">
                <GrPieChart className="text-blue-500 text-xl" />
              </div>
              <select
                className="bg-transparent text-gray-500 focus:outline-none"
                onChange={handleDropdownChangeForUsers}
                value={selectedFilter}
              >
                {["In Total", "This Week", "This Month", "This Year"].map(
                  (option, index) => (
                    <option key={index} value={option} className="text-black">
                      {option}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <div className="text-gray-500">Total Users</div>
                <div className="text-2xl font-bold">{totalUsers}</div>
              </div>
              <div>
                <div className="text-gray-500">New Users</div>
                <div className="flex gap-2">
                  <div className="text-2xl font-bold">{newUsers}</div>
                  <span className="text-green-600 flex items-center">
                    +2.06%
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* instructor filter */}
          <InstructorStatus />
          {/* bookings filter */}
          <BookingStatus />
        </div>

        {/* Second Row - ------------------------------ */}
        <div className="flex flex-wrap justify-between gap-4">
          
         <BookingConversionRate/>

          <div className="flex-grow flex flex-col gap-4 justify-between items-center w-full md:w-[calc(31%-0.5rem)]">
            {/* Resolved Queries */}
            <div className="w-full h-[50%] bg-white shadow-lg rounded-lg p-6 relative border border-solid border-neutral-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-accent-100 rounded-md">
                  <MdQueryStats className="text-purple-500 text-xl" />
                </div>
                {/* <Dropdown /> */}
                <select
                  className="bg-transparent text-gray-500 focus:outline-none"
                  value={selectedQueryFilter}
                  onChange={dropdownChangeForQueryStatus}
                >
                  {["In Total", "This Week", "This Month", "This Year"].map(
                    (option, index) => (
                      <option key={index} value={option} className="text-black">
                        {option}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="text-gray-500">Queries Resolved</div>
              <div className="text-3xl font-bold">{acceptedCount}</div>
              <div className="text-red-500 text-sm mt-1">
                Unresolved: {pendingCount}
                {"  "}{" "}
                <span className="text-red-600">
                  {" "}
                  {rateChange > 0 ? `+${rateChange}%` : `${rateChange}%`}
                </span>
              </div>
            </div>

            {/* total revenue */}
           <BookingRevenue/>
          </div>

          <RecentQueries />
        </div>
        {/* third row cards-------------------------- */}
       <RevenueGraph/>
        {/* 4th roww------------ */}
        <div className="flex flex-wrap lg:flex-nowrap justify-between gap-6">
          <div className="flex-grow w-full md:w-[calc(35%-0.5rem)]">
            <WebsiteStats />
          </div>
         <StudentEnrollment/>
        </div>
        {/* 5th row----------------------- */}
        <SuccessRateChart />
      </div>
    </div>
  );
};

export default Dashboard;
