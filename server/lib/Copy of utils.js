(function() {
	return {
		findIndexForId : function(objs, id) {
			for (var i=0; i<objs.length; i++) {
				if (objs[i].id == id) return i;
			}
		},
		addObj : function(objs, obj) {
			objs.push(obj);
		},
		updateObj : function(objs, obj) {
			var index = findIndexForId(obj.id)
			objs[index] = obj;
		},
		deleteObj : function(objs, id) {
			var index = findIndexForId(id)
			objs.splice(index, 1);
		}
		
	};
})();

