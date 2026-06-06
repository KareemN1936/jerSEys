const mysql = require("mysql2/promise");

let pool;

if (process.env.DATABASE_URL) {
  const dbUrl = new URL(process.env.DATABASE_URL);

  pool = mysql.createPool({
    host: dbUrl.hostname,
    port: Number(dbUrl.port),
    user: dbUrl.username,
    password: decodeURIComponent(dbUrl.password),
    database: dbUrl.pathname.replace("/", ""),
    ssl: {
      rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
      rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

const testDbConnection = async () => {
  const connection = await pool.getConnection();

  try {
    await connection.ping();
    console.log("Database connection established successfully.");
  } finally {
    connection.release();
  }
};

module.exports = {
  pool,
  testDbConnection
};