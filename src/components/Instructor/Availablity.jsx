import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./customCalendar.css";
import SetAvailability from "./SetAvailability";
import GetAvailability from "./GetAvailability";

const localizer = momentLocalizer(moment);

const Availability = () => {
  const [availability, setAvailability] = useState("get");
  return (
    <div className=" p-6 bg-white ">
      <div className="py-4 flex items-center gap-6 border-b border-solid border-slate-400">
        <div
          className={`px-8 py-3  ${
            availability !== "get"
              ? "border border-blue-300 border-solid rounded-b-lg bg-blue-200 "
              : "bg-blue-400 rounded-t-lg text-white border-b-4 border-blue-500 border-solid scale-105"
          } font-bold transition-all ease-in-out duration-300 cursor-pointer`}
          onClick={() => setAvailability("get")}
        >
          Get Availablity
        </div>
        <div
          className={`px-8 py-3 rounded-t-lg ${
            availability !== "set"
              ? "border border-blue-300 border-solid rounded-b-lg bg-blue-200 "
              : "bg-blue-400 rounded-t-lg text-white border-b-4 border-blue-500 border-solid scale-105 "
          } font-bold transition-all ease-in-out duration-300 cursor-pointer`}
          onClick={() => setAvailability("set")}
        >
          Set Availablity
        </div>
      </div>
      {availability === "get" ? (
        <GetAvailability />
      ) : (
        <SetAvailability setAvailabilityBool={setAvailability} />
      )}
    </div>
  );
};

export default Availability;
