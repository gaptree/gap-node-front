'use strict';

const path = require('path');
const scss = require('gap-node-scss');
const webpack = require('gap-node-webpack');

module.exports = (setting) => {
    const staticHost = setting.staticHost || 'localhost';
    const baseDir = setting.baseDir;

    if (setting.scss) {
        scss.build({
            inputDir: path.resolve(baseDir, setting.scss.inputDir),
            outputDir: path.resolve(baseDir, setting.scss.outputDir.dist),
            includePaths: setting.scss.includePaths.map(item => path.resolve(baseDir, item)),
            outputStyle: 'compressed' // nested, expanded, compact, compressed
        });
    }

    if (setting.webpack) {
        webpack.build({
            mode: 'production',
            staticHost: staticHost,
            publicSlug: setting.webpack.publicSlug.dist,
            contextDir: path.resolve(baseDir, setting.webpack.contextDir),
            outputDir: path.resolve(baseDir, setting.webpack.outputDir.dist),
            modules: setting.webpack.modules.map(item => path.resolve(baseDir, item)),
            entry: setting.webpack.entry,
            minimize: true
        });
    }
};
