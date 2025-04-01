import React from 'react';

const Footer = ({ activeTasks, completedTasks }) => {
  return (
    <div className="bg-white shadow-md px-4 py-3 border-t border-gray-100">
      <div className="max-w-2xl mx-auto flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {activeTasks} active, {completedTasks} completed
        </div>
        <div className="text-xs text-gray-500">
          Task Manager v1.0
        </div>
      </div>
    </div>
  );
};

export default Footer;
