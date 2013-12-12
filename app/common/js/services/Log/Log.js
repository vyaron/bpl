'use strict';

/**
 * @ngdoc object
 * @name Log
 *
 * @description
 * The Log class is in-charge of logging at the client side.
 * it will be implemented as a global object so that it can easily
 * be used from anywhere without the need for explicit injection.
 * This approach is taken specifically for the Log class because
 * in most cases it will be used for quick debugging that will
 * not exist in production code.
 *
 * # General usage
 * In Develop environment it will be used for quick debugging.
 * In Production environment it will be used for send errors to server side.
 *
 * <pre>
 *     var contact = {id : 1, full_name : "Ronen Cohen"};
 *
 *     Log.debug('Contact:', contact);
 *     Log.info("You are about to get error");
 *     Log.warn("Final warning");
 *     Log.error("Error!");
 * </pre>
 */
var Log = (function(){
    'use strict';

    var _debug = true, _url = "";

    var _noop = function(){};

    /**
     * @ngdoc method
     * @name Log#setDebug
     * @methodOf Log
     *
     * @description
     * Method to set debug mode.
     *
     * @param {Boolean} flag show debug in console
     */
    var setDebug = function(flag){
        _debug = flag ? true : false;
    };


    /**
     * @ngdoc method
     * @name Log#getDebug
     * @methodOf Log
     *
     * @description
     * Method to get debug mode.
     *
     * @return {Boolean} debug mode
     */
    var getDebug = function(){
        return _debug;
    };

    var setUrl = function(newUrl){
        if (newUrl) _url = newUrl;
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

            var data = (JSON && JSON.stringify) ? JSON.stringify(arguments) : '';
            req.send(data);
        }
    };

    var _console = function(type){
        return function(){
            var logFunc = _noop;
            if (_debug) logFunc = console[type] || console.log || _noop;
            else if (type == 'error') logFunc = _serverLog;

            var args = [];
            for (var i=0; i< arguments.length; i++){
                args.push(_formatError(arguments[i]));
            }

            var arg1 = args[0] ? args[0] : null;
            var arg2 = args[1] ? args[1] : null;

            if (logFunc.apply) logFunc.apply(console, args);
            else logFunc(arg1, arg2); //for older browser like IE
        };
    };

    return {
        setDebug : setDebug,
        getDebug : getDebug,
        setUrl : setUrl,

        /**
         * @ngdoc method
         * @name Log#debug
         * @methodOf Log
         *
         * @description
         * Method try to logs a value – level debug.
         * Those messages will only be outputted when in debug mode.
         *
         * @prams {...*} arguments -
         */
        debug : _console('debug'),

        /**
         * @ngdoc method
         * @name Log#info
         * @methodOf Log
         *
         * @description
         * Method try to logs a value – level info.
         * Those messages will only be outputted when in debug mode.
         *
         * @prams {...*} arguments -
         */
        info : _console('info'),

        /**
         * @ngdoc method
         * @name Log#warn
         * @methodOf Log
         *
         * @description
         * Method try to logs a value – level warn.
         * Those messages will only be outputted when in debug mode.
         *
         * @prams {...*} arguments -
         */
        warn :  _console('warn'),

        /**
         * @ngdoc method
         * @name Log#error
         * @methodOf Log
         *
         * @description
         * Method try to logs a value – level error.
         * Those messages will only be outputted when in debug mode
         * or send to server if url is defined.
         *
         * @prams {...*} arguments -
         */
        error : _console('error')
    };
})();

/**
 * @ngdoc method
 * @name D
 * @methodOf Log
 *
 * @description
 * Alias for Log.debug
 *
 * @prams {Mix} arguments -
 */
var D = Log.debug;