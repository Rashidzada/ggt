

# SRS Document

## Project Name: **GoGreenTech Learning Academy**

**Owner:** Rashid Zada
**Role:** Software Engineer
**Email:** [rashidzad6@gmail.com](mailto:rashidzad6@gmail.com)
**Contact / WhatsApp:** 03470983567
**Qualification:** MSc Computer Science, University of Swat, 2019

---

# 1. Introduction

## 1.1 Purpose

The purpose of this software is to build a **lightweight, easy-to-use, responsive online learning platform** named **GoGreenTech Learning Academy**. The platform will provide online courses, intro videos, learning resources, quizzes, WhatsApp communication, student enrollments, and admin management.

The system will include:

* **Backend:** Python Django + Django REST Framework
* **Web Frontend:** React + Tailwind CSS
* **Authentication:** JWT
* **Mobile/Desktop App:** Flutter for Android and Windows
* **Storage for learning resources:** Google Drive links
* **Single Admin Panel:** Only one main admin manages the system

---

## 1.2 Scope

This platform is designed for students who want to learn through:

* Recorded video lessons
* Project-based learning
* Group-based learning
* Face-to-face guidance coordination
* Course resources from Google Drive
* Quiz-based practice
* WhatsApp-based application and communication

The platform should be lightweight, modern, and easy to manage.

---

## 1.3 Objectives

* Create a full online learning SaaS-style platform
* Allow students to browse courses and preview intro videos
* Allow students to register/login with email-based account access
* Give students access to course materials after enrollment
* Provide 3 free trial lessons/videos or limited trial access
* Allow students to apply for a course via WhatsApp
* Allow admin to manage courses, students, content, quizzes, and analytics
* Provide mobile and Windows app support through Flutter
* Make the platform responsive and professional

---

# 2. Overall Description

## 2.1 Product Perspective

GoGreenTech Learning Academy will be a complete digital learning ecosystem with:

* Public marketing website
* Student learning portal
* Admin dashboard
* REST API backend
* Flutter mobile/desktop client

---

## 2.2 User Types

### 1. Admin

Only one super admin will manage everything:

* courses
* students
* videos
* resources
* quizzes
* inquiries
* dashboard
* enrollment review

### 2. Student

Students can:

* sign up
* log in
* see intro content
* view enrolled courses
* watch videos
* open resources
* attempt quizzes
* contact admin through WhatsApp
* apply for courses

### 3. Visitor / Guest

Visitors can:

* visit homepage
* watch intro videos
* see course list
* see platform information
* apply to join
* contact admin

---

# 3. Functional Requirements

## 3.1 Authentication Module

The system must provide:

* User registration
* User login
* User logout
* JWT authentication
* Refresh token support
* Password reset
* Email verification optional
* Role-based access control

### Registration fields:

* Full name
* Email
* Phone number
* Password
* Confirm password

---

## 3.2 Homepage / Landing Page

The first screen should include:

* Platform logo and branding
* Name: **GoGreenTech Learning Academy**
* Intro section
* 1 to 3 intro videos
* Featured courses
* Why choose us section
* Learning modes:

  * group learning
  * face-to-face/project-based learning
  * video-based learning
* Student apply button
* WhatsApp contact button
* Testimonials section
* Footer with contact details

---

## 3.3 Course Module

Admin can create and manage courses.

### Course fields:

* Title
* Slug
* Thumbnail image
* Short description
* Full description
* Course category
* Course level
* Course price
* Course type:

  * free
  * paid
  * trial
* Course duration
* Course instructor name
* Course status
* Intro video link
* Google Drive resource links
* Programming code examples/content if required

### Course features:

* Course list page
* Course detail page
* Course preview
* Intro lesson preview
* Trial access for selected lessons
* Enrollment request button
* WhatsApp apply button

---

## 3.4 Lesson / Video Module

Each course can contain multiple lessons.

### Lesson fields:

* Course
* Title
* Description
* Video URL
* Video type
* Duration
* Order number
* Is free preview
* Is published

### Lesson features:

* Student can watch enrolled lesson videos
* Guest can watch preview lessons only
* Admin can add/update/delete lessons

---

## 3.5 Learning Resources Module

Resources will mainly be uploaded externally and linked through Google Drive.

### Resource fields:

* Course
* Title
* Description
* Resource type
* Google Drive link
* Is downloadable
* Visibility type

### Resource types:

* PDF
* DOC/DOCX
* ZIP
* Code files
* Notes
* Slides

---

## 3.6 Quiz Module

The platform should have short quizzes.

### Quiz features:

* Quiz per course or per lesson
* Multiple-choice questions
* Instant result
* Score display
* Pass/fail setting
* Quiz history

### Quiz entities:

* Quiz
* Question
* Option
* Answer
* Student attempt

---

## 3.7 Enrollment / Apply Module

Students can apply for courses.

### Enrollment workflow:

