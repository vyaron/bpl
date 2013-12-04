'use strict';

describe('Log', function(){
    //var console;

    beforeEach(function() {
        var noop = function(){};
        window.console = {error : noop, info : noop, warn : noop, debug : noop};
        spyOn(window.console, 'debug');
        spyOn(window.console, 'info');
        spyOn(window.console, 'error');
        spyOn(window.console, 'warn');

        spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
        spyOn(XMLHttpRequest.prototype, 'send').andCallThrough();
    });

    it('should create global object Log', function(){
        expect(Log).toEqual(jasmine.any(Object));
    });

    it('should contain Log object with function debug', function(){
        expect(Log.debug).toEqual(jasmine.any(Function));
    });

    it('should create D global alias to Log.debug', function(){
        expect(D).toEqual(Log.debug);
    });

    it('should contain Log object with function info', function(){
        expect(Log.info).toEqual(jasmine.any(Function));
    });

    it('should contain Log object with function warn', function(){
        expect(Log.warn).toEqual(jasmine.any(Function));
    });

    it('should contain Log object with function error', function(){
        expect(Log.error).toEqual(jasmine.any(Function));
    });

    it('should contain Log object with function setDebug', function(){
        expect(Log.setDebug).toEqual(jasmine.any(Function));
    });

    it('should contain Log object with function getDebug', function(){
        expect(Log.getDebug).toEqual(jasmine.any(Function));
    });

    it('should return default debug mode true', function(){
        expect(Log.getDebug()).toBe(true);
    });

    it('should return debug mode False', function(){
        Log.setDebug(false);
        expect(Log.getDebug()).toBe(false);
    });

    it('should return debug mode True', function(){
        Log.setDebug(false);
        Log.setDebug(true);
        expect(Log.getDebug()).toBe(true);
    });

    it('should contain Log object with function setUrl', function(){
        expect(Log.setUrl).toEqual(jasmine.any(Function));
    });

    it('tracks that the console.debug was called', function(){
        Log.debug('contact:', {id : 1});
        expect(console.debug).toHaveBeenCalledWith('contact:', {id : 1});
    });

    it('tracks that the console.warn was called', function(){
        Log.warn('contact:', {id : 1});
        expect(console.warn).toHaveBeenCalledWith('contact:', {id : 1});
    });

    it('tracks that the console.info was called', function(){
        Log.info('contact:', {id : 1});
        expect(console.info).toHaveBeenCalledWith('contact:', {id : 1});
    });

    it('tracks that the console.error was called', function(){
        Log.error('contact:', {id : 1});
        expect(console.error).toHaveBeenCalledWith('contact:', {id : 1});
    });

    it('tracks that the console.debug was not called', function(){
        Log.setDebug(false);
        Log.debug('contact:', {id : 1});
        expect(console.debug).not.toHaveBeenCalled();
    });

    it('tracks that the console.error was not called', function(){
        Log.setDebug(false);
        Log.error('contact:', {id : 1});
        expect(console.error).not.toHaveBeenCalled();
    });

    it("should call our log server with right url", function() {
        var url = 'ourLogServer/';
        Log.setDebug(false);
        Log.setUrl(url);

        Log.error('contact', {id : 1});

        expect(console.error).not.toHaveBeenCalled();
        expect(XMLHttpRequest.prototype.open).toHaveBeenCalled();
        expect(XMLHttpRequest.prototype.open.mostRecentCall.args[1]).toEqual(url);
    });

    it("should Error arg", function() {
        Log.setDebug(true);

        Log.debug(new Error('ido'));
        expect(console.debug.mostRecentCall.args[0]).toContain('Error: ido');
    });
});