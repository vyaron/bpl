'use strict';

var Log = (function(){
    var _debug = true, _url = "", _self = this;
    var _noop = function(){};

    var setDebug = function(flag){
        _debug = flag ? true : false;
    };

    var setUrl = function(url){
        _url = url ? url : '';
    };

    var _formatError = function(arg) {
        if (arg instanceof Error) {
            if (arg.stack) {
                arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
                    ? 'Error: ' + arg.message + '\n' + arg.stack
                    : arg.stack;
            } else if (arg.sourceURL) {
                arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
            }
        }
        return arg;
    };

    var _serverLog = function(){
        if (_url){
            var req = new XMLHttpRequest();
            req.open('POST', _url, false);
            //req.overrideMimeType('application/json');
            var data = (JSON && JSON.stringify) ? JSON.stringify(arguments) : '';
            req.send(data);
        }
    };

    var _consoleLog = function(type) {
        var console = window.console || {},
            logFn = console[type] || console.log || _noop;

        if (logFn.apply) {
            return function() {
                var args = [];
                for (var i= 0; i<arguments.length; i++){
                    args.push(_formatError(arguments[i]));
                }

                if (!_debug) {
                    if (type == 'error') logFn = _serverLog;
                    else logFn = _noop;
                }

                return logFn.apply(console, args);
            };
        }

        // we are IE which either doesn't have window.console => this is noop and we do nothing,
        // or we are IE where console.log doesn't have apply so we log at least first 2 args
        return function(arg1, arg2) {
            arg2 = arg2 || '';

            if (!_debug) {
                if (type == 'error') logFn = _serverLog;
                else logFn = _noop;
            }

            logFn(arg1, arg2);
        };
    };

    return {
        setDebug : setDebug,
        setUrl : setUrl,

        log: _consoleLog('log'),
        info: _consoleLog('info'),
        warn: _consoleLog('warn'),
        error: _consoleLog('error'),
        debug: (function () {
            var fn = _consoleLog('debug');

            return function() {
                if (_debug) {
                    fn.apply(_self, arguments);
                }
            };
        }())
    };
})();

var cl = Log.log;