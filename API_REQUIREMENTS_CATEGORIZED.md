## UMaT Admin Dashboard: Backend API Requirements Categorization

This document categorizes the required API endpoints for the UMaT Admin Dashboard into three groups based on their feasibility with the current `Johnson_Bot` backend:

1.  **Easily Obtainable:** Data that can be directly retrieved or calculated from the existing database schema (`src/models/models.py`) with minimal aggregation.
2.  **Obtainable with Configuration/Minor Changes:** Data that requires some aggregation, joins across tables, or minor additions to the existing models or services.
3.  **Potentially Impossible/Requires Significant New Features:** Data that relies on concepts not currently present in the database or would require substantial new logic (e.g., external integrations, complex real-time analytics not currently tracked).

---

### **Category 1: Easily Obtainable**

These endpoints can be implemented with straightforward queries and aggregations on the existing `src/models/models.py` schema.

#### 2.1.1. Key Statistics Cards (`GET /api/v1/admin/dashboard/stats`)

*   **"Total Students"**: Directly from `User` model count.
*   **"Bot Interactions"**: Directly from `InteractionLog` model count.

#### 2.1.2. Recent Activity Feed (`GET /api/v1/admin/dashboard/recent-activity`)

*   **`id`**: From `QuizSession` or `InteractionLog`.
*   **`user.name`**: From `User` model (can use `telegram_id` or a placeholder if a `name` field isn't added to `User`).
*   **`action`**: Can be inferred from `QuizSession` (started/completed quiz) or `InteractionLog` (answered question).
*   **`timestamp`**: From `QuizSession.started_at` or `completed_at`, or `InteractionLog.timestamp`.

#### 2.2.1. Student Statistics Cards (`GET /api/v1/admin/students/stats`)

*   **"Total Students"**: Directly from `User` model count.
*   **"Active Students"**: Requires defining "active" (e.g., users with interactions in the last X days). This is a simple filter.

#### 2.2.2. Students Data Table (`GET /api/v1/admin/students`)

*   **`id`**: From `User.id`.
*   **`name`**: From `User` (if a `name` field is added, otherwise use `telegram_id` or a generated name).
*   **`email`**: Not currently in `User` model, would need to be added.
*   **`course`**: Can be derived from `QuizSession` or `UserAnswer` history.
*   **`year`**: Not currently in `User` model, would need to be added.
*   **`last_active`**: From the latest `QuizSession.completed_at` or `InteractionLog.timestamp` for a user.
*   **`status`**: Can be inferred from `last_active` (e.g., "Active" if `last_active` is recent).
*   **`gpa`**: Not currently in `User` model, would need to be added.
*   **Pagination, search, sort**: Standard SQLAlchemy query features.

#### 2.3.1. Course Statistics Cards (`GET /api/v1/admin/courses/stats`)

*   **"Total Courses"**: Directly from `Course` model count.
*   **"Active Courses"**: Requires defining "active" (e.g., courses with quizzes started in the last X days). This is a simple filter.
*   **"Total Enrollment"**: Can be approximated by counting unique `user_id` in `QuizSession` for each course.

#### 2.3.2. Courses Data Table (`GET /api/v1/admin/courses`)

*   **`id`**: From `Course.id`.
*   **`name`**: From `Course.name`.
*   **`code`**: Not currently in `Course` model, would need to be added.
*   **`instructor`**: Not currently in `Course` model, would need to be added.
*   **`department`**: Can be derived from `Course` -> `Level` -> `Program` -> `Faculty` relationships.
*   **`students_enrolled`**: Count of unique `user_id` in `QuizSession` for the course.
*   **`max_capacity`**: Not currently in `Course` model, would need to be added.
*   **`duration`**: Not currently in `Course` model, would need to be added.
*   **`status`**: Can be inferred (e.g., "Active" if questions exist).
*   **`start_date`**: Not currently in `Course` model, would need to be added.
*   **`difficulty`**: Can be derived from `Question.difficulty_score` averages for the course.
*   **Pagination, search, sort**: Standard SQLAlchemy query features.

#### 2.3.3. Course Actions (`POST/PUT/DELETE /api/v1/admin/courses/{id}`)

*   CRUD operations on the `Course` model are straightforward.

#### 2.4.2. Bot Interactions Data Table (`GET /api/v1/admin/bot/interactions`)

*   **`id`**: From `InteractionLog.id`.
*   **`query`**: Not directly stored as a "query" string, but `InteractionLog` has `question_id` which can link to `Question.question_text`.
*   **`student`**: From `User` model via `InteractionLog.user_id`.
*   **`subject`**: From `Course` model via `InteractionLog.question_id` -> `Question.course_id`.
*   **`response_time_seconds`**: From `InteractionLog.time_taken`.
*   **`timestamp`**: From `InteractionLog.timestamp`.
*   **`status`**: Can be inferred (e.g., "Resolved" if `is_correct` is true/false).
*   **Pagination, search, sort**: Standard SQLAlchemy query features.

#### 3.1.1. Public Platform Statistics (`GET /api/v1/public/stats`)

*   **`total_students`**: From `User` model count.
*   **`active_courses`**: Requires defining "active" (same as admin).
*   **`total_interactions`**: From `InteractionLog` model count.

#### 3.2.1. Login Endpoint (`POST /api/v1/auth/login`)

*   Standard authentication flow using a `User` model (or a separate `AdminUser` model). Requires adding password hashing and token generation.

#### 3.3. General Authenticated User Info (`GET /api/v1/auth/me`)

*   **`full_name`**: Needs to be added to `User` model.
*   **`email`**: Needs to be added to `User` model.
*   **`avatar_initial`**: Can be derived from `full_name`.

---

### **Category 2: Obtainable with Configuration/Minor Changes**

These endpoints require some additional logic, new fields in existing models, or more complex aggregations.

#### 2.1.1. Key Statistics Cards (`GET /api/v1/admin/dashboard/stats`)

*   **"Course Completion"**: Requires calculating average `QuizSession.final_score` across all completed quizzes.
*   **"Learning Hours"**: Requires summing `QuizSessionQuestion.time_taken` for all answered questions, then converting to hours.
*   **`change` and `trend` fields**: These require historical data and comparison logic (e.g., current month vs. previous month). This means adding date filtering to queries.
*   **`description` fields**: Static strings or simple dynamic text.

#### 2.2.1. Student Statistics Cards (`GET /api/v1/admin/students/stats`)

*   **"Average GPA"**: Requires adding a `gpa` field to the `User` model and updating it, or calculating it from some other performance metric (not currently available).
*   **"Completion Rate"**: Requires calculating average `QuizSession.final_score` for all quizzes.
*   **`email` and `year` fields**: Need to be added to the `User` model.

#### 2.3.1. Course Statistics Cards (`GET /api/v1/admin/courses/stats`)

*   **"Avg Completion"**: Requires calculating average `QuizSession.final_score` for quizzes related to each course.
*   **`code`, `instructor`, `max_capacity`, `duration`, `start_date` fields**: Need to be added to the `Course` model.

#### 2.4.1. Bot Performance Statistics (`GET /api/v1/admin/bot/stats`)

*   **"Avg Response Time"**: Requires averaging `InteractionLog.time_taken`.
*   **"Accuracy Rate"**: Requires calculating `(correct_interactions / total_interactions) * 100` from `InteractionLog`.
*   **"User Satisfaction"**: Not currently tracked. Would require a new field in `InteractionLog` or a separate `Feedback` model.
*   **`change` fields**: Requires historical data and comparison logic (e.g., current period vs. previous).

#### 2.4.3. Bot Actions (`POST /api/v1/admin/bot/train`)

*   **"Train Model"**: This implies a machine learning model. While the adaptive learning logic exists, a formal "training" endpoint would require defining what "training" entails (e.g., re-evaluating question difficulties, updating user profiles based on new data) and implementing that logic.

#### 2.5.1. Fetch and Update Settings (`GET/PUT /api/v1/admin/settings`)

*   Requires a new `Settings` model or a configuration file that can be read/written by the API.

#### 2.5.2. System Status (`GET /api/v1/admin/system-status`)

*   **`database` status**: Can be checked by a simple database query.
*   **`ai_service` status**: Requires a health check endpoint for the adaptive learning service.
*   **`storage` status**: Requires integration with S3 to check bucket usage.

#### 3.1.1. Public Platform Statistics (`GET /api/v1/public/stats`)

*   **`completion_rate_percent`**: Same as admin dashboard.
*   **`avg_session_minutes`**: Requires calculating average `(completed_at - started_at)` for `QuizSession`.
*   **`success_rate_percent`**: Same as bot accuracy rate.

#### 3.1.2. Public Recent Activity (`GET /api/v1/public/recent-activity`)

*   **`active_students` and `trend_percent`**: Requires more complex aggregation and historical data for each course.

#### 3.1.3. Chart Data (Public) (`GET /api/v1/public/bot/knowledge-growth`, `GET /api/v1/public/bot/performance-metrics`)

*   These would reuse the logic from the admin counterparts, but served publicly.

---

### **Category 3: Potentially Impossible / Requires Significant New Features**

These requirements are either not directly supported by the current data model or imply complex features that are outside the immediate scope of a backend API without significant prior development.

#### 2.1.1. Key Statistics Cards (`GET /api/v1/admin/dashboard/stats`)

*   **`trend` (up/down)**: While "change" can be calculated, determining a definitive "trend" (e.g., statistically significant upward or downward movement) often involves more sophisticated time-series analysis than simple period-over-period comparison. This might be simplified to just "up" or "down" based on `change`.

#### 2.2.2. Students Data Table (`GET /api/v1/admin/students`)

*   **`email` and `year`**: While these can be added to the `User` model, the current bot interaction doesn't collect this information. It would require changes to the bot's user registration/profile flow.
*   **`gpa`**: This is a very specific academic metric. Unless the platform integrates with a student information system or has a mechanism for students to input/calculate their GPA, this is impossible to obtain.

#### 2.3.2. Courses Data Table (`GET /api/v1/admin/courses`)

*   **`instructor`**: No concept of instructors in the current model. Would require a new `Instructor` model and relationships.
*   **`max_capacity`**: No concept of course capacity.
*   **`duration`**: No concept of course duration.
*   **`start_date`**: No concept of course start dates.

#### 2.4.1. Bot Performance Statistics (`GET /api/v1/admin/bot/stats`)

*   **"User Satisfaction"**: This is a subjective metric that would require a dedicated feedback mechanism (e.g., users rating bot responses) to collect. It's not currently tracked.

#### 2.4.2. Bot Interactions Data Table (`GET /api/v1/admin/bot/interactions`)

*   **`accuracy_percent` and `satisfaction_rating`**: These are derived metrics. `accuracy_percent` can be calculated from `is_correct` in `InteractionLog`, but `satisfaction_rating` is not collected.
*   **`status` (e.g., "Resolved")**: While `is_correct` can imply a resolution, a more nuanced "status" might require manual admin intervention or more complex bot logic to determine if an interaction is truly "resolved."

#### 2.5.1. Fetch and Update Settings (`GET/PUT /api/v1/admin/settings`)

*   **Complex nested settings structure**: While a `Settings` model can be created, managing a deeply nested JSON structure directly in a single database field can become cumbersome. It might be better to flatten some settings or use a more sophisticated key-value store if the settings become very complex.
