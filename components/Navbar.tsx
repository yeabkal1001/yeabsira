'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, Database, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function Navbar() {
  const [dbConnected, setDbConnected] = useState<boolean>(false);

  useEffect(() => {
    setDbConnected(isSupabaseConfigured());
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 no-print sticky top-0 z-30 shadow-xs">
      {/* Left: Term Indicator & Search */}
      <div className="flex items-center space-x-4 flex-1 max-w-md">
        <div className="flex items-center space-x-2 text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>Fall Semester 2026</span>
        </div>
      </div>

      {/* Right: Status Pill, Notifications & User */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Supabase status badge */}
        <div 
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            dbConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
          title={dbConnected ? 'Supabase connected' : 'Running in Offline / Demo Mode with Local Storage'}
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {dbConnected ? 'Supabase Connected' : 'Offline / Local Mode'}
          </span>
          {dbConnected ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          ) : (
            <AlertCircle className="w-3 h-3 text-amber-600" />
          )}
        </div>

        {/* Notifications Icon */}
        <button 
          type="button" 
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800">Yeabsira Kayel</p>
            <p className="text-[11px] text-slate-500">Instructor / Student</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-100">
            YK
          </div>
        </div>
      </div>
    </header>
  );
}
