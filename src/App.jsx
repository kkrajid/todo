import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  Calendar, 
  X, 
  Check, 
  Edit2,
  BookOpen,
  User,
  Bell
} from 'lucide-react';
import logo from "./assets/logo.png";

const App = () => {
  const [page, setPage] = useState('splash');
  const [tasks, setTasks] = useState([]);
  const [newObjective, setNewObjective] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update current date/time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format for Indian date display
  const formatIndianDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format for Indian time display
  const formatIndianTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateBalanceTime = (deadline) => {
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate - currentDateTime;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
      return diffHours > 0 ? `${diffHours} hour${diffHours > 1 ? 's' : ''}` : 'Due now';
    } else {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue`;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setPage('login'), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update all tasks with current balance time
    setTasks((currentTasks) =>
      currentTasks.map((task) => ({
        ...task,
        balanceTime: calculateBalanceTime(task.deadline),
      }))
    );
  }, [currentDateTime]);

  const handleLogin = () => {
    if (username && password) setPage('main');
  };

  const handleSave = () => {
    if (newObjective && selectedDate && selectedTime) {
      const deadline = `${selectedDate}T${selectedTime}`;
      if (editingTask) {
        setTasks(tasks.map(task =>
          task.id === editingTask.id
            ? { 
                ...task, 
                objective: newObjective, 
                deadline, 
                balanceTime: calculateBalanceTime(deadline),
                completed: false 
              }
            : task
        ));
        setEditingTask(null);
      } else {
        const newTask = {
          id: Date.now(), // Use timestamp for unique ID
          objective: newObjective,
          deadline,
          balanceTime: calculateBalanceTime(deadline),
          completed: false,
        };
        setTasks([...tasks, newTask]);
      }
      handleClear();
    }
  };

  const handleClear = () => {
    setNewObjective('');
    setSelectedDate('');
    setSelectedTime('');
    setEditingTask(null);
  };

  const handleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    ));
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewObjective(task.objective);
    const [date, time] = task.deadline.split('T');
    setSelectedDate(date);
    setSelectedTime(time.slice(0, 5));
  };

  if (page === 'splash') {
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
            Developed by Meenu, Sanjay, Hawaz & Akshay
          </div>
        </div>
      </div>
    );
  }

  if (page === 'login') {
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md p-8 rounded-md">
            <div className="flex flex-col items-center mb-8">
              <img src={logo} alt="DISHA Logo" className="w-[220px] md:w-[250px]" />
            </div>
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-4 border-2 border-rose-100 rounded-lg focus:outline-none focus:border-rose-300 placeholder-gray-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 border-2 border-rose-100 rounded-lg focus:outline-none focus:border-rose-300 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex space-x-4">
                <button
                  className="w-1/2 p-4 bg-rose-500 text-white rounded-lg font-semibold hover:bg-rose-600 transition-colors"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <button
                  className="w-1/2 p-4 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="DISHA Logo" className="w-10 h-10" />
            {/* <div className="text-xl font-bold text-rose-600">ANZEEY</div> */}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-600 hidden md:block">
              {formatIndianDate(currentDateTime)}
            </div>
            <div className="h-8 w-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-4 space-y-6">
          {/* Today's Date Banner */}
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl p-4 text-white shadow-md">
            <div className="text-xs uppercase tracking-wide opacity-80">Today's Date</div>
            <div className="text-xl font-bold">
              {currentDateTime.toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric', 
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <div className="text-sm mt-1 opacity-90">
              {currentDateTime.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </div>
          </div>

          {/* Create/Update Form */}
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
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
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
                  onClick={handleSave}
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>

          {/* Active Tasks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-rose-500" />
                Active Tasks
              </h2>
              <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-medium">
                {tasks.filter(task => !task.completed).length} tasks
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.filter(task => !task.completed).length === 0 ? (
                <div className="bg-white rounded-xl p-5 text-center text-gray-500 border border-dashed border-gray-200">
                  No active tasks. Create a new task to get started!
                </div>
              ) : (
                tasks.filter(task => !task.completed).map(task => {
                  const deadlineDate = new Date(task.deadline);
                  const isUrgent = (deadlineDate - currentDateTime) / (1000 * 60 * 60 * 24) < 1;
                  
                  return (
                    <div 
                      key={task.id} 
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
                            {calculateBalanceTime(task.deadline)}
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
                          onClick={() => handleEdit(task)}
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg transition-colors"
                          onClick={() => handleComplete(task.id)}
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => handleDelete(task.id)}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          {tasks.filter(task => task.completed).length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Check className="w-5 h-5 mr-2 text-teal-500" />
                  Completed Tasks
                </h2>
                <span className="bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-sm font-medium">
                  {tasks.filter(task => task.completed).length} completed
                </span>
              </div>
              
              <div className="space-y-2">
                {tasks.filter(task => task.completed).map(task => {
                  const deadlineDate = new Date(task.deadline);
                  
                  return (
                    <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-l-teal-400 border border-gray-100 opacity-75">
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
                            onClick={() => handleDelete(task.id)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-white shadow-md px-4 py-3 border-t border-gray-100">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {tasks.filter(task => !task.completed).length} active, {tasks.filter(task => task.completed).length} completed
          </div>
          <div className="text-xs text-gray-500">
             Task Manager v1.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;