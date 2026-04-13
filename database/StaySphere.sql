DROP DATABASE IF EXISTS StaySphere;
CREATE DATABASE StaySphere;
USE StaySphere;

CREATE TABLE Roles
(
role_id INT PRIMARY KEY,
role_name VARCHAR(50)
);

CREATE TABLE Users
(
user_id INT PRIMARY KEY,
username VARCHAR(50),
password VARCHAR(50),
role_id INT,
FOREIGN KEY(role_id) REFERENCES Roles(role_id)
);

CREATE TABLE Students
(
student_id INT PRIMARY KEY,
user_id INT,
name VARCHAR(100),
phone VARCHAR(15),
gender VARCHAR(10) CHECK (gender = 'Female'),
address VARCHAR(200),
FOREIGN KEY(user_id) REFERENCES Users(user_id)
);

CREATE TABLE RoomTypes
(
type_id INT PRIMARY KEY,
type_name VARCHAR(50),
capacity INT
);

CREATE TABLE Rooms
(
room_id INT PRIMARY KEY,
room_number VARCHAR(10),
type_id INT,
status VARCHAR(20),
FOREIGN KEY(type_id) REFERENCES RoomTypes(type_id)
);

CREATE TABLE RoomAllocation
(
allocation_id INT PRIMARY KEY,
student_id INT,
room_id INT,
allocation_date DATE,
FOREIGN KEY(student_id) REFERENCES Students(student_id),
FOREIGN KEY(room_id) REFERENCES Rooms(room_id)
);

CREATE TABLE Fees
(
fee_id INT PRIMARY KEY,
student_id INT,
amount DECIMAL(10,2),
due_date DATE,
status VARCHAR(20),
FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE Payments
(
payment_id INT PRIMARY KEY,
fee_id INT,
amount_paid DECIMAL(10,2),
payment_date DATE,
FOREIGN KEY(fee_id) REFERENCES Fees(fee_id)
);

CREATE TABLE ComplaintStatus
(
status_id INT PRIMARY KEY,
status_name VARCHAR(50)
);

CREATE TABLE Complaints
(
complaint_id INT PRIMARY KEY,
student_id INT,
description VARCHAR(200),
status_id INT,
date_submitted DATE,
FOREIGN KEY(student_id) REFERENCES Students(student_id),
FOREIGN KEY(status_id) REFERENCES ComplaintStatus(status_id)
);

CREATE TABLE Visitors
(
visitor_id INT PRIMARY KEY,
student_id INT,
visitor_name VARCHAR(100),
entry_time DATETIME,
exit_time DATETIME,
FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE AttendanceLogs
(
log_id INT PRIMARY KEY,
student_id INT,
entry_time DATETIME,
exit_time DATETIME,
FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE LeaveRequests
(
leave_id INT PRIMARY KEY,
student_id INT,
from_date DATE,
to_date DATE,
status VARCHAR(20),
FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE ExtraCharges
(
charge_id INT PRIMARY KEY,
student_id INT,
description VARCHAR(100),
amount DECIMAL(10,2),
charge_date DATE,
status VARCHAR(20),
FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

INSERT INTO Roles VALUES
(1,'Admin'),
(2,'Student'),
(3,'Warden');

INSERT INTO Users VALUES
(1,'admin1','pass',1),
(2,'student1','pass',2),
(3,'student2','pass',2);

INSERT INTO Students VALUES
(1,2,'Aliya Khan','03001234567','Female','Lahore'),
(2,3,'Sara Ahmed','03007654321','Female','Karachi');

INSERT INTO RoomTypes VALUES
(1,'Single',1),
(2,'Double',2);

INSERT INTO Rooms VALUES
(1,'A101',1,'Available'),
(2,'B201',2,'Occupied');

INSERT INTO RoomAllocation VALUES
(1,1,2,'2026-03-01');

INSERT INTO Fees VALUES
(1,1,20000,'2026-04-01','Pending');

INSERT INTO Payments VALUES
(1,1,10000,'2026-03-05');

INSERT INTO ComplaintStatus VALUES
(1,'Pending'),
(2,'Resolved');

INSERT INTO Complaints VALUES
(1,1,'Water leakage',1,'2026-03-02');

INSERT INTO Visitors VALUES
(1,1,'Ahmed Khan','2026-03-03 10:00:00','2026-03-03 12:00:00');

INSERT INTO AttendanceLogs VALUES
(1,1,'2026-03-03 08:00:00','2026-03-03 18:00:00');

INSERT INTO LeaveRequests VALUES
(1,1,'2026-03-10','2026-03-12','Pending');

INSERT INTO ExtraCharges VALUES
(1,1,'Late Fee',500,'2026-03-10','Pending'),
(2,1,'Room Damage',1500,'2026-03-12','Pending');

-- Feature 1: User login with role
SELECT u.username, r.role_name
FROM Users u
JOIN Roles r ON u.role_id = r.role_id;

-- Feature 2: View all students
SELECT student_id, name, phone, address
FROM Students;


SELECT *
FROM Students
WHERE name LIKE '%Ali%';

-- Feature 3: View rooms with their type
SELECT r.room_number, rt.type_name, r.status
FROM Rooms r
JOIN RoomTypes rt ON r.type_id = rt.type_id;

-- Feature 4: Room allocation (student and their assigned room)
SELECT s.name, r.room_number, ra.allocation_date
FROM RoomAllocation ra
JOIN Students s ON ra.student_id = s.student_id
JOIN Rooms r ON ra.room_id = r.room_id;

-- Feature 5: Student fee details
SELECT s.name, f.amount, f.due_date, f.status
FROM Fees f
JOIN Students s ON f.student_id = s.student_id;

-- Aggregate: total payments received
SELECT SUM(amount_paid) AS TotalPayments
FROM Payments;

-- Feature 6: Complaint management
SELECT s.name, c.description, cs.status_name
FROM Complaints c
JOIN Students s ON c.student_id = s.student_id
JOIN ComplaintStatus cs ON c.status_id = cs.status_id;

-- Filter: pending complaints
SELECT *
FROM Complaints
WHERE status_id = 1;

-- Feature 7: Visitor records
SELECT s.name, v.visitor_name, v.entry_time
FROM Visitors v
JOIN Students s ON v.student_id = s.student_id;

-- Feature 8: Attendance tracking
SELECT s.name, a.entry_time, a.exit_time
FROM AttendanceLogs a
JOIN Students s ON a.student_id = s.student_id;

-- Feature 9: Leave requests
SELECT s.name, l.from_date, l.to_date, l.status
FROM LeaveRequests l
JOIN Students s ON l.student_id = s.student_id;

-- Aggregate: total number of students
SELECT COUNT(*) AS TotalStudents
FROM Students;

--Finding any extra charges per student
SELECT s.name, SUM(ec.amount) AS TotalExtraCharges
FROM ExtraCharges ec
JOIN Students s ON ec.student_id = s.student_id
GROUP BY s.name;

SELECT * FROM Roles;
SELECT * FROM Users;
SELECT * FROM Students;
SELECT * FROM RoomTypes;
SELECT * FROM Rooms;
SELECT * FROM RoomAllocation;
SELECT * FROM Fees;
SELECT * FROM Payments;
SELECT * FROM ComplaintStatus;
SELECT * FROM Complaints;
SELECT * FROM Visitors;
SELECT * FROM AttendanceLogs;
SELECT * FROM LeaveRequests;


UPDATE Complaints
SET status_id = 2
WHERE complaint_id = 1;



DELETE FROM Visitors
WHERE visitor_id = 1;