import React, { useState, useEffect } from "react";
import { FaChartPie, FaClock, FaListAlt } from "react-icons/fa";
import { MdExpandMore } from "react-icons/md";
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
import axios from "../../axios";

const UpcomingLessons = () => {
  const [students, setStudents] = useState([]);
  const lessons = [
    {
      city: "Sydney",
      date: "14 Oct 2024",
      name: "Wade Warren",
      status: "Pending",
      image: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      city: "Melbourne",
      date: "13 Oct 2024",
      name: "Esther Howard",
      status: "Accepted",
      image: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      city: "Brisbane",
      date: "9 Oct 2024",
      name: "Brooklyn Simmons",
      status: "Rejected",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      city: "Adelaide",
      date: "9 Oct 2024",
      name: "Guy Hawkins",
      status: "Accepted",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      city: "Perth",
      date: "8 Oct 2024",
      name: "Adelaide Richardson",
      status: "Pending",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
      city: "Perth",
      date: "8 Oct 2024",
      name: "Adelaide Richardson",
      status: "Pending",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
      city: "Perth",
      date: "8 Oct 2024",
      name: "Adelaide Richardson",
      status: "Pending",
      image: "https://randomuser.me/api/portraits/women/5.jpg",
    },
  ];

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-600",
    Accepted: "bg-green-100 text-green-600",
    Rejected: "bg-red-100 text-red-600",
  };
  const fetchLessons = async () => {
    try {
      const response = await axios.get(
        "items/Booking?filter[package][Instructor][_eq]=16&&filter[status]=pending&&fields=*,learner.user_id.first_name,learner.user_id.last_name,learner.user_id.profileImg"
      );
      setStudents(response.data.data); // Ensure `lessons` is a state variable
    } catch (err) {
      console.error("Error fetching lessons:", err);
    }
  };
  useEffect(() => {
    fetchLessons();
  }, []);
  console.log("students", students);
  return (
    <div className="w-full md:w-[42%] p-4 bg-white rounded-lg shadow-lg border border-solid border-slate-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Lessons</h2>
      <div className="space-t-4 overflow-y-auto max-h-[340px] scrollbar-thin scrollbar-thumb-gray-300">
        {students.map((lesson, index) => (
          <div
            key={index}
            className="flex items-center p-3 bg-white rounded-lg shadow-sm"
          >
            <img
              src={lesson.learner.user_id.profileImg}
              alt={`${lesson.learner.user_id.first_name} ${lesson.learner.user_id.last_name}`}
              className="w-10 h-10 rounded-full mr-3 shrink-0 object-cover"
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                {lesson.learner.user_id.first_name}{" "}
                {lesson.learner.user_id.last_name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const LessonBooking = () => {
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
    <div className="w-full md:w-[56%] p-6 px-4 lg:px-6 mt-8 md:mt-auto bg-white shadow-md rounded-lg border border-solid border-neutral-100">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Student Enrollment</h2>
          <div className="text-blue-600 text-2xl lg:text-3xl font-bold mt-2 mb-4">
            5000 Students
          </div>
        </div>
        <div>
          {/* Dropdown for selecting timeframe */}
          <select
            className="border border-gray-300 p-2 rounded-md shadow-sm"
            value={timeframeForDiversity}
            onChange={handleTimeframeChangeForDiversity}
          >
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="This Year">This Year</option>
            <option value="Overall">Overall</option>
          </select>
        </div>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer
        width="107%"
        height={300}
        className={"-ml-[6vw] xs:-ml-[4vw] md:-ml-[2.5vw]"}
      >
        <BarChart data={selectedDataForDiversity}>
          <CartesianGrid strokeDasharray="5 5" />
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
  const [bookingData, setBookingData] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `items/Booking?filter[package][Instructor][_eq]=${localStorage.getItem(
    "instructorId"
  )}&&fields=*,package.price,date_created`;

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
          weekData[dayIndex].netProfit = parseFloat(
            (weekData[dayIndex].netProfit + price * 0.8).toFixed(2)
          );
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
          monthData[weekIndex].netProfit = parseFloat(
            (monthData[weekIndex].netProfit + price * 0.8).toFixed(2)
          );
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
          months[monthIndex].netProfit = parseFloat(
            (months[monthIndex].netProfit + price * 0.8).toFixed(2)
          );
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
      setBookingData(bookings);

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
        <ResponsiveContainer height={300} width={"100%"}>
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

const AllBookings = () => {
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    growth: "N/A",
  });
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");

  // Helper function to group bookings by time period
  function groupBookingsByPeriod(bookings, period) {
    const now = new Date();
    return bookings.filter((booking) => {
      const dateCreated = new Date(booking.date_created);
      switch (period) {
        case "This Week":
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return dateCreated >= weekAgo;
        case "This Month":
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          return dateCreated >= monthAgo;
        case "This Year":
          const yearAgo = new Date(now);
          yearAgo.setFullYear(now.getFullYear() - 1);
          return dateCreated >= yearAgo;
        default:
          return true;
      }
    });
  }

  // Calculate booking counts
  function calculateBookingCounts(bookings, period) {
    const filteredBookings = groupBookingsByPeriod(bookings, period);
    const total = filteredBookings.length;
    const pending = filteredBookings.filter(
      (b) => b.status === "pending" || b.status === "Pending"
    ).length;
    const completed = filteredBookings.filter((b) => b.status === "Completed")
      .length;

    const previousPeriodBookings = groupBookingsByPeriod(
      bookings,
      getPreviousPeriod(period)
    );
    const previousTotal = previousPeriodBookings.length;
    const growth =
      previousTotal > 0
        ? (((total - previousTotal) / previousTotal) * 100).toFixed(2)
        : "N/A";

    return { total, pending, completed, growth };

    return { total, pending, completed };
  }

  function getPreviousPeriod(period) {
    switch (period) {
      case "weekly":
        return "previous_week";
      case "monthly":
        return "previous_month";
      case "yearly":
        return "previous_year";
      default:
        return "all_time";
    }
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "items/Booking?filter[package].[Instructor][_eq]=16"
        );
        const bookings = response.data.data;
        setCounts(calculateBookingCounts(bookings, selectedPeriod));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [selectedPeriod]);

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex flex-col justify-between border border-solid border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <FaListAlt className="text-3xl text-yellow-500" />
        <select
          className="p-2 border border-gray-300 rounded focus:outline-none"
          value={selectedPeriod}
          onChange={handlePeriodChange}
        >
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
          <option value="This Year">This Year</option>
        </select>
      </div>
      <h3 className="text-gray-600 font-medium">All Bookings</h3>
      <p className="text-2xl font-bold text-gray-800">{counts.total}</p>
      <div className="flex justify-between items-center text-gray-600">
        <div>
          <span>Pending</span>
          <p className="font-medium text-gray-800">{counts.pending}</p>
        </div>
        <div>
          <span>Completed</span>
          <p className="font-medium text-gray-800">
            {counts.completed}
            <span className="text-green-500 text-sm ml-2">
              {counts.growth}%
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const TotalHoursTaught = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `items/Booking?filter[package][Instructor][_eq]=${localStorage.getItem(
            "instructorId"
          )}&&filter[status]=Completed&&fields=*,package.duration`
        );
        setBookings(response.data.data); // Store the bookings from the response
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter bookings by timeframe
  const filterBookingsByTimeframe = (timeframe) => {
    const now = new Date();
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date_created);
      if (timeframe === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return bookingDate >= oneWeekAgo && bookingDate <= now;
      } else if (timeframe === "month") {
        return (
          bookingDate.getMonth() === now.getMonth() &&
          bookingDate.getFullYear() === now.getFullYear()
        );
      } else if (timeframe === "year") {
        return bookingDate.getFullYear() === now.getFullYear();
      }
      return false;
    });
  };

  // Calculate total hours based on filtered bookings
  const filteredBookings = filterBookingsByTimeframe(timeframe);
  const totalHours = filteredBookings.reduce(
    (sum, booking) => sum + (booking.package?.duration || 0),
    0
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex flex-col justify-between border border-solid border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <FaClock className="text-3xl text-yellow-500" />
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <h3 className="text-gray-600 font-medium">Total Hours Taught:</h3>
      <p className="text-2xl font-bold text-gray-800">{totalHours}</p>
      <div className="flex justify-between items-center text-gray-600">
        <span>
          Hours {timeframe === "week" ? "This Week" : `This ${timeframe}`}
        </span>
        <span className="font-medium text-gray-800">{totalHours}</span>
      </div>
    </div>
  );
};

