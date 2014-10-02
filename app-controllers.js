VisualIDE
.controller('pageController', ['$scope', function($scope) {
	console.log('PageController initialized from app-controllers.js');

}])
.controller('pageMetaData', ['$scope','pageService', function($scope, pageService) {
	console.log('PageMetaData initialized from app-controllers.js');
	$scope.page = pageService;
}]);
