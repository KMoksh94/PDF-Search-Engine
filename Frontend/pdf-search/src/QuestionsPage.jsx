import React, { useState } from 'react';
import { askPdfQuestion } from './utilities/askQuestion';

const QuestionsPage = ({ pdfId }) => {
  const [question, setQuestion] = useState("");
  const [answerData, setAnswerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswerData(null);

    try {
      const data = await askPdfQuestion(question, pdfId);
      setAnswerData(data);
    } catch (error) {
      setAnswerData({ error: error.message || "Network error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center mt-4 transition-all duration-500">
      <form onSubmit={handleAsk} className="w-full relative z-10">
        <div className={`relative flex items-center w-full h-14 rounded-full bg-white overflow-hidden border border-gray-300 shadow-sm hover:shadow-md focus-within:shadow-lg focus-within:border-blue-400 transition-all duration-300 ${isLoading ? 'opacity-70' : ''}`}>
          <div className="grid place-items-center h-full w-14 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            className="peer h-full w-full outline-none text-gray-700 pr-2 bg-transparent text-lg font-sans placeholder-gray-400"
            type="text"
            placeholder="Ask any question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
            autoComplete="off"
          />
          <button 
            type="submit" 
            disabled={isLoading || !question.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 rounded-full font-semibold transition-colors mr-2 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
          >
            {isLoading ? (
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : "Ask"}
          </button>
        </div>
      </form>
      {answerData && (
        <div className="w-full mt-8 bg-white border border-gray-200 rounded-2xl shadow-xl p-8 transform transition-all duration-500 origin-top">
          
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">AI Answer</h2>
          </div>
          
          {answerData.error ? (
            <p className="text-red-500 text-lg">{answerData.error}</p>
          ) : (
            <>
              <div className="prose prose-blue max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {answerData.answer}
              </div>
              {answerData.sources && answerData.sources.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 bg-gray-50 -mx-8 -mb-8 p-8 rounded-b-2xl">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Sources Cited</h4>
                  <div className="flex flex-wrap gap-2">
                    {answerData.sources.map((source, idx) => (
                      <span key={idx} className="bg-white text-gray-600 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 shadow-sm">
                        Page {source.pageNumber}, Para {source.paragraphStart}-{source.paragraphEnd}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;
