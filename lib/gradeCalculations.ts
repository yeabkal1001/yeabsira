import { AssessmentScores, LetterGrade, AcademicStanding, GradeRecord, GradeDistribution } from './types';

export const ASSESSMENT_WEIGHTS = {
  assignments: 0.20,
  quizzes: 0.15,
  midterm: 0.25,
  finalExam: 0.40,
} as const;

/**
 * Calculates weighted total score based on the 20/15/25/40 formula
 */
export function calculateTotalScore(scores: AssessmentScores): number {
  const assignments = Math.max(0, Math.min(100, scores.assignments || 0));
  const quizzes = Math.max(0, Math.min(100, scores.quizzes || 0));
  const midterm = Math.max(0, Math.min(100, scores.midterm || 0));
  const finalExam = Math.max(0, Math.min(100, scores.finalExam || 0));

  const total =
    assignments * ASSESSMENT_WEIGHTS.assignments +
    quizzes * ASSESSMENT_WEIGHTS.quizzes +
    midterm * ASSESSMENT_WEIGHTS.midterm +
    finalExam * ASSESSMENT_WEIGHTS.finalExam;

  return Math.round(total * 100) / 100;
}

/**
 * Maps raw percentage score to higher education letter grade scale
 */
export function getLetterGrade(totalScore: number): LetterGrade {
  if (totalScore >= 90) return 'A+';
  if (totalScore >= 85) return 'A';
  if (totalScore >= 80) return 'A-';
  if (totalScore >= 75) return 'B+';
  if (totalScore >= 70) return 'B';
  if (totalScore >= 65) return 'B-';
  if (totalScore >= 60) return 'C+';
  if (totalScore >= 50) return 'C';
  if (totalScore >= 45) return 'C-';
  if (totalScore >= 40) return 'D';
  return 'F';
}

/**
 * Maps letter grade to 4.00 Grade Point scale
 */
export function getGradePoint(letterGrade: LetterGrade): number {
  switch (letterGrade) {
    case 'A+':
    case 'A':
      return 4.00;
    case 'A-':
      return 3.75;
    case 'B+':
      return 3.50;
    case 'B':
      return 3.00;
    case 'B-':
      return 2.75;
    case 'C+':
      return 2.50;
    case 'C':
      return 2.00;
    case 'C-':
      return 1.75;
    case 'D':
      return 1.00;
    case 'F':
    default:
      return 0.00;
  }
}

/**
 * Determines whether a grade represents a passing mark
 */
export function isPassingGrade(letterGrade: LetterGrade): boolean {
  return letterGrade !== 'F' && letterGrade !== 'D';
}

/**
 * Calculates weighted Grade Point Average (GPA)
 */
export function calculateGpa(records: { creditHours: number; gpaPoint: number }[]): number {
  if (!records || records.length === 0) return 0.0;
  let totalQualityPoints = 0;
  let totalCredits = 0;

  for (const rec of records) {
    const credits = rec.creditHours || 3;
    totalQualityPoints += credits * (rec.gpaPoint || 0);
    totalCredits += credits;
  }

  if (totalCredits === 0) return 0.0;
  return Math.round((totalQualityPoints / totalCredits) * 100) / 100;
}

/**
 * Determines academic standing status based on cumulative GPA
 */
export function getAcademicStanding(gpa: number): AcademicStanding {
  if (gpa >= 3.75) return "Dean's List";
  if (gpa >= 2.00) return 'Good Standing';
  if (gpa >= 1.75) return 'Academic Warning';
  return 'Academic Probation';
}

/**
 * Calculates grade distribution histogram data
 */
export function calculateDistribution(records: GradeRecord[]): GradeDistribution[] {
  const grades: LetterGrade[] = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];
  const total = records.length || 1;

  const counts: Record<LetterGrade, number> = {
    'A+': 0, 'A': 0, 'A-': 0,
    'B+': 0, 'B': 0, 'B-': 0,
    'C+': 0, 'C': 0, 'C-': 0,
    'D': 0, 'F': 0,
  };

  records.forEach((r) => {
    if (counts[r.letterGrade] !== undefined) {
      counts[r.letterGrade]++;
    }
  });

  return grades.map((g) => ({
    grade: g,
    count: counts[g],
    percentage: Math.round((counts[g] / total) * 1000) / 10,
  }));
}

export function formatGpa(gpa: number): string {
  return (gpa || 0).toFixed(2);
}

