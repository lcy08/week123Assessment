
import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = ((current + 1) / total) * 100;
  
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span>Question {current + 1} of {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;