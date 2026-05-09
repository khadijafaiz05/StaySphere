const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',       require('./Routes/authRoutes'));
app.use('/api/students',   require('./Routes/studentRoutes'));
app.use('/api/attendance', require('./Routes/attendanceRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`StaySphere running on port ${PORT}`));