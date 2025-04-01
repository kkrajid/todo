
import React from 'react';
import logo from "../assets/logo.png";

const SplashScreen = () => {
  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src={logo} alt="DISHA Logo" className="w-[220px] md:w-[250px]" />
        <div className="flex space-x-1 mb-12 h-6 items-end">
          <div className="w-2 h-4 bg-rose-500 animate-bar1"></div>
          <div className="w-2 h-4 bg-rose-500 animate-bar2"></div>
          <div className="w-2 h-4 bg-rose-500 animate-bar3"></div>
          <div className="w-2 h-4 bg-rose-500 animate-bar4"></div>
          <div className="w-2 h-4 bg-rose-500 animate-bar5"></div>
        </div>
        <div className="absolute bottom-8 text-gray-600 text-sm">
          Developed by Anas, Sarfaraz and Rafath
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
