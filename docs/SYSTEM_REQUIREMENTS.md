# System Requirements Specification (SRS)
## Student Grading Management System
**Project Activity:** J-01 (Planning and Requirements)  
**Student:** Yeabsira Kayel (ID: UGR-0170-24)  
**Reporting Period:** November 4–10, 2026  
**Institution:** BITS College / Faculty of Computing and Technology  

---

## 1. Executive Summary & Purpose
The **Student Grading Management System (SGMS)** is an automated academic records and assessment platform engineered to streamline the recording, computation, evaluation, and reporting of student performance. Designed for higher-education academic environments, the system replaces manual grading spreadsheets with a centralized, deterministic, and verifiable workflow adhering to standard academic grading policies and GPA (Grade Point Average) calculation standards.

---

## 2. Stakeholders and User Roles

| Role | Responsibilities | Key Capabilities |
| :--- | :--- | :--- |
| **Instructor / Faculty** | Course assessment management | Enter continuous assessment marks, calculate final grades, generate grade rosters, flag students at academic risk. |
| **Academic Department Head / Dean** | Curriculum & performance oversight | Review department-wide grade distributions, audit grade change history, approve submitted grade sheets. |
| **Registrar / System Administrator** | Master record management | Maintain student enrollments, course catalogs, credit hour weighting, academic status rules (Probation, Dean's List). |
| **Student** | Academic progress tracking | View published semester grades, cumulative GPA, course completion status, and official unofficial transcript previews. |

---

## 3. Grading Policy & Computational Formulas

### 3.1 Continuous Assessment Weight Distribution
Every course assessment adheres to a standardized component breakdown totaling 100%:
- **Assignments & Lab Exercises:** 20%
- **Quizzes & Continuous Tests:** 15%
- **Midterm Examination:** 25%
- **Final Examination:** 40%
- **Total Course Score:** $\text{Score} = \text{Assignment} \times 0.20 + \text{Quiz} \times 0.15 + \text{Midterm} \times 0.25 + \text{Final} \times 0.40$

### 3.2 Grade Scale & Grade Point Equivalents
The system implements the standard higher education letter grading and 4.00 GPA system:

| Raw Score Range (%) | Letter Grade | Grade Point (GP) | Academic Standing |
| :---: | :---: | :---: | :---: |
| 90.00 – 100.00 | **A+** | 4.00 | Excellent |
| 85.00 – 89.99 | **A** | 4.00 | Excellent |
| 80.00 – 84.99 | **A-** | 3.75 | Very Good |
| 75.00 – 79.99 | **B+** | 3.50 | Very Good |
| 70.00 – 74.99 | **B** | 3.00 | Good |
| 65.00 – 69.99 | **B-** | 2.75 | Good |
| 60.00 – 64.99 | **C+** | 2.50 | Satisfactory |
| 50.00 – 59.99 | **C** | 2.00 | Satisfactory (Pass Cutoff) |
| 45.00 – 49.99 | **C-** | 1.75 | Unsatisfactory |
| 40.00 – 44.99 | **D** | 1.00 | Very Poor |
| 0.00 – 39.99 | **F** | 0.00 | Failing |

### 3.3 GPA Calculation Engine
- **Quality Points (QP) per Course:** $\text{QP}_i = \text{Credit Hours}_i \times \text{GP}_i$
- **Semester GPA (SGPA):** 
  $$\text{SGPA} = \frac{\sum_{i=1}^{n} (\text{Credit Hours}_i \times \text{GP}_i)}{\sum_{i=1}^{n} \text{Credit Hours}_i}$$
- **Cumulative GPA (CGPA):** Computed across all historical graded credit hours.
- **Academic Status Thresholds:**
  - $\text{CGPA} \ge 3.75$: **Dean's List / Very Great Distinction**
  - $2.00 \le \text{CGPA} < 3.75$: **Good Academic Standing**
  - $1.75 \le \text{CGPA} < 2.00$: **Academic Warning**
  - $\text{CGPA} < 1.75$: **Academic Probation**

---

## 4. Functional Requirements (FR)

### FR-1: Student Roster Management
- FR-1.1: The system shall record student identification (`student_id` e.g., `UGR-0170-24`), full name, email, department, cohort year, and active enrollment status.
- FR-1.2: Support fuzzy searching by student name or student ID.
- FR-1.3: Filter students by department, cohort, and academic standing status.

### FR-2: Course & Curriculum Management
- FR-2.1: Store course catalog entries including course code, title, department, credit hours (ECTS/Credit units), and instructor assigned.
- FR-2.2: Track enrollment linking students to courses per academic semester and academic year.

### FR-3: Gradebook & Real-Time Calculation
- FR-3.1: Provide an interactive gradebook table displaying raw assessment components (Assignment, Quiz, Midterm, Final).
- FR-3.2: Automatically validate raw score inputs (0 to 100 bounding check).
- FR-3.3: Calculate total score, letter grade, and grade points instantaneously upon score modification.
- FR-3.4: Support bulk calculation and status locking (Draft vs. Final Submitted).

### FR-4: Analytics & Institutional Reporting
- FR-4.1: Render dynamic visual distribution of letter grades (A+, A, B, C, D, F) across sections.
- FR-4.2: Display class performance statistics: Highest Score, Lowest Score, Mean Score, and Pass Percentage.
- FR-4.3: Export grade rosters to standard CSV format.
- FR-4.4: Generate printable official student transcripts with academic summary and GPA.

---

## 5. Non-Functional Requirements (NFR)
- **NFR-1 (Usability & Responsiveness):** Fully responsive web interface optimized for desktop, tablet, and mobile browsers using Tailwind CSS.
- **NFR-2 (Reliability & Persistence):** Zero-loss grade persistence with PostgreSQL / Supabase, backed by local offline synchronization for uninterrupted instructor data entry.
- **NFR-3 (Data Integrity & Validation):** Strict server-side and client-side validation ensuring no impossible scores ($<0$ or $>100$) can be persisted.
- **NFR-4 (Security & Access Control):** Row Level Security (RLS) enforcement at the database layer ensuring users only view or mutate authorized course records.
