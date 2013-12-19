'use strict';


angular.module('bplApp.widgets')
    .directive('moves', function() {
        return {
            restrict : 'A',
            templateUrl: 'widgets/moves/moves.html',
            replace: true,
            controller: 'moves',
            scope: {}
        };
    })
    .directive('movesSort', function() {
        return {
            link : function(scope, element, attrs){
                if (! element.find('.sort-wrapper').length) element.wrapInner('<div class="sort-wrapper"></div>');

                element.attr('ng-class', "getSortableClass('" + attrs.movesSort + "')");
                element.attr('ng-click', "sorting('" + attrs.movesSort + "')");
            }
        };
    })
    .directive('movesFilterDropdown', function() {
        return {
            link : function(scope, element, attrs){
                element.find('> li')
                    .each(function(i, el){
                        var el = angular.element(el);
                        el.find('div:first').attr('ng-click', "openDropDown(" + i + ")");
                        el.find('ul:first').attr('ng-show', "isDropDownOpen(" + i + ")");
                    });
            }
        };
    })
    .controller('moves', ['$scope', '$filter', 'ngTableParams', 'MovesResource', function($scope, $filter, ngTableParams, MovesResource){
        var groupBy = function(item) {
            return item.is_conditional ? $filter('trans')('Conditional') : $filter('date')(item.created_at, 'MMMM yyyy');
        };

        var getDateFilter = function(key){
            var now = new Date();
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            now = Math.floor(now.getTime() / 1000);

            var dateFilter = { ends_at : now * 1000};

            if (key == '30_DAYS')  dateFilter['starts_at'] = strtotime('-30 days', now) * 1000;
            else if (key == '3_MONTH') dateFilter['starts_at'] = strtotime('-3 month', now) * 1000;
            else if (key == '6_MONTH') dateFilter['starts_at'] = strtotime('-6 month', now) * 1000;

            return dateFilter;
        };

        var getData = function($defer, params) {
            var offset = (params.page() - 1) * params.count();
            var limit = params.page() * params.count();

            var queryParams = angular.extend({offset : offset, limit : limit}, params.filter());

            MovesResource.query(queryParams, function(moves, headers){
                var data = params.sorting() ? $filter('orderBy')(moves, params.orderBy()) : moves;

                var range = MovesResource.getRange(headers);
                if (range.total) params.total(range.total);

                $defer.resolve(data);
            });
        };

        var tableParams = new ngTableParams({
            page: 1,
            count: 7,
            filter : getDateFilter('30_DAYS')
        }, {
            groupBy: groupBy,
            getData: getData
        });

        //d(tableParams.filter()['name']);



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
            //d(move);
            move.$isOpen = !move.$isOpen;
        };

        var openDropDwonType = null;
        var isDropDownOpen = function(type){
            return openDropDwonType == type;
        };

        var openDropDown = function(type){
            openDropDwonType = type;
        };

        var filterBy = function(){
            angular.extend(tableParams.filter(), arguments[0]);
        };

        var getDateFilterTitle = function(key){
            var str;

            if (key == '30_DAYS')  str = $filter('trans')('30 Days');
            else if (key == '3_MONTH') str = $filter('trans')('Three Months');
            else if (key == '6_MONTH') str = $filter('trans')('Half Last Year');
            else if (key == 'CUSTOM') str = $filter('date')(tableParams.filter()['starts_at'], 'dd.M.yy') + '-' + $filter('date')(tableParams.filter()['ends_at'], 'dd.M.yy');

            return str;
        };

        var filterByDate = function(){
            var now = strtotime('now') * 1000;

            if (arguments.length == 1){
                var key = arguments[0];
                var dateFilter = getDateFilter(key);

                if (arguments[0] != 'CUSTOM') {
                    openDropDown();
                    $scope.showFilterByDatesForm = false;
                    $scope.filterDateTitle = getDateFilterTitle(key);
                    filterBy(dateFilter);
                    angular.extend($scope.filter, dateFilter);
                }
                else {
                    $scope.showFilterByDatesForm = true;
                }
            }
        };

        var submitFilterByDate = function(){
            var dateFilter = {
                starts_at : $scope.filter.starts_at,
                ends_at : $scope.filter.ends_at
            };

            filterBy(dateFilter);

            $scope.filterDateTitle = getDateFilterTitle('CUSTOM');

            openDropDown();
        };

        $scope.filter = getDateFilter('30_DAYS');
        $scope.tableParams = tableParams;
        $scope.getSortableClass = getSortableClass;
        $scope.sorting = sorting;
        $scope.filterBy = filterBy;
        $scope.getCtgClass = getCtgClass;
        $scope.isGrouped = true;
        $scope.showDetails = showDetails;

        $scope.filterBy = filterBy;
        $scope.filterByDate = filterByDate;
        $scope.submitFilterByDate = submitFilterByDate;

        $scope.filterDateTitle = getDateFilterTitle('30_DAYS');

        var allActionsTxt = $filter('trans')('All actions');
        $scope.filterCtgsTitle = allActionsTxt;
        $scope.filterSumTitle = allActionsTxt;

        $scope.openDropDown = openDropDown;
        $scope.isDropDownOpen = isDropDownOpen;
    }]);