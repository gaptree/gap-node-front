'use strict';

const express = require('express');
const path = require('path');
const scss = require('gap-node-scss');
const webpack = require('gap-node-webpack');
const mock = require('gap-node-mock');
const bodyParser = require('body-parser');
const chokidar = require('chokidar');

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
            entry: setting.webpack.entry,
            rules: setting.webpack.rules
        }));
    }

    if (setting.public) {
        app.use(
            '/' + (setting.public.publicSlug.dev || ''),
            express.static(path.resolve(baseDir, setting.public.publicDir))
        );
    }

    let router = () => {
        console.log('router do nothing!');
    };

    const buildMockRouter = () => {
        console.log('build mock router');
        router = mock({mockDir: setting.mock.mockDir});
    };

    if (setting.mock) {
        app.use(bodyParser.json()); // support json encoded bodies
        app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
        app.use(
            '/' + (setting.mock.publicSlug.dev || ''),
            (req, res, next) => router(req, res, next)
        );

        buildMockRouter();

        chokidar.watch(setting.mock.mockDir, {ignored: /(^|[/\\])\../}).on('all', (event, path) => {
            if (event == 'addDir') {
                return;
            }

            console.log(event, path);
            Object.keys(require.cache).forEach((id) => {
                if (id.indexOf(path) >= 0) {
                    console.log('delete require cache', id);
                    delete require.cache[id];
                }
            });
            buildMockRouter();
        });
    }

    app.listen(port, function () {
        console.log('Front Server listening on port ' + port + '!');
    });
};
