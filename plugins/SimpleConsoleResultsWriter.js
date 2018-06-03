/**
 * Created by jb on 6/2/2018.
 */
const WriteResults = function(sessionResults, stats) {
    var runningStats = {
        numberOfIterations: stats.length,
        status: "completed",
        averages: {
            duration: 0,
            cpu: 0,
            reads: 0,
            compileCPUTime: 0,
            compileTime: 0
        },
        totals: {
            duration: 0,
            cpu: 0,
            reads: 0,
            compileCPUTime: 0,
            compileTime: 0
        }
    };

    // loop over each iteration of the test
    stats.forEach(function (resultStats) {
        runningStats.totals.duration += resultStats.executionTotal.elapsed;
        runningStats.totals.cpu += resultStats.executionTotal.cpu;

        runningStats.totals.compileTime += resultStats.compileTotal.elapsed;
        runningStats.totals.compileCPUTime += resultStats.compileTotal.cpu;

        // now loop through each table that has IO stats
        resultStats.tableIOResult.forEach(function (resultSetIO) {
            // last loop I swear - loop through each result set's IO
            resultSetIO.forEach(function (tableIO) {
                runningStats.totals.reads += tableIO.scan + tableIO.logical + tableIO.physical + tableIO.readahead + tableIO.loblogical + tableIO.lobphysical + tableIO.lobreadahead;
            });
        });
    });

    // calc the averages
    runningStats.averages.duration = runningStats.totals.duration / runningStats.numberOfIterations;
    runningStats.averages.cpu = runningStats.totals.cpu / runningStats.numberOfIterations;
    runningStats.averages.reads = runningStats.totals.reads / runningStats.numberOfIterations;
    runningStats.averages.compileCPUTime = runningStats.totals.compileCPUTime / runningStats.numberOfIterations;
    runningStats.averages.compileTime = runningStats.totals.compileTime / runningStats.numberOfIterations;

    console.log(JSON.stringify(runningStats, null, 2));
}

module.exports = WriteResults;