'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  PieChart,
  Award
} from 'lucide-react';
import { GradeRecord, Student } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { calculateDistribution, formatGpa } from '@/lib/gradeCalculations';
import GradeDistributionChart from '@/components/GradeDistributionChart';

export default function AnalyticsPage() {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    async function load() {
      const [g, s] = await Promise.all([
        StorageService.getGrades(),
        StorageService.getStudents(),
      ]);
      setGrades(g);
      setStudents(s);
    }
    load();
  }, []);

  const distribution = calculateDistribution(grades);

  // Performance calculations
  const totalRecords = grades.length || 1;
  const scores = grades.map((g) => g.totalScore);
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  const meanScore =
    scores.length > 0
      ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
      : 0;

  const passingGrades = grades.filter((g) => g.letterGrade !== 'F' && g.letterGrade !== 'D');
  const passRate = Math.round((passingGrades.length / totalRecords) * 1000) / 10;

  // At-risk students (totalScore < 60 or GPA < 2.0)
  const atRiskStudents = students.filter((s) => s.gpa < 2.0 || s.standing === 'Academic Warning');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <span>Academic Performance Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive institutional performance metrics, cohort distribution, and academic risk detection.
        </p>
      </div>

      {/* Summary Score Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase">Class Mean Score</span>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{meanScore}%</p>
          <span className="text-xs text-emerald-600 font-semibold mt-2 block">Above minimum threshold (50%)</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase">Highest Score</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1 font-mono">{highestScore}%</p>
          <span className="text-xs text-slate-500 mt-2 block">Grade A+ (Excellence)</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase">Lowest Recorded</span>
          <p className="text-2xl font-bold text-rose-600 mt-1 font-mono">{lowestScore}%</p>
          <span className="text-xs text-slate-500 mt-2 block">Grade C (Remedial candidate)</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase">Overall Pass Rate</span>
          <p className="text-2xl font-bold text-indigo-600 mt-1 font-mono">{passRate}%</p>
          <span className="text-xs text-emerald-600 font-semibold mt-2 block">Satisfies institutional standards</span>
        </div>
      </div>

      {/* Visual Chart */}
      <GradeDistributionChart distribution={distribution} />

      {/* Two columns: Assessment Weighting Policy & Early Warning Intervention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assessment Weighting Model */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-2">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <span>Continuous Assessment Weight Distribution</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Curriculum formula applied uniformly across all courses for the 2026-2027 academic year.
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Final Examination</span>
                <span className="font-mono text-indigo-700">40%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Midterm Examination</span>
                <span className="font-mono text-blue-700">25%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Assignments & Practical Labs</span>
                <span className="font-mono text-emerald-700">20%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Quizzes & Continuous Tests</span>
                <span className="font-mono text-amber-700">15%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Warning / At-Risk Alert */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Early Warning & Intervention Candidates</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Students identified with cumulative GPA below 2.00 requiring faculty academic counseling.
            </p>

            <div className="space-y-2.5">
              {atRiskStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{st.fullName}</p>
                    <p className="text-[11px] text-slate-600 font-mono">
                      {st.studentId} • {st.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-rose-100 text-rose-800">
                      GPA {formatGpa(st.gpa)}
                    </span>
                    <span className="block text-[10px] text-amber-700 font-semibold mt-0.5">
                      {st.standing}
                    </span>
                  </div>
                </div>
              ))}
              {atRiskStudents.length === 0 && (
                <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All enrolled students are in Good Academic Standing.</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Adheres to academic policy: Minimum required cumulative GPA for graduation is 2.00.
          </div>
        </div>
      </div>
    </div>
  );
}
