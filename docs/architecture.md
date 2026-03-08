# Architecture Summary

## Overview

GoGreenTech Learning Academy is implemented as a lightweight monorepo with three delivery surfaces:

- Django REST API for core business logic, authentication, admin management, dashboards, and invoice generation
- React web client for marketing, enrollment, dashboard, and profile flows
- Flutter client for Android and Windows with shared API-backed flows

## Backend design

### Apps

- `accounts`: custom user model, student profiles, JWT auth endpoints
- `courses`: categories, courses, lessons, resources, applications, enrollments, payments, lesson progress
- `quizzes`: quizzes, questions, options, attempts, scoring
- `website`: homepage content and testimonials
- `notifications`: direct and broadcast notifications
- `dashboard`: admin and student dashboard endpoints

### Key implementation decisions

- Single custom `User` model supports `admin` and `student` roles
- Only one admin account is allowed at model level for the current MVP
- Course pricing supports fixed, quote-only, or hybrid pricing modes
- Learning resources use Google Drive URLs instead of file upload storage
- Payment records are attached to enrollments and can generate PDF invoices
- JWT auth uses Simple JWT with refresh token rotation enabled

## Web design

- React + Vite + Tailwind CSS
- Central Axios client with token refresh handling
- Auth context persists session state and profile data
- Route protection guards dashboard/profile flows
- Public routes cover landing, course discovery, and application flow

## Flutter design

- `provider` for app state
- `dio` for API communication with token refresh
- `shared_preferences` for persisted JWT session storage
- `url_launcher` for WhatsApp, video, resource, and invoice links

## Deployment shape

- PostgreSQL-ready through `DATABASE_URL`
- Docker compose included for local full-stack startup
- Frontend can be built as static assets and served separately
- Backend handles media/static settings and OpenAPI schema generation
