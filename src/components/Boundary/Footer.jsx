import React from "react";
import {useLocation } from "react-router-dom";

//react-icons imports
import { FaTwitter } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaGooglePlusG } from "react-icons/fa";

const Footer = () => {
  const location=useLocation()
  if (location.pathname === '/admin') {
    return null; // Do not render the landing page navbar if on the /admin route
  }
  return (
    <div>
      <footer className="bg-[#0C0C0C] text-[#FFFFFF] w-full">
        <div className="w-full py-10 flex  flex-col justify-center items-start px-10 md:px-20 md:py-20">
          <div className="justify-start">
            <ul className="justify-start flex flex-col gap-5 text-sm mb-4 md:flex-row">
              <li>
                <a href="#" className="hover:underline">
                  FEATURES
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  PRICING PLANS
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  CONTACTS
                </a>
              </li>
            </ul>
          </div>
          <hr className="w-full" />

          <div className="flex flex-col gap-7 justify-between w-full mt-5 md:flex-row md:mt-10 ">
            <div className="flex flex-col gap-3 w-4/5 md:w-1/2 md:flex-row md:gap-16">
              <div className="text-2xl font-semibold">Startup</div>
              <div className="">
                Join us and find the perfect driving instructor near you. Let's
                get you driving with confidence!
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:gap-7">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms</a>
              <div className="flex gap-5 mt-2">
                <a href="#">
                <FaTwitter />
                </a>
                <a href="#">
                <FaFacebookF />
                </a>
                <a href="#">
                <FaGooglePlusG className="h-5 w-8" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
