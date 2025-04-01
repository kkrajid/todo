
export const formatIndianDate = (date) => {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatIndianTime = (date) => {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const calculateBalanceTime = (deadline, currentDateTime) => {
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
