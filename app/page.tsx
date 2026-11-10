'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  Award, 
  ArrowUpRight,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import GradeDistributionChart from '@/components/GradeDistributionChart';
import TranscriptModal from '@/components/TranscriptModal';
import { StorageService } from '@/lib/storage';
import { Student, Course, GradeRecord, DashboardMetrics } from '@/lib/types';
import { calculateDistribution, formatGpa } from '@/lib/gradeCalculations';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalStudents: 8,
    activeCourses: 6,
    averageGpa: 3.42,
    passingRate: 95.0,
    pendingSubmissions: 2,
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStudentForTranscript, setSelectedStudentForTranscript] = useState<Student | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, s, g] = await Promise.all([
          StorageService.getDashboardMetrics(),
          StorageService.getStudents(),
          StorageService.getGrades(),
        ]);
        setMetrics(m);
        setStudents(s);
        setGrades(g);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const distribution = calculateDistribution(grades);
  const topStudents = [...students].sort((a, b) => b.gpa - a.gpa).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Overview Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-400/30">
            <Award className="w-3.5 h-3.5" />
            Software Process Improvement (PSP)
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Student Grading Management System
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Faculty assessment dashboard for tracking student continuous evaluation, automatic GPA computation, course analytics, and official transcript generation.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/grades"
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Open Gradebook</span>
            </Link>
            <Link
              href="/students"
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Manage Student Roster</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Students"
          value={metrics.totalStudents}
          subtitle="Enrolled active cohorts"
          icon={Users}
          colorScheme="blue"
          trend={{ value: "+8 Active", positive: true }}
        />
        <MetricCard
          title="Active Courses"
          value={metrics.activeCourses}
          subtitle="Fall Semester 2026"
          icon={BookOpen}
          colorScheme="indigo"
        />
        <MetricCard
          title="Class Average GPA"
          value={`${formatGpa(metrics.averageGpa)}`}
          subtitle="Target threshold: 3.00 / 4.00"
          icon={TrendingUp}
          colorScheme="emerald"
          trend={{ value: "Good Standing", positive: true }}
        />
        <MetricCard
          title="Passing Rate"
          value={`${metrics.passingRate}%`}
          subtitle={`${metrics.pendingSubmissions} draft submissions`}
          icon={CheckCircle2}
          colorScheme="purple"
          trend={{ value: `${100 - metrics.passingRate}% At Risk`, positive: metrics.passingRate >= 90 }}
        />
      </div>

      {/* Grade Distribution & Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GradeDistributionChart distribution={distribution} />
        </div>

        {/* Top Performing Students List */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900">Dean's Honor Roll</h3>
              </div>
              <Link href="/students" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-0.5">
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {topStudents.map((st, idx) => (
                <div 
                  key={st.id} 
                  className="py-2.5 flex items-center justify-between hover:bg-slate-50/60 px-2 rounded-lg cursor-pointer transition-colors"
                  onClick={() => setSelectedStudentForTranscript(st)}
                  title="Click to view official transcript"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-slate-400 w-4">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{st.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{st.studentId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-indigo-50 text-indigo-700 font-mono font-bold text-xs px-2 py-0.5 rounded-full border border-indigo-100">
                      GPA {formatGpa(st.gpa)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-lg text-center">
            <p className="text-[11px] text-slate-600">
              Click any student to view their official academic transcript.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Grade Submissions Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Continuous Assessment Entries</h3>
            <p className="text-xs text-slate-500">Live records from instructor continuous grading assessments</p>
          </div>
          <Link
            href="/grades"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Full Gradebook</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">ID</th>
                <th className="py-2.5 px-3">Course</th>
                <th className="py-2.5 px-3 text-center">Assignment (20%)</th>
                <th className="py-2.5 px-3 text-center">Quiz (15%)</th>
                <th className="py-2.5 px-3 text-center">Midterm (25%)</th>
                <th className="py-2.5 px-3 text-center">Final (40%)</th>
                <th className="py-2.5 px-3 text-center">Total</th>
                <th className="py-2.5 px-3 text-center">Grade</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grades.slice(0, 6).map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-medium text-slate-900">{r.studentName}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{r.studentId}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{r.courseCode}</td>
                  <td className="py-3 px-3 text-center font-mono">{r.scores.assignments}</td>
                  <td className="py-3 px-3 text-center font-mono">{r.scores.quizzes}</td>
                  <td className="py-3 px-3 text-center font-mono">{r.scores.midterm}</td>
                  <td className="py-3 px-3 text-center font-mono">{r.scores.finalExam}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">{r.totalScore.toFixed(1)}%</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                      r.letterGrade.startsWith('A')
                        ? 'bg-emerald-50 text-emerald-700'
                        : r.letterGrade.startsWith('B')
                        ? 'bg-indigo-50 text-indigo-700'
                        : r.letterGrade.startsWith('C')
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {r.letterGrade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      r.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.status === 'Submitted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
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
    </div>
  );
}

