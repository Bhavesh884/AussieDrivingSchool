import React, { useEffect, useState } from "react";
import { CgSmile, CgDanger, CgDollar } from "react-icons/cg";
import Modal from "react-modal";
import axios from "../../axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteNotificationModal, setDeleteNotificationModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

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

  const handleDeleteNotification = async (id) => {
    // Simulating delete action

    try {
      const response = await axios.delete(`/items/Notifications/${id}`);
      console.log(response.data);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
      // fetchNotifications();
    } catch (error) {
      console.log(error);
    }
    setDeleteNotificationModal(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const { icon, textColor, bgColor } = getCategoryStyles(
              notification.Type
            );

            return (
              <div
                key={notification.id}
                className={`flex items-center justify-between space-x-3 p-4 rounded-md shadow ${bgColor}`}
              >
                <div className="flex items-center space-x-3">
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
                <button
                  onClick={() => {
                    setDeleteNotificationModal(true);
                    setNotificationToDelete(notification.id);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
      <hr className="border-t border-gray-300 my-4" />

      {/* Delete Notification Modal */}
      <Modal
        isOpen={deleteNotificationModal}
        onRequestClose={() => setDeleteNotificationModal(false)}
        className="w-[90%] max-w-md p-6 bg-white rounded-lg shadow-lg mx-auto mt-24"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center"
      >
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <span className="text-3xl font-bold">⚠</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Notification?
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete this notification? This action
            cannot be undone.
          </p>
          <div className="flex justify-between space-x-4">
            <button
              onClick={() => setDeleteNotificationModal(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteNotification(notificationToDelete)}
              className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notifications;
