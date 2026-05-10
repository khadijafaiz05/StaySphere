USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'StaySphere')
    DROP DATABASE StaySphere;
GO

CREATE DATABASE StaySphere;
GO

USE StaySphere;
GO

CREATE TABLE Roles (
  role_id INT PRIMARY KEY IDENTITY(1,1),
  role_name VARCHAR(50)
);

CREATE TABLE Cities (
  city_id INT PRIMARY KEY IDENTITY(1,1),
  city_name VARCHAR(50),
  province VARCHAR(50)
);

CREATE TABLE ComplaintStatus (
  status_id INT PRIMARY KEY IDENTITY(1,1),
  status_name VARCHAR(50)
);

CREATE TABLE RoomTypes (
  type_id INT PRIMARY KEY IDENTITY(1,1),
  type_name VARCHAR(50),
  capacity INT
);

CREATE TABLE Users (
  user_id INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(50),
  password VARCHAR(50),
  role_id INT,
  FOREIGN KEY(role_id) REFERENCES Roles(role_id)
);

CREATE TABLE Students (
  student_id INT PRIMARY KEY IDENTITY(1,1),
  user_id INT,
  name VARCHAR(100),
  phone VARCHAR(15),
  street VARCHAR(150),
  city_id INT,
  FOREIGN KEY(user_id) REFERENCES Users(user_id),
  FOREIGN KEY(city_id) REFERENCES Cities(city_id)
);


CREATE TABLE Rooms (
  room_id INT PRIMARY KEY IDENTITY(1,1),
  room_number VARCHAR(10),
  type_id INT,
  status VARCHAR(20),
  FOREIGN KEY(type_id) REFERENCES RoomTypes(type_id)
);

CREATE TABLE RoomAllocation (
  allocation_id INT PRIMARY KEY IDENTITY(1,1),
  student_id INT,
  room_id INT,
  allocation_date DATE,
  vacate_date DATE NULL,
  FOREIGN KEY(student_id) REFERENCES Students(student_id),
  FOREIGN KEY(room_id) REFERENCES Rooms(room_id)
);

