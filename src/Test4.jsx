import React from "react";
import axios from "./axios";
import { useState } from "react";
import { useEffect } from "react";
import { FaChartPie } from "react-icons/fa";
import { FaClock } from "react-icons/fa";
import { FaListAlt } from 'react-icons/fa';
import { MdQueryStats } from "react-icons/md";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell, LineChart,
  Line } from "recharts";
import { FiDollarSign } from "react-icons/fi";

import { Country,State,City } from "country-state-city";


// const Test4 = () => {
//   const [selectedDataForDiversity, setSelectedDataForDiversity] = useState([]);
//   const [timeframeForDiversity, setTimeframeForDiversity] = useState("This Year");

//   useEffect(() => {
//     fetchData();
//   }, [timeframeForDiversity]);

//   const fetchData = async () => {
//     try {
//       const response = await axios("items/Learner");
//       const learners = response.data.data;
//       console.log("learners",learners)

//       // Process data into timeframes
//       const processedData = processLearnerData(learners);
//       setSelectedDataForDiversity(processedData[timeframeForDiversity]);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const processLearnerData = (learners) => {
//     const weeklyData = [];
//     const monthlyData = [];
//     const yearlyData = [];
//     const overallData = {};

//     const now = new Date();

//     learners.forEach((learner) => {
//       const createdDate = new Date(learner.date_created);
//       const gender = learner.user_id.gender;

//       // Weekly
//       const daysDiff = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
//       if (daysDiff <= 7) {
//         const day = createdDate.toLocaleDateString("en-US", { weekday: "short" });
//         addToGroup(weeklyData, day, gender);
//       }

//       // Monthly
//       if (now.getMonth() === createdDate.getMonth() && now.getFullYear() === createdDate.getFullYear()) {
//         const weekOfMonth = Math.ceil(createdDate.getDate() / 7);
//         addToGroup(monthlyData, `Week ${weekOfMonth}`, gender);
//       }

//       // Yearly
//       if (now.getFullYear() === createdDate.getFullYear()) {
//         const month = createdDate.toLocaleDateString("en-US", { month: "short" });
//         addToGroup(yearlyData, month, gender);
//       }

//       // Overall
//       const year = createdDate.getFullYear();
//       if (!overallData[year]) overallData[year] = { male: 0, female: 0 };
//       overallData[year][gender]++;
//     });

//     return {
//       "This Week": weeklyData,
//       "This Month": monthlyData,
//       "This Year": yearlyData,
//       Overall: Object.entries(overallData).map(([year, counts]) => ({ name: year, ...counts })),
//     };
//   };

//   const addToGroup = (group, key, gender) => {
//     const existing = group.find((item) => item.name === key);
//     if (existing) {
//       existing[gender]++;
//     } else {
//       group.push({ name: key, male: gender === "male" ? 1 : 0, female: gender === "female" ? 1 : 0 });
//     }
//   };

//   const handleTimeframeChangeForDiversity = (event) => {
//     setTimeframeForDiversity(event.target.value);
//   };

//   return (
//     <div className="flex-grow w-full md:w-[calc(65%-0.5rem)] p-6 bg-white shadow-md rounded-lg border border-solid border-neutral-100">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-xl font-bold">Student Enrollment</h2>
//           <div className="text-blue-600 text-4xl font-bold mt-2">
//             {selectedDataForDiversity.reduce((sum, item) => sum + item.male + item.female, 0)} Students
//           </div>
//         </div>
//         <div>
//           <select
//             className="border border-gray-300 p-2 rounded-md shadow-sm"
//             value={timeframeForDiversity}
//             onChange={handleTimeframeChangeForDiversity}
//           >
//             <option value="This Week">This Week</option>
//             <option value="This Month">This Month</option>
//             <option value="This Year">This Year</option>
//             <option value="Overall">Overall</option>
//           </select>
//         </div>
//       </div>

//       <div className="w-[106%] sm:w-full ml-[-5.5vw] sm:ml-[-4vw] lg:ml-[-2vw]">
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={selectedDataForDiversity}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="male" stackId="a" fill="#007bff" />
//             <Bar dataKey="female" stackId="a" fill="#ffc107" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };


