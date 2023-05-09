const express = require('express');
const mysql = require('mysql2/promise');


const app = express();

// create a connection pool
const pool = mysql.createPool({
  host: '3306',
  user: 'root',
  password: '',
  database: 'users'
});

// endpoint to get users
app.get('/users', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// serve the HTML page with the button
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Get Users</title>
      </head>
      <body>
        <button onclick="getUsers()">Get Users</button>
        <script>
          async function getUsers() {
            const response = await fetch('/users');
            const data = await response.json();
            console.log(data);
          }
        </script>
      </body>
    </html>
  `);
});

// start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
