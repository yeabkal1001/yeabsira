'use client';

import React, { useState, useEffect } from 'react';
import { X, Calculator, Save, AlertCircle } from 'lucide-react';
import { GradeRecord, AssessmentScores } from '@/lib/types';
import { calculateTotalScore, getLetterGrade, getGradePoint } from '@/lib/gradeCalculations';

interface GradeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: GradeRecord | null;
  onSave: (updatedRecord: GradeRecord) => void;
}

export default function GradeEntryModal({
  isOpen,
  onClose,
  record,
  onSave,
}: GradeEntryModalProps) {
  const [scores, setScores] = useState<AssessmentScores>({
    assignments: 0,
    quizzes: 0,
    midterm: 0,
    finalExam: 0,
  });
  const [status, setStatus] = useState<'Draft' | 'Submitted' | 'Approved'>('Draft');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setScores({
        assignments: record.scores.assignments || 0,
        quizzes: record.scores.quizzes || 0,
        midterm: record.scores.midterm || 0,
        finalExam: record.scores.finalExam || 0,
      });
      setStatus(record.status);
      setError(null);
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const currentTotal = calculateTotalScore(scores);
  const currentLetter = getLetterGrade(currentTotal);
  const currentGp = getGradePoint(currentLetter);

  const handleScoreChange = (field: keyof AssessmentScores, valueStr: string) => {
    const val = parseFloat(valueStr);
    if (isNaN(val)) {
      setScores((prev) => ({ ...prev, [field]: 0 }));
      return;
    }
    if (val < 0 || val > 100) {
      setError('Score components must be between 0 and 100.');
    } else {
      setError(null);
    }
    setScores((prev) => ({ ...prev, [field]: Math.min(100, Math.max(0, val)) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;

    const updated: GradeRecord = {
      ...record,
      scores,
      totalScore: currentTotal,
      letterGrade: currentLetter,
      gpaPoint: currentGp,
      status,
      lastUpdated: new Date().toISOString(),
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">Continuous Assessment Entry</h3>
            <p className="text-xs text-slate-300">
              {record.studentName} ({record.studentId}) — {record.courseCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assignments & Labs (20%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={scores.assignments}
                onChange={(e) => handleScoreChange('assignments', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Quizzes & Tests (15%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={scores.quizzes}
                onChange={(e) => handleScoreChange('quizzes', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Midterm Exam (25%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={scores.midterm}
                onChange={(e) => handleScoreChange('midterm', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Final Examination (40%)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={scores.finalExam}
                onChange={(e) => handleScoreChange('finalExam', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                required
              />
            </div>
          </div>

          {/* Submission Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Grading Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Draft">Draft (Instructor working copy)</option>
              <option value="Submitted">Submitted to Department</option>
              <option value="Approved">Approved & Locked by Registrar</option>
            </select>
          </div>

          {/* Real-time Computed Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-700 font-semibold text-sm">
              <Calculator className="w-4 h-4" />
              <span>Computed Result</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Total</span>
                <span className="text-base font-bold text-slate-900 font-mono">{currentTotal}%</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">Letter</span>
                <span className="text-base font-bold text-indigo-600 font-mono">{currentLetter}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-medium">GP</span>
                <span className="text-base font-bold text-slate-900 font-mono">{currentGp.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save & Calculate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

