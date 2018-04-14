'use strict';

const express = require('express');
const path = require('path');
const scss = require('gap-node-scss');
const webpack = require('gap-node-webpack');
const mock = require('gap-node-mock');

module.exports = (setting) => {
    const app = express();
    const port = setting.port || 8007;
    const staticHost = setting.staticHost || 'localhost';
    const baseDir = setting.baseDir;

    if (setting.scss) {
        app.use(
            '/' + (setting.scss.publicSlug.dev || ''),
            scss.middleware({
                inputDir: path.resolve(baseDir, setting.scss.inputDir),
                outputDir: path.resolve(baseDir, setting.scss.outputDir.dev),
                includePaths: setting.scss.includePaths.map(item => path.resolve(baseDir, item)),
                sourceMap: true,
                outputStyle: 'expanded' // nested, expanded, compact, compressed
            })
        );
    }

    if (setting.webpack) {
        app.use(webpack.middleware({
            staticHost: staticHost,
            publicSlug: setting.webpack.publicSlug.dev,
            contextDir: path.resolve(baseDir, setting.webpack.contextDir),
            outputDir: path.resolve(baseDir, setting.webpack.outputDir.dev),
            modules: setting.webpack.modules.map(item => path.resolve(baseDir, item)),
            sourceMap: true,
            entry: setting.webpack.entry
        }));
    }

    if (setting.public) {
        app.use(
            '/' + (setting.public.publicSlug.dev || ''),
            express.static(path.resolve(baseDir, setting.public.publicDir))
        );
    }

    if (setting.mock) {
        app.use(
            '/' + (setting.mock.publicSlug.dev || ''),
            mock({mockDir: setting.mock.mockDir})
        );
    }

    app.listen(port, function () {
        console.log('Front Server listening on port ' + port + '!');
    });
};
