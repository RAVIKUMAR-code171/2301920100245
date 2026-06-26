const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(morgan('dev'));


const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrdW1hcnJhdmkwNTAyMjAwNUBnbWFpbC5jb20iLCJleHAiOjE3ODI0NTM4MDAsImlhdCI6MTc4MjQ1MjkwMCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImZmNmI5ZTc3LWQ0ZWYtNDg5Ny05MTE3LWI5NjBjNzBkZjdiMSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InJhdmkga3VtYXIiLCJzdWIiOiI3MGY2OGFmOC1lNzUwLTRhODAtYWUxOC0xMjhmZDQ0NTBhZjQifSwiZW1haWwiOiJrdW1hcnJhdmkwNTAyMjAwNUBnbWFpbC5jb20iLCJuYW1lIjoicmF2aSBrdW1hciIsInJvbGxObyI6IjIzMDE5MjAxMDAyNDUiLCJhY2Nlc3NDb2RlIjoieHhrSm5rIiwiY2xpZW50SUQiOiI3MGY2OGFmOC1lNzUwLTRhODAtYWUxOC0xMjhmZDQ0NTBhZjQiLCJjbGllbnRTZWNyZXQiOiJSQ1VRSEtQbmdmU3haaFdFIn0.88QsYbZaLyarLvH4RjBsglXIoYVQ9CAgGlsbMRXitdc";


const Log = async (stack, level, pack, message) => {
  try {
    const response = await axios.post(
      'http://4.224.186.213/evaluation-service/logs',
      {
        stack: stack,
        level: level,
        package: pack,
        message: message
      },
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`
        }
      }
    );
    console.log(`[LOG SUCCESS] ${stack} | ${level} | ${pack} | ${message}`);
    return response.data;
  } catch (error) {
    console.error('[LOG FAILED]', error.message);
  }
};
const { router, setLog } = require('./notifications');
setLog(Log);
app.use('/api', router);


app.use(async (req, res, next) => {
  await Log('backend', 'info', 'middleware', `Incoming ${req.method} request to ${req.url}`);
  next();
});

// Test route
app.get('/', async (req, res) => {
  await Log('backend', 'info', 'handler', 'Root route hit');
  res.json({ message: 'Server is running' });
  await Log('backend', 'info', 'handler', 'Response sent successfully');
});

const PORT = 3000;
app.listen(PORT, async () => {
  await Log('backend', 'info', 'service', `Server started on port ${PORT}`);
});