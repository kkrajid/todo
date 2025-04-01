import React from 'react';
import { Clock, Check } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, currentDateTime, onEdit, onComplete, onDelete }) => {
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-rose-500" />
            Active Tasks
          </h2>
          <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-sm font-medium">
            {activeTasks.length} tasks
          </span>
        </div>
        
        <div className="space-y-3">
          {activeTasks.length === 0 ? (
            <div className="bg-white rounded-xl p-5 text-center text-gray-500 border border-dashed border-gray-200">
              No active tasks. Create a new task to get started!
            </div>
          ) : (
            activeTasks.map(task => (
              <TaskItem 
                key={task.id}
                task={task}
                currentDateTime={currentDateTime}
                onEdit={onEdit}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Check className="w-5 h-5 mr-2 text-teal-500" />
              Completed Tasks
            </h2>
            <span className="bg-teal-100 text-teal-600 px-3 py-1 rounded-full text-sm font-medium">
              {completedTasks.length} completed
            </span>
          </div>
          
          <div className="space-y-2">
            {completedTasks.map(task => (
              <TaskItem 
                key={task.id}
                task={task}
                currentDateTime={currentDateTime}
                onDelete={onDelete}
                completed={true}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TaskList;
