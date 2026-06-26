const express = require('express');
const axios = require('axios');
const router = express.Router();

const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrdW1hcnJhdmkwNTAyMjAwNUBnbWFpbC5jb20iLCJleHAiOjE3ODI0NTU1MDIsImlhdCI6MTc4MjQ1NDYwMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjdkMTlmZTZkLTFkY2YtNDFkNi04ODc3LTJkOWM3NWRjODNjYSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6InJhdmkga3VtYXIiLCJzdWIiOiI3MGY2OGFmOC1lNzUwLTRhODAtYWUxOC0xMjhmZDQ0NTBhZjQifSwiZW1haWwiOiJrdW1hcnJhdmkwNTAyMjAwNUBnbWFpbC5jb20iLCJuYW1lIjoicmF2aSBrdW1hciIsInJvbGxObyI6IjIzMDE5MjAxMDAyNDUiLCJhY2Nlc3NDb2RlIjoieHhrSm5rIiwiY2xpZW50SUQiOiI3MGY2OGFmOC1lNzUwLTRhODAtYWUxOC0xMjhmZDQ0NTBhZjQiLCJjbGllbnRTZWNyZXQiOiJSQ1VRSEtQbmdmU3haaFdFIn0.ykzveGYNPCWXK30CE2Qi24N6rYpYMxoe15-ULkeKdww";
const WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1
};

router.get('/notifications', async (req, res) => {
  await Log('backend', 'info', 'handler', 'Fetching notifications from AffordMed API');

  const response = await axios.get('http://4.224.186.213/evaluation-service/notifications', {
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` }
  });

  const notifications = response.data.notifications;
  await Log('backend', 'info', 'handler', `Fetched ${notifications.length} notifications`);

  const sorted = notifications.sort((a, b) => {
    const weightDiff = (WEIGHT[b.Type] || 0) - (WEIGHT[a.Type] || 0);
    if (weightDiff !== 0) return weightDiff;
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });

  const top10 = sorted.slice(0, 10);
  await Log('backend', 'info', 'handler', 'Returning top 10 priority notifications');

  res.json({ notifications: top10 });
});

module.exports = { router, setLog: (logFn) => { global.Log = logFn; } };