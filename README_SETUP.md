# SkillSight AI - Setup & Run Instructions

## Prerequisites
- **Python** (3.8+)
- **Node.js** (16+)

## 1. Backend Setup (Django)

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install python dependencies (make sure you are in a virtual environment if needed):
    ```bash
    pip install -r requirements.txt
    ```
3.  Run migrations:
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
4.  Load the dataset (Careers & Recommendations):
    ```bash
    python manage.py load_datasets
    ```
5.  Start the server:
    ```bash
    python manage.py runserver
    ```
    The API will be available at `http://127.0.0.1:8000/`.

## 2. Frontend Setup (React + Vite)

1.  Open a new terminal and navigate to the project root (where `package.json` is):
    ```bash
    cd d:\SkillSightAi\SkillSightAi
    ```
2.  Install node dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173/`.

## 3. Usage

1.  Open `http://localhost:5173/` in your browser.
2.  Login (or just click "Login" if it's a mock login).
3.  Go to "Start Analysis" or `/analyze`.
4.  Select a target role (e.g., "Python Developer").
5.  Enter your skills (e.g., "Python, HTML").
6.  Click "Analyze Skills".
7.  View your results, missing skills, and recommended learning resources.
