import { useState, useCallback, useEffect } from 'react';
import { questionsData } from '../data/questions';

export const useQuestionnaireState = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
  const saved = localStorage.getItem('assessment-progress');
  if (saved) {
    const data = JSON.parse(saved);
    setAnswers(data.answers);
    setCurrentQuestion(data.currentQuestion);
  }
}, []);

  useEffect(() => {
    localStorage.setItem('assessment-progress', JSON.stringify({
      answers,
      currentQuestion
    }));
  }, [answers, currentQuestion]);

  const selectAnswer = useCallback((questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }, [currentQuestion]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const submitQuestionnaire = useCallback(() => {
    setShowResults(true);
  }, []);

  const calculateScore = useCallback(() => {
    let correct = 0;
    questionsData.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questionsData.length,
      percentage: Math.round((correct / questionsData.length) * 100)
    };
  }, [answers]);

  const reset = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setShowResults(false);
  }, []);

  return {
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
    totalQuestions: questionsData.length,
    currentQuestionData: questionsData[currentQuestion]
  };
};