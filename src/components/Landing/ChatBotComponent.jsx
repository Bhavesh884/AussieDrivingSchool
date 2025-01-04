import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

// Custom Tailwind Form Component
const QueryForm = ({ steps, triggerNextStep }) => {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    setSubmitted(true); // Show thank you message
    setTimeout(() => triggerNextStep(), 2000); // Proceed to the next chatbot step after a delay
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
      {submitted ? (
        <div className="text-center">
          <p className="text-lg font-semibold text-green-600">
            Thank you! Your query has been submitted.
          </p>
          <p className="text-sm text-gray-600">We'll get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              id="mobile"
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your mobile number"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Query Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Describe your query"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 px-6 rounded-md font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            Submit Query
          </button>
        </form>
      )}
    </div>
  );
};

const ChatBotComponent = () => {
  const steps = [
    {
      id: "welcome",
      message:
        "Hi! Welcome to our Driving Learning School. How can I assist you today?",
      trigger: "main-options",
    },
    {
      id: "main-options",
      options: [
        {
          value: "instructor",
          label: "About becoming an Instructor",
          trigger: "instructor-questions",
        },
        {
          value: "learner",
          label: "About becoming a Learner",
          trigger: "learner-questions",
        },
        {
          value: "booking",
          label: "About Booking Lessons",
          trigger: "booking-questions",
        },
        { value: "query", label: "Submit a Query", trigger: "query-form" },
      ],
    },
    {
      id: "instructor-questions",
      message: "What would you like to know about becoming an instructor?",
      trigger: "instructor-options",
    },
    {
      id: "instructor-options",
      options: [
        {
          value: "requirements",
          label: "What are the requirements?",
          trigger: "instructor-requirements",
        },
        {
          value: "signup",
          label: "How to sign up?",
          trigger: "instructor-signup",
        },
        {
          value: "payment",
          label: "What is the payment process?",
          trigger: "instructor-payment",
        },
      ],
    },
    {
      id: "instructor-requirements",
      message:
        "To become an instructor, you need a valid license, proof of experience, and a clean driving record.",
      trigger: "main-options",
    },
    {
      id: "instructor-signup",
      message:
        "You can sign up as an instructor through our platform by clicking on 'Become an Instructor' on the homepage.",
      trigger: "main-options",
    },
    {
      id: "instructor-payment",
      message:
        "Instructors receive payments weekly via bank transfer for the lessons they conduct.",
      trigger: "main-options",
    },
    {
      id: "learner-questions",
      message: "What would you like to know about becoming a learner?",
      trigger: "learner-options",
    },
    {
      id: "learner-options",
      options: [
        {
          value: "requirements",
          label: "What are the requirements?",
          trigger: "learner-requirements",
        },
        {
          value: "signup",
          label: "How to sign up?",
          trigger: "learner-signup",
        },
        { value: "fees", label: "What are the fees?", trigger: "learner-fees" },
      ],
    },
    {
      id: "learner-requirements",
      message:
        "To become a learner, you need to provide basic identification details and select a driving course.",
      trigger: "main-options",
    },
    {
      id: "learner-signup",
      message:
        "Sign up as a learner by clicking on 'Start Learning' on the homepage and creating an account.",
      trigger: "main-options",
    },
    {
      id: "learner-fees",
      message:
        "The fees depend on the course you choose. Visit the 'Courses' section on our website for details.",
      trigger: "main-options",
    },
    {
      id: "booking-questions",
      message: "What would you like to know about booking lessons?",
      trigger: "booking-options",
    },
    {
      id: "booking-options",
      options: [
        {
          value: "how-to",
          label: "How to book a lesson?",
          trigger: "booking-how-to",
        },
        {
          value: "reschedule",
          label: "Can I reschedule a lesson?",
          trigger: "booking-reschedule",
        },
        {
          value: "cancellation",
          label: "What is the cancellation policy?",
          trigger: "booking-cancellation",
        },
      ],
    },
    {
      id: "booking-how-to",
      message:
        "You can book a lesson by selecting an instructor and a time slot that works for you on the 'Book Lesson' page.",
      trigger: "main-options",
    },
    {
      id: "booking-reschedule",
      message:
        "Lessons can be rescheduled up to 24 hours in advance through your dashboard.",
      trigger: "main-options",
    },
    {
      id: "booking-cancellation",
      message:
        "Cancellations are allowed up to 48 hours in advance with a full refund. After that, no refunds are issued.",
      trigger: "main-options",
    },
    {
      id: "query-form",
      component: <QueryForm />,
      asMessage: true,
      waitAction: true,
    },
  ];

  // Chatbot Theme
  const theme = {
    background: "#f5f8fb",
    fontFamily: "Arial, Helvetica, sans-serif",
    headerBgColor: "#FFA500",
    headerFontColor: "#fff",
    headerFontSize: "18px",
    botBubbleColor: "#FFA500",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4a4a4a",
  };

  return (
    <ThemeProvider theme={theme}>
      <ChatBot steps={steps} floating={true} />
    </ThemeProvider>
  );
};

export default ChatBotComponent;
