/**
 * Created by daniel on 5/13/2018.
 */

const sql = require("msnodesqlv8");

const connectionString = 'Server=.;Database=SampleDB;Trusted_Connection=yes;Driver={SQL Server Native Client 11.0}';
const query = "SELECT name FROM sys.databases";

// let q = conn.query()
// q.on('info', e => {
//     console.log(`print: ${e.message.substr(e.message.lastIndexOf(']') + 1)}`)
// })
sql.open(connectionString, (err, conn) => {
    if (err) {
        throw err;
    }
    let x = 1;
    if (err) {
        throw err;
    }

    // setInterval(() => {
        let q = conn.query(`SET STATISTICS TIME ON; SET STATISTICS IO ON; SELECT * FROM dbo.Users`,
            (err, results, more) => {
                // if (more && !err && results && results.length === 0) {
                //     return;
                // }
                // console.log(`[${x}] more = ${more} err ${err} results ${JSON.stringify(results)}`);
                // if (more) return;
                // ++x;
            });
        q.on('info', (e) => {
            console.log(`print: ${e.message.substr(e.message.lastIndexOf(']') + 1)}`)
        })
    // }, 100);
});