const TotalEarnings = () => {
  const [timeframe, setTimeframe] = useState("week");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `items/Booking?filter[package][Instructor][_eq]=${localStorage.getItem(
            "instructorId"
          )}&&fields=*,package.*`
        );
        setBookings(response.data.data); // Store the bookings from the response
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter bookings by timeframe
  const filterBookingsByTimeframe = (timeframe) => {
    const now = new Date();
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date_created);
      if (timeframe === "week") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return bookingDate >= oneWeekAgo && bookingDate <= now;
      } else if (timeframe === "month") {
        return (
          bookingDate.getMonth() === now.getMonth() &&
          bookingDate.getFullYear() === now.getFullYear()
        );
      } else if (timeframe === "year") {
        return bookingDate.getFullYear() === now.getFullYear();
      }
      return false;
    });
  };

  // Calculate total earnings based on filtered bookings
  const filteredBookings = filterBookingsByTimeframe(timeframe);
  const totalEarnings = filteredBookings.reduce(
    (sum, booking) => sum + parseFloat(booking.package?.price || 0),
    0
  );

  // Get recent earnings (most recent booking price)
  const recentEarnings = filteredBookings.length
    ? parseFloat(filteredBookings[0]?.package?.price || 0)
    : 0;

  // Calculate growth (percentage change compared to previous timeframe)
  const previousTimeframeBookings = filterBookingsByTimeframe(
    timeframe === "week" ? "week" : timeframe === "month" ? "month" : "year"
  );
  const previousEarnings = previousTimeframeBookings.reduce(
    (sum, booking) => sum + parseFloat(booking.package?.price || 0),
    0
  );
  const growth =
    previousEarnings > 0
      ? (((totalEarnings - previousEarnings) / previousEarnings) * 100).toFixed(
          2
        )
      : 0;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex flex-col justify-between border border-solid border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <FaChartPie className="text-3xl text-blue-500" />
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
      <h3 className="text-gray-600 font-medium">Total Earnings</h3>
      <p className="text-2xl font-bold text-gray-800">
        ${totalEarnings.toFixed(2)}
      </p>
      <div className="flex justify-between items-center text-gray-600">
        <span>Recent</span>
        <span className="font-medium text-gray-800">
          ${recentEarnings.toFixed(2)}
        </span>
        <span
          className={`text-sm ${
            growth >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {growth >= 0 ? "+" : ""}
          {growth}%
        </span>
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
  const apiUrl = `items/Booking?filter[package][Instructor][_eq]=${localStorage.getItem(
    "instructorId"
  )}&&fields=*,learner.user_id.gender`;

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

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState("This Week");
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const [data, setData] = useState({
    earnings: { total: "$15,000", recent: "$525", growth: "+2.06%" },
    hours: { total: 125, weekly: 15 },
    bookings: { total: 345, pending: 25, completed: 320, growth: "+10.03%" },
  });

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setShowDropdown(false); // Close dropdown on selection

    // Logic to change data based on the selected timeframe
    if (newTimeframe === "This Month") {
      setData({
        earnings: { total: "$60,000", recent: "$2,100", growth: "+8.45%" },
        hours: { total: 500, weekly: 60 },
        bookings: {
          total: 1400,
          pending: 100,
          completed: 1300,
          growth: "+5.30%",
        },
      });
    } else if (newTimeframe === "This Year") {
      setData({
        earnings: { total: "$700,000", recent: "$50,000", growth: "+15.00%" },
        hours: { total: 7000, weekly: 120 },
        bookings: {
          total: 17000,
          pending: 200,
          completed: 16500,
          growth: "+12.50%",
        },
      });
    } else {
      setData({
        earnings: { total: "$15,000", recent: "$525", growth: "+2.06%" },
        hours: { total: 125, weekly: 15 },
        bookings: {
          total: 345,
          pending: 25,
          completed: 320,
          growth: "+10.03%",
        },
      });
    }
  };

  // Function to handle dropdown toggle
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const Dropdown = () => (
    <div className="relative inline-block text-left dropdown">
      <button
        className="inline-flex items-center text-gray-500 hover:text-gray-700"
        onClick={(e) => {
          e.stopPropagation(); // Prevent event from bubbling up
          toggleDropdown();
        }}
      >
        {timeframe} <MdExpandMore className="ml-1" />
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          {["This Week", "This Month", "This Year"].map((option) => (
            <button
              key={option}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => handleTimeframeChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Earnings Card */}
        <TotalEarnings />

        {/* Hours Card */}
        <TotalHoursTaught />

        {/* Bookings Card */}
        {/* <div className="p-4 bg-white rounded-lg shadow-md flex flex-col justify-between border border-solid border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <FaListAlt className="text-3xl text-yellow-500" />
            <Dropdown />
          </div>
          <h3 className="text-gray-600 font-medium">All Bookings</h3>
          <p className="text-2xl font-bold text-gray-800">
            {data.bookings.total}
          </p>
          <div className="flex justify-between items-center text-gray-600">
            <div>
              <span>Pending</span>
              <p className="font-medium text-gray-800">
                {data.bookings.pending}
              </p>
            </div>
            <div>
              <span>Completed</span>
              <p className="font-medium text-gray-800">
                {data.bookings.completed}
                <span className="text-green-500 text-sm ml-2">
                  {data.bookings.growth}
                </span>
              </p>
            </div>
          </div>
        </div> */}

        <AllBookings />
      </div>
      {/* --------------2nd row --------------- */}
      <div className="flex justify-between flex-wrap md:flex-nowrap mt-6">
        <UpcomingLessons />
        {/* <LessonBooking /> */}
        <StudentEnrollment />
      </div>
      {/* -----------------------3rd row----------------------- */}
      <RevenueGraph />
    </div>
  );
};

export default Dashboard;
