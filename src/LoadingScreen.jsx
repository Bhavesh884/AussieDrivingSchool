import React from "react";
import loadingGif from "./assets/Videos/Loading.gif";
import { useLoading } from "./LoadingContext";

// Adjust the path based on your folder structure

const LoadingScreen = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white  z-[9999999999999999999999]">
      {/* Animated GIF */}
      <h1 className="text-2xl md:text-4xl font-bold text-blue-700 text-center mb-6">
        Aussie Driving School
      </h1>
      <div className="animate-pulse">
        <img
          src={loadingGif}
          alt="Loading..."
          className="w-32 h-32 md:w-48 md:h-48"
        />
      </div>
      <h1 className="text-2xl md:text-4xl font-bold text-blue-500 animate-pulse text-center">
        Loading...
      </h1>
    </div>
  );
};

export default LoadingScreen;
