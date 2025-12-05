import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsView } from './components/ResultsView';
import { analyzeOMR } from './services/geminiService';
import { AnalysisResult } from './types';
import { Loader2, ScanLine, AlertTriangle, FileCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ScanLine className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              OMR Genius
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Gemini 2.5/3 Pro Powered</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {!result && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Instant OMR Grading
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Upload the student's sheet and the correct answer key. Our AI will scan, compare, and calculate the marks instantly.
              </p>
              
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium">
                <span>Scoring Rule:</span>
                <span className="font-bold">+1 Correct</span>
                <span className="w-1 h-1 rounded-full bg-indigo-300"></span>
                <span className="font-bold text-red-600">-0.25 Wrong</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-slate-100">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="flex-1">
                  <FileUpload
                    id="student-upload"
                    label="1. Upload Student OMR Sheet"
                    file={studentFile}
                    onFileSelect={setStudentFile}
                    onClear={() => setStudentFile(null)}
                  />
                </div>
                
                <div className="hidden md:block w-px bg-slate-100 self-stretch relative top-8"></div>
                
                <div className="flex-1">
                  <FileUpload
                    id="key-upload"
                    label="2. Upload Answer Key Page"
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

              <div className="mt-8">
                <button
                  onClick={handleAnalyze}
                  disabled={!studentFile || !keyFile || isAnalyzing}
                  className={`w-full py-4 px-6 rounded-xl flex items-center justify-center space-x-2 text-base font-semibold transition-all duration-200
                    ${!studentFile || !keyFile 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5'
                    }
                    ${isAnalyzing ? 'cursor-wait opacity-90' : ''}
                  `}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing Sheets...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-5 h-5" />
                      <span>Calculate Marks</span>
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  Powered by Google Gemini 3 Pro Vision. Images are processed securely.
                </p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <ResultsView result={result} onReset={reset} />
        )}

      </main>
    </div>
  );
};

export default App;