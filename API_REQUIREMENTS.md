# UMaT Admin Dashboard: Backend API Requirements

## 1. Project Context

This document outlines the backend API endpoints and data structures required for the UMaT Admin Dashboard frontend.

The project is a web application built with Next.js, TypeScript, and Tailwind CSS. Its primary purpose is to provide an administrative interface for managing and monitoring an adaptive learning platform. Administrators use this dashboard to view key metrics, manage students and courses, and configure the learning bot's intelligence.

This document will break down the data requirements on a page-by-page basis to ensure the FastAPI backend provides all necessary data in the expected format.

---

## 2. Admin API Routes (`/api/v1/admin/*`)

This section details the API endpoints required for the admin dashboard. These routes should be protected and only accessible to authenticated administrators.

### 2.1. Page: Admin Dashboard (`app/admin/page.tsx`)

This is the main landing page for the admin panel. It displays a high-level overview of the platform's activity.

#### 2.1.1. Key Statistics Cards

*   **Purpose:** To provide a quick, at-a-glance overview of the most important platform metrics.
*   **Required API Endpoint:** `GET /api/v1/admin/dashboard/stats`
*   **Expected Data Format:** A JSON array of 4 objects.

```json
[
  {
    "title": "Total Students",
    "value": "2847",
    "change": "+12.5%",
    "trend": "up",
    "description": "Active learners this month"
  },
  {
    "title": "Course Completion",
    "value": "87.3%",
    "change": "+5.2%",
    "trend": "up",
    "description": "Average completion rate"
  },
  {
    "title": "Bot Interactions",
    "value": "15432",
    "change": "+23.1%",
    "trend": "up",
    "description": "AI assistance requests"
  },
  {
    "title": "Learning Hours",
    "value": "8921",
    "change": "+8.7%",
    "trend": "up",
    "description": "Total study time this week"
  }
]
```

#### 2.1.2. Recent Activity Feed

*   **Purpose:** To show administrators a live feed of the most recent user interactions.
*   **Required API Endpoint:** `GET /api/v1/admin/dashboard/recent-activity`
*   **Expected Data Format:** A JSON array of activity objects.

```json
[
  {
    "id": "evt_1JqL2mFzGqZzYqYq1JqL2mFz",
    "user": {
      "name": "John Doe",
      "avatar_initial": "J"
    },
    "action": "completed Advanced Mathematics",
    "timestamp": "2025-08-24T10:30:00Z"
  },
  {
    "id": "evt_2KqL2mFzGqZzYqYq2KqL2mFz",
    "user": {
      "name": "Jane Smith",
      "avatar_initial": "J"
    },
    "action": "started Physics Course",
    "timestamp": "2025-08-24T10:27:00Z"
  }
]
```

### 2.2. Page: Students (`app/admin/students/page.tsx`)

This page is for displaying and managing a list of all students.

#### 2.2.1. Student Statistics Cards

*   **Purpose:** To provide an overview of student-related metrics.
*   **Required API Endpoint:** `GET /api/v1/admin/students/stats`
*   **Expected Data Format:** A JSON array of 4 objects.

```json
[
  {
    "title": "Total Students",
    "value": "2,847"
  },
  {
    "title": "Active Students",
    "value": "2,234"
  },
  {
    "title": "Average GPA",
    "value": "3.6"
  },
  {
    "title": "Completion Rate",
    "value": "87.3%"
  }
]
```

#### 2.2.2. Students Data Table

*   **Purpose:** To display a comprehensive, sortable, and searchable list of all students.
*   **Required API Endpoint:** `GET /api/v1/admin/students`
*   **Supported Query Parameters:** `?search={term}`, `?page={num}&limit={num}`, `?sortBy={field}&order={asc|desc}`
*   **Expected Data Format:** A JSON object containing pagination details and an array of student objects.

```json
{
  "pagination": {
    "total_items": 2847,
    "total_pages": 285,
    "current_page": 1,
    "page_size": 10
  },
  "data": [
    {
      "id": "std_1",
      "name": "John Doe",
      "email": "john.doe@umat.edu.gh",
      "course": "Computer Science",
      "year": "3rd Year",
      "progress": 85,
      "last_active": "2025-08-24T08:30:00Z",
      "status": "Active",
      "gpa": 3.7
    }
  ]
}
```

