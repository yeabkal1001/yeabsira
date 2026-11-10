# Student Grading Management System (SGMS)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)

An automated academic assessment and grade records management system developed for **Software Process Improvement (Personal Software Process - PSP)**.

---

## 📌 Student & Project Information

- **Student Name:** Yeabsira Kayel
- **Student ID:** UGR-0170-24
- **Project Title:** Student Grading Management System
- **Technology Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL)
- **Reporting Period:** November 4–10, 2026
- **Source Code Repository:** [https://github.com/yeabkal1001/yeabsira](https://github.com/yeabkal1001/yeabsira)
- **Institution:** BITS College / Faculty of Computing and Technology

---

## 🚀 Key Features

1. **Continuous Assessment Gradebook:**
   - Standard 4-component assessment model:
     - **Assignments & Practical Labs (20%)**
     - **Quizzes & Tests (15%)**
     - **Midterm Examination (25%)**
     - **Final Examination (40%)**
   - Instant calculation of total percentage, letter grade, and grade points (4.00 scale).

2. **Student Academic Directory:**
   - Full student roster with search by Name or ID (`UGR-0170-24`).
   - Filters for department (Software Engineering, Computer Science, Information Systems) and academic standing.
   - Dynamic registration modal for enrolling new students.

3. **Official Transcript Generator:**
   - Formatted printable academic transcript modal including institution branding, course enrollment breakdown, credits, semester GPA, cumulative GPA, and registrar signature block.

4. **Performance Analytics & Early Warning:**
   - Visual grade distribution bar chart (A+, A, B, C, D, F).
   - Class statistical metrics: Mean, Highest, Lowest, Pass rate.
   - Automatic identification of at-risk students ($\text{GPA} < 2.00$) for academic intervention.

5. **Course Catalog & Offerings:**
   - Overview of departmental courses, credit units, instructors, and enrolled students.

6. **Dual-Mode Persistence (Supabase + Local Storage):**
   - Direct integration with Supabase PostgreSQL backend.
   - Zero-config local offline demo mode with sample BITS College student and course records when environment variables are pending.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (React 18, App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Lucide React Icons
- **Database & Backend:** Supabase (PostgreSQL, Triggers, Row-Level Security)
- **Build Tools:** PostCSS, Autoprefixer, ESLint

---

## 📋 PSP Work Log Summary

### 1. Job Number Log

| Job No. | Activity | Description of Work |
| :--- | :--- | :--- |
| **J-01** | Planning and requirements | Defined the project purpose, core users, expected grading workflow, and initial functional requirements. |
| **J-02** | Next.js project setup | Initialized the Next.js application, organized the project structure, and prepared the development environment. |
| **J-03** | UI design and frontend development | Designed application screens and implemented frontend components and page layouts. |
| **J-04** | Supabase setup | Configured the Supabase project and prepared the backend/database connection for application data. |

### 2. Daily Time Log

| Date | Job No. | Work Performed | Hours |
| :--- | :--- | :--- | :---: |
| **Nov 4, 2026** | J-01 | Planning the project scope and identifying system requirements. | 2.5 |
| **Nov 5, 2026** | J-02 | Setting up the Next.js project and organizing the application structure. | 2.5 |
| **Nov 6, 2026** | J-03 | Working on UI design, page layouts, and frontend components. | 2.5 |
| **Nov 9, 2026** | J-03 | Continuing frontend implementation and refining the interface. | 2.5 |
| **Nov 10, 2026** | J-04 | Setting up Supabase and preparing the backend/database integration. | 2.5 |
| **Total** | | **Reconstructed development time** | **12.5 hrs** |

---

## 💻 Getting Started & Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/yeabkal1001/yeabsira.git
cd yeabsira
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase (Optional for local demo)
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Execute the database schema and seed data in your Supabase SQL Editor:
1. `supabase/schema.sql` (Creates tables, triggers, and RLS policies)
2. `supabase/seed.sql` (Inserts initial departments, students, and courses)

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the system.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```
├── app/
│   ├── analytics/        # Performance metrics and grade distribution charts
│   ├── courses/          # Course catalog and class rosters
│   ├── grades/           # Interactive continuous assessment gradebook
│   ├── settings/         # Supabase connection & grading scale
│   ├── students/         # Student directory and transcript viewer
│   ├── globals.css       # Global styling and print media rules
│   ├── layout.tsx        # Root application layout shell
│   └── page.tsx          # Main dashboard overview
├── components/
│   ├── AddStudentModal.tsx        # Registration dialog
│   ├── GradeDistributionChart.tsx # Histogram frequency visualizer
│   ├── GradeEntryModal.tsx        # Continuous score entry modal
│   ├── MetricCard.tsx             # Stat indicator card
│   ├── Navbar.tsx                 # Top navigation and status bar
│   ├── Sidebar.tsx                # Left application sidebar
│   └── TranscriptModal.tsx        # Printable official transcript
├── docs/
│   ├── ARCHITECTURE.md          # Technical architectural design document
│   └── SYSTEM_REQUIREMENTS.md   # Functional & non-functional requirements
├── lib/
│   ├── gradeCalculations.ts     # GPA, weighted total, and letter grade logic
│   ├── mockData.ts              # Sample student, course, and grade records
│   ├── storage.ts               # Unified data layer (Supabase + Local fallback)
│   ├── supabase.ts              # Supabase client initialization
│   └── types.ts                 # TypeScript type definitions
├── supabase/
│   ├── schema.sql               # PostgreSQL tables, triggers, and RLS policies
│   └── seed.sql                 # Sample university seed data
├── .env.example                 # Environment variables template
├── package.json                 # Project dependencies & scripts
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript compiler configuration
```

---

## 📄 License
This project is submitted for academic evaluation at BITS College under the Software Process Improvement course.

