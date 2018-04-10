'use strict';

module.exports = (setting) => {
    return {
        release: () => {
            require('./lib/release.js')(setting);
        },
        runServer: () => {
            require('./lib/runServer.js')(setting);
        }
    };
};
