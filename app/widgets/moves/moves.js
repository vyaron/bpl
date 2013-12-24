'use strict';


angular.module('bplApp.widgets')
    .directive( 'adviserPopup', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
            templateUrl: 'widgets/moves/adviser.html',
            link: function (scope, element, attrs) {
                scope.cancel = function () {
                    // TODO: onClose();
                    scope.$parent.tt_isOpen = false;
                };
            }
        };
    })
    // TODO: remove dependenceis?
    .directive( 'adviser', [ '$compile', '$timeout', '$parse', '$window', '$tooltip', function ( $compile, $timeout, $parse, $window, $tooltip ) {
        var tooltip = $tooltip( 'adviser', 'adviser', 'click' );
        return tooltip;
    }])


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
    .controller('moves', ['$scope', '$filter', 'ngTableParams', 'PubSub', 'MovesResource', 'MovesCategoriesResource', function($scope, $filter, ngTableParams, PubSub, MovesResource, MovesCategoriesResource){
        var movesCategories = MovesCategoriesResource.query();

        var groupBy = function(item) {
            return item.is_conditional ? $filter('trans')('Conditional') : $filter('date')(item.created_at, 'MMMM yyyy');
        };

        // getTimeByKey
        var getDateFilter = function(key){
            // TODO: make this code general
            var now = new Date();
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            now = Math.floor(now.getTime() / 1000);

            var dateFilter = { ends_at : now * 1000};

            if (key == '30_DAYS')       dateFilter['starts_at'] = strtotime('-30 days', now) * 1000;
            else if (key == '3_MONTH')  dateFilter['starts_at'] = strtotime('-3 month', now) * 1000;
            else if (key == '6_MONTH')  dateFilter['starts_at'] = strtotime('-6 month', now) * 1000;

            return dateFilter;
        };

        var getData = function($defer, params) {
            if ($scope.accountId){
                // TODO: extend params so we have: params.offset() and params.limit()
                var offset = (params.page() - 1) * params.count();
                var limit = params.page() * params.count();

                var queryParams = angular.extend({accountId : $scope.accountId, offset : offset, limit : limit}, params.filter());

                MovesResource.query(queryParams, function(moves, headers){
                    var data = params.sorting() ? $filter('orderBy')(moves, params.orderBy()) : moves;

                    var range = MovesResource.getRange(headers);
                    if (range.total) params.total(range.total);

                    $defer.resolve(data);
                });
            }
        };

        var tableModel = new ngTableParams({
            page: 1,
            count: 7,
            filter : getDateFilter('30_DAYS')
        }, {
            groupBy: groupBy,
            getData: getData
        });

        //d(tableModel);



        var toggleGroup = function(name){
            if (name == 'created_at') {
                tableModel.settings().groupBy = groupBy;
                $scope.isGrouped = true;
            } else {
                tableModel.settings().groupBy = angular.noop;
                $scope.isGrouped = false;
            }
        };

        var getSortableClass = function(name){
            var sortableClass = 'sortable';

            if (tableModel.isSortBy(name, 'asc')) sortableClass += ' sort-asc';
            else if (tableModel.isSortBy(name, 'desc')) sortableClass += ' sort-desc';

            return sortableClass;
        };

        var sorting = function(name){
            toggleGroup(name);

            var sortParams = {};
            sortParams[name] = tableModel.isSortBy(name, 'asc') ? 'desc' : 'asc';

            tableModel.sorting(sortParams);
        };

//        var getCtgClass = function(move){
//            return 'ctg ctg-' + move.category_id;
//        };

        // TODO: think if we can put on the model
        var getCtgName = function(move){
            for (var i=0; i < movesCategories.length; i++){
                if (movesCategories[i].id == move.category_id) return movesCategories[i].name;
            }
        };

        var showDetails = function(move){
            move.$_isOpen = !move.$_isOpen;

            if (move.$_isOpen){
                move.$_isLoading = true;
                move.$get(function(moveDetails){
                    move.$_isLoading = false;
                    angular.extend(move, moveDetails);
                });
            }
        };


        var openDropDownType = null;
        var isDropDownOpen = function(type){
            return openDropDownType == type;
        };

        var openDropDown = function(type){
            openDropDownType = type;
        };

        var filterBy = function(newFilters){
            angular.extend(tableModel.filter(), newFilters);
            tableModel.page(1);
        };

        // TODO: document what is it for
        var getDateFilterTitle = function(key){
            var str;

            if (key == '30_DAYS')  str = $filter('trans')('30 Days');
            else if (key == '3_MONTH') str = $filter('trans')('Three Months');
            else if (key == '6_MONTH') str = $filter('trans')('Half Last Year');
            else if (key == 'CUSTOM') str = $filter('date')(tableModel.filter()['starts_at'], 'dd.M.yy') + '-' + $filter('date')(tableModel.filter()['ends_at'], 'dd.M.yy');

            return str;
        };

        // TODO: document what is it for
        var filterByDate = function(){
            //if (arguments.length == 1){
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
            //}
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

//        var getLoadingClass = function(move){
//            return move.$_isLoading ? 'loading' : null;
//        };

        var update = function(move){
            move.$update();
        };

//        var getCheckbookStyle = function(move){
//            return 'background-image: url("' + move.getCheckbookImageUrl() + '")';
//        };


        $scope.accountId = null;

        $scope.filter = getDateFilter('30_DAYS');
        $scope.tableModel = tableModel;
        $scope.getSortableClass = getSortableClass;
        $scope.sorting = sorting;
        $scope.filterBy = filterBy;
        //$scope.getCtgClass = getCtgClass;
        $scope.getCtgName = getCtgName;
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

        //$scope.getLoadingClass = getLoadingClass;
        $scope.update = update;


        PubSub.subscribe(PubSub.CHANEL_ACCOUNT_SELECTED, $scope, function(e, time, accountId){
            $scope.accountId = accountId;
            tableModel.reload();
        });


    }]);