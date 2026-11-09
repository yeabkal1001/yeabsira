'use client';

import React from 'react';
import { X, Printer, GraduationCap, Building2 } from 'lucide-react';
import { Student, GradeRecord } from '@/lib/types';
import { calculateGpa, formatGpa } from '@/lib/gradeCalculations';

interface TranscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  grades: GradeRecord[];
}

export default function TranscriptModal({
  isOpen,
  onClose,
  student,
  grades,
}: TranscriptModalProps) {
  if (!isOpen || !student) return null;

  const studentGrades = grades.filter((g) => g.studentId === student.studentId);
  const totalEarnedCredits = studentGrades.reduce((acc, g) => acc + (g.creditHours || 3), 0);
  const computedGpa = calculateGpa(studentGrades);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in duration-200">
        {/* Top actions bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2 text-sm font-semibold">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Official Academic Grade Transcript Preview</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Transcript Document */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-900 bg-white" id="official-transcript">
          {/* Institutional Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-900 text-white mb-2">
              <Building2 className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-wider text-slate-900">
              BITS College
            </h1>
            <h2 className="text-xs uppercase tracking-widest text-slate-600 font-semibold mt-0.5">
              Faculty of Computing & Technology • Office of the Registrar
            </h2>
            <p className="text-[11px] text-slate-500 mt-1">Official Student Academic Grade Report</p>
          </div>

          {/* Student Profile Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="text-slate-500 font-medium">Student Name:</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{student.fullName}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Student ID Number:</p>
              <p className="font-bold text-slate-900 text-sm font-mono mt-0.5">{student.studentId}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Department / Program:</p>
              <p className="font-semibold text-slate-800 mt-0.5">{student.department}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Academic Year & Term:</p>
              <p className="font-semibold text-slate-800 mt-0.5">Year {student.yearLevel} • Fall 2026</p>
            </div>
          </div>

          {/* Course Grades Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Semester Course Enrollments & Assessment Results
            </h4>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-300 font-semibold">
                    <th className="py-2.5 px-3">Course Code</th>
                    <th className="py-2.5 px-3">Course Title</th>
                    <th className="py-2.5 px-3 text-center">Credit Hours</th>
                    <th className="py-2.5 px-3 text-center">Score (%)</th>
                    <th className="py-2.5 px-3 text-center">Letter Grade</th>
                    <th className="py-2.5 px-3 text-center">Grade Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {studentGrades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-mono font-semibold text-slate-800">{grade.courseCode}</td>
                      <td className="py-2 px-3 text-slate-700">{grade.courseTitle}</td>
                      <td className="py-2 px-3 text-center font-mono">{grade.creditHours}</td>
                      <td className="py-2 px-3 text-center font-mono font-semibold">{grade.totalScore.toFixed(1)}%</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-indigo-700">{grade.letterGrade}</td>
                      <td className="py-2 px-3 text-center font-mono font-semibold">{grade.gpaPoint.toFixed(2)}</td>
                    </tr>
                  ))}
                  {studentGrades.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-400">
                        No enrolled courses recorded for this student.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cumulative Performance Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-indigo-50/70 border border-indigo-200 p-4 rounded-xl gap-3">
            <div>
              <p className="text-xs font-medium text-indigo-900">Academic Standing Status</p>
              <p className="text-sm font-bold text-indigo-700 mt-0.5">{student.standing}</p>
            </div>
            <div className="flex items-center space-x-6 text-right">
              <div>
                <p className="text-[11px] text-slate-500 font-medium uppercase">Credits Graded</p>
                <p className="text-base font-bold text-slate-800 font-mono">{totalEarnedCredits}</p>
              </div>
              <div className="pl-6 border-l border-indigo-200">
                <p className="text-[11px] text-indigo-700 font-bold uppercase">Cumulative GPA</p>
                <p className="text-2xl font-black text-indigo-600 font-mono">
                  {formatGpa(computedGpa || student.gpa)}
                  <span className="text-xs font-normal text-slate-500"> / 4.00</span>
                </p>
              </div>
            </div>
          </div>

          {/* Institutional Signatures */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto mb-2"></div>
              <p className="font-semibold text-slate-700">Dean of Academic Affairs</p>
              <p className="text-[10px] text-slate-400">Faculty of Computing & Technology</p>
            </div>
            <div>
              <div className="border-b border-dashed border-slate-400 w-3/4 mx-auto mb-2"></div>
              <p className="font-semibold text-slate-700">University Registrar Seal</p>
              <p className="text-[10px] text-slate-400">Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
