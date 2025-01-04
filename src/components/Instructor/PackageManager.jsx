import React, { useState } from "react";
import PackageCreationPage from "./PackageCreationPage";
import GetPackages from "./GetPackages";

const PackageManager = () => {
  const [pkg, setPkg] = useState("get");
  return (
    <div className="px-6 ">
      <div className="py-4 flex items-center gap-6 border-b border-solid border-slate-400">
        <div
          className={`px-8 py-3  ${
            pkg !== "get"
              ? "border border-blue-300 border-solid rounded-b-lg bg-blue-200 "
              : "bg-blue-400 rounded-t-lg text-white border-b-4 border-blue-500 border-solid scale-105"
          } font-bold transition-all ease-in-out duration-300 cursor-pointer`}
          onClick={() => setPkg("get")}
        >
          Manage Package
        </div>
        <div
          className={`px-8 py-3 rounded-t-lg ${
            pkg !== "create"
              ? "border border-blue-300 border-solid rounded-b-lg bg-blue-200 "
              : "bg-blue-400 rounded-t-lg text-white border-b-4 border-blue-500 border-solid scale-105 "
          } font-bold transition-all ease-in-out duration-300 cursor-pointer`}
          onClick={() => setPkg("create")}
        >
          Create Package
        </div>
      </div>
      {pkg === "get" ? (
        <GetPackages />
      ) : (
        <PackageCreationPage setPkg={setPkg} />
      )}
    </div>
  );
};

export default PackageManager;
