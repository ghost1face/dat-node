'use strict';
const connectionParser = require('mssql/lib/connectionstring');

function splitConnectionString(connectionString) {
    if (typeof connectionString !== 'string')
        return connectionString;

    let connSettings = {options: {}};
    connectionString.split(';').forEach(pair => {
        let index = pair.indexOf('=');
        let key = pair.substring(0, index);
        let value = pair.substring(index + 1);

        if (key) {
            switch (key.toLowerCase()) {
                case 'application name':
                case 'appname':
                case 'app name':
                    connSettings.options.appName = value;
                    break;

                case 'integrated security':
                case 'trusted_connection':
                    connSettings.options.trustedConnection = value;
                    break;

                case 'instance':
                case 'instance name':
                case 'instancename':
                    connSettings.options.instanceName = value;
                    break;

                case 'driver':
                    connSettings.options.driver = value;
                    break;
            }

        }
    });

    return connSettings;
}

function isTrue(value) {
    return value && (value.toLowerCase() === 'yes' || value.toLowerCase() === 'true');
}

module.exports = function (connectionString) {
    let connOptions = typeof connectionString !== 'string' ? connectionString : connectionParser.resolve(connectionString);
    let connSettings = splitConnectionString(connectionString);

    let newOptions = Object.assign({}, connOptions.options, connSettings.options);
    let newSettings = Object.assign({}, connOptions, connSettings)

    newSettings.options = newOptions;

    if (isTrue(newSettings.options.trustedConnection))
        newSettings.options.driver = 'msnodesqlv8';

    return newSettings;
}