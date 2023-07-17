class MySQLWrapper {
    static connector = null;
    constructor(dbConnector) {
      this.dbConnector = dbConnector;
    }
  
    queryExecutor(query, params, connection) {
      return new Promise((resolve, reject) => {
        connection.query(query, params, (err, rows) => {
          connection.release();
          if (err) {
            console.error(`Error executing query: ${query} with params: ${params}. Error: ${err}`);
            return reject(err);
          }
          resolve(rows);
        });
      });
    }
  
    createQuery({ query, params }) {
      return new Promise((resolve, reject) => {
        this.dbConnector.pool.getConnection((err, connection) => {
          if (err) {
            console.error(`Error getting DB connection: ${err}`);
            return reject(err);
          }
  
          this.queryExecutor(query, params, connection)
            .then(resolve)
            .catch(reject);
        });
      });
    }
  
    createTransactionalQuery({ query, params, connection }) {
      return this.queryExecutor(query, params, connection);
    }
  
    commit(connection) {
      return new Promise((resolve, reject) => {
        connection.commit(err => {
          connection.release();
          if (err) {
            console.error(`Error during commit: ${err}`);
            return this.rollback(connection).then(() => reject(err));
          }
          resolve();
        });
      });
    }
  
    rollback(connection) {
      return new Promise((resolve, reject) => {
        connection.rollback(err => {
          connection.release();
          if (err) {
            console.error(`Error during rollback: ${err}`);
            return reject(err);
          }
          resolve();
        });
      });
    }
  
    getConnectionFromPool() {
      return new Promise((resolve, reject) => {
        this.dbConnector.pool.getConnection((err, connection) => {
          if (err) {
            console.error(`Error getting DB connection: ${err}`);
            return reject(err);
          }
          resolve(connection);
        });
      });
    }
  
    beginTransaction(connection) {
      return new Promise((resolve, reject) => {
        connection.beginTransaction(err => {
          if (err) {
            console.error(`Error starting transaction: ${err}`);
            connection.release();
            return reject(err);
          }
          resolve(connection);
        });
      });
    }
  }
  
  module.exports = MySQLWrapper;
  