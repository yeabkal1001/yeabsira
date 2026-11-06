'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  FileText, 
  GraduationCap, 
  Award,
  BookOpen
} from 'lucide-react';
import { Student, Department, AcademicStanding, GradeRecord } from '@/lib/types';
import { StorageService } from '@/lib/storage';
import { formatGpa } from '@/lib/gradeCalculations';
import TranscriptModal from '@/components/TranscriptModal';
import AddStudentModal from '@/components/AddStudentModal';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [standingFilter, setStandingFilter] = useState<string>('All');
  const [selectedStudentForTranscript, setSelectedStudentForTranscript] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const [s, g] = await Promise.all([
        StorageService.getStudents(),
        StorageService.getGrades(),
      ]);
      setStudents(s);
      setGrades(g);
    }
    load();
  }, []);

  const handleAddStudent = async (newStudent: Student) => {
    const updated = [newStudent, ...students];
    setStudents(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sgms_students_v1', JSON.stringify(updated));
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchesDept = departmentFilter === 'All' || s.department === departmentFilter;
    const matchesStanding = standingFilter === 'All' || s.standing === standingFilter;

    return matchesSearch && matchesDept && matchesStanding;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Student Academic Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student enrollment profiles, academic standing classifications, and cumulative GPA records.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Student</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student name, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Department:</span>
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Departments</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Systems">Information Systems</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
            <span>Standing:</span>
          </div>
          <select
            value={standingFilter}
            onChange={(e) => setStandingFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Standings</option>
            <option value="Dean's List">Dean's List (≥3.75)</option>
            <option value="Good Standing">Good Standing (2.00–3.74)</option>
            <option value="Academic Warning">Academic Warning (&lt;2.00)</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-3 px-4">Student Profile</th>
                <th className="py-3 px-3">Student ID</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3 text-center">Year</th>
                <th className="py-3 px-3 text-center">Cumulative GPA</th>
                <th className="py-3 px-3 text-center">Academic Standing</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                        {st.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{st.fullName}</p>
                        <p className="text-[11px] text-slate-500">{st.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-semibold text-slate-700">{st.studentId}</td>
                  <td className="py-3.5 px-3 text-slate-700">{st.department}</td>
                  <td className="py-3.5 px-3 text-center font-mono">Year {st.yearLevel}</td>
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900">
                    {formatGpa(st.gpa)}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        st.standing === "Dean's List"
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : st.standing === 'Good Standing'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {st.standing}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedStudentForTranscript(st)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
                      title="View Official Transcript"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Official Transcript</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No students match the current search or filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transcript Modal */}
      <TranscriptModal
        isOpen={Boolean(selectedStudentForTranscript)}
        onClose={() => setSelectedStudentForTranscript(null)}
        student={selectedStudentForTranscript}
        grades={grades}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStudent}
      />
    </div>
  );
}
