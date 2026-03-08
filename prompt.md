

## AI Agent Prompt

You are a **senior full-stack software architect, Django engineer, React engineer, Flutter engineer, database designer, API designer, and UI/UX expert**.

Build a **production-ready lightweight online learning platform** called:

# **GoGreenTech Learning Academy**

## Project Owner Details

* Owner Name: **Rashid Zada**
* Role: **Software Engineer**
* Email: **[rashidzad6@gmail.com](mailto:rashidzad6@gmail.com)**
* Contact / WhatsApp: **03470983567**
* Qualification: **MSc Computer Science, University of Swat, 2019**

---

## Core Goal

Create a complete online learning platform with:

* **Backend:** Python Django + Django REST Framework
* **Web Frontend:** React + Tailwind CSS
* **Authentication:** JWT
* **Mobile/Desktop App:** Flutter for Android and Windows
* **Database:** PostgreSQL
* **Resource Handling:** Google Drive links for PDFs, docs, code, notes, and other materials
* **Communication:** WhatsApp click-to-chat integration
* **Admin Management:** One main admin only

The platform must be **easy, lightweight, responsive, modular, cleanly coded, and ready to extend**.

---

## Required Modules

### 1. Authentication

Implement:

* registration
* login
* logout
* refresh token
* protected routes
* role-based access
* one admin role
* student role

Use JWT securely.

---

### 2. Landing Page

Build a modern responsive homepage with:

* logo area
* hero section
* intro text
* platform name: GoGreenTech Learning Academy
* 1 to 3 intro videos
* featured courses
* why choose us
* testimonials
* apply button
* WhatsApp contact button
* footer with owner info

---

### 3. Course Management

Create full CRUD for:

* course categories
* courses
* lessons
* resources
* quizzes

Each course should support:

* title
* thumbnail
* short description
* full description
* level
* duration
* price
* free/paid/trial type
* intro video
* Google Drive resource links
* optional programming code content
* published status

---

### 4. Lessons and Videos

Each course contains multiple lessons.

Each lesson should include:

* title
* description
* video URL
* duration
* sequence/order
* free preview flag
* published flag

Guests can only see preview lessons.
Enrolled students can see full lessons.

---

### 5. Resource Module

Create a resource module using Google Drive links.

Each resource should support:

* title
* description
* type
* course relation
* drive link
* visibility control

Types may include:

* PDF
* DOC
* DOCX
* ZIP
* code
* notes
* slides

---

### 6. Quiz System

Create short quiz support with:

* quiz title
* course relation
* lesson relation optional
* multiple-choice questions
* options
* correct answer
* instant result
* attempt history
* score summary

---

### 7. Enrollment / Application Flow

Create course application flow with:

* name
* email
* phone
* selected course
* message

Store application in backend.
Add “Apply via WhatsApp” button that opens prefilled WhatsApp message.

---

### 8. Trial Access

Allow 3 free trial lessons or limited course preview.
After trial, show clear CTA:

* Register
* Apply now
* Contact on WhatsApp

---

### 9. Student Dashboard

Student dashboard must show:

* profile
* enrolled courses
* lessons
* resources
* quiz scores
* notifications
* contact admin button

---

### 10. Admin Dashboard

Create an admin dashboard showing:

* total students
* total enrollments
* total active courses
* total applications
* recent signups
* quiz activity
* course statistics

Admin must manage:

* users
* courses
* lessons
* resources
* quizzes
* homepage content
* testimonials
* applications

---

### 11. Flutter App

Build Flutter app for:

* Android
* Windows desktop

App screens:

* splash screen
* onboarding optional
* login/register
* home
* course list
* course detail
* video lesson
* resources
* quiz
* profile
* WhatsApp contact

Use a clean professional UI.
Must be responsive and lightweight.

---

### 12. React Frontend

Build React frontend using:

* React
* Tailwind CSS
* Axios
* React Router
* reusable components
* protected routes
* clean folder structure

Pages:

* home
* about
* courses
* course detail
* login
* register
* dashboard
* profile
* application form
* not found

---

### 13. Django Backend

Use:

* Django
* Django REST Framework
* PostgreSQL
* Simple JWT or equivalent
* CORS
* media/static config
* environment variables
* modular apps

Suggested Django apps:

* accounts
* courses
* resources
* quizzes
* enrollments
* dashboard
* website
* notifications

Implement:

* serializers
* viewsets / APIs
* permissions
* filters
* pagination
* admin customization

---

### 14. Database Design

Design models for:

* User
* StudentProfile
* CourseCategory
* Course
* Lesson
* Resource
* Quiz
* Question
* Option
* QuizAttempt
* EnrollmentApplication
* Enrollment
* Testimonial
* HomepageContent
* Notification

Use proper relationships, indexes, slugs, timestamps, and status fields.

---

### 15. WhatsApp Integration

Add click-to-chat WhatsApp integration using the owner number:
**03470983567**

Support:

* global floating WhatsApp button
* apply-to-course WhatsApp button
* prefilled course inquiry message

---

### 16. UI/UX Requirements

The design must be:

* modern
* clean
* easy to use
* lightweight
* mobile responsive
* student friendly
* professional

Use:

* soft green branding
* education-focused visuals
* modern cards
* simple typography
* dashboard-friendly layouts

---

### 17. Technical Quality Requirements

The code must be:

* production structured
* modular
* reusable
* secure
* validated
* documented
* easy to extend

Include:

* README
* setup guide
* API documentation
* environment sample files
* seed data or demo data
* example admin credentials in dev only

---

### 18. Deliverables Required

Generate:

#### Backend

* full Django project
* DRF APIs
* JWT auth
* PostgreSQL config
* admin panel

#### Frontend

* full React app
* Tailwind styling
* API integration

#### Flutter

* full Flutter app
* API service layer
* auth flow
* responsive UI

#### Documentation

* architecture summary
* DB schema summary
* API endpoint list
* installation steps
* deployment notes

---

### 19. Important Constraints

* Only one main admin for now
* Use Google Drive links instead of complex file storage for learning materials
* Keep system lightweight
* Do not overcomplicate version 1
* Keep code clean and realistic
* Prefer a practical MVP that can be expanded later

---

### 20. Nice-to-Have Features for Future

Prepare the codebase so these can be added later:

* payment integration
* certificates
* live classes
* assignments
* subscriptions
* multiple instructors
* advanced analytics
* offline cached lessons in mobile app

---

### 21. Output Format

Build the project in this order:

1. architecture and folder structure
2. database models
3. backend APIs
4. React frontend
5. Flutter app
6. admin dashboard
7. testing and validation
8. documentation

For every part:

* explain decisions
* generate production-style code
* keep modules separated
* avoid fake placeholder logic unless clearly marked
also have the payment mangment for per couse of the studnt that ahve the whatsapp thigns not fix couse pries htat was deal on whatsapp but pdf and whtpasmessage was maybe generete like that have other 
---
#Note:
make this for producation ready software not a todo list