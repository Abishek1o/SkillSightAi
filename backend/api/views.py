import json
import re
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Career, LearningResource, UserAnalysis
from django.db.models import Avg, Sum
from pypdf import PdfReader
from docx import Document
import io

class ResumeParseView(APIView):
    """
    API View to parse uploaded resume files (PDF, Docx, TXT) and return extracted text.
    """
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if 'file' not in request.FILES:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = request.FILES['file']
        file_name = uploaded_file.name.lower()
        extracted_text = ""

        try:
            if file_name.endswith('.pdf'):
                reader = PdfReader(uploaded_file)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"
            
            elif file_name.endswith('.docx'):
                doc = Document(uploaded_file)
                for para in doc.paragraphs:
                    extracted_text += para.text + "\n"
            
            elif file_name.endswith('.txt'):
                extracted_text = uploaded_file.read().decode('utf-8')
            
            else:
                return Response({"error": "Unsupported file format. Please upload PDF, DOCX, or TXT."}, status=status.HTTP_400_BAD_REQUEST)

            if not extracted_text.strip():
                return Response({"error": "No text could be extracted from the file."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"text": extracted_text}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Error parsing file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SkillAnalysisView(APIView):
    """
    API View to analyze skills against a target role using Pandas and Database Models.
    """

    def post(self, request):
        # 1. Get User Input
        user_skills_list = request.data.get('skills', [])
        target_role = request.data.get('target_role', '') or request.data.get('career')
        firebase_uid = request.data.get('firebase_uid')
        resume_text = request.data.get('resume_text', '')

        if not target_role:
            return Response(
                {"error": "Target role is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Fetch Required Skills from DB
        try:
            career_obj = Career.objects.get(title__iexact=target_role)
            try:
                required_skills = json.loads(career_obj.required_skills)
                if not isinstance(required_skills, list):
                    required_skills = [required_skills] if required_skills else []
            except (json.JSONDecodeError, TypeError) as e:
                 print(f"Error decoding required_skills for {target_role}: {e}")
                 required_skills = []
        except Career.DoesNotExist:
            available_roles = Career.objects.values_list('title', flat=True)
            return Response(
                {
                    "error": f"Role '{target_role}' not found.",
                    "available_roles": list(available_roles)
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # 3. Automatic Skill Extraction from Resume Text
        if resume_text:
            extracted_skills = []
            resume_text_lower = resume_text.lower()
            for skill in required_skills:
                # Use regex with word boundaries to avoid partial matches (e.g., "Java" in "JavaScript")
                # We also handle skills with special chars like C++ or .NET
                pattern = r'(?i)\b' + re.escape(skill.lower()) + r'\b'
                if re.search(pattern, resume_text_lower):
                    extracted_skills.append(skill)
            
            # Merge extracted skills with manually provided ones (if any)
            user_skills_list = list(set(user_skills_list + extracted_skills))

        # 4. Perform Analysis with Pandas
        df_required = pd.DataFrame({'skill': required_skills})
        df_required['normalized_skill'] = df_required['skill'].str.lower().str.strip()

        df_user = pd.DataFrame({'skill': user_skills_list})
        if not df_user.empty:
            df_user['normalized_skill'] = df_user['skill'].str.lower().str.strip()
        else:
             df_user = pd.DataFrame(columns=['skill', 'normalized_skill'])
        
        # Calculate Intersection (Matched Skills)
        matched_skills = df_required[df_required['normalized_skill'].isin(df_user['normalized_skill'])]['skill'].tolist()
        
        # Calculate Difference (Missing Skills)
        missing_skills = df_required[~df_required['normalized_skill'].isin(df_user['normalized_skill'])]['skill'].tolist()

        # 5. Calculate Match Percentage
        total_required = len(df_required)
        match_count = len(matched_skills)
        
        match_percentage = 0
        if total_required > 0:
            match_percentage = round((match_count / total_required) * 100, 2)

        # 5. Save to History if Firebase UID is provided
        if firebase_uid:
            try:
                UserAnalysis.objects.create(
                    firebase_uid=firebase_uid,
                    role=career_obj.title,
                    match_percentage=match_percentage,
                    skills_count=len(user_skills_list),
                    missing_skills=json.dumps(missing_skills)
                )
            except Exception as e:
                print(f"Error saving analysis to DB: {e}")

        # 6. Generate Recommendations from DB
        recommendations = []
        missing_skills_normalized = [s.lower() for s in missing_skills]
        
        for skill in missing_skills:
            # Find resource in DB
            rec_obj = LearningResource.objects.filter(skill_name__iexact=skill).first()
            
            if rec_obj:
                recommendations.append({
                    "skill": skill,
                    "resource": rec_obj.resource_name,
                    "link": rec_obj.link,
                    "type": rec_obj.resource_type,
                    "difficulty": rec_obj.get_difficulty_level_display()
                })
            else:
                # Fallback to FreeCodeCamp for unexpected skills
                recommendations.append({
                    "skill": skill,
                    "resource": "FreeCodeCamp Courses",
                    "link": f"https://www.freecodecamp.org/learn",
                    "type": "Course",
                    "difficulty": "Beginner"
                })

        # 7. Construct Response
        response_data = {
            "role": career_obj.title,
            "match_percentage": match_percentage,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "recommendations": recommendations,
            "total_required": total_required,
            "total_matched": match_count
        }

        return Response(response_data, status=status.HTTP_200_OK)

class DashboardStatsView(APIView):
    """
    API View to fetch user-specific dashboard statistics.
    """
    def get(self, request):
        firebase_uid = request.query_params.get('uid')
        if not firebase_uid:
            return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_analyses = UserAnalysis.objects.filter(firebase_uid=firebase_uid).order_by('-created_at')
        
        total_analyses = user_analyses.count()
        avg_match = user_analyses.aggregate(Avg('match_percentage'))['match_percentage__avg'] or 0
        total_skills = user_analyses.aggregate(Sum('skills_count'))['skills_count__sum'] or 0
        
        # Calculate approximate learning hours (mock calculation for now: 6 hours per analysis)
        learning_hours = total_analyses * 6 

        recent_history = []
        all_missing_skills = []

        for analysis in user_analyses[:5]:
            try:
                m_skills = json.loads(analysis.missing_skills)
            except:
                m_skills = []
                
            recent_history.append({
                "id": analysis.id,
                "date": analysis.created_at.strftime('%Y-%m-%d'),
                "jobTitle": analysis.role,
                "matchPercentage": round(analysis.match_percentage),
                "missingSkills": m_skills
            })
            all_missing_skills.extend(m_skills)

        # Get top recommended skills (from missing skills)
        from collections import Counter
        top_skills_counts = Counter(all_missing_skills).most_common(4)
        recommended_skills = []
        for skill_name, _ in top_skills_counts:
            recommended_skills.append({
                "name": skill_name,
                "category": "Development", # Default category
                "priority": "High"
            })

        # Fallback if no data
        if not recommended_skills:
            recommended_skills = [
                {"name": "Python", "category": "Programming", "priority": "High"},
                {"name": "React", "category": "Frontend", "priority": "High"}
            ]

        data = {
            "total_analyses": total_analyses,
            "avg_match_score": f"{round(avg_match)}%",
            "skills_acquired": total_skills,
            "learning_hours": learning_hours,
            "recent_analyses": recent_history,
            "recommended_skills": recommended_skills
        }

        return Response(data, status=status.HTTP_200_OK)

class AnalysisDetailView(APIView):
    """
    API View to fetch a single analysis result by ID.
    """
    def get(self, request, pk):
        try:
            analysis = UserAnalysis.objects.get(pk=pk)
            missing_skills = json.loads(analysis.missing_skills)
            
            # Re-generate recommendations based on missing skills
            recommendations = []
            for skill in missing_skills:
                rec_obj = LearningResource.objects.filter(skill_name__iexact=skill).first()
                if rec_obj:
                    recommendations.append({
                        "skill": skill,
                        "resource": rec_obj.resource_name,
                        "link": rec_obj.link,
                        "type": rec_obj.resource_type,
                        "difficulty": rec_obj.get_difficulty_level_display()
                    })
                else:
                    recommendations.append({
                        "skill": skill,
                        "resource": "General Search",
                        "link": f"https://www.google.com/search?q=learn+{skill}+free+course",
                        "type": "Search",
                        "difficulty": "Beginner"
                    })

            # Fetch target role matching skills to get "matched" count and list
            # Note: We don't store "matched_skills" specifically in UserAnalysis for brevity, 
            # so we re-calculate or return placeholders. For a better UX, we'll try to find the career again.
            matched_skills = []
            total_required = 0
            try:
                career_obj = Career.objects.get(title__iexact=analysis.role)
                required_skills = json.loads(career_obj.required_skills)
                total_required = len(required_skills)
                # Since we don't store user's actual skills list, we infer matched = required - missing
                missing_normalized = [s.lower() for s in missing_skills]
                matched_skills = [s for s in required_skills if s.lower() not in missing_normalized]
            except:
                pass

            data = {
                "role": analysis.role,
                "match_percentage": analysis.match_percentage,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "recommendations": recommendations,
                "total_required": total_required,
                "total_matched": len(matched_skills)
            }
            return Response(data, status=status.HTTP_200_OK)
        except UserAnalysis.DoesNotExist:
            return Response({"error": "Analysis not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            analysis = UserAnalysis.objects.get(pk=pk)
            analysis.delete()
            return Response({"message": "Analysis deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except UserAnalysis.DoesNotExist:
            return Response({"error": "Analysis not found"}, status=status.HTTP_404_NOT_FOUND)
