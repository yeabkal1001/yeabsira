'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Code2, 
  FileCode,
  Award
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';
import { StorageService } from '@/lib/storage';

export default function SettingsPage() {
  const [dbConnected, setDbConnected] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  useEffect(() => {
    setDbConnected(isSupabaseConfigured());
  }, []);

  const handleReset = () => {
    StorageService.resetToDefault();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          <span>System Settings & Backend Configuration</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Supabase database integration settings, grading policies, and PSP work log metadata.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Local storage successfully reset to default BITS College sample dataset!</span>
        </div>
      )}

      {/* Supabase Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${dbConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Supabase Backend Status</h3>
              <p className="text-xs text-slate-500">
                PostgreSQL database service providing real-time data persistence and Row-Level Security
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${
              dbConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {dbConnected ? 'Connected & Live' : 'Offline / Local Demo Mode'}
          </span>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
          <p>
            {dbConnected
              ? 'The application is actively communicating with your remote Supabase instance.'
              : 'The application is running in zero-friction Local Storage Demo Mode. To connect your live Supabase cloud database:'}
          </p>
          {!dbConnected && (
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] space-y-1">
              <p className="text-slate-400"># 1. Create a .env.local file in the project root</p>
              <p className="text-indigo-300">NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</p>
              <p className="text-indigo-300">NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key</p>
              <p className="text-slate-400 mt-2"># 2. Run the SQL schema and seed scripts in Supabase SQL Editor:</p>
              <p className="text-emerald-300">- supabase/schema.sql (Creates tables, triggers, and RLS policies)</p>
              <p className="text-emerald-300">- supabase/seed.sql (Inserts initial departments, students, and courses)</p>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Reset local offline state to initial seed:</span>
          <button
            onClick={handleReset}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Sample Data</span>
          </button>
        </div>
      </div>

      {/* Grading Scale Reference Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-bold text-base text-slate-900 mb-2">Institutional Grading Scale Reference</h3>
        <p className="text-xs text-slate-500 mb-4">
          Standardized higher education grade boundaries and quality point equivalents.
        </p>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Raw Score Range</th>
                <th className="py-2.5 px-3 text-center">Letter Grade</th>
                <th className="py-2.5 px-3 text-center">Grade Point (4.0 Scale)</th>
                <th className="py-2.5 px-3">Performance Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr className="hover:bg-slate-50/60"><td className="py-2 px-3">90.00 – 100.00%</td><td className="py-2 px-3 text-center font-bold text-emerald-600">A+</td><td className="py-2 px-3 text-center">4.00</td><td className="py-2 px-3 font-sans text-slate-700">Excellent</td></tr>
              <tr className="hover:bg-slate-50/60"><td className="py-2 px-3">85.00 – 89.99%</td><td className="py-2 px-3 text-center font-bold text-emerald-600">A</td><td className="py-2 px-3 text-center">4.00</td><td className="py-2 px-3 font-sans text-slate-700">Excellent</td></tr>
              <tr className="hover:bg-slate-50/60"><td className="py-2 px-3">80.00 – 84.99%</td><td className="py-2 px-3 text-center font-bold text-emerald-600">A-</td><td className="py-2 px-3 text-center">3.75</td><td className="py-2 px-3 font-sans text-slate-700">Very Good</td></tr>
              <tr className="hover:bg-slate-50/60"><td className="py-2 px-3">75.00 – 79.99%</td><td className="py-2 px-3 text-center font-bold text-indigo-600">B+</td><td className="py-2 px-3 text-center">3.50</td><td className="py-2 px-3 font-sans text-slate-700">Very Good</td></tr>
              <tr className="hover:bg-slate-50/60"><td className="py-2 px-3">70.00 – 74.99%</td><td className="py-2 px-3 text-center font-bold text-indigo-600">B</td><td className="py-2 px-3 text-center">3.00</td><td className="py-2 px-3 font-sans text-slate-700">Good</td></tr>
              <tr className="hover:bg-slate-50/60"><td className="py-2 px-3">65.00 – 69.99%</td><td className="py-2 px-3 text-center font-bold text-indigo-600">B-</td><td className="py-2 px-3 text-center">2.75</td><td className="py-2 px-3 font-sans text-slate-700">Good</td></tr>
              <tr className="hover:bg-slate-50/60"><td className="py-2 px-3">60.00 – 64.99%</td><td className="py-2 px-3 text-center font-bold text-amber-600">C+</td><td className="py-2 px-3 text-center">2.50</td><td className="py-2 px-3 font-sans text-slate-700">Satisfactory</td></tr>
              <tr className="hover:bg-slate-50/60"><td className="py-2 px-3">50.00 – 59.99%</td><td className="py-2 px-3 text-center font-bold text-amber-600">C</td><td className="py-2 px-3 text-center">2.00</td><td className="py-2 px-3 font-sans text-slate-700">Passing Cutoff</td></tr>
              <tr className="hover:bg-slate-50/60"><td className="py-2 px-3">45.00 – 49.99%</td><td className="py-2 px-3 text-center font-bold text-rose-600">C-</td><td className="py-2 px-3 text-center">1.75</td><td className="py-2 px-3 font-sans text-slate-700">Unsatisfactory</td></tr>
              <tr className="hover:bg-slate-50/60"><td className="py-2 px-3">40.00 – 44.99%</td><td className="py-2 px-3 text-center font-bold text-rose-600">D</td><td className="py-2 px-3 text-center">1.00</td><td className="py-2 px-3 font-sans text-slate-700">Very Poor</td></tr>
              <tr className="hover:bg-slate-50/60"><td className="py-2 px-3">0.00 – 39.99%</td><td className="py-2 px-3 text-center font-bold text-rose-600">F</td><td className="py-2 px-3 text-center">0.00</td><td className="py-2 px-3 font-sans text-slate-700">Failing</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* PSP Work Log Metadata Box */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Personal Software Process (PSP) Specification</span>
        </div>
        <h4 className="text-base font-bold text-white">Project Identity & Log Verification</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
          <div>
            <span className="text-slate-400 block">Student Name</span>
            <span className="font-semibold text-white">Yeabsira Kayel</span>
          </div>
          <div>
            <span className="text-slate-400 block">Student ID</span>
            <span className="font-semibold text-white font-mono">UGR-0170-24</span>
          </div>
          <div>
            <span className="text-slate-400 block">Reporting Period</span>
            <span className="font-semibold text-white">Nov 4–10, 2026</span>
          </div>
          <div>
            <span className="text-slate-400 block">Reconstructed Hours</span>
            <span className="font-semibold text-indigo-300 font-mono">12.5 Hours</span>
          </div>
        </div>
      </div>
    </div>
  );
}
