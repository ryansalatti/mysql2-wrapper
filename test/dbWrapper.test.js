/*
 * For these tests, we'll need a real or mock MySQL server. 
 * The tests will use a test database and a test table that need to be created beforehand. 
 * You could add scripts to your package.json file to setup and teardown these resources 
 * before and after testing.
*/

const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
const MySQLWrapper = require('../dbWrapper');
const MySQLConnector = require('../dbConnect');

chai.use(chaiAsPromised);

describe('MySQLConnector', function() {
  it('should connect to the database with username and password', function() {
    // Initialize MySQLConnector with the database configuration
    const dbConfig = {
      username: 'test_user',
      password: 'test_password',
      address: 'db_address',
      dbName: 'db_name',
      /*ssl: {
        caPath: __dirname + '/ssl/server-ca.pem',
        keyPath: __dirname + '/ssl/client-key.pem',
        certPath: __dirname + '/ssl/client-cert.pem',
      }*/
    };
    const connector = new MySQLConnector(dbConfig);
    const wrapper = new MySQLWrapper(connector);
    
    return expect(wrapper.getConnectionFromPool()).to.be.fulfilled;
  });
});

describe('MySQLWrapper', function() {
  before(async function() {
    this.connection = await MySQLWrapper.getConnectionFromPool();
  });

  after(function() {
    this.connection.release();
  });

  describe('#createQuery()', function() {
    it('should return a Promise that resolves with query results', function() {
      const query = {query: 'SELECT 1', params: []};
      return expect(MySQLWrapper.createQuery(query)).to.eventually.eql([{ '1': 1 }]);
    });
  });

  describe('#createTransactionalQuery()', function() {
    it('should return a Promise that resolves with query results', function() {
      const query = {query: 'SELECT 1', params: []};
      const executeQuery = MySQLWrapper.createTransactionalQuery(query, this.connection);
      return expect(executeQuery).to.eventually.be.fulfilled;
    });
  });
});
