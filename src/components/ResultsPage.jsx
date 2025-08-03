// 1. Enhanced ResultsPage Component with Print Functionality
import React, {useRef} from 'react';
import { questionsData } from '../data/questions';
import html2pdf from 'html2pdf.js';

const ResultsPage = ({ answers, score, onReset, studentName = "Student" }) => {
  const getScoreLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Excellent', color: '#10b981', description: 'Outstanding performance! Keep up the great work.' };
    if (percentage >= 75) return { level: 'Good', color: '#3b82f6', description: 'Good understanding of the material. Review missed topics.' };
    if (percentage >= 60) return { level: 'Fair', color: '#f59e0b', description: 'Fair understanding. Additional practice recommended.' };
    return { level: 'Needs Improvement', color: '#ef4444', description: 'Requires additional support and practice.' };
  };

  const scoreInfo = getScoreLevel(score.percentage);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const printableRef = useRef();


  const handleSimplePrint = () => {
    window.print();
  }

  return (
    <div className="results-page" ref={printableRef}>
      {/* Print Header - only visible when printing */}
      <div className="print-header" style={{ display: 'none' }}>
        <h1>English Assessment Results</h1>
        <p><strong>Student:</strong> {studentName}</p>
        <p><strong>Date:</strong> {currentDate}</p>
        <p><strong>Assessment:</strong> Grade 5 English - Weeks 1-3</p>
      </div>

      <div className="results-header">
        <h2>Assessment Complete!</h2>
        <div className="score-circle print-score-section" style={{ borderColor: scoreInfo.color }}>
          <span className="score-percentage">{score.percentage}%</span>
          <span className="score-fraction">{score.correct}/{score.total} correct</span>
        </div>
        <p className="score-level" style={{ color: scoreInfo.color }}>
          {scoreInfo.level}
        </p>
        <p className="score-description">{scoreInfo.description}</p>
      </div>

      {/* Print Button - hidden when printing */}
      <div className="print-section no-print" style={{ marginBottom: '30px', textAlign: 'center' }}>
        <button className="print-button" onClick={handleSimplePrint}>
          🖨️ Print Results
        </button>
        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
          Generate a printable report of your assessment results
        </p>
      </div>

      <div className="detailed-results">
        <h3>Detailed Question Review</h3>
        
        {/* Section Summary */}
        <div className="section-summary">
          {Object.entries({
            'A': 'Greetings and Personal Information',
            'B': 'Questions and WH-Questions',
            'C': 'Daily Routines and Time', 
            'D': 'Grammar Focus'
          }).map(([sectionKey, sectionName]) => {
            const sectionQuestions = questionsData.filter(q => q.section === sectionKey);
            const sectionCorrect = sectionQuestions.filter(q => answers[q.id] === q.correctAnswer).length;
            const sectionPercentage = Math.round((sectionCorrect / sectionQuestions.length) * 100);
            
            return (
              <div key={sectionKey} className="section-score print-question-review">
                <strong>Part {sectionKey}: {sectionName}</strong>
                <span style={{ float: 'right' }}>
                  {sectionCorrect}/{sectionQuestions.length} ({sectionPercentage}%)
                </span>
              </div>
            );
          })}
        </div>

        {/* Individual Questions */}
        {questionsData.map((question, index) => {
          const userAnswer = answers[question.id];
          const isCorrect = userAnswer === question.correctAnswer;
          const userAnswerText = question.options.find(opt => opt.id === userAnswer)?.text || 'Not answered';
          const correctAnswerText = question.options.find(opt => opt.id === question.correctAnswer)?.text;
          
          return (
            <div key={question.id} className="result-item print-question-review">
              <div className="result-header print-question-header">
                <span className="question-num">Question {index + 1} (Part {question.section})</span>
                <span className={`result-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              
              <p className="result-question"><strong>{question.question}</strong></p>
              
              <div className="result-answers">
                <p className={`user-answer ${isCorrect ? 'correct-answer' : 'incorrect-answer'}`}>
                  <strong>Your answer:</strong> {userAnswer ? `${userAnswer}) ${userAnswerText}` : 'Not answered'}
                </p>
                
                {!isCorrect && (
                  <p className="correct-answer">
                    <strong>Correct answer:</strong> {question.correctAnswer}) {correctAnswerText}
                  </p>
                )}
                
                {question.explanation && (
                  <p className="explanation" style={{ 
                    fontSize: '0.9rem', 
                    color: '#666', 
                    marginTop: '10px',
                    fontStyle: 'italic' 
                  }}>
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons - hidden when printing */}
      <div className="action-buttons no-print" style={{ 
        display: 'flex', 
        gap: '15px', 
        justifyContent: 'center',
        marginTop: '30px' 
      }}>
        <button className="reset-button" onClick={onReset}>
          🔄 Take Assessment Again
        </button>
        <button className="save-button" onClick={() => {
          const element = printableRef.current;
          const opt = {
            margin:       0.2,
            filename:     `${studentName.replace(/\s+/g, '_')}_Assessment_Results.pdf`,
            image:        { type: 'jpeg', quality: 0.99 },
            html2canvas:  { scale: 1 },
            jsPDF:        { unit: 'cm', format: 'a4', orientation: 'portrait' }
          };
          html2pdf().set(opt).from(element).save();
        }}>
          💾 Save as PDF
        </button>
      </div>

      {/* Footer for print - only visible when printing */}
      <div className="print-footer" style={{ 
        display: 'none',
        marginTop: '50px',
        padding: '20px 0',
        borderTop: '1px solid #ccc',
        fontSize: '0.8rem',
        color: '#666'
      }}>
        <p>Generated on {currentDate} | English Assessment Grade 5 | Weeks 1-3 Review</p>
      </div>
    </div>
  );
};

export default ResultsPage;