import React, { useState } from 'react'
import { uploadPdfFile } from './utilities/fileUpload';
import Modal from './utilities/Modal';
import QuestionsPage from './QuestionsPage';

const App = () => {

  const [pdfFile, setPdfFile] = useState(null);
  const [loading,setLoading] = useState(false);
  const [pdfReady,setPDFReady] = useState(false);
  const [pdfId, setPdfId] = useState(null);

  const [isOpen,setIsOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpload = async (pdfFile) => {
    setLoading(true);
    try {
      const response = await uploadPdfFile(pdfFile);
      setPdfId(response.pdfId);
      setPDFReady(true);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message || "An error occurred during upload.");
      setIsOpen(true);
    } finally {
      setLoading(false);
    }
  }


  return (
    <>
    {isOpen && <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={"Error"}>
      <p className="text-red-500">{errorMsg}</p>
    </Modal>}
    <main className='container mx-auto px-4 min-h-screen bg-gray-50 text-gray-800 font-sans'>
      <section className='pt-20 flex flex-col items-center min-h-screen'>
        <div className='text-center mb-10'>
          <h1 className='text-5xl font-extrabold tracking-tight text-gray-900 mb-4'>
            AI PDF Analyzer
          </h1>
          <p className='text-lg text-gray-500 max-w-xl mx-auto'>
            Instantly chat with any PDF document. Upload your file below to extract insights, summarize data, and find answers in seconds.
          </p>
        </div>

        {!pdfReady ? (
          <div className='w-full max-w-2xl'>
            <form className='w-full'>
              <label 
                htmlFor='pdf-upload' 
                className={`flex flex-col items-center justify-center w-full h-72 border-2 border-blue-400 border-dashed rounded-xl cursor-pointer bg-white hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className='flex flex-col items-center justify-center pt-5 pb-6 text-center px-4'>
                  
                  <div className='bg-blue-100 p-4 rounded-full mb-4'>
                    {loading ? (
                      <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className='w-10 h-10 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'></path>
                      </svg>
                    )}
                  </div>
                  
                  {pdfFile ? (
                    <>
                      <p className='mb-2 text-xl text-gray-700 font-semibold'>
                        {pdfFile.name}
                      </p>
                      <p className='text-sm text-green-500 font-medium'>
                        {loading ? "Uploading to AI..." : "Ready to upload"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className='mb-2 text-xl text-gray-700'>
                        <span className='font-semibold text-blue-600'>Choose a file</span> or drag it here
                      </p>
                      <p className='text-sm text-gray-500'>Only PDF files are supported</p>
                    </>
                  )}
                </div>
                <input 
                  id='pdf-upload' 
                  name='pdf-upload'
                  type='file' 
                  accept='.pdf'
                  className='hidden' 
                  disabled={loading}
                  onChange={(e) => setPdfFile(e.target.files[0])}
                />
              </label>
            </form>
            {pdfFile && !loading && (
              <div className="mt-6 flex justify-center animation-fade-in">
                <button 
                  onClick={() => handleUpload(pdfFile)}
                  className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Upload PDF
                </button>
              </div>
            )}
          </div>
        ) : (
          <QuestionsPage pdfId={pdfId} />
        )}

      </section>
    </main>
    </>
  )
}

export default App