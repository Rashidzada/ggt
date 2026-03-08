# Vercel + PythonAnywhere Deployment

This project is prepared to deploy with:

- React web frontend on Vercel
- Django backend on PythonAnywhere

## 1. Deploy Django on PythonAnywhere

### Create the app

1. Upload or clone this project into your PythonAnywhere home directory.
2. Create a new web app on PythonAnywhere.
3. Choose **Manual configuration** and a supported Python version.
4. Point the project to the repo folder, for example:
   - Project root: `/home/YOURUSERNAME/go_green_tech`
   - Backend root: `/home/YOURUSERNAME/go_green_tech/backend`

### Create the virtualenv and install packages

From a PythonAnywhere Bash console:

```bash
mkvirtualenv --python=/usr/bin/python3.13 gogreentech-env
pip install -r /home/YOURUSERNAME/go_green_tech/backend/requirements.txt
```

If you already have a virtualenv, activate it and install:

```bash
workon gogreentech-env
pip install -r /home/YOURUSERNAME/go_green_tech/backend/requirements.txt
```

### Create `.env`

Create `/home/YOURUSERNAME/go_green_tech/.env` with production values:

```env
DJANGO_SECRET_KEY=replace-with-a-long-random-secret-key
DJANGO_DEBUG=0
DJANGO_ALLOWED_HOSTS=YOURUSERNAME.pythonanywhere.com
DJANGO_CORS_ALLOWED_ORIGINS=https://YOUR-PROJECT.vercel.app
DJANGO_CSRF_TRUSTED_ORIGINS=https://YOURUSERNAME.pythonanywhere.com,https://YOUR-PROJECT.vercel.app
DJANGO_TIME_ZONE=Asia/Karachi
DATABASE_URL=sqlite:////home/YOURUSERNAME/go_green_tech/backend/db.sqlite3
WHATSAPP_NUMBER=03470983567
SITE_URL=https://YOURUSERNAME.pythonanywhere.com
DJANGO_SECURE_SSL_REDIRECT=1
DJANGO_SESSION_COOKIE_SECURE=1
DJANGO_CSRF_COOKIE_SECURE=1
DJANGO_SECURE_HSTS_SECONDS=3600
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=1
DJANGO_SECURE_HSTS_PRELOAD=0
DJANGO_TRUST_X_FORWARDED_PROTO=1
```

If you later move to MySQL or PostgreSQL, replace `DATABASE_URL`.

### Configure the WSGI file

Open the WSGI file from the PythonAnywhere **Web** tab and replace its contents with:

[pythonanywhere_wsgi.py](/D:/go_green_tech/backend/deployment/pythonanywhere_wsgi.py)

Update `YOURUSERNAME` and the project folder name if needed.

### Run Django commands

From a Bash console on PythonAnywhere:

```bash
workon gogreentech-env
cd /home/YOURUSERNAME/go_green_tech/backend
python manage.py migrate
python manage.py collectstatic --noinput
```

Run seed data only if you want demo content:

```bash
python manage.py seed_demo
```

### Configure static and media mappings

In the PythonAnywhere **Web** tab, add:

- URL `/static/` -> Directory `/home/YOURUSERNAME/go_green_tech/staticfiles`
- URL `/media/` -> Directory `/home/YOURUSERNAME/go_green_tech/media`

This is required for uploaded owner images, course thumbnails, and other media.

### Reload the web app

Press **Reload** in the PythonAnywhere Web tab.

Your API should then be available at:

- `https://YOURUSERNAME.pythonanywhere.com/api/docs/`

## 2. Deploy React on Vercel

### Import the frontend

1. Import the repo into Vercel.
2. Set the **Root Directory** to `frontend/web`.
3. Vercel will use:
   - framework: Vite
   - build command: `npm run build`
   - output directory: `dist`

This repo already includes:

- [vercel.json](/D:/go_green_tech/frontend/web/vercel.json)

That file adds SPA rewrites so React Router routes like `/about` and `/courses/full-stack-web-development` work after refresh.

### Add environment variables in Vercel

Set:

```env
VITE_API_URL=https://YOURUSERNAME.pythonanywhere.com/api
```

Then deploy.

## 3. Post-deploy checks

### Backend

- Open `https://YOURUSERNAME.pythonanywhere.com/api/docs/`
- Test login
- Open admin
- Confirm uploaded owner photo and Google Drive owner photo URL both work
- Confirm `/media/` files load

### Frontend

- Open your Vercel domain
- Refresh `/about`, `/courses`, and `/free-learning`
- Confirm login works against PythonAnywhere API
- Confirm CORS is clean in browser devtools

## 4. Notes

- If you use a Google Drive image URL in `Owner photo url`, the API converts it to a browser-friendly image URL.
- If both `Owner photo` and `Owner photo url` are set, the URL currently takes priority.
- For production, do not run `seed_demo` unless you intentionally want demo accounts and demo courses.
