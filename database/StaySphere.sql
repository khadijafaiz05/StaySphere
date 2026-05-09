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
  role_id   INT PRIMARY KEY IDENTITY(1,1),
  role_name VARCHAR(50)
);

CREATE TABLE Users (
  user_id  INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(50),
  password VARCHAR(50),
  role_id  INT,
  FOREIGN KEY(role_id) REFERENCES Roles(role_id)
);

CREATE TABLE Students (
  student_id INT PRIMARY KEY IDENTITY(1,1),
  user_id    INT,
  name       VARCHAR(100),
  phone      VARCHAR(15),
  gender     VARCHAR(10) CHECK (gender = 'Female'),
  address    VARCHAR(200),
  FOREIGN KEY(user_id) REFERENCES Users(user_id)
);

CREATE TABLE RoomTypes (
  type_id   INT PRIMARY KEY IDENTITY(1,1),
  type_name VARCHAR(50),
  capacity  INT
);

CREATE TABLE Rooms (
  room_id     INT PRIMARY KEY IDENTITY(1,1),
  room_number VARCHAR(10),
  type_id     INT,
  status      VARCHAR(20),
  FOREIGN KEY(type_id) REFERENCES RoomTypes(type_id)
);

CREATE TABLE RoomAllocation (
  allocation_id   INT PRIMARY KEY IDENTITY(1,1),
  student_id      INT,
  room_id         INT,
  allocation_date DATE,
  FOREIGN KEY(student_id) REFERENCES Students(student_id),
  FOREIGN KEY(room_id)    REFERENCES Rooms(room_id)
);

CREATE TABLE Fees (
  fee_id     INT PRIMARY KEY IDENTITY(1,1),
  student_id INT,
  amount     DECIMAL(10,2),
  due_date   DATE,
  status     VARCHAR(20),
  FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE Payments (
  payment_id   INT PRIMARY KEY IDENTITY(1,1),
  fee_id       INT,
  amount_paid  DECIMAL(10,2),
  payment_date DATE,
  FOREIGN KEY(fee_id) REFERENCES Fees(fee_id)
);

CREATE TABLE ComplaintStatus (
  status_id   INT PRIMARY KEY IDENTITY(1,1),
  status_name VARCHAR(50)
);

CREATE TABLE Complaints (
  complaint_id   INT PRIMARY KEY IDENTITY(1,1),
  student_id     INT,
  description    VARCHAR(200),
  status_id      INT,
  date_submitted DATE,
  FOREIGN KEY(student_id) REFERENCES Students(student_id),
  FOREIGN KEY(status_id)  REFERENCES ComplaintStatus(status_id)
);

CREATE TABLE Visitors (
  visitor_id   INT PRIMARY KEY IDENTITY(1,1),
  student_id   INT,
  visitor_name VARCHAR(100),
  entry_time   DATETIME,
  exit_time    DATETIME,
  FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE AttendanceLogs (
  log_id     INT PRIMARY KEY IDENTITY(1,1),
  student_id INT,
  entry_time DATETIME,
  exit_time  DATETIME,
  FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE LeaveRequests (
  leave_id   INT PRIMARY KEY IDENTITY(1,1),
  student_id INT,
  from_date  DATE,
  to_date    DATE,
  status     VARCHAR(20),
  FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

CREATE TABLE ExtraCharges (
  charge_id   INT PRIMARY KEY IDENTITY(1,1),
  student_id  INT,
  description VARCHAR(100),
  amount      DECIMAL(10,2),
  charge_date DATE,
  status      VARCHAR(20),
  FOREIGN KEY(student_id) REFERENCES Students(student_id)
);

GO


INSERT INTO Roles (role_name) VALUES ('Admin'), ('Student'), ('Warden');

INSERT INTO Users (username, password, role_id) VALUES
('admin1',   'pass', 1),
('student1', 'pass', 2),
('student2', 'pass', 2);

INSERT INTO Students (user_id, name, phone, gender, address) VALUES
(2, 'Aliya Khan',  '03001234567', 'Female', 'Lahore'),
(3, 'Sara Ahmed',  '03007654321', 'Female', 'Karachi');

INSERT INTO RoomTypes (type_name, capacity) VALUES
('Single', 1),
('Double', 2);

INSERT INTO Rooms (room_number, type_id, status) VALUES
('A101', 1, 'Available'),
('B201', 2, 'Occupied');

INSERT INTO RoomAllocation (student_id, room_id, allocation_date) VALUES
(1, 2, '2026-03-01');

INSERT INTO Fees (student_id, amount, due_date, status) VALUES
(1, 20000, '2026-04-01', 'Pending');

INSERT INTO Payments (fee_id, amount_paid, payment_date) VALUES
(1, 10000, '2026-03-05');

INSERT INTO ComplaintStatus (status_name) VALUES ('Pending'), ('Resolved');

INSERT INTO Complaints (student_id, description, status_id, date_submitted) VALUES
(1, 'Water leakage', 1, '2026-03-02');

INSERT INTO Visitors (student_id, visitor_name, entry_time, exit_time) VALUES
(1, 'Ahmed Khan', '2026-03-03 10:00:00', '2026-03-03 12:00:00');

INSERT INTO AttendanceLogs (student_id, entry_time, exit_time) VALUES
(1, '2026-03-03 08:00:00', '2026-03-03 18:00:00');

INSERT INTO LeaveRequests (student_id, from_date, to_date, status) VALUES
(1, '2026-03-10', '2026-03-12', 'Pending');

INSERT INTO ExtraCharges (student_id, description, amount, charge_date, status) VALUES
(1, 'Late Fee',    500,  '2026-03-10', 'Pending'),
(1, 'Room Damage', 1500, '2026-03-12', 'Pending');

GO



SELECT u.username, r.role_name 
FROM Users u 
JOIN Roles r ON u.role_id = r.role_id;


SELECT student_id, name, phone, address 
FROM Students;


SELECT r.room_number, rt.type_name, r.status 
FROM Rooms r 
JOIN RoomTypes rt ON r.type_id = rt.type_id;


SELECT s.name, r.room_number, ra.allocation_date FROM RoomAllocation ra 
JOIN Students s ON ra.student_id = s.student_id 
JOIN Rooms r ON ra.room_id = r.room_id;


SELECT s.name, f.amount, f.due_date, f.status 
FROM Fees f JOIN Students s ON f.student_id = s.student_id;


SELECT SUM(amount_paid) AS TotalPayments 
FROM Payments;


SELECT s.name, c.description, cs.status_name 
FROM Complaints c JOIN Students s ON c.student_id = s.student_id 
JOIN ComplaintStatus cs ON c.status_id = cs.status_id;


SELECT s.name, a.entry_time, a.exit_time 
FROM AttendanceLogs a JOIN Students s ON a.student_id = s.student_id;


SELECT s.name, l.from_date, l.to_date, l.status
FROM LeaveRequests l JOIN Students s ON l.student_id = s.student_id;

SELECT COUNT(*) AS TotalStudents FROM Students;

SELECT s.name, SUM(ec.amount) AS TotalExtraCharges 
FROM ExtraCharges ec JOIN Students s ON ec.student_id = s.student_id 
GROUP BY s.name;