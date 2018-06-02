const assert = require('assert');
const pluginLoader = require('../src/pluginloader');

describe('Plugin loader', function () {
   it('Loads module from relative path', function () {
      const resolvedFunction = pluginLoader('../src/pluginLoader');

      assert(resolvedFunction != null);
   });

   it('Loads module from node_modules', function () {
      const resolved = pluginLoader('fs');

      assert(resolved != null)
   });

   it('Loads modules from plugins directory', function () {
      const resolvedFunction = pluginLoader('console-output');

      assert(resolvedFunction != null);
   });
});
