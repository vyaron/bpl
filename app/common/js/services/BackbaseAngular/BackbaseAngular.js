'use strict';

var BackbaseAngular = (function(){
    'use strict';

    var widgetId2AngularScope = {};

    var updateScopePref = function(widget){
        if (widget && widget.id){
            var scope = this.getAngularScope(widget.id);
            if (scope){
                //TODO: get preferences
                //TODO: scope.$apply | scope.$digest new preferences values
            }
        }
    };

    return {
        setAngularScope : function(element, scope){
            var id = scope.parents('[pid]').attr('[pid]');
            if (id) widgetId2AngularScope[id] = scope;
        },

        getAngularScope : function(id){
            return (id in widgetId2AngularScope) widgetId2AngularScope[id];
        },

        load : updateScopePref,
        prefModified : updateScopePref
    }
})();