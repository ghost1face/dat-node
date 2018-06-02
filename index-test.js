const argv = require('yargs')
   .help('h')
   .alias('h', 'help')
   .epilog('copyright 2018')
   .argv;

// const sql = require('mssql');
const sql = require('mssql/msnodesqlv8');
let configFile = {
   server: 'localhost',
   database: 'SampleDB',
   options: {
      trustedConnection: 'yes'
   }
   // server: 'localhost\\SQLExpress',
   // database: 'TestDB'
};

// configFile = 'Server=.;Database=SampleDB;Trusted_Connection=yes';

const pool = new sql.ConnectionPool(configFile);
pool.on('debug', (connection, message) => {
   console.log(message)
});
pool.on('error', err => {
   console.log(err);
});
pool.connect().then(_ => {
   debugger;
   const request = new sql.Request(pool);

   request.on('info', message => {
      console.info(`INFO-MESSAGE: ${JSON.stringify(message, null, 2)}`);
   });

   request.on('error', err => {
      console.error(`ERROR-MESSAGE: ${err}`);
   });

   request.on('msg', msg => {
      console.log(`MESSAGE: ${msg}`);
   });

   request.on('meta', meta => {
      console.log(`META: ${meta}`);
   });

   request.on('warning', warn => {
      console.log(`WARNING: ${warn}`);
   });

   // request.query('PRINT \'hello world\'; SELECT TOP 1 * FROM dbo.Users', (err, result) => {
   //     debugger;
   //     console.log('CALLBACK:');
   //     console.dir(result);
   // });

   return request.query('SET STATISTICS IO ON;PRINT \'hello world\'; SELECT TOP 1 * FROM dbo.Users; SELECT TOP 2 * FROM dbo.Users;').then((result) => {
      console.log('PROMISE:')
      console.log(JSON.stringify(result, null, 2));
   })
      .catch(err => console.error(err))
      .then(_ => pool.close());


});
