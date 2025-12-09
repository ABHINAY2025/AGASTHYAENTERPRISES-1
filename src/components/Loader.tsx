import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center gap-4">
        
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-gray-700 font-semibold tracking-wide">
          Processing...
        </p>

      </div>
    </div>
  );
};

export default Loader;
