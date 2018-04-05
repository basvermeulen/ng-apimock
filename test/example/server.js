const express = require('express');
var http = require('http');
var ws = require('ws');
const serveStatic = require('serve-static');
const path = require('path');
const ngApimockUtil = require(path.join(process.cwd(), 'lib/utils'));
const ngApimock = require(path.join(process.cwd(), 'tasks/index.js'))();
const configuration = {src: 'test/mocks', outputDir: '.tmp/some-other-dir'};

ngApimock.run(configuration);
ngApimock.watch(configuration.src);

const app = express();
var server = http.createServer(app);
var wss = new ws.Server({ noServer: true });

var handleUpgrade = require('express-websocket');

app.use(ngApimockUtil.ngApimockRequest);
app.use('/node_modules', serveStatic(path.join(process.cwd(), 'node_modules')));
app.use('/mocking', serveStatic('.tmp/some-other-dir'));
app.use('/', serveStatic(__dirname));

app.use('/api', function (request, response, next) {
    // response.websocket(function (ws) {
    //     // Optional callback
    //     ws.send('hello');
    // });
    next();
});

app.use('/online/rest/some/api', function (request, response, next) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    if (request.method === 'GET') {
        response.end("[{\"a\":\"b\"}]");
    } else if (request.method === 'POST') {
        response.end("{\"c\": \"d\"}");
    } else {
        next();
    }
});

server.on('upgrade', handleUpgrade(app, wss));

server.listen(9900);
console.log('server running on port 9900');
