# mysql2-wrapper

mysql2-wrapper is a lightweight, promise-based wrapper around the popular mysql2 Node.js library, designed to simplify and streamline MySQL database operations. This package provides an easy-to-use and intuitive API for executing SQL queries and managing transactions, making it a valuable tool for developers working with MySQL databases in Node.js.

## Table of Contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [API Reference](#api-reference)
4. [Examples](#examples)
5. [Contributing](#contributing)
6. [Tests](#tests)
7. [License](#license)

## Installation

## Usage
First, initialize your database connector and then the wrapper:
```javascript
const MySQLConnector = require('mysql-connector-wrapper');
const MySQLWrapper = require('mysql-wrapper');

const dbConnector = new MySQLConnector({
  username: 'your-username',
  dbName: 'your-db-name',
  password: 'your-password',
  address: 'your-db-address',
  poolSize: 100,
  queueLimit: 250
});

const dbWrapper = new MySQLWrapper(dbConnector);
```
You can then use the dbWrapper instance to execute database queries.

## API Reference
#### MySQLWrapper
createQuery({query, params}): Executes the given SQL query with provided parameters.
createTransactionalQuery({query, params, connection}): Execute a sequential group of SQL operations to perform as a one single work unit that can be committed or rolled back.

##### Parameters:

`query` (String): The SQL query to execute.
`params` (Array): The parameters to pass to the SQL query.
`connection` (Object): The database connection object. This object represents a single database connection. It is used to execute the query within a specific database connection which can be useful for running transactions.
##### Returns:
A Promise that will be resolved with the result of the query.

## Examples
createQuery method:
```javascript
const query = 'SELECT * FROM users WHERE id = ?';
const params = [1];

dbWrapper.createQuery({ query, params })
  .then(rows => console.log(rows))
  .catch(err => console.error(err));
```
createTransactionalQuery method:
```javascript
  let connection;
  
  try {
    connection = await dbWrapper.getConnectionFromPool();
    await dbWrapper.beginTransaction(connection);
    
    const query1 = 'UPDATE accounts SET balance = balance - ? WHERE id = ?';
    const params1 = [100, 1];  // Deduct 100 units from account with id 1
    await dbWrapper.createTransactionalQuery({ query: query1, params: params1, connection });

    const query2 = 'UPDATE accounts SET balance = balance + ? WHERE id = ?';
    const params2 = [100, 2];  // Add 100 units to account with id 2
    await dbWrapper.createTransactionalQuery({ query: query2, params: params2, connection });

    await dbWrapper.commit(connection);
  } catch(err) {
    console.error(err);
    if (connection) {
      await dbWrapper.rollback(connection);
    }
  }
```
## Contributing
Contributions are welcome! Please open an issue if you have a feature request or bug report. For larger changes, it's better to open an issue first to discuss the changes. Please make sure to add tests for your changes and follow the existing coding style.

## Tests
To run the test suite, first install the dependencies, then run npm test:
```bash
npm install
npm test
```
## License
This project is licensed under the terms of the MIT license.


