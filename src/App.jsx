import React from 'react';
import { useQuestionnaireState } from './hooks/useQuestionnaireState';
import QuestionCard from './components/QuestionCard';
import ProgressBar from './components/ProgressBar';
import ResultsPage from './components/ResultsPage';
import './styles/questionnaire.css';

function App() {
  const {
    currentQuestion,
    answers,
    isCompleted,
    showResults,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    submitQuestionnaire,
    calculateScore,
    reset,
    totalQuestions,
    currentQuestionData
  } = useQuestionnaireState();

  if (showResults) {
    return (
      <div className="app">
        <ResultsPage 
          answers={answers}
          score={calculateScore()}
          onReset={reset}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>English Assessment - Grade 5</h1>
        <p>Weeks 6-7 Review</p>
      </header>

      <main className="app-main">
        <ProgressBar current={currentQuestion} total={totalQuestions} />

        {currentQuestionData && currentQuestionData.options ? (
          <QuestionCard
            question={currentQuestionData}
            selectedAnswer={answers[currentQuestionData.id]}
            onAnswerSelect={selectAnswer}
            questionNumber={currentQuestion + 1}
          />
        ) : (
          <p style={{ textAlign: "center", color: "#666" }}>
            Loading question...
          </p>
        )}

        <div className="navigation-buttons">
          <button
            className="nav-button secondary"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>

          {isCompleted ? (
            <button
              className="nav-button primary"
              onClick={submitQuestionnaire}
              disabled={!answers[currentQuestionData.id]}
            >
              Submit Assessment
            </button>
          ) : (
            <button
              className="nav-button primary"
              onClick={nextQuestion}
              disabled={!answers[currentQuestionData.id]}
            >
              Next
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;