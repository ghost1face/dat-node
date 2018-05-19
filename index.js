// const connectionStringParser = require('./src/connectionString');
//
// connectionStringParser('Server=.;Database=SampleDB;Trusted_Connection=yes;Driver={SQL Server Native Client 11.0}');
//
// module.exports = require('./src/session');


const Session = require('./src/session');
const parseStats = require('./src/statsparser');

// const config = {
//     iterations: 5,
//     connectionSettings: 'Server=.;Database=SampleDB;Trusted_Connection=yes',
//     tests: [{
//         query: 'SELECT TOP 100 * FROM dbo.Users'
//     }]
// };

const runDat = function(config) {
    const session = new Session(config);

    return session.execute()
        .then(_ => {
            debugger;
            let stats = session.sessionResults.map(sr => {
                return parseStats(sr.msgs.join('\n'));
            });

            // todo: proper output
            console.log(session.sessionResults.map(sr => sr.msgs.join('\n')).join('\n\n'));

            return session.close();
        })
        .catch(err => {
            return session.close();
        })
        .then(_ => session);
}

module.exports = runDat;
//
// {
//     "iterations": 100,
//     "tests": [{
//         "sql": "SELECT TOP 100 * FROM dbo.DimAccount",
//         "connectionString": "Data Source=localhost;Initial Catalog=AdventureWorksDW2014;Integrated Security=true;"
//     }]
// }