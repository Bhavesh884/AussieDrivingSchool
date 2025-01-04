import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import NavBar from "./components/Boundary/NavBar.jsx";
import Footer from "./components/Boundary/Footer.jsx";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import { LoadingProvider } from "./LoadingContext";
import LoadingScreen from "./LoadingScreen.jsx";

import LearnerLandingPage from "./components/Landing/LearnerLandingPage.jsx";
import InstructorLandingPage from "./components/Landing/InstructorLandingPage.jsx";
import LoginModal from "./components/Auth/LoginModal.jsx";
import LearnerSignUp from "./components/Auth/LearnerSignUp.jsx";
import ForgotPassword from "./components/Auth/ForgotPassword.jsx";
import VerifyCode from "./components/Auth/VerifyCode.jsx";
import SetNewPassword from "./components/Auth/SetNewPassword.jsx";
import UpdatePassword from "./components/Auth/UpdatePassword.jsx";
import Test from "./Test.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import VisitorForm from "./components/VisitorDetails/VisitorForm.jsx";
import InstructorDashboard from "./components/Instructor/InstructorDashboard.jsx";
import LearnersBookings from "./components/Learner/LearnersBookings.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleSignUp from "./components/Auth/SignUpModal.jsx";
import LearnerProfile from "./components/Learner/LearnerProfile.jsx";
import GetPackages from "./components/Instructor/GetPackages.jsx";
import { ProfileImageProvider } from "./utils/ProfileImageContext.jsx";
import "react-toastify/dist/ReactToastify.css";
import PaymentSuccessPage from "./components/Learner/PaymentSucessful.jsx";
import { Elements } from "@stripe/react-stripe-js";
import PaymentFailure from "./components/Learner/PaymentFailed.jsx";

const Layout = () => {
  const location = useLocation();
  const [instructorTab, setInstructorTab] = useState("Dashboard");
  const [adminTab, setAdminTab] = useState("Dashboard");

  const noNavFooterRoutes = [
    "/login",
    "/rolesignup",
    "/learnersignup",
    "/forgotpassword",
    "/verifycode",
    "/setpassword",
    "/updatepassword",
    "/visitorform",
  ];
  const shouldShowNavFooter = !noNavFooterRoutes.includes(location.pathname);
  return (
    <div>
      {shouldShowNavFooter && (
        <NavBar
          instructorTab={instructorTab}
          setInstructorTab={setInstructorTab}
          adminTab={adminTab}
          setAdminTab={setAdminTab}
        />
      )}
      <Outlet
        context={{
          instructorTab,
          setInstructorTab,
          adminTab,
          setAdminTab,
        }}
      />
      {shouldShowNavFooter && <Footer />}
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProfileImageProvider>
        <Layout />
      </ProfileImageProvider>
    ),
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/learnerpage",
        element: <LearnerLandingPage />,
      },
      {
        path: "instructorpage",
        element: (
          <ProtectedRoute>
           <InstructorLandingPage />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginModal />,
      },
      {
        path: "/rolesignup",
        element: <RoleSignUp />,
      },
      {
        path: "/learnersignup",
        element: <LearnerSignUp />,
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "/verifycode",
        element: <VerifyCode />,
      },
      {
        path: "/setpassword",
        element: <SetNewPassword />,
      },
      {
        path: "/updatepassword",
        element: <UpdatePassword />,
      },
      {
        path: "testelement",
        element: <Test />,
      },
      {
        path: "paymentsuccess",
        element: <PaymentSuccessPage />,
      },
      {
        path: "learnerpage/paymentsuccess",
        element: <PaymentSuccessPage />,
      },
      {
        path: "paymentfailed",
        element: <PaymentFailure />,
      },
      {
        path: "learnerpage/paymentfailed",
        element: <PaymentFailure />,
      },
      {
        path: "admindashboard",
        element: (
          <ProtectedRoute>
            <AdminDashboard />,
          </ProtectedRoute>
        ),
      },
      {
        path: "instructordashboard",
        element: (
          <ProtectedRoute>
            <InstructorDashboard />,
          </ProtectedRoute>
        ),
      },
      {
        path: "visitorform",
        element: <VisitorForm />,
      },
      {
        path: "getpackages",
        element: <GetPackages />,
      },
      {
        path: "learnerbookings",
        element: (
          <ProtectedRoute>
            <LearnersBookings />
          </ProtectedRoute>
        ),
      },
      {
        path: "learnerprofile",
        element: (
          <ProtectedRoute>
            <LearnerProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <LoadingProvider>
    <LoadingScreen /> {/* Global loading screen */}
    <RouterProvider router={appRouter} />
  </LoadingProvider>
);
