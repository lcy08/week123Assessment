import React from 'react';

const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  questionNumber 
}) => {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">Question {questionNumber}</span>
        <span className="section-badge">Part {question.section}</span>
      </div>
      
      <h3 className="question-text">{question.question}</h3>
      
      <div className="options-container">
        {question.options.map((option) => (
          <label 
            key={option.id} 
            className={`option-label ${
              selectedAnswer === option.id ? 'selected' : ''
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option.id}
              checked={selectedAnswer === option.id}
              onChange={() => onAnswerSelect(question.id, option.id)}
            />
            <span className="option-text">
              {option.id}) {option.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;