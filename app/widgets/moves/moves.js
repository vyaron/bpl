'use strict';


angular.module('bplApp.widgets')
    .directive('moves', function() {
        return {
            templateUrl: 'widgets/moves/moves.html',
            replace: true,
            controller: 'moves',
            scope: true
        };
    })
    .directive('movesSort', function() {
        return {
            link : function(scope, element, attrs){
                element.attr('ng-class', "getSortableClass('" + attrs.movesSort + "')");
                element.attr('ng-click', "sorting('" + attrs.movesSort + "')");
            }
        };
    })
    .controller('moves', ['$scope', '$filter', 'ngTableParams', 'MovesResource', function($scope, $filter, ngTableParams, MovesResource){
        var groupBy = function(item) {
            return item.is_conditional ? 'על תנאי' : $filter('date')(item.created_at, 'MMMM yyyy');
        };

        var tableParams = new ngTableParams({
            page: 1,
            count: 7
        }, {
            groupBy: groupBy,
            getData: function($defer, params) {
                var offset = (params.page() - 1) * params.count();
                var limit = params.page() * params.count();

                MovesResource.query({offset : offset, limit : limit}, function(moves, headers){
                    var data = params.sorting() ? $filter('orderBy')(moves, params.orderBy()) : moves;

                    var range = MovesResource.getRange(headers);
                    if (range.total) params.total(range.total);

                    $defer.resolve(data);
                });
            }
        });

        var toggleGorup = function(name){
            if (name == 'created_at') {
                tableParams.settings().groupBy = groupBy;
                $scope.isGrouped = true;
            } else {
                tableParams.settings().groupBy = function(){return 0};
                $scope.isGrouped = false;
            }
        };

        var getSortableClass = function(name){
            var sortableClass = 'sortable';

            if (tableParams.isSortBy(name, 'asc')) sortableClass += ' sort-asc';
            else if (tableParams.isSortBy(name, 'desc')) sortableClass += ' sort-desc';

            return sortableClass;
        };

        var sorting = function(name){
            toggleGorup(name);

            var sortParams = {};
            sortParams[name] = tableParams.isSortBy(name, 'asc') ? 'desc' : 'asc';
            tableParams.sorting(sortParams);
        };


        var getCtgClass = function(move){
            return 'ctg ctg-' + move.category_id;
        };

        var showDetails = function(move){
            d(move);
            move.$isOpen = !move.$isOpen;
        };

        $scope.tableParams = tableParams;
        $scope.getSortableClass = getSortableClass;
        $scope.sorting = sorting;
        $scope.getCtgClass = getCtgClass
        $scope.isGrouped = true;
        $scope.showDetails = showDetails;
    }]);