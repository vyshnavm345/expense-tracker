
# Expense Tracker

A full-stack personal expense tracking application built with Django (REST API) and React. This app allows users to track their expenses, view summaries by category or user (admin), and manage their spending.

## Features

- User authentication (login, register)
- Create, edit, delete expenses
- Filter expenses by category and date
- Pie chart summary of expenses
- Admin dashboard with user-wise and category-wise summaries
- Form validation and loading/error states

---

## 🛠 Tech Stack

- **Frontend**: React, Tailwind CSS, Recharts
- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL (or SQLite for local dev)
- **Auth**: Token-based auth with Django Rest Framework

---

## 🔧 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/vyshnavm345/expense-tracker.git
cd expense-tracker
```

### 2. Backend Setup (Django)

```bash
cd backend

# Create virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env  # Or manually create `.env` and add your DB credentials, secret key, etc.

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

Your backend server should be running at `http://127.0.0.1:8000/`

### 3. Frontend Setup (React)

In a separate terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend
npm start
```

Frontend will run on `http://localhost:5173/`

---

## 📂 Folder Structure

```
expense-tracker/
├── backend/
│   ├── manage.py
│   └── expenseapp/
│       └── ...
├── frontend/
│   └── src/
│       └── ...
```

---

## 📄 License

MIT License

---

## 🙌 Acknowledgements

Built as part of a personal project by [Vyshnav M](https://github.com/vyshnavm345).
