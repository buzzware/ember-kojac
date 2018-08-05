'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  // This is for the bower version. Convert to use "npm install simplestorage.js"
  //app.import('bower_components/simpleStorage/simpleStorage.js');
  //app.import('vendor/shims/simple-storage.js');

  var mockjson = new Funnel('tests/public/mockjson', {
    destDir: '/assets/mockjson'
  });

  return app.toTree(mockjson);
};
