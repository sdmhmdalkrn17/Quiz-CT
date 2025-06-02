import { Question } from './types';
import { INITIAL_QUESTIONS } from './constants';

const QUESTIONS_STORAGE_KEY = 'ctScanQuizQuestions';

export const loadQuestionsFromLocalStorage = (): Question[] => {
  try {
    const storedQuestions = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (storedQuestions) {
      const parsedQuestions = JSON.parse(storedQuestions);
      // Basic validation to ensure it's an array and items have an id and text
      if (Array.isArray(parsedQuestions) && parsedQuestions.every(q => q.id && q.text && q.options && q.correctOptionId)) {
        return parsedQuestions;
      }
    }
  } catch (error) {
    console.error("Error loading questions from local storage:", error);
  }
  return [...INITIAL_QUESTIONS]; // Return a copy to avoid direct mutation
};

export const saveQuestionsToLocalStorage = (questions: Question[]): void => {
  try {
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  } catch (error) {
    console.error("Error saving questions to local storage:", error);
  }
};