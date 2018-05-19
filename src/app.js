'use strict';
const versionNumber = require('../package.json').version;

const argv = require('yargs')
    .alias('c', 'configPath')
    .describe('c', 'Path to configuration file to execute test')
    .demandOption(['c'])
    .version(versionNumber)
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2018')
    .argv;

const fs = require('fs')
const path = require('path');
const runDat = require('../index');

function fileExists(path) {
    return new Promise(function (resolve, reject) {
        try {
            fs.access(path, fs.constants.F_OK | fs.constants.R_OK, err => {
                if (err)
                    resolve(false);
                else
                    resolve(true);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}

(async function () {

    try {
        const absoluteConfigPath = path.resolve(argv.configPath);

        const exists = await fileExists(absoluteConfigPath);
        if (!exists)
            throw Error(`The file ${absoluteConfigPath} does not exist`);

        let configString = fs.readFileSync(absoluteConfigPath, 'utf-8');
        if (!configString)
            throw Error(`Invalid config contents`);

        let config = JSON.parse(configString);

        await runDat(config);
    }
    catch (error) {
        console.error(error);
        return;
    }
})();