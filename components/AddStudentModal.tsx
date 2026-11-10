'use client';

import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { Student, Department } from '@/lib/types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (student: Student) => void;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  onAdd,
}: AddStudentModalProps) {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('UGR-');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<Department>('Software Engineering');
  const [yearLevel, setYearLevel] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !studentId.trim() || !email.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const newStudent: Student = {
      id: `s-${Date.now()}`,
      studentId: studentId.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      department,
      yearLevel,
      status: 'Active',
      gpa: 0.0,
      totalCredits: 0,
      standing: 'Good Standing',
    };

    onAdd(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Register New Student</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Yeabsira Kayel"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student ID Number *
            </label>
            <input
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="e.g. UGR-0170-24"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Institutional Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@bitscollege.edu.et"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Software Engineering">Software Eng.</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Systems">Info Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Year Level
              </label>
              <select
                value={yearLevel}
                onChange={(e) => setYearLevel(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>
            </div>
          </div>

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
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Register Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

