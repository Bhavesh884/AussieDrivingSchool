import React, { useEffect, useState } from "react";
import { CgSmile, CgDanger, CgDollar } from "react-icons/cg"; // Icons for categories
import axios from "../../axios";
import { FaWindowClose } from "react-icons/fa";

const Notifications = ({ setNotificationModal }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get user ID from localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/items/Notifications?filter[user_id]=${userId}`
      );
      setNotifications(response.data.data || []);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryStyles = (type) => {
    switch (type) {
      case "welcome":
        return {
          icon: <CgSmile size={24} className="text-green-500" />,
          textColor: "text-green-800",
          bgColor: "bg-green-50",
        };
      case "alert":
        return {
          icon: <CgDanger size={24} className="text-red-500" />,
          textColor: "text-red-800",
          bgColor: "bg-red-50",
        };
      case "Note":
        return {
          icon: <CgDollar size={24} className="text-blue-500" />,
          textColor: "text-blue-800",
          bgColor: "bg-blue-50",
        };
      default:
        return {
          icon: <CgSmile size={24} className="text-gray-500" />,
          textColor: "text-gray-800",
          bgColor: "bg-gray-50",
        };
    }
  };

  return (
    <div className="p-4 ">
      {/* have a close button */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold">Notifications</div>
        <div
          onClick={() => setNotificationModal(false)}
          className=" p-1  bg-red-500 text-white rounded hover:bg-red-600"
        >
          <FaWindowClose />
        </div>
      </div>
      <hr className="border-t border-gray-300 my-4" />
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {/* take just 5 elements from the notifications array */}
          {notifications.slice(0, 5).map((notification) => {
            const { icon, textColor, bgColor } = getCategoryStyles(
              notification.Type
            );

            return (
              <div
                key={notification.id}
                className={`flex items-center space-x-3 p-4 rounded-md shadow ${bgColor}`}
              >
                {icon}
                <div>
                  <p className={`text-sm ${textColor}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.post_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <hr className="border-t border-gray-300 my-4" />
    </div>
  );
};

export default Notifications;
