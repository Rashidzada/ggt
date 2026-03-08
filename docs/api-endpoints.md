# API Endpoint List

## Auth

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`
- `PATCH /api/auth/me/`
- `POST /api/auth/password/`

## Website

- `GET /api/website/homepage/`
- `PATCH /api/website/homepage/` admin
- `GET /api/website/testimonials/`
- `POST /api/website/testimonials/` admin

## Courses

- `GET /api/courses/`
- `GET /api/courses/featured/`
- `GET /api/courses/{slug}/`
- `GET /api/courses/categories/`
- `POST /api/courses/categories/` admin

## Applications and enrollments

- `POST /api/courses/applications/`
- `GET /api/courses/applications/` current user or admin
- `PATCH /api/courses/applications/{id}/` admin
- `GET /api/courses/enrollments/`
- `POST /api/courses/enrollments/` admin

## Payments

- `GET /api/courses/payments/`
- `POST /api/courses/payments/` admin
- `GET /api/courses/payments/{id}/invoice/`

## Learning progress

- `GET /api/courses/progress/`
- `POST /api/courses/progress/`
- `PATCH /api/courses/progress/{id}/`

## Quizzes

- `GET /api/quizzes/`
- `GET /api/quizzes/{slug}/`
- `POST /api/quizzes/{slug}/submit/`
- `GET /api/quizzes/attempts/`
- `POST /api/quizzes/` admin

## Notifications

- `GET /api/notifications/`
- `POST /api/notifications/` admin
- `POST /api/notifications/{id}/mark_read/`

## Dashboards

- `GET /api/dashboard/student/`
- `GET /api/dashboard/admin/stats/`

## Schema/docs

- `GET /api/schema/`
- `GET /api/docs/`
