'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Award, 
  ArrowRight,
  Clock,
  Building,
  Plus
} from 'lucide-react';
import { Course, GradeRecord } from '@/lib/types';
import { StorageService } from '@/lib/storage';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<GradeRecord[]>([]);

  useEffect(() => {
    async function load() {
      const [c, g] = await Promise.all([
        StorageService.getCourses(),
        StorageService.getGrades(),
      ]);
      setCourses(c);
      setGrades(g);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <span>Course Catalog & Offerings</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Academic courses assigned for assessment and grade submission for Fall Semester 2026.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => {
          const courseGrades = grades.filter((g) => g.courseCode === course.courseCode);
          const enrolledCount = courseGrades.length;
          const avgScore =
            enrolledCount > 0
              ? Math.round(
                  (courseGrades.reduce((sum, g) => sum + g.totalScore, 0) / enrolledCount) * 10
                ) / 10
              : 0;

          return (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {course.courseCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {course.creditHours} Credit Units
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 mt-3 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.department}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Instructor</span>
                    <span className="font-semibold text-slate-700 truncate block">{course.instructorName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Enrolled</span>
                    <span className="font-semibold text-slate-700 block">{enrolledCount} Students</span>
                  </div>
                </div>

                {enrolledCount > 0 && (
                  <div className="mt-3 bg-slate-50 p-2 rounded-lg flex items-center justify-between text-xs">
                    <span className="text-slate-500">Class Average:</span>
                    <span className="font-bold font-mono text-slate-800">{avgScore}%</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <Link
                  href={`/grades?course=${encodeURIComponent(course.courseCode)}`}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Open Course Gradebook</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
