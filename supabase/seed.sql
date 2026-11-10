-- ==============================================================================
-- Student Grading Management System (SGMS)
-- Seed Data for Supabase
-- Student: Yeabsira Kayel (UGR-0170-24)
-- ==============================================================================

-- 1. Insert Departments
INSERT INTO public.departments (code, name, faculty) VALUES
('SE', 'Software Engineering', 'Faculty of Computing and Technology'),
('CS', 'Computer Science', 'Faculty of Computing and Technology'),
('IS', 'Information Systems', 'Faculty of Computing and Technology')
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Students
INSERT INTO public.students (student_id, full_name, email, department, year_level, status, gpa, total_credits, standing) VALUES
('UGR-0170-24', 'Yeabsira Kayel', 'yeabsira.kayel@bitscollege.edu.et', 'Software Engineering', 3, 'Active', 3.92, 64, 'Dean''s List'),
('UGR-0182-24', 'Natnael Tesfaye', 'natnael.t@bitscollege.edu.et', 'Software Engineering', 3, 'Active', 3.65, 64, 'Good Standing'),
('UGR-0145-24', 'Kalkidan Tibebu', 'kalkidan.tibebu@bitscollege.edu.et', 'Software Engineering', 3, 'Active', 3.88, 64, 'Dean''s List'),
('UGR-0199-24', 'Abel Yohannes', 'abel.yohannes@bitscollege.edu.et', 'Computer Science', 2, 'Active', 3.24, 42, 'Good Standing'),
('UGR-0112-24', 'Blen Girma', 'blen.girma@bitscollege.edu.et', 'Information Systems', 3, 'Active', 3.45, 60, 'Good Standing'),
('UGR-0205-24', 'Yared Berhanu', 'yared.berhanu@bitscollege.edu.et', 'Software Engineering', 3, 'Active', 2.80, 64, 'Good Standing'),
('UGR-0164-24', 'Sara Haile', 'sara.haile@bitscollege.edu.et', 'Computer Science', 2, 'Active', 3.78, 42, 'Dean''s List'),
('UGR-0220-24', 'Elias Melaku', 'elias.melaku@bitscollege.edu.et', 'Software Engineering', 3, 'Active', 1.88, 58, 'Academic Warning')
ON CONFLICT (student_id) DO NOTHING;

-- 3. Insert Courses
INSERT INTO public.courses (id, course_code, title, credit_hours, department, instructor_name, semester, academic_year) VALUES
('11111111-1111-1111-1111-111111111111', 'SE-301', 'Software Process Improvement', 3, 'Software Engineering', 'Dr. Dawit Mengistu', 'Fall 2026', '2026-2027'),
('22222222-2222-2222-2222-222222222222', 'CS-312', 'Database Systems & Architecture', 4, 'Software Engineering', 'Prof. Helen Tadesse', 'Fall 2026', '2026-2027'),
('33333333-3333-3333-3333-333333333333', 'SE-304', 'Web Application Engineering', 3, 'Software Engineering', 'Ins. Yeabkal Wube', 'Fall 2026', '2026-2027'),
('44444444-4444-4444-4444-444444444444', 'CS-204', 'Data Structures and Algorithms', 4, 'Computer Science', 'Dr. Solomon Bekele', 'Fall 2026', '2026-2027'),
('55555555-5555-5555-5555-555555555555', 'SE-308', 'Object-Oriented Software Design', 3, 'Software Engineering', 'Ins. Michael Kebede', 'Fall 2026', '2026-2027'),
('66666666-6666-6666-6666-666666666666', 'IS-210', 'Enterprise Information Systems', 3, 'Information Systems', 'Dr. Bethelhem Alemu', 'Fall 2026', '2026-2027')
ON CONFLICT (course_code) DO NOTHING;

