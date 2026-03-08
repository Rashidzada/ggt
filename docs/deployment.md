# Deployment Notes

## Recommended Targets

- React frontend: Vercel
- Django backend: PythonAnywhere

Use the full guide here:

- [Vercel + PythonAnywhere Deployment](/D:/go_green_tech/docs/vercel-pythonanywhere.md)

## Environment

Set production values for:

- `DJANGO_SECRET_KEY`
- `DATABASE_URL`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CORS_ALLOWED_ORIGINS`
- `DJANGO_CSRF_TRUSTED_ORIGINS`
- `SITE_URL`
- `WHATSAPP_NUMBER`
- `DJANGO_SECURE_SSL_REDIRECT`
- `DJANGO_SESSION_COOKIE_SECURE`
- `DJANGO_CSRF_COOKIE_SECURE`

## Backend

- Install from `backend/requirements.txt`
- Run `python backend/manage.py migrate`
- Run `python backend/manage.py collectstatic --noinput`
- Seed only for demo environments:
  `python backend/manage.py seed_demo`
- Serve the Django app behind a reverse proxy

## Web frontend

- Set `VITE_API_URL`
- Build with `npm run build`
- Serve the generated `frontend/web/dist` directory using nginx, Vercel static output, Netlify, or any static host

## Flutter

- Android:
  `flutter build apk --dart-define=API_URL=https://your-api.example.com/api`
- Windows:
  `flutter build windows --dart-define=API_URL=https://your-api.example.com/api`

## Docker compose

The included `docker-compose.yml` is intended for local or staging use.

- PostgreSQL runs in a dedicated container
- Django runs migrations, seeds demo data, then starts the API
- React is built into a static nginx container

## Post-deploy checks

- Open `/api/docs/`
- Verify registration/login
- Verify course detail preview access
- Submit an application and test the WhatsApp link
- Download a generated invoice PDF
- Verify student/admin dashboard data
- Verify owner photo upload and Google Drive owner photo URL rendering