#### 2.2.3. Student Actions

*   **Purpose:** To allow admins to perform actions on individual students.
*   **Required API Endpoints:**
    *   **Edit:** `PUT /api/v1/admin/students/{id}` (with a JSON body of fields to update)
    *   **Delete:** `DELETE /api/v1/admin/students/{id}`

### 2.3. Page: Courses (`app/admin/courses/page.tsx`)

This page is for managing the educational courses offered on the platform.

#### 2.3.1. Course Statistics Cards

*   **Purpose:** To provide a high-level overview of course-related metrics.
*   **Required API Endpoint:** `GET /api/v1/admin/courses/stats`
*   **Expected Data Format:** A JSON array of 4 objects.

```json
[
  {
    "title": "Total Courses",
    "value": "24"
  },
  {
    "title": "Active Courses",
    "value": "18"
  },
  {
    "title": "Total Enrollment",
    "value": "275"
  },
  {
    "title": "Avg Completion",
    "value": "87%"
  }
]
```

#### 2.3.2. Courses Data Table

*   **Purpose:** To display a comprehensive, sortable, and searchable list of all courses.
*   **Required API Endpoint:** `GET /api/v1/admin/courses`
*   **Supported Query Parameters:** `?search={term}`, `?page={num}&limit={num}`, `?sortBy={field}&order={asc|desc}`
*   **Expected Data Format:** A JSON object containing pagination details and an array of course objects.

```json
{
  "pagination": {
    "total_items": 24,
    "total_pages": 3,
    "current_page": 1,
    "page_size": 10
  },
  "data": [
    {
      "id": "crs_1",
      "name": "Advanced Mathematics",
      "code": "MATH301",
      "instructor": "Dr. Sarah Johnson",
      "department": "Mathematics",
      "students_enrolled": 45,
      "max_capacity": 50,
      "completion_rate": 87,
      "duration": "16 weeks",
      "status": "Active",
      "start_date": "2024-01-15",
      "difficulty": "Advanced"
    }
  ]
}
```

#### 2.3.3. Course Actions

*   **Purpose:** To allow admins to perform actions on individual courses.
*   **Required API Endpoints:**
    *   **Add:** `POST /api/v1/admin/courses` (with a JSON body for the new course)
    *   **Edit:** `PUT /api/v1/admin/courses/{id}` (with a JSON body of fields to update)
    *   **Delete:** `DELETE /api/v1/admin/courses/{id}`

### 2.4. Page: Bot Intelligence (`app/admin/bot-intelligence/page.tsx`)

This page is for monitoring and managing the performance of the adaptive learning bot.

#### 2.4.1. Bot Performance Statistics

*   **Purpose:** To provide a quick overview of the bot's key performance indicators.
*   **Required API Endpoint:** `GET /api/v1/admin/bot/stats`
*   **Expected Data Format:** A JSON array of 4 objects.

```json
[
  {
    "title": "Total Interactions",
    "value": "15,432",
    "change": "+23.1%"
  },
  {
    "title": "Avg Response Time",
    "value": "1.2s",
    "change": "-15.3%"
  },
  {
    "title": "Accuracy Rate",
    "value": "94.2%",
    "change": "+2.8%"
  },
  {
    "title": "User Satisfaction",
    "value": "4.7/5",
    "change": "+0.3"
  }
]
```

#### 2.4.2. Bot Interactions Data Table

*   **Purpose:** To display a detailed log of recent bot-student interactions.
*   **Required API Endpoint:** `GET /api/v1/admin/bot/interactions`
*   **Supported Query Parameters:** `?search={term}`, `?page={num}&limit={num}`, `?sortBy={field}&order={asc|desc}`
*   **Expected Data Format:** A JSON object with pagination and an array of interaction objects.

```json
{
  "pagination": {
    "total_items": 15432,
    "total_pages": 1544,
    "current_page": 1,
    "page_size": 10
  },
  "data": [
    {
      "id": "int_1",
      "query": "How do I solve quadratic equations?",
      "student": "John Doe",
      "subject": "Mathematics",
      "response_time_seconds": 1.2,
      "accuracy_percent": 95,
      "satisfaction_rating": 4.8,
      "timestamp": "2025-08-24T14:30:00Z",
      "status": "Resolved"
    }
  ]
}
```

#### 2.4.3. Bot Actions

