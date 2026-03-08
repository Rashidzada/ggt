from django.contrib import admin

from apps.quizzes.models import Option, Question, Quiz, QuizAttempt


class OptionInline(admin.TabularInline):
    model = Option
    extra = 2


class QuestionInline(admin.StackedInline):
    model = Question
    extra = 1


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "lesson", "passing_score", "is_published")
    list_filter = ("is_published", "course")
    search_fields = ("title", "description", "course__title")


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("quiz", "prompt", "order")
    inlines = [OptionInline]


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = ("quiz", "user", "score", "correct_answers", "passed", "created_at")
    list_filter = ("passed", "quiz")
    search_fields = ("quiz__title", "user__email", "user__full_name")
