# gap-node-front

## Install

```
yarn add gap-node-front
```

## Usage

```javascript
const gapFront = require('gap-node-front');

const setting = {
    baseDir: path.resolve(__dirname, '..'),
    port: 8087,
    staticHost: 'localhost',
    scss: {
        publicSlug: 'css',
        inputDir: 'front/scss',
        outputDir: {
            dev: 'site/static/dev/css',
            dist: 'site/static/dist/css'
        },
        includePaths: [
            'node_modules/foundation-sites/scss',
            'node_modules/gap-front-scss/scss',
            'node_modules/gap-front-zselect/scss'
        ]
    },
    webpack: {
        publicSlug: 'js',
        contextDir: 'front/js',
        outputDir: {
            'dev': 'site/static/dev/js',
            'dist': 'site/static/dist/js'
        },
        modules: [
            'node_modules'
        ],
        entry: {
            main: './main.js'
        }
    },
    public: {
        publicSlug: '',
        publicDir: 'site/public'
    },
    mock: {
        mockDir: 'mock'
    }
};

gapFront(setting).runServer();
//or
gapFront(setting).release();
```
