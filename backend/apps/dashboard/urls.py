from django.urls import path

from apps.dashboard.views import AdminStatsAPIView, StudentDashboardAPIView

urlpatterns = [
    path("admin/stats/", AdminStatsAPIView.as_view(), name="admin-dashboard-stats"),
    path("student/", StudentDashboardAPIView.as_view(), name="student-dashboard"),
]
