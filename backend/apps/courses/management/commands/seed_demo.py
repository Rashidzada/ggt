from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.accounts.models import User
from apps.courses.models import (
    Course,
    CourseCategory,
    Enrollment,
    EnrollmentApplication,
    Lesson,
    PaymentRecord,
    Resource,
)
from apps.notifications.models import Notification
from apps.quizzes.models import Option, Question, Quiz
from apps.website.models import FreeLearningVideo, HomepageContent, Testimonial


class Command(BaseCommand):
    help = "Seed demo content for GoGreenTech Learning Academy."

    def handle(self, *args, **options):
        admin, created = User.objects.get_or_create(
            email="admin@gogreentech.local",
            defaults={
                "full_name": "Rashid Zada",
                "phone_number": "03470983567",
                "role": User.Roles.ADMIN,
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            admin.set_password("Admin123!")
            admin.save()

        student, created = User.objects.get_or_create(
            email="student@gogreentech.local",
            defaults={
                "full_name": "Demo Student",
                "phone_number": "03001234567",
            },
        )
        if created:
            student.set_password("Student123!")
            student.save()

        HomepageContent.objects.update_or_create(
            site_name="GoGreenTech Learning Academy",
            defaults={
                "tagline": "Project-based learning with WhatsApp-first enrollment",
                "hero_title": "Learn practical tech skills with guided support",
                "hero_subtitle": "Recorded lessons, quiz practice, shared resources, and personal enrollment guidance.",
                "intro_text": "GoGreenTech is built for students who want lightweight but serious training.",
                "about_title": "A practical learning platform built around guided progress",
                "about_description": (
                    "GoGreenTech Learning Academy is designed for students who want real skill development without a "
                    "heavy or confusing learning system. Rashid Zada combines software engineering experience with a "
                    "simple teaching model: structured content, preview access, clear enrollment, and direct support."
                ),
                "intro_video_urls": [
                    "https://www.youtube.com/watch?v=q15rpL3Zj8k",
                    "https://www.youtube.com/watch?v=7-LCAy6EuUs",
                ],
                "why_choose_us": [
                    "Small and practical course structure",
                    "Three free trial lessons before enrollment",
                    "WhatsApp-based guidance and pricing discussion",
                ],
                "learning_modes": ["Video-based learning", "Project-based learning", "Face-to-face guidance"],
                "owner_name": "Rashid Zada",
                "owner_role": "Software Engineer",
                "owner_email": "rashidzad6@gmail.com",
                "owner_whatsapp": "03470983567",
                "owner_qualification": "MSc Computer Science, University of Swat, 2019",
                "owner_photo_url": "https://rashidzada.pythonanywhere.com/media/profile_images/mypic-removebg-preview.png",
                "owner_profile_url": "https://rashidzada.pythonanywhere.com/",
            },
        )

        free_learning_videos = [
            (
                1,
                True,
                "Master Gemini AI in 15 Minutes: Text, Image, Video & Music Prompts!",
                "https://www.youtube.com/watch?v=q15rpL3Zj8k",
                "https://i.ytimg.com/vi/q15rpL3Zj8k/hqdefault.jpg",
            ),
            (
                2,
                False,
                "C++ File Handling Tutorial | Input Output Explained Simply",
                "https://www.youtube.com/watch?v=7-LCAy6EuUs",
                "https://i.ytimg.com/vi/7-LCAy6EuUs/hqdefault.jpg",
            ),
            (
                3,
                False,
                "Record (Structure) in C++ | Explained with Real-Life Examples",
                "https://www.youtube.com/watch?v=ZH9R6szcH4w",
                "https://i.ytimg.com/vi/ZH9R6szcH4w/hqdefault.jpg",
            ),
            (
                4,
                False,
                "C++ Pointers | Complete Introduction with Simple Examples",
                "https://www.youtube.com/watch?v=_FU1k9Cbgn0",
                "https://i.ytimg.com/vi/_FU1k9Cbgn0/hqdefault.jpg",
            ),
            (
                5,
                False,
                "Logical Operators + ++i & i++ + Assignment Operators | Complete Beginner Guide.",
                "https://www.youtube.com/watch?v=LTAKucZXGmE",
                "https://i.ytimg.com/vi/LTAKucZXGmE/hqdefault.jpg",
            ),
            (
                6,
                False,
                "C++ Operators Made Easy! Arithmetic + Relational Explained with Examples.",
                "https://www.youtube.com/watch?v=HN7YSEfQOeo",
                "https://i.ytimg.com/vi/HN7YSEfQOeo/hqdefault.jpg",
            ),
            (
                7,
                False,
                "Ternary Operator in C++ | Easy Explanation with Screen Width Examples",
                "https://www.youtube.com/watch?v=USBw_Sxem5k",
                "https://i.ytimg.com/vi/USBw_Sxem5k/hqdefault.jpg",
            ),
            (
                8,
                False,
                "C++ Decision Making: Nested If, Else-If & Switch Statement Explained with Examples.",
                "https://www.youtube.com/watch?v=RAHJ2z0mUys",
                "https://i.ytimg.com/vi/RAHJ2z0mUys/hqdefault.jpg",
            ),
        ]
        for sort_order, show_on_homepage, title, video_url, thumbnail_url in free_learning_videos:
            FreeLearningVideo.objects.update_or_create(
                video_url=video_url,
                defaults={
                    "title": title,
                    "description": "Free Pashto lesson from the GoGreenTech channel.",
                    "thumbnail_url": thumbnail_url,
                    "language": "Pashto",
                    "sort_order": sort_order,
                    "is_published": True,
                    "show_on_homepage": show_on_homepage,
                },
            )

        category, _ = CourseCategory.objects.get_or_create(
            title="Software Development",
            defaults={"description": "Programming and modern development tracks."},
        )
        course, _ = Course.objects.get_or_create(
            title="Full Stack Web Development",
            defaults={
                "category": category,
                "short_description": "React, Django, APIs, and deployment in one guided track.",
                "full_description": "A practical course for students who want to build production-style applications.",
                "duration": "8 weeks",
                "level": Course.Levels.INTERMEDIATE,
                "course_type": Course.CourseTypes.PAID,
                "pricing_model": Course.PricingModels.HYBRID,
                "listed_price": Decimal("15000.00"),
                "quote_label": "Final fee confirmed on WhatsApp",
                "intro_video_url": "https://www.youtube.com/watch?v=ysz5S6PUM-U",
                "drive_folder_url": "https://drive.google.com/",
                "featured": True,
                "is_published": True,
            },
        )

        lessons = [
            ("Platform overview", True, 1),
            ("React fundamentals", True, 2),
            ("Django REST APIs", True, 3),
            ("Authentication and dashboard", False, 4),
        ]
        for title, preview, order in lessons:
            Lesson.objects.get_or_create(
                course=course,
                order=order,
                defaults={
                    "title": title,
                    "description": f"Lesson for {title}",
                    "video_url": "https://www.youtube.com/watch?v=ysz5S6PUM-U",
                    "duration_minutes": 20,
                    "is_free_preview": preview,
                    "is_published": True,
                },
            )

        Resource.objects.get_or_create(
            course=course,
            title="Course Roadmap PDF",
            defaults={
                "description": "Overview of modules and weekly plan.",
                "resource_type": Resource.ResourceTypes.PDF,
                "drive_link": "https://drive.google.com/",
                "visibility": Resource.Visibility.PUBLIC,
            },
        )
        Resource.objects.get_or_create(
            course=course,
            title="Starter Code",
            defaults={
                "description": "Initial project boilerplate.",
                "resource_type": Resource.ResourceTypes.CODE,
                "drive_link": "https://drive.google.com/",
                "visibility": Resource.Visibility.ENROLLED,
                "code_content": "git clone https://example.com/repo",
            },
        )

        quiz, _ = Quiz.objects.get_or_create(
            course=course,
            title="Getting Started Quiz",
            defaults={
                "description": "Checks early understanding of the course flow.",
                "passing_score": 60,
                "is_published": True,
            },
        )
        if not quiz.questions.exists():
            question = Question.objects.create(quiz=quiz, prompt="Which stack powers this platform?", order=1)
            Option.objects.create(question=question, text="Django + React + Flutter", is_correct=True, order=1)
            Option.objects.create(question=question, text="Laravel + Vue", is_correct=False, order=2)

        application, _ = EnrollmentApplication.objects.get_or_create(
            course=course,
            email=student.email,
            defaults={
                "user": student,
                "name": student.full_name,
                "phone": student.phone_number,
                "message": "I want to enroll in the course.",
                "status": EnrollmentApplication.Statuses.APPROVED,
                "quoted_price": Decimal("12000.00"),
                "pricing_notes": "Discount confirmed via WhatsApp.",
            },
        )
        enrollment, _ = Enrollment.objects.get_or_create(
            user=student,
            course=course,
            defaults={
                "application": application,
                "approved_by": admin,
                "status": Enrollment.Statuses.ACTIVE,
                "agreed_price": Decimal("12000.00"),
                "activated_at": timezone.now(),
            },
        )
        PaymentRecord.objects.get_or_create(
            enrollment=enrollment,
            defaults={
                "amount_due": Decimal("12000.00"),
                "amount_paid": Decimal("6000.00"),
                "status": PaymentRecord.Statuses.PARTIAL,
                "payment_method": PaymentRecord.Methods.WHATSAPP,
                "transaction_reference": "DEMO-WA-001",
                "notes": "First installment recorded after WhatsApp confirmation.",
            },
        )

        Testimonial.objects.get_or_create(
            name="Areeba Khan",
            defaults={
                "role": "Student",
                "content": "The lessons are simple to follow and the support on WhatsApp is very helpful.",
                "is_featured": True,
                "sort_order": 1,
            },
        )
        Notification.objects.get_or_create(
            user=student,
            title="Welcome to GoGreenTech",
            defaults={
                "notification_type": Notification.Types.ANNOUNCEMENT,
                "message": "Your demo account is ready. Start from the preview lessons and continue into the dashboard.",
            },
        )

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))
