import React from 'react';
import { BookOpen, Clock, Calendar, Edit2, Check, X } from 'lucide-react';
import { formatIndianDate, formatIndianTime, calculateBalanceTime } from '../utils/dateUtils';

const TaskItem = ({ task, currentDateTime, onEdit, onComplete, onDelete, completed = false }) => {
  const deadlineDate = new Date(task.deadline);
  const isUrgent = !completed && (deadlineDate - currentDateTime) / (1000 * 60 * 60 * 24) < 1;
  
  if (completed) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-teal-400 border border-gray-100 opacity-75">
        <div className="flex items-center justify-between">
          <div className="font-medium text-gray-600 line-through flex items-center">
            <Check className="w-5 h-5 mr-2 text-teal-500" />
            {task.objective}
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">
              {formatIndianDate(deadlineDate)}
            </span>
            <button
              className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => onDelete(task.id)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
        isUrgent ? 'border-l-red-500' : 'border-l-rose-400'
      } border border-gray-100`}
    >
      <div className="mb-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-gray-800 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-rose-500" />
            {task.objective}
          </div>
          <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
            isUrgent ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
          }`}>
            <Clock className="w-4 h-4 mr-1" />
            {calculateBalanceTime(task.deadline, currentDateTime)}
          </div>
        </div>
        <div className="text-sm text-gray-600 flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          {formatIndianDate(deadlineDate)} at {formatIndianTime(deadlineDate)}
        </div>
      </div>
      <div className="border-t border-gray-100 pt-3 flex justify-end space-x-2">
        <button
          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
          onClick={() => onEdit(task)}
        >
          <Edit2 className="w-5 h-5" />
        </button>
        <button
          className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg transition-colors"
          onClick={() => onComplete(task.id)}
        >
          <Check className="w-5 h-5" />
        </button>
        <button
          className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
          onClick={() => onDelete(task.id)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
