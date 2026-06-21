const http = require('http');

http.get('http://localhost:80/api/db', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const db = JSON.parse(data);
      console.log('Successfully fetched and parsed db.json');
      console.log(`Users count: ${db.users ? db.users.length : 0}`);
      console.log(`Leads count: ${db.leads ? db.leads.length : 0}`);
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
      console.log('Raw data:', data);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching db:', err.message);
});
