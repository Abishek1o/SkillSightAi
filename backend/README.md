# SkillSight AI - Backend

This backend is built with Django and Django REST Framework.

## Setup Instructions

1.  **Install Python**: Ensure Python is installed.
2.  **Create Virtual Environment**:
    ```bash
    python -m venv venv
    ```
3.  **Activate Virtual Environment**:
    *   Windows: `venv\Scripts\activate`
    *   Mac/Linux: `source venv/bin/activate`
4.  **Install Requirements**:
    ```bash
    pip install -r requirements.txt
    ```
5.  **Run Migrations** (Optional for this specific mini-project but good practice):
    ```bash
    python manage.py migrate
    ```
6.  **Run Server**:
    ```bash
    python manage.py runserver
    ```

The API will be available at `http://127.0.0.1:8000/`.

## API Endpoints

### Analyze Skills
*   **URL**: `/api/analyze/`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "role": "Frontend Developer",
      "skills": ["HTML", "CSS", "React"]
    }
    ```
