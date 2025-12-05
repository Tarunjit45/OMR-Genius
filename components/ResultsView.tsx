import React from 'react';
import { AnalysisResult } from '../types';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { CheckCircle, XCircle, MinusCircle, Award } from 'lucide-react';

interface ResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result, onReset }) => {
  const data = [
    { name: 'Correct', value: result.correct, color: '#22c55e' }, // green-500
    { name: 'Wrong', value: result.wrong, color: '#ef4444' }, // red-500
    { name: 'Unattempted', value: result.unattempted, color: '#94a3b8' }, // slate-400
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Score Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Assessment Complete</h2>
            <p className="text-sm md:text-base text-slate-500">Here is the detailed breakdown of the OMR sheet.</p>
          </div>
          
          <div className="w-full md:w-auto flex items-center justify-center gap-4 bg-indigo-50 px-6 py-4 rounded-xl border border-indigo-100">
            <div className="p-2.5 md:p-3 bg-indigo-600 rounded-full text-white shadow-md shadow-indigo-200">
              <Award className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-semibold text-indigo-600 uppercase tracking-wide">Total Score</p>
              <p className="text-3xl md:text-4xl font-extrabold text-indigo-900 leading-none">{result.totalScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
          <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-700">Correct</p>
            <p className="text-2xl font-bold text-green-800">{result.correct}</p>
            <p className="text-[10px] uppercase font-semibold text-green-600 tracking-wider">+1.0 Marks</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
          <XCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-700">Wrong</p>
            <p className="text-2xl font-bold text-red-800">{result.wrong}</p>
            <p className="text-[10px] uppercase font-semibold text-red-600 tracking-wider">-0.25 Marks</p>
          </div>
        </div>

        <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
          <MinusCircle className="w-8 h-8 text-slate-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-700">Unattempted</p>
            <p className="text-2xl font-bold text-slate-800">{result.unattempted}</p>
            <p className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">0.0 Marks</p>
          </div>
        </div>
      </div>

      {/* Chart & Table Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Chart */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1 flex flex-col items-center justify-center">
          <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-2 md:mb-4 w-full text-left">Performance</h3>
          <div className="h-56 md:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 lg:col-span-2 overflow-hidden flex flex-col max-h-[500px]">
          <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-base md:text-lg font-semibold text-slate-800">Question Analysis</h3>
          </div>
          <div className="overflow-auto flex-1 p-0 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 md:px-6 py-3 w-16 text-center">No.</th>
                  <th className="px-4 md:px-6 py-3 text-center">Your Ans</th>
                  <th className="px-4 md:px-6 py-3 text-center">Key</th>
                  <th className="px-4 md:px-6 py-3">Status</th>
                  <th className="px-4 md:px-6 py-3 text-right">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.details.map((q) => (
                  <tr key={q.questionNumber} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 md:px-6 py-3 font-medium text-slate-700 text-center">{q.questionNumber}</td>
                    <td className="px-4 md:px-6 py-3 font-mono text-slate-600 text-center">
                      <span className={`inline-block w-6 h-6 text-center leading-6 rounded ${
                        q.studentAnswer ? 'bg-slate-100' : 'text-slate-300'
                      }`}>
                        {q.studentAnswer || '-'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 font-mono text-slate-600 text-center font-semibold">{q.correctAnswer}</td>
                    <td className="px-4 md:px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide border ${
                        q.status === 'CORRECT' ? 'bg-green-50 text-green-700 border-green-100' :
                        q.status === 'WRONG' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className={`px-4 md:px-6 py-3 text-right font-mono font-medium ${
                      q.status === 'CORRECT' ? 'text-green-600' :
                      q.status === 'WRONG' ? 'text-red-600' :
                      'text-slate-400'
                    }`}>
                      {q.status === 'CORRECT' ? '+1.00' :
                       q.status === 'WRONG' ? '-0.25' :
                       '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4 md:pt-8 pb-4">
        <button
          onClick={onReset}
          className="w-full md:w-auto px-8 py-3.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
        >
          Check Another Sheet
        </button>
      </div>
    </div>
  );
};