
import React from 'react';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatIndianDate } from '../utils/dateUtils';
import logo from "../assets/logo.png";

const Header = ({ currentDateTime }) => {
  const { logout } = useAuth();

  return (
    <div className="bg-white shadow-md px-4 py-3 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="DISHA Logo" className="w-10 h-10" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-600 hidden md:block">
            {formatIndianDate(currentDateTime)}
          </div>
          <button 
            onClick={logout}
            className="h-8 w-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
