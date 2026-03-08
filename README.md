# GoGreenTech Learning Academy

GoGreenTech Learning Academy is a full-stack SaaS learning platform built from [prompt.md](prompt.md) and [SRS.md](SRS.md). It includes a Django API and admin panel, a React web application, and a Flutter client for desktop/mobile.

The project is structured so you can:

- run it locally for development
- deploy the web frontend to Vercel
- deploy the Django backend to PythonAnywhere
- manage academy content, owner profile details, courses, free-learning videos, and student activity from Django admin

## What is included

- JWT authentication with `admin` and `student` roles
- Public marketing site with responsive landing, courses, about, and application pages
- Protected student flows for dashboard, profile, and free-learning library
- Django-managed free-learning videos with embedded playback
- Course catalog with lessons, resources, previews, quizzes, applications, and payment records
- Owner profile management with either uploaded images or external image URLs, including Google Drive shared image links
- Flutter client for Android and Windows

## Tech stack

- Backend: Django, Django REST Framework, Simple JWT, django-filter, drf-spectacular
- Frontend: React 19, Vite, TypeScript, Tailwind CSS, Axios, React Router
- Mobile/Desktop: Flutter
- Storage approach: Django media uploads plus external Google Drive links where needed
- Deployment target: Vercel for React, PythonAnywhere for Django

## Repository structure

```text
backend/                  Django project, API, admin, migrations, deployment helpers
frontend/web/             React + Vite web app
mobile/gogreentech_app/   Flutter application
docs/                     Architecture, database, API, and deployment docs
logo/                     Shared branding assets
prompt.md                 Original product prompt
SRS.md                    Original software requirements spec
```

## Main product features

### Public website

- Responsive homepage with featured course content and a featured free video
- About page powered by Django content
- Owner card with image upload support and external URL support
- Course listing and course detail pages
- Student application form

### Student area

- Login and registration
- Dashboard and profile
- Protected free-learning page with embedded videos
- Course progress, resources, quizzes, and notifications

### Admin area

- Django admin for homepage content, about content, testimonials, courses, quizzes, notifications, and free-learning videos
- Owner photo can be managed in two ways:
  - upload a file
  - paste an image URL
- Google Drive shared image links are normalized automatically for display

## Local development

## 1. Backend

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
copy .env.example .env
python backend/manage.py migrate
python backend/manage.py seed_demo
python backend/manage.py runserver 0.0.0.0:8000
```

Backend docs:

- API docs: `http://127.0.0.1:8000/api/docs/`
- Admin: `http://127.0.0.1:8000/admin/`

## 2. Web frontend

```bash
cd frontend/web
npm install
npm run dev
```

Default local web URL:

- `http://127.0.0.1:5173/`

## 3. Flutter app

```bash
cd mobile/gogreentech_app
flutter pub get
```

Android emulator:

```bash
flutter run --dart-define=API_URL=http://10.0.2.2:8000/api
```

Windows desktop:

```bash
flutter run -d windows --dart-define=API_URL=http://127.0.0.1:8000/api
```

## Demo accounts

- Admin: `admin@gogreentech.local` / `Admin123!`
- Student: `student@gogreentech.local` / `Student123!`

Use these only for local/demo environments.

## Deployment

Recommended production setup:

- React frontend on Vercel
- Django backend on PythonAnywhere

Start here:

- [Vercel + PythonAnywhere Deployment](docs/vercel-pythonanywhere.md)
- [Deployment Notes](docs/deployment.md)

Key production env values:

- `DJANGO_DEBUG=0`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CORS_ALLOWED_ORIGINS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`
- `SITE_URL`
- `VITE_API_URL`

## Verification commands

Backend tests:

```bash
python backend/manage.py test apps.accounts apps.courses apps.quizzes apps.website apps.notifications apps.dashboard
```

Frontend build:

```bash
cd frontend/web
npm run build
```

Flutter analysis:

```bash
cd mobile/gogreentech_app
flutter analyze
```

Flutter tests:

```bash
cd mobile/gogreentech_app
flutter test
```

## Documentation

- [Architecture](docs/architecture.md)
- [Database Schema](docs/database-schema.md)
- [API Endpoints](docs/api-endpoints.md)
- [Deployment Notes](docs/deployment.md)
- [Vercel + PythonAnywhere Deployment](docs/vercel-pythonanywhere.md)

## Notes

- The repository ignores local virtual environments, node modules, build artifacts, media, staticfiles, logs, and Codex temp folders.
- Uploaded media is not committed to Git by default.
- If you want the owner photo to come from Google Drive, leave the upload field empty and use the `Owner photo url` field in Django admin.
