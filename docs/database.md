# Database Architecture  

## Schema Design  

The database schema consists of two core tables managed by the application (`Habits` and `Habit_Completion`), and a built-in table provided by Supabase for authentication (`auth.users`). The schema is designed to support habit tracking for individual users with a clear, normalized structure and well-defined relationships between tables.

## Tables and Fields  

**1. `auth.users` Table (Provided by Supabase)**  
- **Purpose**: Supabase provides this table to handle user authentication and manage user identity securely.  
- **Key Fields**:  
  - `id` (UUID, Primary Key): A globally unique identifier for each user.  
  - `email` (Text, Unique): The email address of the user for authentication (used for magic link login).  
  - `created_at` (Timestamp): The date and time when the user was first created in the system.  
- **Notes**:  
  - This table is managed internally by Supabase. The application references the `id` field in this table for linking user-specific data.  

**2. `Habits` Table**  
- **Purpose**: Stores a static list of predefined habits that users will track. These habits are shared globally among all users, and no modifications (additions or deletions) can be made by users.  
- **Fields**:  
  - `id` (Serial, Primary Key): A unique identifier for each habit in the app.  
  - `name` (Text, Not Null): The name of the habit (e.g., "Meditate," "Jog").  
  - `created_at` (Timestamp, Default: NOW()): The timestamp for when the habit was created.  
- **Notes**:  
  - This table is purely static and cannot be modified by individual users.  

**3. `Habit_Completion` Table**  
- **Purpose**: Tracks completion statuses for user-specific habits on a daily basis. Each record represents the fact that a specific habit was completed by a specific user on a specific date.  
- **Fields**:  
  - `id` (UUID, Primary Key): A globally unique identifier for each completion record.  
  - `user_id` (UUID, Foreign Key): References the `id` field in the Supabase `auth.users` table, linking the habit completion to a specific user.  
  - `habit_id` (Integer, Foreign Key): References the `id` field in the `Habits` table, linking the record to a specific habit.  
  - `completion_date` (Date, Not Null): The date on which the habit was completed (e.g., "2025-01-16").  
- **Notes**:  
  - A single record is created per habit, per user, per day. Since a habit can only be completed once per day, no additional fields such as a `count` are needed.

## Relationships and Entity Diagram  

The relationships between the tables ensure data is normalized for efficient storage and retrieval.  

1. **auth.users → Habit_Completion**:  
   - Each user (via `auth.users.id`) can have multiple habit completions in the `Habit_Completion` table.  
   - The `user_id` in the `Habit_Completion` table serves as a foreign key pointing to the `id` field in the `auth.users` table.  

2. **Habits → Habit_Completion**:  
   - Each habit (via `Habits.id`) can be linked to multiple completion records in the `Habit_Completion` table.  
   - The `habit_id` in the `Habit_Completion` table serves as a foreign key pointing to the `id` field in the `Habits` table.  

**Entity Relationship Diagram (ERD):**

```
auth.users (id)
    |
    |--< (1-to-Many)
    |
Habit_Completion (id, user_id (FK to auth.users), habit_id (FK to Habits), completion_date)
    |
    |--< (Many-to-1)
    |
Habits (id, name, created_at)
```

---

## Detailed Table Descriptions  

**1. Habits Table**  
| Field Name   | Data Type   | Constraints         | Description                                  |  
|--------------|-------------|---------------------|----------------------------------------------|  
| id           | Serial      | Primary Key, Unique | A unique identifier for each habit.         |  
| name         | Text        | Not Null            | The name of the habit (e.g., "Meditate").   |  
| created_at   | Timestamp   | Default: NOW()      | When the habit was added to the database.   |  

---

**2. Habit_Completion Table**  
| Field Name      | Data Type   | Constraints                | Description                                            |  
|------------------|-------------|----------------------------|--------------------------------------------------------|  
| id              | UUID        | Primary Key, Unique        | Unique identifier for each habit completion record.    |  
| user_id         | UUID        | Foreign Key (auth.users.id)| Links the record to the corresponding user.            |  
| habit_id        | Integer     | Foreign Key (Habits.id)    | Links the record to the corresponding habit.           |  
| completion_date | Date        | Not Null                  | The date the habit was completed (e.g., "2025-01-16"). |  

---

## Key Notes About Design  

- **Normalization**:  
  - `Habits` Table ensures a single source of truth for predefined habit names, preventing duplication.  
  - `Habit_Completion` Table avoids redundant storage by recording only completed habits for users, linked via foreign keys.  

- **Date-Specific Habit Tracking**:  
  - A single record in `Habit_Completion` represents the user's effort for a specific habit on a specific date.  

- **Static Habits**:  
  - Since the habit list is predefined and static, no user can create, delete, or modify habits, ensuring uniformity across the application.  