//hous taught
// const Test4 = () => {
//   const [data, setData] = useState({
//     total: 0,
//     weekly: 0,
//     monthly: 0,
//     yearly: 0,
//   });

//   const [selectedPeriod, setSelectedPeriod] = useState("This Week");

//   // Helper function to group lessons by time period
//   const groupLessonsByPeriod = (lessons, period) => {
//     const now = new Date();
//     return lessons.filter((lesson) => {
//       const dateCreated = new Date(lesson.date_created);
//       switch (period) {
//         case "This Week": {
//           const startOfWeek = new Date(now);
//           startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
//           return dateCreated >= startOfWeek;
//         }
//         case "This Month": {
//           const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month
//           return dateCreated >= startOfMonth;
//         }
//         case "This Year": {
//           const startOfYear = new Date(now.getFullYear(), 0, 1); // Start of current year
//           return dateCreated >= startOfYear;
//         }
//         default:
//           return true;
//       }
//     });
//   };

//   // Calculate total hours taught and for specific periods
//   const calculateHours = (lessons, period) => {
//     const filteredLessons = groupLessonsByPeriod(lessons, period);
//     const totalHours = filteredLessons.reduce(
//       (sum, lesson) => sum + (lesson.Lesson_duration || 0),
//       0
//     );
//     return totalHours;
//   };

//   useEffect(() => {
//     const fetchLessons = async () => {
//       try {
//         const response = await axios.get(
//           `items/Booking?filter[package].[Instructor][_eq]=${localStorage.getItem("instructorId")}&fields=lesson_completed.lesson.*`
//         );
//         const bookings = response.data.data;
//         console.log("response.data.data",response.data.data)

//         // Extract all lessons from the bookings
//         const lessons = bookings.flatMap((booking) =>
//           booking.lesson_completed.map((lc) => lc.lesson)
//         );

//         setData({
//           total: calculateHours(lessons, "All Time"),
//           weekly: calculateHours(lessons, "This Week"),
//           monthly: calculateHours(lessons, "This Month"),
//           yearly: calculateHours(lessons, "This Year"),
//         });
//       } catch (error) {
//         console.error("Error fetching lessons:", error);
//       }
//     };

//     fetchLessons();
//   }, []);

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md flex flex-col justify-between border border-solid border-slate-200">
//       <div className="flex justify-between items-center mb-4">
//         <FaClock className="text-3xl text-yellow-500" />
//         <select
//           className="p-2 border border-gray-300 rounded focus:outline-none"
//           value={selectedPeriod}
//           onChange={(e) => setSelectedPeriod(e.target.value)}
//         >
//           <option value="This Week">This Week</option>
//           <option value="This Month">This Month</option>
//           <option value="This Year">This Year</option>
//         </select>
//       </div>
//       <h3 className="text-gray-600 font-medium">Total Hours Taught:</h3>
//       <p className="text-2xl font-bold text-gray-800">{data.total}</p>
//       <div className="flex justify-between items-center text-gray-600">
//         <span>Hours This Week</span>
//         <span className="font-medium text-gray-800">{data.weekly}</span>
//       </div>
//       <div className="flex justify-between items-center text-gray-600">
//         <span>Hours This Month</span>
//         <span className="font-medium text-gray-800">{data.monthly}</span>
//       </div>
//       <div className="flex justify-between items-center text-gray-600">
//         <span>Hours This Year</span>
//         <span className="font-medium text-gray-800">{data.yearly}</span>
//       </div>
//     </div>
//   );
// };




// const Test4 = () => {
//   const [activeTimeframe, setActiveTimeframe] = useState("thisWeek");
//   const [selectedDataRevenue, setSelectedDataRevenue] = useState([]);
//   const [bookings, setBookings] = useState([]);

//   const handleTimeframeChange = (value) => {
//     setActiveTimeframe(value);
//   };

