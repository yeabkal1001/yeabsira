import { Student, Course, GradeRecord, DashboardMetrics } from './types';
import { INITIAL_COURSES, INITIAL_STUDENTS, INITIAL_GRADES } from './mockData';
import { calculateTotalScore, getLetterGrade, getGradePoint, calculateGpa, getAcademicStanding } from './gradeCalculations';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  STUDENTS: 'sgms_students_v1',
  COURSES: 'sgms_courses_v1',
  GRADES: 'sgms_grades_v1',
};

export class StorageService {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  // Fetch Courses
  static async getCourses(): Promise<Course[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('courses').select('*');
        if (!error && data && data.length > 0) {
          return data.map((c) => ({
            id: c.id,
            courseCode: c.course_code,
            title: c.title,
            creditHours: c.credit_hours,
            department: c.department,
            instructorName: c.instructor_name,
            semester: c.semester,
            academicYear: c.academic_year,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage', err);
      }
    }

    if (!this.isClient()) return INITIAL_COURSES;
    const cached = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
    return INITIAL_COURSES;
  }

  // Fetch Students
  static async getStudents(): Promise<Student[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('students').select('*');
        if (!error && data && data.length > 0) {
          return data.map((s) => ({
            id: s.id,
            studentId: s.student_id,
            fullName: s.full_name,
            email: s.email,
            department: s.department,
            yearLevel: s.year_level,
            status: s.status,
            gpa: s.gpa,
            totalCredits: s.total_credits,
            standing: s.standing,
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage', err);
      }
    }

    if (!this.isClient()) return INITIAL_STUDENTS;
    const cached = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    return INITIAL_STUDENTS;
  }

  // Fetch Grades
  static async getGrades(): Promise<GradeRecord[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('grades')
          .select(`
            *,
            enrollments (
              student_id,
              course_id,
              students (student_id, full_name),
              courses (course_code, title, credit_hours, semester)
            )
          `);
        if (!error && data && data.length > 0) {
          return data.map((g) => ({
            id: g.id,
            studentId: g.enrollments?.students?.student_id || g.student_id,
            courseId: g.enrollments?.course_id || g.course_id,
            studentName: g.enrollments?.students?.full_name || 'Student',
            courseCode: g.enrollments?.courses?.course_code || 'CODE',
            courseTitle: g.enrollments?.courses?.title || 'Course',
            creditHours: g.enrollments?.courses?.credit_hours || 3,
            semester: g.enrollments?.courses?.semester || 'Fall 2026',
            scores: {
              assignments: g.assignment_score || 0,
              quizzes: g.quiz_score || 0,
              midterm: g.midterm_score || 0,
              finalExam: g.final_score || 0,
            },
            totalScore: g.total_score,
            letterGrade: g.letter_grade,
            gpaPoint: g.gpa_point,
            status: g.status || 'Draft',
            lastUpdated: g.updated_at || new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local storage', err);
      }
    }

    if (!this.isClient()) return INITIAL_GRADES;
    const cached = localStorage.getItem(STORAGE_KEYS.GRADES);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(INITIAL_GRADES));
    return INITIAL_GRADES;
  }

  // Save or update grade record
  static async saveGrade(record: GradeRecord): Promise<GradeRecord[]> {
    const totalScore = calculateTotalScore(record.scores);
    const letterGrade = getLetterGrade(totalScore);
    const gpaPoint = getGradePoint(letterGrade);

    const updatedRecord: GradeRecord = {
      ...record,
      totalScore,
      letterGrade,
      gpaPoint,
      lastUpdated: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('grades').upsert({
          id: updatedRecord.id,
          assignment_score: updatedRecord.scores.assignments,
          quiz_score: updatedRecord.scores.quizzes,
          midterm_score: updatedRecord.scores.midterm,
          final_score: updatedRecord.scores.finalExam,
          total_score: totalScore,
          letter_grade: letterGrade,
          gpa_point: gpaPoint,
          status: updatedRecord.status,
          updated_at: updatedRecord.lastUpdated,
        });
      } catch (err) {
        console.warn('Failed to upsert to Supabase', err);
      }
    }

    if (!this.isClient()) return [updatedRecord];

    const currentGrades = await this.getGrades();
    const index = currentGrades.findIndex((g) => g.id === updatedRecord.id);
    let newGrades: GradeRecord[];

    if (index >= 0) {
      newGrades = [...currentGrades];
      newGrades[index] = updatedRecord;
    } else {
      newGrades = [updatedRecord, ...currentGrades];
    }

    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(newGrades));
    await this.recalculateStudentGpas(updatedRecord.studentId, newGrades);
    return newGrades;
  }

  // Recalculate student GPA when grades change
  private static async recalculateStudentGpas(studentId: string, allGrades: GradeRecord[]): Promise<void> {
    const studentGrades = allGrades.filter((g) => g.studentId === studentId);
    if (studentGrades.length === 0) return;

    const gpa = calculateGpa(studentGrades);
    const standing = getAcademicStanding(gpa);

    const students = await this.getStudents();
    const idx = students.findIndex((s) => s.studentId === studentId);
    if (idx >= 0) {
      students[idx].gpa = gpa;
      students[idx].standing = standing;
      if (this.isClient()) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      }
    }
  }

  // Dashboard Metrics
  static async getDashboardMetrics(): Promise<DashboardMetrics> {
    const students = await this.getStudents();
    const courses = await this.getCourses();
    const grades = await this.getGrades();

    const totalStudents = students.length;
    const activeCourses = courses.length;

    const avgGpa =
      students.length > 0
        ? Math.round((students.reduce((acc, s) => acc + s.gpa, 0) / students.length) * 100) / 100
        : 0;

    const passingCount = grades.filter((g) => g.letterGrade !== 'F' && g.letterGrade !== 'D').length;
    const passingRate = grades.length > 0 ? Math.round((passingCount / grades.length) * 1000) / 10 : 0;
    const pendingSubmissions = grades.filter((g) => g.status === 'Draft').length;

    return {
      totalStudents,
      activeCourses,
      averageGpa: avgGpa,
      passingRate,
      pendingSubmissions,
    };
  }

  // Reset to default sample data
  static resetToDefault(): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(INITIAL_GRADES));
    }
  }
}
