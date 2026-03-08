from rest_framework import serializers

from apps.quizzes.models import Option, Question, Quiz, QuizAttempt


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ["id", "text", "is_correct", "order"]


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True)

    class Meta:
        model = Question
        fields = ["id", "prompt", "explanation", "order", "options"]


class QuizListSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    lesson_title = serializers.CharField(source="lesson.title", read_only=True)
    question_count = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ["id", "title", "slug", "description", "course_title", "lesson_title", "passing_score", "question_count"]

    def get_question_count(self, obj):
        return obj.questions.count()


class QuizDetailSerializer(QuizListSerializer):
    questions = serializers.SerializerMethodField()

    class Meta(QuizListSerializer.Meta):
        fields = QuizListSerializer.Meta.fields + ["questions"]

    def get_questions(self, obj):
        request = self.context.get("request")
        is_admin = bool(
            request
            and request.user.is_authenticated
            and request.user.role == request.user.Roles.ADMIN
        )
        data = QuestionSerializer(obj.questions.prefetch_related("options"), many=True).data
        if is_admin:
            return data
        for question in data:
            for option in question["options"]:
                option.pop("is_correct", None)
        return data


class QuizWriteSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Quiz
        fields = [
            "id",
            "course",
            "lesson",
            "title",
            "description",
            "passing_score",
            "max_attempts",
            "is_published",
            "shuffle_options",
            "questions",
        ]

    def _sync_questions(self, quiz, questions_data):
        quiz.questions.all().delete()
        for question_data in questions_data:
            options_data = question_data.pop("options", [])
            question = Question.objects.create(quiz=quiz, **question_data)
            for option_data in options_data:
                Option.objects.create(question=question, **option_data)

    def create(self, validated_data):
        questions_data = validated_data.pop("questions", [])
        quiz = Quiz.objects.create(**validated_data)
        self._sync_questions(quiz, questions_data)
        return quiz

    def update(self, instance, validated_data):
        questions_data = validated_data.pop("questions", [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        self._sync_questions(instance, questions_data)
        return instance


class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source="quiz.title", read_only=True)

    class Meta:
        model = QuizAttempt
        fields = [
            "id",
            "quiz",
            "quiz_title",
            "answers",
            "score",
            "total_questions",
            "correct_answers",
            "passed",
            "created_at",
        ]


class QuizSubmissionSerializer(serializers.Serializer):
    answers = serializers.DictField(child=serializers.IntegerField(), allow_empty=False)
