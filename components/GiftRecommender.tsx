
import React, { useState } from 'react';
import { Contact, GiftRecommendation } from '../types';
import { getGiftRecommendations } from '../services/geminiService';
import GiftIcon from './icons/GiftIcon';

interface GiftRecommenderProps {
  contact: Contact;
}

const GiftRecommender: React.FC<GiftRecommenderProps> = ({ contact }) => {
  const [budget, setBudget] = useState<number>(50000);
  const [recommendations, setRecommendations] = useState<GiftRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecommend = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    try {
      const result = await getGiftRecommendations(contact, budget);
      setRecommendations(result);
    } catch (err) {
      setError('추천을 받아오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const budgetOptions = [30000, 50000, 100000, 200000];

  return (
    <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-indigo-300">AI 선물 추천 엔진</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1">예산 설정</label>
           <div className="flex items-center bg-gray-700 rounded-lg p-1 space-x-1">
             {budgetOptions.map(option => (
                 <button key={option} onClick={() => setBudget(option)} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 w-full ${budget === option ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                     {option.toLocaleString()}원
                 </button>
             ))}
           </div>
        </div>
        <button
          onClick={handleRecommend}
          disabled={isLoading}
          className="w-full sm:w-auto self-end bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              추천 중...
            </>
          ) : (
            '선물 추천받기'
          )}
        </button>
      </div>

      {error && <p className="text-red-400 text-center my-4">{error}</p>}

      {recommendations.length > 0 && (
        <div className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold">추천 선물 목록:</h4>
            {recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-500/20 p-2 rounded-full">
                            <GiftIcon className="w-5 h-5 text-indigo-300" />
                        </div>
                        <div>
                            <p className="font-bold text-md text-white">{rec.itemName}</p>
                            <p className="text-xs text-gray-400">{rec.category}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-300 mt-3 pl-1">
                      <span className="font-semibold text-indigo-400">추천 이유:</span> {rec.reason}
                    </p>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default GiftRecommender;
