# System Architecture & Technical Design
## Student Grading Management System
**Project Activity:** J-01 (Planning and Architecture)  
**Student:** Yeabsira Kayel (ID: UGR-0170-24)  
**Technology Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL)  

---

## 1. Architectural Overview
The system follows a modern multi-tier cloud-native web architecture separating the presentation layer, business logic engine, and relational persistence layer.

```
+--------------------------------------------------------------+
|                     Next.js Frontend (App Router)            |
|  - Dashboard Overview (`/`)                                  |
|  - Student Directory & Transcripts (`/students`)             |
|  - Course Catalog (`/courses`)                               |
|  - Interactive Gradebook (`/grades`)                         |
|  - Performance Analytics (`/analytics`)                      |
|  - System Settings & Supabase Sync (`/settings`)             |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                Application Layer & Business Logic            |
|  - Grade Computation Engine (`lib/gradeCalculations.ts`)      |
|  - Dual-Mode Data Layer: Offline Cache + Remote Sync         |
|  - Client State & Form Validation Handlers                   |
+------------------------------+-------------------------------+
                               |
                               v
+--------------------------------------------------------------+
|                 Backend & Database (Supabase)                |
|  - PostgreSQL Relational Schema with Referential Integrity   |
|  - Database Triggers for Grade Recalculation                 |
|  - Row Level Security (RLS) Policies                         |
+--------------------------------------------------------------+
```

---

## 2. Relational Database Model (Supabase / PostgreSQL)

### Entity-Relationship Diagram (ERD)

```
 [Departments]
       | 1
       |
       | N
   [Students] <------- N:1 -------- [Enrollments] -------- 1:N ------> [Courses]
                                         | 1                               | 1
                                         |                                 |
                                         | 1                               | N
                                     [Grades]                     [Instructors]
```

### Table Definitions & Foreign Key Relationships
1. **`departments`**: Master department metadata (e.g., Software Engineering, Computer Science).
2. **`students`**: Master student demographic and academic standing information. Primary key `id`, unique constraint on `student_id`.
3. **`courses`**: Course listings with credit hours and assigned instructor.
4. **`enrollments`**: Associates a student with a course for a given academic semester and academic year.
5. **`grades`**: Assessment scores per enrollment record. Maintains raw values for `assignment_score`, `quiz_score`, `midterm_score`, `final_score`, alongside derived `total_score`, `letter_grade`, and `gpa_point`.
6. **`grade_audit_logs`**: Immutable audit trail recording grade changes, modifier identities, and update timestamps.

---

## 3. Data Integrity & Automated Calculations
To ensure strict consistency between the presentation tier and database:
- **Client Side:** Instant dynamic calculation provides interactive feedback while editing or reviewing scores.
- **Database Side:** PostgreSQL triggers (`BEFORE INSERT OR UPDATE ON grades`) execute `calculate_grade_metrics()` to deterministically guarantee that total scores and letter grades stored in the database cannot become desynchronized or corrupted.

---

## 4. Dual-Mode Storage Architecture
To accommodate development without requiring instant external credentials, the application implements an adaptive data layer:
- **Connected Mode:** Directly queries and writes to Supabase via `@supabase/supabase-js`.
- **Hybrid / Demo Mode:** When environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are pending configuration, the application utilizes a persistent local browser storage provider populated with realistic BITS College academic seed data, providing an immediate working system out-of-the-box.

