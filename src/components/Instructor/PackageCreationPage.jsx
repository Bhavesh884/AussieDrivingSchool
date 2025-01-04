import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import { set } from "date-fns";
import { useLoading } from "../../LoadingContext";
import { handleError } from "../../utils/Toastify";
import { ToastContainer } from "react-toastify";

const PackageCreationPage = ({ setPkg }) => {
  const [step, setStep] = useState(1); // To track the form step
  const [formData, setFormData] = useState({
    name: "",
    Plan_Type: "standard plan",
    Description: "",
    Discount: 0,
    price: "",
    duration: "",
    lessons: [],
  });

  const [lessons, setLessons] = useState([]);
  const [selectedLessonIds, setSelectedLessonIds] = useState([]);
  const [totalLessonDuration, setTotalLessonDuration] = useState(0);

  const { setIsLoading } = useLoading();
  const getLessons = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/items/Lessons?filter[instructor][_eq]=${localStorage.getItem(
          "instructorId"
        )}`
      );
      setLessons(response.data.data);
    } catch (err) {
      console.error("Error fetching lessons:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch lessons from API
  useEffect(() => {
    getLessons();
  }, []);

  useEffect(() => {
    const instructorId = localStorage.getItem("instructorId");
    if (instructorId) {
      setFormData((prev) => ({ ...prev, Instructor: instructorId }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLessonSelect = (lesson) => {
    const isAlreadySelected = selectedLessonIds.includes(lesson.id);
    const newTotalDuration = isAlreadySelected
      ? totalLessonDuration - lesson.Lesson_duration
      : totalLessonDuration + lesson.Lesson_duration;

    if (newTotalDuration <= formData.duration) {
      if (isAlreadySelected) {
        setSelectedLessonIds(
          selectedLessonIds.filter((id) => id !== lesson.id)
        );
      } else {
        setSelectedLessonIds([...selectedLessonIds, lesson.id]);
      }
      setTotalLessonDuration(newTotalDuration);
    } else {
      handleError("Selected lessons exceed the package duration.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post("/items/Packages", {
        name: formData.name,
        Plan_Type: formData.Plan_Type,
        // convert to int
        Discount: parseInt(formData.Discount),
        Description: formData.Description,
        price: parseInt(formData.price),
        duration: parseInt(formData.duration),
        Instructor: parseInt(localStorage.getItem("instructorId")),
        lessons: selectedLessonIds.map((id) => ({ Lessons_id: id })),
      });
      console.log(response.data);
      setStep(1);
      setFormData({
        name: "",
        Plan_Type: "standard plan",
        Discount: 0,
        price: "",
        duration: "",
        lessons: [],
      });
      setSelectedLessonIds([]);
      setTotalLessonDuration(0);
      setPkg("get");
    } catch (err) {
      console.log("Error creating package:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg min-h-screen  p-6  mt-4 w-full border border-solid border-slate-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Create a New Package
      </h2>

      {/* Step 1: Package Details */}
      {step === 1 && (
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col mb-2 ">
            <label className="block text-gray-700 font-semibold">
              Package Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full mt-2 p-3 border rounded-lg"
              placeholder="Enter package name"
            />
          </div>

          <div className="flex flex-col mb-2 ">
            <label className="block text-gray-700 font-semibold">
              Plan Type
            </label>
            <select
              name="Plan_Type"
              value={formData.Plan_Type}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border rounded-lg"
            >
              <option value="standard plan">Standard Plan</option>
              <option value="premium plan">Premium Plan</option>
            </select>
          </div>

          <div className="flex flex-col mb-2 ">
            <label className="block text-gray-700 font-semibold">
              Package Description
            </label>
            <input
              type="text"
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              required
              className="w-full mt-2 p-3 border rounded-lg"
              placeholder="Enter package name"
            />
          </div>

          <div className="flex flex-col mb-2 ">
            <label className="block text-gray-700 font-semibold">
              Discount (%)
            </label>
            <input
              type="number"
              name="Discount"
              value={formData.Discount}
              onChange={handleInputChange}
              className="w-full mt-2 p-3 border rounded-lg"
              placeholder="Enter discount"
            />
          </div>

          <div className="flex flex-col mb-2 ">
            <label className="block text-gray-700 font-semibold">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className="w-full mt-2 p-3 border rounded-lg"
              placeholder="Enter price"
            />
          </div>

          <div className="flex flex-col mb-4 ">
            <label className="block text-gray-700 font-semibold">
              Duration (Hours)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              className="w-full mt-2 p-3 border rounded-lg"
              placeholder="Enter duration"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            className="bg-indigo-600 text-white p-3 w-fit self-center px-6 rounded-lg hover:bg-indigo-700"
          >
            Next: Select Lessons
          </button>
        </form>
      )}

      {/* Step 2: Lesson Selection */}
      {step === 2 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Select Lessons (Total Duration: {totalLessonDuration} /{" "}
            {formData.duration} hours)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((lesson) => {
              const isSelected = selectedLessonIds.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    isSelected
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">
                      {lesson.lesson_name}
                    </h4>

                    {isSelected ? (
                      <FaCheckCircle className="text-2xl" />
                    ) : (
                      <FaPlusCircle className="text-2xl text-indigo-600" />
                    )}
                  </div>
                  <p className=" overflow-ellipsis">
                    {lesson.lesson_description}
                  </p>
                  <p className="font-bold">{lesson.Lesson_duration} hours</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-300 p-3 rounded-lg hover:bg-gray-400"
            >
              Previous
            </button>
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700"
            >
              Create Package
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default PackageCreationPage;
