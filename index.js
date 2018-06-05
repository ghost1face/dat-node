const Session = require('./src/session');
const parseStats = require('./src/statsparser');
const fakeResultsWriterPlugin = require('./plugins/SimpleConsoleResultsWriter');

const runDat = function (config) {
   const session = new Session(config);
   return session.execute()
      .then(_ => {
         debugger;
         let stats = session.sessionResults.map(sr => {
            return parseStats(sr.msgs.join('\n'));
         });

         fakeResultsWriterPlugin(session.sessionResults, stats);

         return session.close();
      })
      .catch(err => {
         return session.close();
      })
      .then(_ => session);
}

module.exports = runDat;
