const mysql = require('mysql2');
const fs = require('fs');

class MySQLConnector {
  constructor(config) {
    const {
      username,
      dbName,
      password,
      address,
      poolSize,
      queueLimit,
      ssl
    } = config;

    const sslConfig = ssl ? {
      ca: fs.readFileSync(ssl.caPath),
      key: fs.readFileSync(ssl.keyPath),
      cert: fs.readFileSync(ssl.certPath),
    } : null;

    this.internalPool = mysql.createPool({
      host: address,
      user: username,
      database: dbName,
      password: password,
      connectionLimit: poolSize || 100,
      queueLimit: queueLimit || 250,
      charset:'utf8mb4',
      waitForConnections: true,
      ssl: sslConfig
    });

    this.registerThreadCounter();
  }

  registerThreadCounter() {
    this.internalPool.on('connection', (connection) => console.log(`New connection established with server on thread #${connection.threadId}`));
  }

  get pool() {
    return this.internalPool;
  }
}

module.exports = MySQLConnector;
