# Database Schema Summary

## Accounts

- `User`
  - email, full_name, phone_number, role, is_email_verified
- `StudentProfile`
  - user, profile_photo, city, qualification, bio

## Course domain

- `CourseCategory`
  - title, slug, description, icon_name, is_active
- `Course`
  - category, title, slug, thumbnail, short_description, full_description, level, duration
  - instructor_name, listed_price, pricing_model, quote_label, course_type
  - intro_video_url, drive_folder_url, code_overview, trial_lesson_limit
  - featured, is_published
- `Lesson`
  - course, title, description, video_url, video_type, duration_minutes, order
  - is_free_preview, is_published
- `Resource`
  - course, title, description, resource_type, drive_link, code_content
  - is_downloadable, visibility, order

## Enrollment and payments

- `EnrollmentApplication`
  - course, user, name, email, phone, message
  - preferred_contact_whatsapp, agreed_via_whatsapp
  - status, quoted_price, admin_notes, pricing_notes
- `Enrollment`
  - user, course, application, approved_by, status, agreed_price
  - activated_at, expires_at
- `PaymentRecord`
  - enrollment, amount_due, amount_paid, due_date, paid_at
  - status, payment_method, transaction_reference, proof_url, notes, invoice_number
- `LessonProgress`
  - user, lesson, is_completed, last_position_seconds, completed_at

## Quiz domain

- `Quiz`
  - course, lesson, title, slug, description, passing_score, max_attempts
  - is_published, shuffle_options
- `Question`
  - quiz, prompt, explanation, order
- `Option`
  - question, text, is_correct, order
- `QuizAttempt`
  - quiz, user, answers, score, total_questions, correct_answers, passed

## Website and communication

- `HomepageContent`
  - site_name, tagline, hero_title, hero_subtitle, intro_text
  - intro_video_urls, why_choose_us, learning_modes
  - owner metadata
- `Testimonial`
  - name, role, content, avatar_url, is_featured, sort_order
- `Notification`
  - user, created_by, audience, notification_type, title, message, action_url, is_read
