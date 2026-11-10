-- ==============================================================================
-- Student Grading Management System (SGMS)
-- Database Schema for Supabase (PostgreSQL)
-- Student: Yeabsira Kayel (UGR-0170-24)
-- Technology: Next.js + Supabase
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    faculty VARCHAR(100) DEFAULT 'Faculty of Computing and Technology',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    year_level INT NOT NULL CHECK (year_level >= 1 AND year_level <= 5),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'On Leave', 'Graduated')),
    gpa NUMERIC(3, 2) DEFAULT 0.00 CHECK (gpa >= 0.00 AND gpa <= 4.00),
    total_credits INT DEFAULT 0,
    standing VARCHAR(50) DEFAULT 'Good Standing',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    credit_hours INT NOT NULL CHECK (credit_hours > 0),
    department VARCHAR(100) NOT NULL,
    instructor_name VARCHAR(150) NOT NULL,
    semester VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) REFERENCES public.students(student_id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    semester VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(student_id, course_id, semester, academic_year)
);

-- 5. Grades Table
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL,
    course_id UUID NOT NULL,
    assignment_score NUMERIC(5, 2) DEFAULT 0.00 CHECK (assignment_score >= 0 AND assignment_score <= 100),
    quiz_score NUMERIC(5, 2) DEFAULT 0.00 CHECK (quiz_score >= 0 AND quiz_score <= 100),
    midterm_score NUMERIC(5, 2) DEFAULT 0.00 CHECK (midterm_score >= 0 AND midterm_score <= 100),
    final_score NUMERIC(5, 2) DEFAULT 0.00 CHECK (final_score >= 0 AND final_score <= 100),
    total_score NUMERIC(5, 2) DEFAULT 0.00,
    letter_grade VARCHAR(5) DEFAULT 'F',
    gpa_point NUMERIC(3, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Approved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Trigger Function to Automatically Compute Weighted Total, Letter Grade & Grade Point
CREATE OR REPLACE FUNCTION public.calculate_grade_metrics()
RETURNS TRIGGER AS $$
DECLARE
    computed_total NUMERIC(5, 2);
    grade_char VARCHAR(5);
    gp NUMERIC(3, 2);
BEGIN
    -- Continuous assessment formula: Assignments (20%), Quizzes (15%), Midterm (25%), Final Exam (40%)
    computed_total := (COALESCE(NEW.assignment_score, 0) * 0.20) +
                      (COALESCE(NEW.quiz_score, 0) * 0.15) +
                      (COALESCE(NEW.midterm_score, 0) * 0.25) +
                      (COALESCE(NEW.final_score, 0) * 0.40);
    
    NEW.total_score := ROUND(computed_total, 2);

    -- Standard University Grading Scale
    IF NEW.total_score >= 90.00 THEN
        grade_char := 'A+'; gp := 4.00;
    ELSIF NEW.total_score >= 85.00 THEN
        grade_char := 'A'; gp := 4.00;
    ELSIF NEW.total_score >= 80.00 THEN
        grade_char := 'A-'; gp := 3.75;
    ELSIF NEW.total_score >= 75.00 THEN
        grade_char := 'B+'; gp := 3.50;
    ELSIF NEW.total_score >= 70.00 THEN
        grade_char := 'B'; gp := 3.00;
    ELSIF NEW.total_score >= 65.00 THEN
        grade_char := 'B-'; gp := 2.75;
    ELSIF NEW.total_score >= 60.00 THEN
        grade_char := 'C+'; gp := 2.50;
    ELSIF NEW.total_score >= 50.00 THEN
        grade_char := 'C'; gp := 2.00;
    ELSIF NEW.total_score >= 45.00 THEN
        grade_char := 'C-'; gp := 1.75;
    ELSIF NEW.total_score >= 40.00 THEN
        grade_char := 'D'; gp := 1.00;
    ELSE
        grade_char := 'F'; gp := 0.00;
    END IF;

    NEW.letter_grade := grade_char;
    NEW.gpa_point := gp;
    NEW.updated_at := TIMEZONE('utc'::text, NOW());

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
DROP TRIGGER IF EXISTS trg_calculate_grade_metrics ON public.grades;
CREATE TRIGGER trg_calculate_grade_metrics
BEFORE INSERT OR UPDATE ON public.grades
FOR EACH ROW
EXECUTE FUNCTION public.calculate_grade_metrics();

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_courses_course_code ON public.courses(course_code);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON public.grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_course_id ON public.grades(course_id);

-- 8. Row Level Security (RLS) Setup
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated and anon users for read-only grading views
CREATE POLICY "Allow public read access for courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Allow public read access for students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow public read access for grades" ON public.grades FOR SELECT USING (true);

-- Allow authenticated instructors to insert and update grades
CREATE POLICY "Allow write for authenticated users" ON public.grades FOR ALL USING (true);

