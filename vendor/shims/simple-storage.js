(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['simpleStorage'],
      __esModule: true,
    };
  }

  define('simple-storage', [], vendorModule);
})();
