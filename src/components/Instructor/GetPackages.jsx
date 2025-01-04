import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { FaTrash } from "react-icons/fa";
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { useLoading } from "../../LoadingContext";

const DeleteModal = ({ packageName, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h2>
      <p className="text-gray-600">
        Are you sure you want to delete the package{" "}
        <span className="font-semibold">{packageName}</span>?
      </p>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
        >
          No
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
);

const GetPackages = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const location = useLocation();
  const navigate = useNavigation();
  const navigates = useNavigate();

  const handleDeleteClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };
  const { setIsLoading } = useLoading();

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `/items/Packages/${selectedPackage.id}`
      );
      console.log(response);
      setSelectedPackage(null);
      setShowModal(false);
      fetchAllPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllPackages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/items/Packages?filter[Instructor][_eq]=${localStorage.getItem(
          "instructorId"
        )}&fields=*,lessons.*,lessons.Lessons_id.*`
      );
      console.log(response.data.data);
      setPackages(response.data.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addPackage = () => {
    navigates("/instructordashboard");
  };
  useEffect(() => {
    fetchAllPackages();
  }, []);

  return (
    <div
      className={`mt-6  min-h-screen ${location.pathname === "/getpackages" &&
        "p-10"}`}
    >
      <h1 className="text-3xl font-bold text-blue-600 mb-6 ">
        Available Packages
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white shadow-lg rounded-lg p-4 hover:shadow-2xl transition-shadow duration-300 border-2 border-neutral-100 drop-shadow-lg flex flex-col h-[380px] border-solid"
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
                  <p className="text-gray-700 font-semibold mb-1">Lessons:</p>
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
            <button
              className={`mt-4 text-white py-2 rounded-md flex items-center justify-center bg-error-300 hover:bg-error-200 transition-all ${
                location.pathname === "/getpackages" ? "hidden" : ""
              }`}
              onClick={() => handleDeleteClick(pkg)}
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        ))}
      </div>
      <div
        className={`w-full flex items-center justify-center ${location.pathname ===
          "/instructordashboard" && "hidden"}`}
      >
        <button
          className={`p-2 border bg-secondary-300 rounded-md hover:bg-secondary-400 mt-10 text-white border-secondary-300 `}
          onClick={addPackage}
        >
          Add New Package
        </button>
      </div>
      {showModal && (
        <DeleteModal
          packageName={selectedPackage?.name}
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default GetPackages;