*   **Purpose:** To allow admins to trigger bot-related actions.
*   **Required API Endpoints:**
    *   **Train Model:** `POST /api/v1/admin/bot/train` (This would likely trigger a background job)

### 2.5. Page: Settings (`app/admin/settings/page.tsx`)

This page allows administrators to configure the entire platform.

#### 2.5.1. Fetch and Update Settings

*   **Purpose:** To load the current platform settings into the form and to save any changes.
*   **Required API Endpoints:**
    *   `GET /api/v1/admin/settings`: Fetches the current settings object.
    *   `PUT /api/v1/admin/settings`: Updates the settings. The request body should contain the full settings object.
*   **Expected Data Format (for both GET and PUT):** A single JSON object containing all settings.

```json
{
    "general": { "site_name": "...", "maintenance_mode": false, ... },
    "bot": { "response_time": "fast", "accuracy_threshold": 85, ... },
    "notifications": { "email_enabled": true, "alert_threshold": 90, ... },
    "security": { "session_timeout_minutes": 30, "password_min_length": 8, ... }
}
```

#### 2.5.2. System Status

*   **Purpose:** To provide a real-time check on the health of various system components.
*   **Required API Endpoint:** `GET /api/v1/admin/system-status`
*   **Expected Data Format:** A JSON object detailing the status of each service.

```json
{
    "database": { "status": "healthy", "message": "..." },
    "ai_service": { "status": "online", "message": "..." },
    "storage": { "status": "warning", "percent_full": 85, "message": "..." }
}
```

---

## 3. Public & Authentication API Routes

This section details endpoints that are publicly accessible or are used for the authentication process.

### 3.1. Page: Public Landing Page (`app/page.tsx`)

This is the main public-facing page used for marketing and high-level, non-sensitive analytics.

#### 3.1.1. Public Platform Statistics

*   **Purpose:** To display key performance indicators to the public.
*   **Required API Endpoint:** `GET /api/v1/public/stats`
*   **Expected Data Format:** A single JSON object.

```json
{
  "total_students": 2847,
  "active_courses": 23,
  "completion_rate_percent": 87.3,
  "avg_session_minutes": 42,
  "total_interactions": 15420,
  "success_rate_percent": 94.2
}
```

#### 3.1.2. Public Recent Activity

*   **Purpose:** To show a feed of recent, anonymized course activity.
*   **Required API Endpoint:** `GET /api/v1/public/recent-activity`
*   **Expected Data Format:** A JSON array of activity objects.

```json
[
    {
        "course_name": "Mining Engineering Fundamentals",
        "active_students": 156,
        "trend_percent": "+12%"
    },
    {
        "course_name": "Geological Survey Methods",
        "active_students": 89,
        "trend_percent": "+8%"
    }
]
```

#### 3.1.3. Chart Data (Public)

*   **Purpose:** The two charts on the public page (`KnowledgeGrowthTrends` and `BotIntelligenceMetrics`) can reuse the same data as their admin counterparts, but served from a public, non-authenticated endpoint.
*   **Required API Endpoints:**
    *   `GET /api/v1/public/bot/knowledge-growth`
    *   `GET /api/v1/public/bot/performance-metrics`
*   **Expected Data Format:** Same as the admin equivalents (see sections 2.4.2 and 2.4.3).

### 3.2. Page: Admin Login (`app/admin/login/page.tsx`)

This page handles administrator authentication.

#### 3.2.1. Login Endpoint

*   **Purpose:** To authenticate an administrator and return a session token.
*   **Required API Endpoint:** `POST /api/v1/auth/login`
*   **Request Body:**

```json
{
    "username": "admin",
    "password": "Admin123"
}
```

*   **Success Response (200 OK):**

```json
{
    "access_token": "ey...",
    "token_type": "bearer"
}
```

*   **Error Response (401 Unauthorized):**

```json
{
    "detail": "Invalid username or password"
}
```

### 3.3. General Authenticated User Info

*   **Purpose:** To fetch information about the currently logged-in user. This is used in the sidebar of the admin pages.
*   **Required API Endpoint:** `GET /api/v1/auth/me`
*   **Expected Data Format:** A single JSON object.

```json
{
  "full_name": "Admin User",
  "email": "admin@umat.edu.gh",
  "avatar_initial": "A"
}
```