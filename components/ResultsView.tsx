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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Score Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Complete</h2>
            <p className="text-slate-500">Here is the detailed breakdown of the OMR sheet.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-indigo-50 px-6 py-4 rounded-xl border border-indigo-100">
            <div className="p-3 bg-indigo-500 rounded-full text-white shadow-md">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Total Score</p>
              <p className="text-4xl font-extrabold text-indigo-900">{result.totalScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center space-x-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-sm font-medium text-green-700">Correct Answers</p>
            <p className="text-2xl font-bold text-green-800">{result.correct}</p>
            <p className="text-xs text-green-600">+1.0 each</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center space-x-4">
          <XCircle className="w-8 h-8 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-700">Wrong Answers</p>
            <p className="text-2xl font-bold text-red-800">{result.wrong}</p>
            <p className="text-xs text-red-600">-0.25 each</p>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center space-x-4">
          <MinusCircle className="w-8 h-8 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-700">Unattempted</p>
            <p className="text-2xl font-bold text-slate-800">{result.unattempted}</p>
            <p className="text-xs text-slate-500">0.0 each</p>
          </div>
        </div>
      </div>

      {/* Chart & Table Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 w-full text-left">Performance Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 lg:col-span-2 overflow-hidden flex flex-col max-h-[500px]">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-800">Question Analysis</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                <tr>
                  <th className="px-6 py-3">Q.No</th>
                  <th className="px-6 py-3">Your Answer</th>
                  <th className="px-6 py-3">Correct Key</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.details.map((q) => (
                  <tr key={q.questionNumber} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-700">#{q.questionNumber}</td>
                    <td className="px-6 py-3 font-mono text-slate-600">{q.studentAnswer || '-'}</td>
                    <td className="px-6 py-3 font-mono text-slate-600">{q.correctAnswer}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        q.status === 'CORRECT' ? 'bg-green-100 text-green-800' :
                        q.status === 'WRONG' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className={`px-6 py-3 text-right font-medium ${
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

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
        >
          Check Another Sheet
        </button>
      </div>
    </div>
  );
};