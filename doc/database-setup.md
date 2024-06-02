# Database Layouts

## User Layout
```sql
CREATE TABLE users (
    uid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone_number TEXT,
    timezone TEXT,
    subscription BOOLEAN DEFAULT FALSE,
    birthday DATE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Tasks Layout
```sql
CREATE TABLE tasks (
    tid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    uid UUID NOT NULL,
    title TEXT NOT NULL,
    occurrence VARCHAR(50) NOT NULL,
	   number_occurrence INT DEFAULT 1,
	   completed_count INT DEFAULT 0,
    category VARCHAR(50),
    completion_percentage INT CHECK (completion_percentage >= 0 AND completion_percentage <= 100) DEFAULT 0,
    status INT DEFAULT 0,
    notes TEXT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    priority VARCHAR(50) NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid)
);
```