import React, { useState, useEffect } from "react";
import axios from "../../axios";
import {
  FaEdit,
  FaTrashAlt,
  FaEye,
  FaTimes,
  FaPlus,
  FaBook,
} from "react-icons/fa";
import { useLoading } from "../../LoadingContext";

const LessonManager = () => {
  const [activeTab, setActiveTab] = useState("view");
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({
    lesson_name: "",
    lesson_description: "",
    Lesson_duration: "1",
  });
  const [editLesson, setEditLesson] = useState(null);

  useEffect(() => {
    fetchLessons();
  }, []);
  const { setIsLoading } = useLoading();

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/items/Lessons?filter[instructor][_eq]=${localStorage.getItem(
          "instructorId"
        )}`
      );
      setLessons(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLesson = async () => {
    try {
      setIsLoading(true);
      await axios.post("/items/Lessons", {
        lesson_name: newLesson.lesson_name,
        lesson_description: newLesson.lesson_description,
        Lesson_duration: newLesson.Lesson_duration,
        instructor: localStorage.getItem("instructorId"),
      });
      setNewLesson({
        lesson_name: "",
        lesson_description: "",
        Lesson_duration: "1",
      });
      setActiveTab("view");
      fetchLessons();
    } catch (error) {
      console.error("Error creating lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLesson = async () => {
    try {
      setIsLoading(true);
      if (!editLesson) return;
      await axios.patch(`/items/Lessons/${editLesson.id}`, {
        lesson_description: editLesson.lesson_description,
        Lesson_duration: editLesson.Lesson_duration,
        lesson_name: editLesson.lesson_name,
        instructor: localStorage.getItem("instructorId"),
      });
      //close all modals
      setEditLesson(null);
      setSelectedLesson(null);
      fetchLessons();
    } catch (error) {
      console.error("Error updating lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLesson = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`/items/Lessons/${id}`);
      fetchLessons();
      setSelectedLesson(null);
    } catch (error) {
      console.error("Error deleting lesson:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Lesson Manager <FaBook className="inline-block text-indigo-500" />
      </h1>

      <div className="mb-6 flex justify-center space-x-4">
        {["view", "create"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-indigo-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "view" ? "View Lessons" : "Create Lesson"}
          </button>
        ))}
      </div>

      {activeTab === "view" && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">1-Hour Lessons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons
                .filter((lesson) => lesson.Lesson_duration === 1)
                .map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-white shadow-md rounded-lg p-4 relative min-h-[200px] border-l-4 border-orange-500"
                  >
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {lesson.lesson_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate-2-lines mb-4">
                      {lesson.lesson_description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {lesson.Lesson_duration} hour(s)
                    </p>
                    <div className="absolute bottom-4 left-4 right-4 flex gap-4 space-x-2">
                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className="p-2 bg-blue-500 text-white rounded flex items-center space-x-1 hover:bg-blue-600"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => setEditLesson(lesson)}
                        className="p-2 bg-yellow-500 text-white rounded flex items-center space-x-1 hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-2 bg-red-500 text-white rounded flex items-center space-x-1 hover:bg-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">2-Hour Lessons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons
                .filter((lesson) => lesson.Lesson_duration === 2)
                .map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-white shadow-md rounded-lg p-4 relative min-h-[200px] border-l-4 border-blue-500"
                  >
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {lesson.lesson_name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate-2-lines mb-4">
                      {lesson.lesson_description}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {lesson.Lesson_duration} hour(s)
                    </p>
                    <div className="absolute bottom-4 left-4 right-4 flex gap-4 space-x-2">
                      <button
                        onClick={() => setSelectedLesson(lesson)}
                        className="p-2 bg-blue-500 text-white rounded flex items-center space-x-1 hover:bg-blue-600"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => setEditLesson(lesson)}
                        className="p-2 bg-yellow-500 text-white rounded flex items-center space-x-1 hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(lesson.id)}
                        className="p-2 bg-red-500 text-white rounded flex items-center space-x-1 hover:bg-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "create" && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Create New Lesson</h2>
          <input
            type="text"
            placeholder="Lesson Name"
            className="w-full p-2 mb-4 border rounded"
            value={newLesson.lesson_name}
            onChange={(e) =>
              setNewLesson({ ...newLesson, lesson_name: e.target.value })
            }
          />
          <textarea
            placeholder="Lesson Description"
            className="w-full p-2 mb-4 border rounded"
            value={newLesson.lesson_description}
            onChange={(e) =>
              setNewLesson({ ...newLesson, lesson_description: e.target.value })
            }
          />
          <select
            className="w-full p-2 mb-4 border rounded"
            value={newLesson.Lesson_duration}
            onChange={(e) =>
              setNewLesson({ ...newLesson, Lesson_duration: e.target.value })
            }
          >
            <option value="1">1 Hour</option>
            <option value="2">2 Hours</option>
          </select>
          <button
            onClick={handleCreateLesson}
            className="flex  items-center p-3 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            <FaPlus className="mr-2" /> Create Lesson
          </button>
        </div>
      )}

      {selectedLesson && (
        <Modal
          lesson={selectedLesson}
          closeModal={() => setSelectedLesson(null)}
          onDelete={() => handleDeleteLesson(selectedLesson.id)}
          setEditLesson={setEditLesson}
        />
      )}

      {editLesson && (
        <EditModal
          lesson={editLesson}
          setEditLesson={setEditLesson}
          onUpdate={handleUpdateLesson}
          closeModal={() => setEditLesson(null)}
        />
      )}
    </div>
  );
};

const Modal = ({ lesson, closeModal, onDelete, setEditLesson }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Lesson Details</h2>
      <p className="font-bold">Name:</p>
      <p className="mb-2">{lesson.lesson_name}</p>
      <p className="font-bold">Description:</p>
      <p className="mb-2">{lesson.lesson_description}</p>
      <p className="font-bold">Duration:</p>
      <p className="mb-4">{lesson.Lesson_duration} hour(s)</p>
      <div className="flex justify-center flex-wrap xs:flex-nowrap gap-4 xs:justify-between font-semibold">
        <button
          onClick={closeModal}
          className="flex items-center gap-2 p-3 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          <FaTimes />
          Cancel
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-2 p-3 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <FaTrashAlt />
          Delete
        </button>
        <button
          onClick={() => setEditLesson(lesson)}
          className="flex items-center gap-2 p-3 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          <FaEye />
          Edit
        </button>
      </div>
    </div>
  </div>
);

const EditModal = ({ lesson, onUpdate, setEditLesson, closeModal }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Lesson</h2>

      <input
        type="text"
        placeholder="Lesson Name"
        className="w-full p-2 mb-4 border rounded"
        value={lesson.lesson_name}
        onChange={(e) =>
          setEditLesson({
            ...lesson,
            lesson_name: e.target.value,
          })
        }
      />

      <textarea
        placeholder="Lesson Description"
        className="w-full p-2 mb-4 border rounded"
        value={lesson.lesson_description}
        onChange={(e) =>
          setEditLesson({
            ...lesson,
            lesson_description: e.target.value,
          })
        }
      />

      <select
        className="w-full p-2 mb-4 border rounded"
        value={lesson.Lesson_duration}
        onChange={(e) =>
          setEditLesson({
            ...lesson,
            Lesson_duration: e.target.value,
          })
        }
      >
        <option value="1">1 Hour</option>
        <option value="2">2 Hours</option>
      </select>

      <div className="flex justify-between">
        <button
          onClick={onUpdate}
          className="p-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save
        </button>

        <button
          onClick={closeModal}
          className="p-3 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default LessonManager;
