from django.urls import path
from .views import SkillAnalysisView, DashboardStatsView, AnalysisDetailView, ResumeParseView

urlpatterns = [
    path('parse-resume/', ResumeParseView.as_view(), name='parse_resume'),
    path('analyze/', SkillAnalysisView.as_view(), name='skill_analysis'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('analysis/<int:pk>/', AnalysisDetailView.as_view(), name='analysis_detail'),
]
