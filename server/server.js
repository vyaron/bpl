// Simple REST API Handler (in memory)
// Built by Yaron Biton misterBIT.co.il?en

var express = require('express'),
  http = require('http'),
  utils = require('./lib/utils.js');


var app = express()
  .use(express.bodyParser())
  .use(express.cookieParser())
  .use(express.static('app'));

const DELAY = 0;
//const DELAY = 5000;

var isForceErrors = function(req){
    return (String(req.query.forceError) == "true") ? true : false;
};

var isAllowed = function(req){
    return req.cookies.bpl ? true : false;
};

const MAX_ITEMS_LIMIT = 100;
app.get(/^\/data\/(\w+)(\/)?(\d+)?(\/)?(\w+)?(\/)?(\d+)?(\/)?$/, function(req, res){
    var data = {};
    var allowed = isAllowed(req);

    if (allowed) {
        var params = utils.getParams(req);
        data = utils.getData(params);

        if (data.length){
            var offset = req.query.offset || 0;
            var limit = req.query.limit || MAX_ITEMS_LIMIT;

            offset = parseInt(offset);
            limit = parseInt(limit);

            res.setHeader('Content-Range', offset + '-' + (offset+limit) + '/' + data.length);
            data = data.slice(offset, offset + limit)
        }
    } else {
        data = {msg : 'Forbidden'};
    }


    setTimeout(function(){
        res.status(allowed ? 200 : 403).json(data);
    }, DELAY);
});

app.put(/^\/data\/(\w+)(\/)?(\d+)?(\/)?(\w+)?(\/)?(\d+)?(\/)?$/, function(req, res){
    var params = utils.getParams(req);

    var data = req.body;
    data = utils.updateObj(params, data);

    setTimeout(function(){
        res.json(data);
    }, DELAY);
});


app.post(/^\/data\/(\w+)(\/)?(\d+)?(\/)?(\w+)?(\/)?(\d+)?(\/)?$/, function(req, res){
    var params = utils.getParams(req);

    var isForceError = (String(req.query.forceError) == "true") ? true : false;

    var data = req.body;

    if (isForceError) data = utils.forceError(data, 'Invalid params');
    else data = utils.createObj(params, data);

    setTimeout(function(){
        res.status(isForceError ? 500 : 200).json(data);
    }, DELAY);
});

app.delete(/^\/data\/(\w+)(\/)?(\d+)?(\/)?(\w+)?(\/)?(\d+)?(\/)?$/, function(req, res){
    var params = utils.getParams(req);

    var data = req.body;
    data = utils.deleteObj(params);

    setTimeout(function(){
        res.json(data);
    }, DELAY);
});

app.get('/', function  (req, res) {
	  res.json(404, {status: 'not found'});
});


app.get('/*', function  (req, res) {
  res.json(404, {status: 'not found'});
});

http.createServer(app).listen(3000, function () {
  console.log("Server ready at http://localhost:3000");
});
