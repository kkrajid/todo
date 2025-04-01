
import React, { useState, useEffect } from 'react';
import { ClipboardCheck } from 'lucide-react';

const TaskForm = ({ onSave, editingTask, onClearForm }) => {
  const [objective, setObjective] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    if (editingTask) {
      setObjective(editingTask.objective);
      const [date, time] = editingTask.deadline.split('T');
      setSelectedDate(date);
      setSelectedTime(time.slice(0, 5));
    }
  }, [editingTask]);

  const handleClear = () => {
    setObjective('');
    setSelectedDate('');
    setSelectedTime('');
    onClearForm();
  };

  const handleSubmit = () => {
    if (objective && selectedDate && selectedTime) {
      const deadline = `${selectedDate}T${selectedTime}`;
      onSave({ 
        objective,
        deadline,
        ...(editingTask && { id: editingTask.id })
      });
      handleClear();
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <ClipboardCheck className="w-5 h-5 mr-2 text-rose-500" />
        {editingTask ? 'Update Task' : 'Create New Task'}
      </h3>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="What do you need to do?"
          className="w-full p-3 border-2 border-rose-100 rounded-lg focus:border-rose-300 focus:outline-none placeholder-gray-400 text-gray-700"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-medium">Due Date</label>
            <input
              type="date"
              className="w-full p-3 border-2 border-rose-100 rounded-lg focus:border-rose-300 focus:outline-none"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600 font-medium">Due Time</label>
            <input
              type="time"
              className="w-full p-3 border-2 border-rose-100 rounded-lg focus:border-rose-300 focus:outline-none"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className="flex-1 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
            onClick={handleSubmit}
          >
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
