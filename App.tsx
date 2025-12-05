import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsView } from './components/ResultsView';
import { analyzeOMR } from './services/geminiService';
import { AnalysisResult } from './types';
import { Loader2, ScanLine, AlertTriangle, FileCheck, Mail, User, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [studentFile, setStudentFile] = useState<File | null>(null);
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!studentFile || !keyFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const data = await analyzeOMR(studentFile, keyFile);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the OMR sheets. Please ensure images are clear and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setStudentFile(null);
    setKeyFile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="bg-indigo-600 p-1.5 md:p-2 rounded-lg">
              <ScanLine className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              OMR Genius
            </h1>
          </div>
          <div className="flex items-center space-x-6 text-xs md:text-sm font-medium text-slate-500">
            <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="hidden xs:inline">Gemini AI</span>
              <span className="inline xs:hidden">AI</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-12 flex-grow w-full">
        
        {!result && (
          <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-3 md:mb-4 tracking-tight">
                Instant OMR Grading
              </h2>
              <p className="text-sm md:text-lg text-slate-600 max-w-2xl mx-auto px-2">
                Upload the student's sheet and the correct answer key. Our AI will scan, compare, and calculate marks instantly.
              </p>
              
              <div className="mt-4 md:mt-6 inline-flex flex-wrap justify-center items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 text-xs md:text-sm font-medium">
                <span className="text-slate-500">Rules:</span>
                <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">+1 Correct</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">-0.25 Wrong</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-4 md:p-8 border border-slate-100">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative">
                <div className="flex-1">
                  <FileUpload
                    id="student-upload"
                    label="1. Student OMR Sheet"
                    file={studentFile}
                    onFileSelect={setStudentFile}
                    onClear={() => setStudentFile(null)}
                  />
                </div>
                
                {/* Mobile Divider */}
                <div className="md:hidden flex items-center justify-center -my-2">
                  <div className="h-px bg-slate-100 w-full absolute z-0"></div>
                  <span className="relative z-10 px-2 bg-white text-xs font-bold text-slate-400 uppercase tracking-widest">
                    AND
                  </span>
                </div>
                
                {/* Desktop Divider */}
                <div className="hidden md:block w-px bg-slate-100 self-stretch relative top-8"></div>
                
                <div className="flex-1">
                  <FileUpload
                    id="key-upload"
                    label="2. Answer Key"
                    file={keyFile}
                    onFileSelect={setKeyFile}
                    onClear={() => setKeyFile(null)}
                  />
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="mt-6 md:mt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={!studentFile || !keyFile || isAnalyzing}
                  className={`w-full py-3.5 md:py-4 px-6 rounded-xl flex items-center justify-center space-x-2 text-base font-semibold transition-all duration-200
                    ${!studentFile || !keyFile 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 active:scale-[0.98]'
                    }
                    ${isAnalyzing ? 'cursor-wait opacity-90' : ''}
                  `}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-5 h-5" />
                      <span>Calculate Marks</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] md:text-xs text-slate-400 mt-4 px-4 leading-tight">
                  Powered by Google Gemini 3 Pro Vision. 
                  <br className="md:hidden"/> 
                  Ensure images are well-lit and clearly visible.
                </p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <ResultsView result={result} onReset={reset} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 md:py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <span className="font-semibold text-slate-800">OMR Genius</span>
            <span className="text-slate-300">|</span>
            <span className="text-xs md:text-sm">AI-Powered Grading</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs md:text-sm">Built by <span className="font-semibold text-slate-700">Tarunjit Biswas</span></span>
            </div>
            <a 
              href="mailto:tarunjitbiswas24@gmail.com" 
              className="flex items-center gap-2 hover:text-indigo-600 transition-colors text-xs md:text-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>tarunjitbiswas24@gmail.com</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;