//   // Fetch bookings data from the API using Axios
//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         const response = await axios.get(
//           "http://3.6.180.229:8055/items/Booking?filter[package][Instructor][_eq]=16&&fields=*,package.*"
//         );
//         setBookings(response.data.data); // Assuming the bookings are inside the 'data' field
//       } catch (error) {
//         console.error("Error fetching bookings:", error);
//       }
//     };

//     fetchBookings();
//   }, []);

//   // Helper function to calculate weekly, monthly, yearly revenue
//   const calculateRevenue = () => {
//     const weeklyData = [];
//     const monthlyData = [];
//     const yearlyData = [];

//     const currentYear = new Date().getFullYear(); // Get the current year dynamically

//     bookings.forEach((booking) => {
//       const price = parseFloat(booking.package.price);
//       const duration = booking.package.duration; // Assuming duration is in weeks

//       // Weekly Revenue (showing days of the week: Mon, Tue, etc.)
//       const weeklyRevenue = price / duration;
//       for (let i = 0; i < duration; i++) {
//         const dayOfWeek = new Date(currentYear, 0, i + 1).toLocaleString("en-us", { weekday: "short" }); // Get weekday name (Mon, Tue, etc.)
//         weeklyData.push({ name: dayOfWeek, totalRevenue: weeklyRevenue, netProfit: weeklyRevenue * 0.5 });
//       }

//       // Monthly Revenue (showing month names: Jan, Feb, etc.)
//       const monthlyRevenue = (price / duration) * 4; // Assuming 4 weeks per month
//       for (let i = 0; i < 12; i++) {
//         const monthName = new Date(currentYear, i, 1).toLocaleString("en-us", { month: "short" }); // Get month name (Jan, Feb, etc.)
//         monthlyData.push({ name: monthName, totalRevenue: monthlyRevenue, netProfit: monthlyRevenue * 0.5 });
//       }

//       // Yearly Revenue (showing months: Jan, Feb, etc.)
//       yearlyData.push({ name: "Year", totalRevenue: price, netProfit: price * 0.5 });
//     });

//     return { weeklyData, monthlyData, yearlyData };
//   };

//   useEffect(() => {
//     const { weeklyData, monthlyData, yearlyData } = calculateRevenue();

//     switch (activeTimeframe) {
//       case "thisWeek":
//         setSelectedDataRevenue(weeklyData);
//         break;
//       case "thisMonth":
//         setSelectedDataRevenue(monthlyData);
//         break;
//       case "thisYear":
//         setSelectedDataRevenue(yearlyData);
//         break;
//       default:
//         setSelectedDataRevenue(yearlyData);
//         break;
//     }
//   }, [activeTimeframe, bookings]);

//   return (
//     <div className="p-4 bg-white shadow-lg rounded-lg border border-solid border-neutral-100 mt-8">
//       <h3 className="text-2xl font-semibold">Revenue</h3>
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <div className="text-blue-600 text-4xl font-bold mt-2">
//             ${selectedDataRevenue.reduce((acc, data) => acc + data.totalRevenue, 0).toFixed(2)}
//           </div>
//           <div className="text-gray-500">{bookings.length} Bookings</div>
//         </div>

//         {/* Timeframe dropdown */}
//         <select
//           name="revenew"
//           id="revenew"
//           onChange={(e) => handleTimeframeChange(e.target.value)}
//           className="p-2 bg-gray-100 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={activeTimeframe}
//         >
//           <option value="thisWeek">This Week</option>
//           <option value="thisMonth">This Month</option>
//           <option value="thisYear">This Year</option>
//         </select>
//       </div>

//       {/* Line Chart */}
//       <ResponsiveContainer width="100%" height={300} className={"-ml-[2vw] mt-4"}>
//         <LineChart data={selectedDataRevenue}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="totalRevenue"
//             stroke="#007bff"
//             activeDot={{ r: 8 }}
//           />
//           <Line type="monotone" dataKey="netProfit" stroke="#ffc107" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };






// Function to process chart data




// Function to process chart data


const Test4 = () => {
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
        <h1 className="text-5xl font-bold text-blue-600 mr-2">
          {averageSuccessRate}
        </h1>
        <span className="text-xl">Success Rate</span>
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


export default Test4;


