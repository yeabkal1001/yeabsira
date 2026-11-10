export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';

export type AcademicStanding = 'Dean\'s List' | 'Good Standing' | 'Academic Warning' | 'Academic Probation';

export type Department = 'Software Engineering' | 'Computer Science' | 'Information Systems';

export interface Student {
  id: string;
  studentId: string; // e.g. UGR-0170-24
  fullName: string;
  email: string;
  department: Department;
  yearLevel: number; // 1, 2, 3, 4
  status: 'Active' | 'On Leave' | 'Graduated';
  gpa: number;
  totalCredits: number;
  standing: AcademicStanding;
}

export interface Course {
  id: string;
  courseCode: string; // e.g. SE-301
  title: string;
  creditHours: number; // ECTS / Credit Units
  department: Department;
  instructorName: string;
  semester: string; // e.g. "Fall 2026"
  academicYear: string; // e.g. "2026-2027"
}

export interface AssessmentScores {
  assignments: number; // Max 100, weighted 20%
  quizzes: number;     // Max 100, weighted 15%
  midterm: number;     // Max 100, weighted 25%
  finalExam: number;   // Max 100, weighted 40%
}

export interface GradeRecord {
  id: string;
  studentId: string; // reference to Student.studentId
  courseId: string;  // reference to Course.id
  studentName: string;
  courseCode: string;
  courseTitle: string;
  creditHours: number;
  semester: string;
  scores: AssessmentScores;
  totalScore: number; // 0 - 100
  letterGrade: LetterGrade;
  gpaPoint: number;   // 0.00 - 4.00
  status: 'Draft' | 'Submitted' | 'Approved';
  lastUpdated: string;
}

export interface GradeDistribution {
  grade: LetterGrade;
  count: number;
  percentage: number;
}

export interface DashboardMetrics {
  totalStudents: number;
  activeCourses: number;
  averageGpa: number;
  passingRate: number;
  pendingSubmissions: number;
}

