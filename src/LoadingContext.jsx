import React, { createContext, useContext, useState } from "react";

// Create a context
const LoadingContext = createContext();

// Provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Expose the loading state and the setter
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook for consuming the context
export const useLoading = () => useContext(LoadingContext);
