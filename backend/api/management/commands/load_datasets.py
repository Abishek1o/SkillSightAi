import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import Career, LearningResource

class Command(BaseCommand):
    help = 'Load careers and recommendations data from JSON files into the database'

    def handle(self, *args, **kwargs):
        base_dir = settings.BASE_DIR
        careers_path = os.path.join(base_dir, 'api', 'data', 'careers.json')
        recommendations_path = os.path.join(base_dir, 'api', 'data', 'recommendations.json')

        self.stdout.write('Loading data...')

        # Load Careers
        if os.path.exists(careers_path):
            with open(careers_path, 'r') as f:
                careers_data = json.load(f)
            
            # Clear existing careers
            Career.objects.all().delete()
            
            for role, skills in careers_data.items():
                Career.objects.create(
                    title=role,
                    required_skills=json.dumps(skills)
                )
            self.stdout.write(self.style.SUCCESS(f'Successfully loaded {len(careers_data)} careers.'))
        else:
            self.stdout.write(self.style.ERROR(f'Careers file not found at {careers_path}'))

        # Load Recommendations
        if os.path.exists(recommendations_path):
            with open(recommendations_path, 'r') as f:
                recommendations_data = json.load(f)
            
            # Clear existing resources
            LearningResource.objects.all().delete()
            
            count = 0
            for skill, data in recommendations_data.items():
                LearningResource.objects.create(
                    skill_name=skill,
                    resource_name=data['resource'],
                    link=data['link'],
                    resource_type=data['type'],
                    difficulty_level=data.get('difficulty', 'Beginner')
                )
                count += 1
            self.stdout.write(self.style.SUCCESS(f'Successfully loaded {count} learning resources.'))
        else:
            self.stdout.write(self.style.ERROR(f'Recommendations file not found at {recommendations_path}'))
