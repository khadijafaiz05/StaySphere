# StaySphere
### A Smart Hostel Management System
StaySphere, A Smart Hostel Management System is a web-based application that is developed to simplify and digitize female hostel management activities. The system ensures proper record maintenance, transparency, and smooth hostel administration through a centralized database by providing an organized platform.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Team Members & Contributions](#team-members--contributions)

---

## About the Project

StaySphere streamlines hostel operations by replacing manual, paper-based processes with a unified digital system. The platform supports three roles : **Admin** and **Student**  each with tailored views and permissions.

Key goals:
- Centralize student records, room allocations, and fee tracking
- Enable transparent complaint management and resolution
- Automate attendance logging and leave request workflows
- Provide a smooth, role-based experience for all hostel stakeholders

---

## Features

### Authentication
- Secure login with role-based access control (Admin / Student)
- Each role redirects to a dedicated dashboard upon login

### Student Management *(Admin)*
- View, search, add, edit, and remove student records
- Track personal information: name, phone, gender, address
- View room allocation and fee status per student

### Student Profile *(Student)*
- View and edit personal contact details
- View assigned room details and allocation date
- Track fee payment status and outstanding balance

### Room Management *(Admin)*
- Manage room types (Single, Double) with capacity details
- View current room status (Available / Occupied)
- Assign and update room allocations

### Fee & Payment Tracking
- Record fee amounts and due dates per student
- Log partial and full payments
- View outstanding balances and payment history

### Complaint Management
- Students can submit complaints with descriptions
- Admin can update complaint status (Pending → Resolved)
- Filter complaints by status

### Attendance Tracking *(Admin & Student)*
- Log entry and exit times for each student
- Admin can view all students' attendance records
- Students can view their own attendance history with duration calculations

### Leave Requests
- Students can submit leave requests with from/to dates
- Admin can view and update leave request statuses

### Visitor Records
- Log visitor name, entry time, and exit time per student
- Admin can view all visitor records

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MySQL |
| API Style | RESTful |
| Version Control | Git / GitHub |

---

## Database Schema

The database `StaySphere` consists of the following tables:

| Table | Description |
|---|---|
| `Roles` | User role definitions (Admin, Student, Warden) |
| `Users` | Login credentials linked to roles |
| `Students` | Student personal details linked to users |
| `RoomTypes` | Room categories with capacity |
| `Rooms` | Individual room records with status |
| `RoomAllocation` | Student-to-room assignment records |
| `Fees` | Fee amounts and due dates per student |
| `Payments` | Payment transactions against fees |
| `ComplaintStatus` | Status lookup (Pending, Resolved) |
| `Complaints` | Student complaints with status tracking |
| `Visitors` | Visitor entry and exit logs |
| `AttendanceLogs` | Student hostel entry/exit records |
| `LeaveRequests` | Student leave applications |

The full schema with sample data is available in [`database/StaySphere.sql`](database/StaySphere.sql).

---

## Project Structure

```
StaySphere/
├── backend/
│   ├── controllers/        # Route handler logic
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── attendanceController.js
│   │   └── taskController.js
│   ├── models/             # Database query functions
│   ├── routes/             # Express route definitions
│   ├── config/             # Database connection setup
│   └── server.js           # Entry point
├── frontend/
│   ├── src/
│   │   ├── pages/          # Page-level React components
│   │   ├── components/     # Reusable UI components
│   │   └── App.jsx         # Root component with routing
│   └── public/
├── database/
│   └── StaySphere.sql      # Full schema + seed data
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or above)
- MySQL (v8 or above)
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/khadijafaiz05/StaySphere.git
cd StaySphere
```

### 2. Set Up the Database

Open your MySQL client and run:

```bash
mysql -u root -p < database/StaySphere.sql
```
This will create the `StaySphere` database, all tables, and insert sample data.

### 3. Configure the Backend

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=StaySphere
PORT=5000
```

Start the backend server:

```bash
node server.js
```

The API will be available at `http://localhost:5000`.

### 4. Run the Frontend

```bash
cd ../frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

### Demo Credentials

| Username | Password | Role |
|---|---|---|
| `admin1` | `pass` | Admin |
| `student1` | `pass` | Student |
| `student2` | `pass` | Student |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login with username and password |

### Students
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get all students |
| `GET` | `/api/students/:id` | Get a student by ID |
| `POST` | `/api/students` | Add a new student |
| `PUT` | `/api/students/:id` | Update student details |
| `DELETE` | `/api/students/:id` | Remove a student |

### Attendance
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/attendance` | Get all attendance logs |
| `GET` | `/api/attendance/:student_id` | Get logs for a specific student |
| `POST` | `/api/attendance` | Log a new entry/exit record |

### Rooms & Allocation
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/rooms` | Get all rooms with type info |
| `GET` | `/api/allocation/:student_id` | Get room allocated to a student |

### Complaints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/complaints` | Get all complaints |
| `PUT` | `/api/complaints/:id` | Update complaint status |

### Leave Requests
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/leave` | Get all leave requests |
| `POST` | `/api/leave` | Submit a new leave request |
| `PUT` | `/api/leave/:id` | Update leave request status |

---

## Team Members & Contributions

| Name | Role / Features |
|---|---|
| **Romaisa Sajjad** | Project Lead, Complaints, Leave Requests,  Visitor Logs |
| *Khadija Faiz* | User Authentication ,Login System , Attendance Tracking (Admin & Student) ,Student Management|
| *Aima Shakeel* | Room Management, Room Allocation ,Fee & Payment Management |


---
## License

This project was developed as an academic project. All rights reserved by the contributors.
