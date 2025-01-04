import React, { useState } from "react";
import { FaDollarSign, FaBook, FaUsers, FaCaretDown } from "react-icons/fa";
import { FaSearch, FaFilter, FaUndo } from "react-icons/fa";
import Modal from "react-modal";

Modal.setAppElement("#root");

const FilteredTable = () => {
  // States for search, filters, and modal visibility
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeFrame, setTimeFrame] = useState("All");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isTimeFrameModalOpen, setIsTimeFrameModalOpen] = useState(false);

  const data = [
    {
      date: "2024-10-19",
      name: "Wade Warren",
      paymentMethod: "Credit Card",
      amount: "$300",
      location: "Naperville",
    },
    {
      date: "2024-10-15",
      name: "Jane Cooper",
      paymentMethod: "Bank Transfer",
      amount: "$500",
      location: "Austin",
    },
    {
      date: "2024-10-10",
      name: "Cameron Williamson",
      paymentMethod: "Credit Card",
      amount: "$100",
      location: "Toledo",
    },
    {
      date: "2024-10-03",
      name: "Guy Hawkins",
      paymentMethod: "Credit Card",
      amount: "$250",
      location: "Orange",
    },
    {
      date: "2024-11-04",
      name: "Robert Fox",
      paymentMethod: "Bank Transfer",
      amount: "$170",
      location: "Fairfield",
    },
    {
      date: "2024-09-24",
      name: "Leslie Alexander",
      paymentMethod: "Credit Card",
      amount: "$200",
      location: "Naperville",
    },
  ];

  // Filtered data based on search, date, and timeframe
  const filteredData = data.filter((row) => {
    // Apply search filter
    if (
      searchTerm &&
      !row.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    // Apply date range filter
    const rowDate = new Date(row.date);
    if (startDate && rowDate < new Date(startDate)) return false;
    if (endDate && rowDate > new Date(endDate)) return false;

    // Apply time frame filter
    const today = new Date();
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - 7);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    if (
      timeFrame === "Today" &&
      rowDate.toDateString() !== today.toDateString()
    )
      return false;
    if (timeFrame === "This Week" && rowDate < thisWeek) return false;
    if (timeFrame === "This Month" && rowDate < thisMonth) return false;
    if (timeFrame === "This Year" && rowDate < thisYear) return false;

    return true;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setTimeFrame("All");
  };

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center gap-4 mb-4 flex-wrap md:flex-nowrap">
        {/* Search Input */}
        <div className="flex items-center bg-gray-100 rounded-md px-4 py-2 w-[50%] border border-solid border-neutral-100">
          <FaSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 bg-transparent focus:outline-none text-neutral-600 w-full"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-8 justify-between shrink-0">
          <div
            onClick={() => setIsTimeFrameModalOpen(true)}
            className="flex items-center gap-3 font-semibold font-poppins text-desk-b-2 text-neutral-600"
          >
            <FaFilter className="" />
            {timeFrame}
          </div>

          <div
            onClick={() => setIsDateModalOpen(true)}
            className="flex items-center gap-3 font-semibold font-poppins text-desk-b-2 text-neutral-600"
          >
            Date
            <FaCaretDown />
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="text-red-500 flex items-center px-4 py-2"
          >
            <FaUndo className="mr-2" /> Reset Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto px-1 py-4">
        <table className="w-full border-collapse rounded-xl shadow-lg border border-slate-300 border-solid overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left font-semibold">Date</th>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Payment Method</th>
              <th className="p-3 text-left font-semibold">Amount</th>
              <th className="p-3 text-left font-semibold">Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <tr key={index} className="border border-slate-300 border-solid">
                <td className="p-3">
                  {new Date(row.date).toLocaleDateString()}
                </td>
                <td className="p-3 font-semibold">{row.name}</td>
                <td className="p-3">{row.paymentMethod}</td>
                <td className="p-3">{row.amount}</td>
                <td className="p-3">{row.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Time Frame Modal */}
      <Modal
        isOpen={isTimeFrameModalOpen}
        onRequestClose={() => setIsTimeFrameModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <h3 className="text-lg font-semibold mb-4">Select Time Frame</h3>
        {["All", "Today", "This Week", "This Month", "This Year"].map(
          (frame) => (
            <div key={frame}>
              <button
                className={`block w-full text-left py-2 px-4 rounded ${
                  frame === timeFrame
                    ? "bg-blue-100 font-semibold"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setTimeFrame(frame);
                  setIsTimeFrameModalOpen(false);
                }}
              >
                {frame}
              </button>
            </div>
          )
        )}
      </Modal>

      {/* Date Filter Modal */}
      <Modal
        isOpen={isDateModalOpen}
        onRequestClose={() => setIsDateModalOpen(false)}
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <h3 className="text-lg font-semibold mb-4">Select Date Range</h3>
        <input
          type="date"
          value={startDate}
          className="w-full p-2 border rounded mb-2"
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          onClick={() => setIsDateModalOpen(false)}
          className="w-full bg-blue-500 text-white py-2 rounded mt-2"
        >
          Apply
        </button>
      </Modal>
    </div>
  );
};

const Earnings = () => {
  // State to manage the selected time frame
  const [timeFrame, setTimeFrame] = useState("This Week");

  // Dummy data that changes based on the selected time frame
  const data = {
    "This Week": { earnings: "$500", lessons: 25, learners: 12 },
    "This Month": { earnings: "$2000", lessons: 100, learners: 50 },
    "This Year": { earnings: "$24000", lessons: 1200, learners: 600 },
  };

  // Dropdown handler to change the time frame
  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  return (
    <div className="px-6 py-4">
      <h2 className="text-3xl font-semibold mb-4">Earnings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Earnings Card */}
        <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-between border border-solid border-slate-200">
          <div className="flex justify-between items-center">
            <FaDollarSign className="text-blue-500 text-2xl" />
            <select
              className="text-gray-500 text-sm outline-none bg-transparent"
              value={timeFrame}
              onChange={handleTimeFrameChange}
            >
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Earnings
            </h3>
            <p className="text-3xl font-bold text-blue-500">
              {data[timeFrame].earnings}
            </p>
          </div>
        </div>

        {/* Lessons Completed Card */}
        <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-between border border-solid border-slate-200">
          <div className="flex justify-between items-center">
            <FaBook className="text-blue-500 text-2xl" />
            <select
              className="text-gray-500 text-sm outline-none bg-transparent"
              value={timeFrame}
              onChange={handleTimeFrameChange}
            >
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Lessons Completed
            </h3>
            <p className="text-3xl font-bold text-blue-500">
              {data[timeFrame].lessons}
            </p>
          </div>
        </div>

        {/* Active Learners Card */}
        <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col justify-between border border-solid border-slate-200">
          <div className="flex justify-between items-center">
            <FaUsers className="text-blue-500 text-2xl" />
            <select
              className="text-gray-500 text-sm outline-none bg-transparent"
              value={timeFrame}
              onChange={handleTimeFrameChange}
            >
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Active Learners
            </h3>
            <p className="text-3xl font-bold text-blue-500">
              {data[timeFrame].learners}
            </p>
          </div>
        </div>
      </div>
      <FilteredTable />
    </div>
  );
};

export default Earnings;
