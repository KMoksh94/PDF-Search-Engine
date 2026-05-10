import React from 'react';

const Modal = ({ isOpen, setIsOpen, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative transform transition-all">
        <button 
          onClick={()=> {
            setIsOpen(false)
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 pr-8">
          {title}
        </h3>
        <div className="text-gray-600">
          {children}
        </div>

      </div>
    </div>
  );
};

export default Modal;
