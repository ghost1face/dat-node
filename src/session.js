'use strict';
const fs = require('fs');
const path = require('path');
const resolveConnectionString = require('./connectionString');
const SessionTest = require('./sessionTest');


// TODO: what is the format of our config file/command args
// TODO: What parameters are required?
class Session {
   constructor(config) {
      let cfg = Object.assign({}, {
         iterations: 20,
         threads: 1
      }, config);

      if (!cfg.tests || !cfg.tests.length)
         throw Error('No tests available to run.');

      // TODO: Resolve queries to determine if it is a query or a path

      cfg.connectionSettings = this._resolveConnection(cfg.connectionSettings);

      this.config = cfg;
   }

   execute() {
      const driver = this._resolveDriver();
      const cfg = this.config;

      let executionPromise = Promise.resolve();
      let pool;

      this.sessionResults = [];
      this.pool = pool = new driver.ConnectionPool(this.config.connectionSettings);

      pool.on('debug', (connection, message) => {
         console.debug(message);
      });

      pool.on('error', err => {
         console.error(err);
      });

      return pool.connect().then(conPool => {
         cfg.tests.forEach(test => {
            for (let i = 0; i < cfg.iterations; i++) {
               let sessionTest = new SessionTest(test, conPool, driver);
               this.sessionResults.push(sessionTest);

               executionPromise = executionPromise.then(sessionTest.runTest);
            }
         });

         return executionPromise;
      })
         .catch(err => {
            console.error(err);
         });

   }

   close() {
      return this.pool.close()
         .catch(err => console.error(err));
   }

   _resolveQuery() {

   }

   _resolveConnection(connectionStringOrObject) {
      if (!connectionStringOrObject || typeof connectionStringOrObject === 'undefined')
         throw Error('No connection string found.');

      return resolveConnectionString(connectionStringOrObject);
   }

   _resolveDriver() {
      let sql;
      const cfg = this.config;
      if (cfg && cfg.connectionSettings && cfg.connectionSettings.options && cfg.connectionSettings.options.driver === 'msnodesqlv8')
         sql = require('mssql/msnodesqlv8');
      else
         sql = require('mssql');

      return sql;
   }
}

module.exports = Session;


/* NOTES:
 1. This should take in a connection string or object for a connection
 2. Resolve the connection string/object to determine which driver to use
 3. Create session with driver instance
 4. Execute query and receive statistics
 5. Parse statistics
 6. Aggregate and return statistics
 7. Close connections and cleanup

*/

/*
{
    "iterations": 100,
    "tests": [{
        "sql": "SELECT TOP 100 * FROM dbo.DimAccount",
        "connectionString": "Data Source=localhost;Initial Catalog=AdventureWorksDW2014;Integrated Security=true;"
    }]
} */