* Student clicks “Apply for this Course”
* Student fills basic form:

  * name
  * email
  * phone
  * selected course
  * message
* System stores application
* Student can also contact admin through WhatsApp directly
* WhatsApp message may auto-fill course title and student name

### Admin can:

* View applications
* Mark as pending/approved/rejected
* Contact student

---

## 3.8 Trial Access Module

The system should provide **3 free trial lessons/videos** or limited trial access before paid enrollment.

### Trial rules:

* Public users can watch 1–3 intro/trial lessons
* Full course access is locked
* Call-to-action shown after trial:

  * Apply now
  * WhatsApp admin
  * Register for full access

---

## 3.9 Student Dashboard

After login, students should see:

* Profile
* Enrolled courses
* Course progress
* Lessons list
* Quiz results
* Resource links
* Notifications
* Contact admin button

---

## 3.10 Admin Dashboard

Admin dashboard should show:

* Total students
* Total course enrollments
* Total active courses
* Total applications
* Quiz attempts
* Recent signups
* Recent course applications
* Course performance summary

### Admin actions:

* manage users
* manage courses
* manage lessons
* manage resources
* manage quizzes
* manage applications
* update homepage content
* upload banners/images
* update intro videos

---

## 3.11 WhatsApp Integration

The platform should include WhatsApp contact features.

### Features:

* Floating WhatsApp button on web and app
* Apply via WhatsApp
* Pre-filled message:

  * student name
  * course title
  * email
  * inquiry

Example:

> Assalamualaikum, I am interested in the course [Course Name]. My name is [Student Name]. Please guide me about enrollment.

---

## 3.12 Profile Module

Student profile fields:

* full name
* email
* phone
* profile photo optional
* city optional
* qualification optional

---

## 3.13 Notifications Module

Basic notifications:

* enrollment confirmation
* quiz result
* new resource added
* course update
* admin announcements

---

# 4. Non-Functional Requirements

## 4.1 Performance

* Lightweight and fast loading
* Optimized API responses
* Lazy loading for videos/images where possible

## 4.2 Security

* JWT-based authentication
* Hashed passwords
* Protected APIs
* Role-based permissions
* Validation on all forms
* Secure admin panel

## 4.3 Usability

* Easy navigation
* Simple UI for students
* Mobile-friendly design
* Clean modern design
* Beginner-friendly

## 4.4 Scalability

* Support future expansion
* Add more instructors later
* Add payment gateway later
* Add certificates later
* Add live classes later

## 4.5 Availability

* Web platform available online
* Flutter app usable on Android and Windows

## 4.6 Maintainability

* Clean code structure
* Modular backend
* Reusable frontend components
* Well-documented API

---

# 5. Technology Stack

## Backend

* Python
* Django
* Django REST Framework
* PostgreSQL
* JWT Authentication
* Django Admin / Custom Admin Dashboard

## Frontend

* React
* Tailwind CSS
* Axios
* React Router
* State management with Context API or Redux Toolkit

## Mobile/Desktop App

* Flutter
* Dio or HTTP package
* JWT token storage
* Responsive UI for Android and Windows

## External Services

* Google Drive links for resources
* WhatsApp integration via click-to-chat

---

# 6. Suggested Database Modules

Main entities:

* User
* StudentProfile
* Course
* CourseCategory
* Lesson
* Resource
* Quiz
* Question
* Option
* QuizAttempt
* EnrollmentApplication
* Enrollment
* Notification
* HomepageContent
* Testimonial

---

# 7. API Requirements

The backend should provide full REST API for:

* auth
* users
* profiles
* courses
* lessons
* resources
* quizzes
* quiz attempts
* enrollments
* applications
* homepage content
* dashboard stats
* notifications

### Example API groups:

* `/api/auth/register/`
* `/api/auth/login/`
* `/api/auth/refresh/`
* `/api/courses/`
* `/api/courses/{id}/`
* `/api/lessons/`
* `/api/resources/`
* `/api/quizzes/`
* `/api/applications/`
* `/api/dashboard/stats/`

---

# 8. UI/UX Requirements

## Web

* Modern landing page
* Tailwind-based responsive design
* Hero section with intro video
* Course cards
* Student dashboard
* Admin dashboard
* Floating WhatsApp button

## Flutter App

* Splash screen
* Login/Register
* Home screen
* Course list
* Course detail
* Video lesson screen
* Quiz screen
* Student profile
* Contact/WhatsApp button

---

# 9. Future Features

These are optional for later versions:

* Payment gateway
* Live classes
* Certificates
* Assignment submission
* Discussion forums
* Multi-instructor support
* Subscription plans
* Video progress tracking
* Email notifications
* Offline lesson caching in app

---

# 10. Success Criteria

The platform will be successful if:

* Students can easily register and access learning content
* Admin can manage all courses and learners
* Trial lessons help attract users
* WhatsApp communication works smoothly
* Web and app both function properly
* The system remains lightweight and responsive

---

