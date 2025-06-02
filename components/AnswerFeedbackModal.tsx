
import React, { useEffect } from 'react';

interface AnswerFeedbackModalProps {
  isCorrect: boolean;
  explanation?: string;
  onClose: () => void;
}

const AnswerFeedbackModal: React.FC<AnswerFeedbackModalProps> = ({ isCorrect, explanation, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ease-in-out scale-100">
        <div className="text-center">
          {isCorrect ? (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <h3 className={`text-2xl font-bold mb-3 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Jawaban Benar!' : 'Jawaban Salah'}
          </h3>
          {explanation && (
            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
              <strong>Penjelasan:</strong> {explanation}
            </p>
          )}
          {!explanation && !isCorrect && (
             <p className="text-sm sm:text-base text-slate-300 mb-6">
              Jangan khawatir, coba lagi di pertanyaan berikutnya!
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          Lanjutkan
        </button>
      </div>
    </div>
  );
};

export default AnswerFeedbackModal;
