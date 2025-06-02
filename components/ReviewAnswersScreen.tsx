import React from 'react';
import { IncorrectlyAnsweredItem } from '../types';

interface ReviewAnswersScreenProps {
  incorrectlyAnswered: IncorrectlyAnsweredItem[];
  onBackToWelcome: () => void;
}

const ReviewAnswersScreen: React.FC<ReviewAnswersScreenProps> = ({ incorrectlyAnswered, onBackToWelcome }) => {
  if (incorrectlyAnswered.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-800 rounded-lg min-h-[400px] flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-green-400 mb-4">Tidak Ada Jawaban Salah!</h2>
        <p className="text-slate-300 mb-6">Selamat! Anda menjawab semua pertanyaan dengan benar atau tidak ada pertanyaan yang salah untuk ditinjau.</p>
        <button
          onClick={onBackToWelcome}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md"
        >
          Kembali ke Menu Utama
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 bg-slate-800 rounded-lg min-h-[500px]">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-sky-400 text-center">Tinjau Jawaban Salah</h2>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
        {incorrectlyAnswered.map(({ question, userAnswerId }, index) => (
          <div key={question.id} className="bg-slate-700/70 p-5 rounded-lg shadow-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-sky-300 mb-3">
              {index + 1}. {question.text}
            </h3>
            <div className="space-y-2 mb-3">
              {question.options.map(opt => {
                let itemClass = "block p-3 rounded-md text-sm ";
                if (opt.id === question.correctOptionId) {
                  itemClass += "bg-green-700/50 border border-green-500 text-green-200";
                } else if (opt.id === userAnswerId) {
                  itemClass += "bg-red-700/50 border border-red-500 text-red-200";
                } else {
                  itemClass += "bg-slate-600/50 border border-slate-500 text-slate-300";
                }
                return (
                  <div key={opt.id} className={itemClass}>
                    <span className="font-medium">{opt.id.toUpperCase()}.</span> {opt.text}
                    {opt.id === question.correctOptionId && <span className="ml-2 text-xs font-bold">(Jawaban Benar)</span>}
                    {opt.id === userAnswerId && opt.id !== question.correctOptionId && <span className="ml-2 text-xs font-bold">(Jawaban Anda)</span>}
                  </div>
                );
              })}
            </div>
            {question.explanation && (
              <div className="mt-3 pt-3 border-t border-slate-600">
                <p className="text-sm text-amber-300">
                  <strong>Penjelasan:</strong> {question.explanation}
                </p>
              </div>
            )}
             {userAnswerId === 'timed_out' && !question.explanation && (
                 <div className="mt-3 pt-3 border-t border-slate-600">
                    <p className="text-sm text-red-300">
                    <strong>Catatan:</strong> Waktu habis untuk menjawab pertanyaan ini.
                    </p>
                 </div>
             )}
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onBackToWelcome}
          className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Kembali ke Menu Utama
        </button>
      </div>
    </div>
  );
};

export default ReviewAnswersScreen;