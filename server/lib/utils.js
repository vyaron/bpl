cl = function(m) {console.log(m);};

var objExtend = function(obj1, obj2){
    for (var key in obj2){
        obj1[key] = obj2[key];
    }

    return obj1;
};

var findIndexForId = function(objs, id, subId) {
    for (var i=0; i<objs.length; i++) {
        if (subId && (objs[i].subId == subId)) return i;
        else if (objs[i].id == id) return i;
    }
};


var findNextId = function(objs, haveSubResource) {
	var nextId = 0;
	for (var i=0; i<objs.length; i++) {
        if (haveSubResource && (objs[i].subId > nextId)) nextId = objs[i].subId;
        else if (!haveSubResource && (objs[i].id > nextId)) nextId = objs[i].id;
	}
	return nextId+1;
};

var dataCache = {};
var getDataPath = function(params){
    //Build data path to items list
    var dataPath = '../data/' + params.resourceName + '/';
    if (params.subResourceName){
        if (params.id) dataPath += params.id + '/';
        dataPath += params.subResourceName + '/';
    }
    dataPath += 'list.json';

    return dataPath;
};

var getDataList = function(params){
    var dataPath = getDataPath(params);
    return (dataPath in dataCache) ? dataCache[dataPath] : dataCache[dataPath] = require(dataPath);
};

var getData = function(params){
    var items = getDataList(params);

    if (params.subId || (params.id && !params.subResourceName)) {
        var index = findIndexForId(items, params.id, params.subId);
        return (index >= 0) ? items[index] : {};
    }

    return items;
};

var updateObj = function(params, data){
    var items = getDataList(params);
    var dataPath = getDataPath(params);
    var index = findIndexForId(items, params.id, params.subId);

    objExtend(dataCache[dataPath][index],data);

    return dataCache[dataPath][index];
};

var createObj = function(params, data){
    var items = getDataList(params);
    var dataPath = getDataPath(params);

    var haveSubResource = params.subResourceName ? true : false;
    var nextId = findNextId(items, haveSubResource);

    var item = {};
    if (haveSubResource){
        if (params.id)  item.id = params.id;
        item.subId = nextId;
    } else {
        item.id = nextId;
    }

    objExtend(data, item);


    dataCache[dataPath].push(data);

    return data;
};

var deleteObj = function (params){
    var dataPath = getDataPath(params);
    var items = getDataList(params);
    var index = findIndexForId(items, params.id, params.subId);

    dataCache[dataPath].splice(index, 1);
};

var getParams = function (req){
    return {resourceName : req.params[0], id : req.params[2], subResourceName : req.params[4], subId : req.params[6]}
};

var forceError = function(data, msg){
    var errorData = {msg : msg, errors: {}};

    for (var key in data){
        errorData.errors[key] = 'required';
    }

    return errorData;
};

exports.forceError = forceError;
exports.objExtend = objExtend;
exports.findIndexForId = findIndexForId;
exports.findNextId = findNextId;
exports.getDataPath = getDataPath;
exports.getDataList = getDataList;
exports.getData = getData;
exports.updateObj = updateObj;
exports.createObj = createObj;
exports.deleteObj = deleteObj;
exports.getParams = getParams;

