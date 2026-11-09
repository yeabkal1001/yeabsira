'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Edit3, 
  CheckCircle2, 
  Calculator,
  RefreshCw,
  Plus
} from 'lucide-react';
import { GradeRecord, Course } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import GradeEntryModal from '@/components/GradeEntryModal';

function GradebookContent() {
  const searchParams = useSearchParams();
  const initialCourse = searchParams.get('course') || 'All';

  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>(initialCourse);
  const [search, setSearch] = useState('');
  const [editingRecord, setEditingRecord] = useState<GradeRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [g, c] = await Promise.all([
        StorageService.getGrades(),
        StorageService.getCourses(),
      ]);
      setGrades(g);
      setCourses(c);
    }
    load();
  }, []);

  const handleSaveGrade = async (updated: GradeRecord) => {
    const newGrades = await StorageService.saveGrade(updated);
    setGrades(newGrades);
    setStatusMessage(`Saved assessment scores for ${updated.studentName} (${updated.courseCode})`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const filteredGrades = grades.filter((g) => {
    const matchesCourse = selectedCourse === 'All' || g.courseCode === selectedCourse;
    const matchesSearch =
      g.studentName.toLowerCase().includes(search.toLowerCase()) ||
      g.studentId.toLowerCase().includes(search.toLowerCase()) ||
      g.courseCode.toLowerCase().includes(search.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Student Name',
      'Student ID',
      'Course Code',
      'Course Title',
      'Assignment (20%)',
      'Quiz (15%)',
      'Midterm (25%)',
      'Final (40%)',
      'Total Score (%)',
      'Letter Grade',
      'Grade Point',
      'Status',
    ];

    const rows = filteredGrades.map((g) => [
      `"${g.studentName}"`,
      `"${g.studentId}"`,
      `"${g.courseCode}"`,
      `"${g.courseTitle}"`,
      g.scores.assignments,
      g.scores.quizzes,
      g.scores.midterm,
      g.scores.finalExam,
      g.totalScore.toFixed(2),
      g.letterGrade,
      g.gpaPoint.toFixed(2),
      g.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Grade_Roster_${selectedCourse}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-600" />
            <span>Continuous Assessment Gradebook</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record continuous marks (20/15/25/40 formula), review automated calculations, and submit finalized course rosters.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Grade Sheet</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-200 no-print">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Course Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between no-print">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Select Course:</span>
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Courses ({grades.length} entries)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.courseCode}>
                {c.courseCode}: {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Course</th>
                <th className="py-3 px-3 text-center">Assignments (20%)</th>
                <th className="py-3 px-3 text-center">Quizzes (15%)</th>
                <th className="py-3 px-3 text-center">Midterm (25%)</th>
                <th className="py-3 px-3 text-center">Final (40%)</th>
                <th className="py-3 px-3 text-center">Total Score</th>
                <th className="py-3 px-3 text-center">Letter</th>
                <th className="py-3 px-3 text-center">GP</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGrades.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{r.studentName}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{r.studentId}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{r.courseCode}</td>
                  <td className="py-3 px-3 text-center font-mono">{r.scores.assignments}</td>
                  <td className="py-3 px-3 text-center font-mono">{r.scores.quizzes}</td>
                  <td className="py-3 px-3 text-center font-mono">{r.scores.midterm}</td>
                  <td className="py-3 px-3 text-center font-mono">{r.scores.finalExam}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                    {r.totalScore.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        r.letterGrade.startsWith('A')
                          ? 'bg-emerald-50 text-emerald-700'
                          : r.letterGrade.startsWith('B')
                          ? 'bg-indigo-50 text-indigo-700'
                          : r.letterGrade.startsWith('C')
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {r.letterGrade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold text-slate-700">
                    {r.gpaPoint.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        r.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'Submitted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right no-print">
                    <button
                      onClick={() => {
                        setEditingRecord(r);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      title="Edit assessment scores"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredGrades.length === 0 && (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    No grade records found for the selected course or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Entry Modal */}
      <GradeEntryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        record={editingRecord}
        onSave={handleSaveGrade}
      />
    </div>
  );
}

export default function GradebookPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 text-sm">
          Loading Gradebook assessments...
        </div>
      }
    >
      <GradebookContent />
    </Suspense>
  );
}
