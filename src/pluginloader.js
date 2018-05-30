const path = require('path');

function tryRequire(pluginNameOrPath) {
    let resolved;
    try {
        resolved = require(pluginNameOrPath);
    }
    catch (ex) {

    }

    return resolved;
}

module.exports = function loadPlugin(plugin) {
    let resolved = tryRequire(plugin);
    if (resolved)
        return resolved;

    let pluginPath = path.resolve('./plugins', plugin);
    resolved = tryRequire(pluginPath);

    return resolved;
}