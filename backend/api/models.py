from django.db import models

class Career(models.Model):
    title = models.CharField(max_length=200, unique=True)
    required_skills = models.TextField(help_text="JSON list of required skills") # Store as JSON string for flexibility

    def __str__(self):
        return self.title

class LearningResource(models.Model):
    resource_type_choices = [
        ('Course', 'Course'),
        ('Documentation', 'Documentation'),
        ('Tutorial', 'Tutorial'),
        ('Certification', 'Certification'),
        ('Tool', 'Tool'),
        ('Practice', 'Practice'),
        ('Search', 'Search'),
    ]
    skill_name = models.CharField(max_length=100)
    resource_name = models.CharField(max_length=200)
    link = models.URLField(max_length=500)
    resource_type = models.CharField(max_length=50, choices=resource_type_choices)
    difficulty_level = models.CharField(max_length=20, default='Beginner', choices=[
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ])

    def __str__(self):
        return f"{self.skill_name} - {self.resource_name}"

class UserAnalysis(models.Model):
    firebase_uid = models.CharField(max_length=128)
    role = models.CharField(max_length=200)
    match_percentage = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    skills_count = models.IntegerField()
    missing_skills = models.TextField(help_text="JSON list of missing skills")

    def __str__(self):
        return f"{self.role} - {self.firebase_uid} - {self.match_percentage}%"