CREATE TABLE Fees (
  fee_id INT PRIMARY KEY IDENTITY(1,1),
  student_id INT,
  amount DECIMAL(10,2),
  due_date DATE,
  status VARCHAR(20),
  FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE Payments (
  payment_id INT PRIMARY KEY IDENTITY(1,1),
  fee_id INT,
  amount_paid DECIMAL(10,2),
  payment_date DATE,
  FOREIGN KEY(fee_id) REFERENCES Fees(fee_id)
);

CREATE TABLE ExtraCharges (
  charge_id INT PRIMARY KEY IDENTITY(1,1),
  student_id INT,
  description VARCHAR(100),
  amount DECIMAL(10,2),
  charge_date DATE,
  status VARCHAR(20),
  FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE Complaints (
  complaint_id INT PRIMARY KEY IDENTITY(1,1),
  student_id INT,
  category VARCHAR(50),
  description VARCHAR(200),
  status_id INT,
  date_submitted DATE,
  FOREIGN KEY(student_id) REFERENCES Students(student_id),
  FOREIGN KEY(status_id) REFERENCES ComplaintStatus(status_id)
);

CREATE TABLE Visitors (
  visitor_id INT PRIMARY KEY IDENTITY(1,1),
  student_id INT,
  visitor_name VARCHAR(100),
  entry_time DATETIME,
  exit_time DATETIME,
  FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE AttendanceLogs (
  log_id INT PRIMARY KEY IDENTITY(1,1),
  student_id INT,
  entry_time DATETIME,
  exit_time DATETIME,
  FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE LeaveRequests (
  leave_id INT PRIMARY KEY IDENTITY(1,1),
  student_id INT,
  from_date DATE,
  to_date DATE,
  status VARCHAR(20),
  FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

GO

INSERT INTO Roles (role_name) VALUES
('Admin'),
('Student'),
('Warden');

INSERT INTO Cities (city_name, province) VALUES
('Lahore', 'Punjab'),
('Karachi', 'Sindh'),
('Islamabad', 'Federal Capital Territory'),
('Peshawar', 'Khyber Pakhtunkhwa'),
('Quetta', 'Balochistan');

INSERT INTO Users (username, password, role_id) VALUES
('admin1', 'pass', 1),
('student1', 'pass', 2),
('student2', 'pass', 2);

INSERT INTO Students (user_id, name, phone, street, city_id) VALUES
(2, 'Aliya Khan', '03001234567', 'House 5 Street 3', 1),
(3, 'Sara Ahmed', '03007654321', 'Flat 2B Block 9', 2);

INSERT INTO RoomTypes (type_name, capacity) VALUES
('Single', 1),
('Double', 2);

INSERT INTO Rooms (room_number, type_id, status) VALUES
('A101', 1, 'Available'),
('B201', 2, 'Occupied');

INSERT INTO RoomAllocation (student_id, room_id, allocation_date, vacate_date) VALUES
(1, 2, '2026-03-01', NULL);

INSERT INTO Fees (student_id, amount, due_date, status) VALUES
(1, 20000, '2026-04-01', 'Pending');

INSERT INTO Payments (fee_id, amount_paid, payment_date) VALUES
(1, 10000, '2026-03-05');

INSERT INTO ComplaintStatus (status_name) VALUES
('Pending'),
('Resolved');

INSERT INTO Complaints (student_id, category, description, status_id, date_submitted) VALUES
(1, 'Plumbing', 'Water leakage', 1, '2026-03-02');

INSERT INTO Visitors (student_id, visitor_name, entry_time, exit_time) VALUES
(1, 'Ahmed Khan', '2026-03-03 10:00:00', '2026-03-03 12:00:00');

INSERT INTO AttendanceLogs (student_id, entry_time, exit_time) VALUES
(1, '2026-03-03 08:00:00', '2026-03-03 18:00:00');

INSERT INTO LeaveRequests (student_id, from_date, to_date, status) VALUES
(1, '2026-03-10', '2026-03-12', 'Pending');

INSERT INTO ExtraCharges (student_id, description, amount, charge_date, status) VALUES
(1, 'Late Fee', 500, '2026-03-10', 'Pending'),
(1, 'Room Damage', 1500, '2026-03-12', 'Pending');

GO

--sample queries
    
-- User login with role
SELECT u.username, r.role_name
FROM Users u
JOIN Roles r ON u.role_id = r.role_id;

-- View all students
SELECT s.student_id, s.name, s.phone, s.street,
       c.city_name, c.province
FROM Students s
JOIN Cities c ON s.city_id = c.city_id;

-- Search student by name
SELECT s.student_id, s.name, s.phone, s.street,
       c.city_name, c.province
FROM Students s
JOIN Cities c ON s.city_id = c.city_id
WHERE s.name LIKE '%Ali%';

-- View rooms with type
SELECT r.room_number, rt.type_name, r.status
FROM Rooms r
JOIN RoomTypes rt ON r.type_id = rt.type_id;

-- Active room allocations
SELECT s.name, r.room_number, ra.allocation_date
FROM RoomAllocation ra
JOIN Students s ON ra.student_id = s.student_id
JOIN Rooms r ON ra.room_id = r.room_id
WHERE ra.vacate_date IS NULL;

-- Full room allocation history
SELECT s.name, r.room_number, ra.allocation_date, ra.vacate_date
FROM RoomAllocation ra
JOIN Students s ON ra.student_id = s.student_id
JOIN Rooms r ON ra.room_id = r.room_id;

-- Student fee details
SELECT s.name, f.amount, f.due_date, f.status
FROM Fees f
JOIN Students s ON f.student_id = s.student_id;

-- Total payments
SELECT SUM(amount_paid) AS TotalPayments
FROM Payments;

-- Pending complaints
SELECT *
FROM Complaints
WHERE status_id = 1;

-- Visitor records
SELECT s.name, v.visitor_name, v.entry_time, v.exit_time
FROM Visitors v
JOIN Students s ON v.student_id = s.student_id;

-- Attendance tracking
SELECT s.name, a.entry_time, a.exit_time
FROM AttendanceLogs a
JOIN Students s ON a.student_id = s.student_id;

-- Leave requests
SELECT s.name, l.from_date, l.to_date, l.status
FROM LeaveRequests l
JOIN Students s ON l.student_id = s.student_id;

-- Total students
SELECT COUNT(*) AS TotalStudents
FROM Students;

-- Update complaint status
UPDATE Complaints
SET status_id = 2
WHERE complaint_id = 1;

-- Deallocate room
UPDATE RoomAllocation
SET vacate_date = CAST(GETDATE() AS DATE)
WHERE allocation_id = 1;

-- Delete visitor
DELETE FROM Visitors
WHERE visitor_id = 1;

-- Insert new user
INSERT INTO Users (username, password, role_id)
VALUES ('romaisa1', 'pass', 2);

-- Insert new student
INSERT INTO Students (user_id, name, phone, street, city_id)
VALUES (4, 'Romaisa', '03261237801', 'Johar Town', 1);

-- View all tables
SELECT * FROM Roles;
SELECT * FROM Cities;
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
SELECT * FROM ExtraCharges;

GO