-- 4. Insert Enrollments
INSERT INTO public.enrollments (id, student_id, course_id, semester, academic_year) VALUES
('e1111111-1111-1111-1111-111111111111', 'UGR-0170-24', '11111111-1111-1111-1111-111111111111', 'Fall 2026', '2026-2027'),
('e2222222-2222-2222-2222-222222222222', 'UGR-0170-24', '22222222-2222-2222-2222-222222222222', 'Fall 2026', '2026-2027'),
('e3333333-3333-3333-3333-333333333333', 'UGR-0170-24', '33333333-3333-3333-3333-333333333333', 'Fall 2026', '2026-2027'),
('e4444444-4444-4444-4444-444444444444', 'UGR-0182-24', '11111111-1111-1111-1111-111111111111', 'Fall 2026', '2026-2027'),
('e5555555-5555-5555-5555-555555555555', 'UGR-0145-24', '11111111-1111-1111-1111-111111111111', 'Fall 2026', '2026-2027'),
('e6666666-6666-6666-6666-666666666666', 'UGR-0199-24', '44444444-4444-4444-4444-444444444444', 'Fall 2026', '2026-2027'),
('e7777777-7777-7777-7777-777777777777', 'UGR-0112-24', '66666666-6666-6666-6666-666666666666', 'Fall 2026', '2026-2027'),
('e8888888-8888-8888-8888-888888888888', 'UGR-0205-24', '11111111-1111-1111-1111-111111111111', 'Fall 2026', '2026-2027'),
('e9999999-9999-9999-9999-999999999999', 'UGR-0164-24', '44444444-4444-4444-4444-444444444444', 'Fall 2026', '2026-2027'),
('e0000000-0000-0000-0000-000000000000', 'UGR-0220-24', '11111111-1111-1111-1111-111111111111', 'Fall 2026', '2026-2027')
ON CONFLICT (student_id, course_id, semester, academic_year) DO NOTHING;

-- 5. Insert Grades (Trigger will automatically compute total_score, letter_grade, gpa_point)
INSERT INTO public.grades (enrollment_id, student_id, course_id, assignment_score, quiz_score, midterm_score, final_score, status) VALUES
('e1111111-1111-1111-1111-111111111111', 'UGR-0170-24', '11111111-1111-1111-1111-111111111111', 96.00, 92.00, 94.00, 95.00, 'Approved'),
('e2222222-2222-2222-2222-222222222222', 'UGR-0170-24', '22222222-2222-2222-2222-222222222222', 90.00, 88.00, 86.00, 92.00, 'Approved'),
('e3333333-3333-3333-3333-333333333333', 'UGR-0170-24', '33333333-3333-3333-3333-333333333333', 95.00, 90.00, 88.00, 91.00, 'Submitted'),
('e4444444-4444-4444-4444-444444444444', 'UGR-0182-24', '11111111-1111-1111-1111-111111111111', 85.00, 82.00, 84.00, 86.00, 'Approved'),
('e5555555-5555-5555-5555-555555555555', 'UGR-0145-24', '11111111-1111-1111-1111-111111111111', 94.00, 90.00, 91.00, 93.00, 'Approved'),
('e6666666-6666-6666-6666-666666666666', 'UGR-0199-24', '44444444-4444-4444-4444-444444444444', 78.00, 74.00, 80.00, 76.00, 'Submitted'),
('e7777777-7777-7777-7777-777777777777', 'UGR-0112-24', '66666666-6666-6666-6666-666666666666', 82.00, 80.00, 85.00, 79.00, 'Approved'),
('e8888888-8888-8888-8888-888888888888', 'UGR-0205-24', '11111111-1111-1111-1111-111111111111', 70.00, 68.00, 72.00, 70.00, 'Draft'),
('e9999999-9999-9999-9999-999999999999', 'UGR-0164-24', '44444444-4444-4444-4444-444444444444', 92.00, 89.00, 87.00, 90.00, 'Approved'),
('e0000000-0000-0000-0000-000000000000', 'UGR-0220-24', '11111111-1111-1111-1111-111111111111', 55.00, 50.00, 48.00, 52.00, 'Draft');
