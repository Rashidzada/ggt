export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Profile {
  profile_photo?: string | null;
  city: string;
  qualification: string;
  bio: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  role: "admin" | "student";
  is_email_verified: boolean;
  created_at: string;
  profile: Profile;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface HomepageContent {
  id: number;
  site_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  intro_text: string;
  about_title: string;
  about_description: string;
  intro_video_urls: string[];
  why_choose_us: string[];
  learning_modes: string[];
  owner_name: string;
  owner_role: string;
  owner_email: string;
  owner_whatsapp: string;
  owner_qualification: string;
  owner_photo: string | null;
  owner_photo_display_url: string;
  owner_photo_url: string;
  owner_profile_url: string;
  footer_note: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar_url: string;
  is_featured: boolean;
  sort_order: number;
}

export interface FreeLearningVideo {
  id: number;
  title: string;
  description: string;
  video_url: string;
  video_id: string;
  embed_url: string;
  thumbnail_url: string;
  language: string;
  sort_order: number;
  is_published: boolean;
  show_on_homepage: boolean;
}

export interface CourseCategory {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon_name: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  video_url: string;
  video_type: string;
  duration_minutes: number;
  order: number;
  is_free_preview: boolean;
  is_published: boolean;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  resource_type: string;
  drive_link: string;
  code_content: string;
  is_downloadable: boolean;
  visibility: string;
  order: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  category: CourseCategory;
  short_description: string;
  full_description?: string;
  level: string;
  duration: string;
  instructor_name: string;
  course_type: string;
  pricing_model: string;
  listed_price: string | number | null;
  price_display: string;
  featured: boolean;
  is_published: boolean;
  intro_video_url: string;
  thumbnail_url: string;
  lessons_count: number;
  quiz_count: number;
  drive_folder_url?: string;
  code_overview?: string;
  trial_lesson_limit?: number;
  lessons?: Lesson[];
  resources?: Resource[];
  is_enrolled?: boolean;
  progress_percent?: number;
  application_status?: string | null;
  latest_payment_status?: string | null;
  whatsapp_apply_url?: string;
}

export interface Enrollment {
  id: number;
  course: Course;
  status: string;
  agreed_price: string;
  activated_at: string | null;
  expires_at: string | null;
  progress_percent: number;
  created_at: string;
}

export interface PaymentRecord {
  id: number;
  invoice_number: string;
  course_title: string;
  amount_due: string;
  amount_paid: string;
  balance: string;
  due_date: string | null;
  paid_at: string | null;
  status: string;
  payment_method: string;
  transaction_reference: string;
  proof_url: string;
  notes: string;
  invoice_url: string;
  created_at: string;
}

export interface QuizAttempt {
  id: number;
  quiz: number;
  quiz_title: string;
  answers: Record<string, number>;
  score: number;
  total_questions: number;
  correct_answers: number;
  passed: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  action_url: string;
  is_read: boolean;
  created_at: string;
}

export interface StudentDashboardData {
  profile: User;
  enrollments: Enrollment[];
  quiz_attempts: QuizAttempt[];
  notifications: NotificationItem[];
  payments: PaymentRecord[];
  unread_notifications: number;
}

export interface AdminDashboardData {
  total_students: number;
  total_enrollments: number;
  total_active_courses: number;
  total_applications: number;
  recent_signups: User[];
  quiz_activity: QuizAttempt[];
  recent_applications: {
    id: number;
    name: string;
    course: string;
    status: string;
    created_at: string;
  }[];
  course_statistics: {
    title: string;
    course_type: string;
    enrollment_count: number;
    featured: boolean;
  }[];
}

export interface ApplicationResponse {
  id: number;
  course: number;
  course_title: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferred_contact_whatsapp: boolean;
  agreed_via_whatsapp: boolean;
  status: string;
  quoted_price: string | null;
  admin_notes: string;
  pricing_notes: string;
  whatsapp_url: string;
  created_at: string;
}
