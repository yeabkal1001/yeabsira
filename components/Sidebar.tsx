'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  BarChart3, 
  Settings, 
  Award,
  Layers
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Students', href: '/students', icon: Users },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Gradebook', href: '/grades', icon: GraduationCap },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings & DB', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex-shrink-0 md:min-h-screen border-r border-slate-800 flex flex-col no-print">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-500 transition-colors">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight block text-white">SGMS Portal</span>
            <span className="text-xs text-indigo-400 font-medium">BITS College</span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1.5 flex-1">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Academic Management
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Student & Project Info Widget */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center space-x-3 mb-2">
          <div className="h-9 w-9 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-bold text-sm">
            YK
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Yeabsira Kayel</p>
            <p className="text-[11px] text-slate-400 truncate">ID: UGR-0170-24</p>
          </div>
        </div>
        <div className="bg-slate-900 rounded p-2 text-[10px] text-slate-400 flex items-center justify-between border border-slate-800">
          <span className="flex items-center gap-1">
            <Award className="w-3 h-3 text-amber-400" /> PSP Work Log
          </span>
          <span className="text-indigo-400 font-mono">12.5 hrs</span>
        </div>
      </div>
    </aside>
  );
}

