import React, { useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../LoadingContext";
import axios from "../../axios";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlotsIds, setSelectedSlotsIds] = useState([]);

  const DeleteAvailability = async (overlappingSlots) => {
    const keys = overlappingSlots.map((slot) => slot.id);
    try {
      setIsLoading(true);
      const response = await axios.delete(`/items/Availability`, {
        data: { keys: keys }, // Specify data explicitly here
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error deleting availability:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const findOverlappingAvailabilities = async (selectedSlots, slots) => {
    console.log(selectedSlots, "slots bgrh", slots);
    // Step 1: Extract unique dates from selected slots
    const selectedDates = new Set(
      selectedSlots?.map(
        (slot) => new Date(slot.start_datetime).toISOString().split("T")[0]
      )
    );

    // Step 2: Filter slots that fall on the selected dates
    const slotsOnSelectedDates = slots.filter((slot) => {
      const slotDate = new Date(slot.start_datetime)
        .toISOString()
        .split("T")[0];
      return selectedDates.has(slotDate);
    });

    // Step 3: Helper function to check if two time ranges overlap
    const isOverlapping = (slot1, slot2) => {
      return (
        new Date(slot1.start_datetime) < new Date(slot2.end_datetime) &&
        new Date(slot1.end_datetime) > new Date(slot2.start_datetime)
      );
    };

    // Step 4: Find overlapping slots, excluding the selected slots themselves
    const overlappingSlots = slotsOnSelectedDates.filter((slot) =>
      selectedSlots.some(
        (selectedSlot) =>
          slot.id !== selectedSlot.id && isOverlapping(selectedSlot, slot)
      )
    );

    return overlappingSlots;
  };
  const MarkAvailability = async () => {
    try {
      setIsLoading(true);
      // Create the payload by mapping over selectedSlots
      const payload = JSON.parse(localStorage.getItem("selectedSlots")).map(
        (slot) => ({
          id: slot.id,
          status: "booked",
        })
      );

      // Send the PATCH request with the payload
      const response = await axios.patch(`items/Availability/`, payload);

      console.log(response);
    } catch (error) {
      console.log("Error marking availability:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createBooking = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("items/Booking", {
        learner: localStorage.getItem("LearnerId"),
        package: localStorage.getItem("selectedPackage"),
        status: "pending",
        Availability: JSON.parse(localStorage.getItem("selectedSlotsIds")),
      });
      console.log(response.data);
      MarkAvailability();
      const overlappingSlots = await findOverlappingAvailabilities(
        JSON.parse(localStorage.getItem("selectedSlots")),
        JSON.parse(localStorage.getItem("slots"))
      );
      console.log(overlappingSlots, "overlapinggggggggg");

      DeleteAvailability(overlappingSlots);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    //check all null conditions
    if (
      localStorage.getItem("selectedPackage") === null ||
      localStorage.getItem("selectedSlotsIds") === null ||
      localStorage.getItem("selectedSlots") === null ||
      localStorage.getItem("slots") === null
    ) {
      navigate("/learnerpage");
    }
    setSelectedSlots(JSON.parse(localStorage.getItem("selectedSlots")));
    setSlots(JSON.parse(localStorage.getItem("slots")));
    setSelectedSlotsIds(JSON.parse(localStorage.getItem("selectedSlotsIds")));

    createBooking();

    //at unmount clear local storage
    return () => {
      localStorage.removeItem("selectedPackage");
      localStorage.removeItem("selectedSlotsIds");
      localStorage.removeItem("selectedSlots");
      localStorage.removeItem("slots");
    };
  }, []);
  if (
    localStorage.getItem("selectedPackage") === null ||
    localStorage.getItem("selectedSlotsIds") === null ||
    localStorage.getItem("selectedSlots") === null ||
    localStorage.getItem("slots") === null
  )
    return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 via-green-100 to-green-50 p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 lg:p-12 max-w-3xl w-full text-center">
        <div className="flex justify-center mb-6 animate-bounce">
          <AiOutlineCheckCircle className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 text-lg md:text-xl">
          Thank you for your payment. Your transaction was completed
          successfully, and we appreciate your trust in our services.
        </p>

        <button
          onClick={() => {
            // setIsSuccessModalOpen(false);
            navigate("/learnerpage");
          }}
          className="mt-6 px-6 py-3 bg-green-500 text-white rounded-full font-medium text-lg shadow-lg transform transition hover:scale-105 hover:bg-green-600"
        >
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
