import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Footer from '../components/Footer';
import { fetchTasks, createTask, updateTask, deleteTask } from '../utils/api';
import { calculateBalanceTime } from '../utils/dateUtils';

const MainPage = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksData = await fetchTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    
    loadTasks();
  }, []);

  // Update current date/time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Update balance time for all tasks when current time changes
  useEffect(() => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => ({
        ...task,
        balanceTime: calculateBalanceTime(task.deadline, currentDateTime),
      }))
    );
  }, [currentDateTime]);

  const handleSave = async (taskData) => {
    try {
      if (taskData.id) {
        // Update existing task
        const updatedTask = await updateTask(taskData.id, {
          ...taskData,
          completed: false
        });
        setTasks(tasks.map(task =>
          task.id === taskData.id ? updatedTask : task
        ));
      } else {
        // Create new task
        const newTask = await createTask({
          ...taskData,
          completed: false
        });
        setTasks([...tasks, newTask]);
      }
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleClearForm = () => {
    setEditingTask(null);
  };

  const handleComplete = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      const updatedTask = await updateTask(id, { 
        ...taskToUpdate, 
        completed: true 
      });
      
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header currentDateTime={currentDateTime} />
      
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

          <TaskForm 
            onSave={handleSave} 
            editingTask={editingTask}
            onClearForm={handleClearForm}
          />

          <TaskList 
            tasks={tasks}
            currentDateTime={currentDateTime}
            onEdit={handleEdit}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <Footer 
        activeTasks={tasks.filter(task => !task.completed).length}
        completedTasks={tasks.filter(task => task.completed).length}
      />
    </div>
  );
};

export default MainPage;
