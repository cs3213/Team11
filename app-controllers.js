VisualIDE
.controller('actionController', ['$scope', function($scope) {
	console.log('actionController initialized from app-controllers.js');
	$scope.actions = [
		'set x 24',
		'set y 50',
		'show',
		'hide',
		'move up 3',
		'costume 2',
		'background 1',
		'repeat 3',
		'move down 2',
		'move left 2',
		'move right 2',
		'move up 2',
		'endrepeat'
	];
	$scope.play = function() {
		alert("todo!");
	};
	$scope.save = function() {
		alert("todo!");
	};
}])
.controller('authController', ['$scope', function($scope) {
	console.log('pageController initialized from app-controllers.js');
	$scope.login = function() {
		alert("todo!");
	};
}])
.controller('backgroundController', ['$scope', function($scope) {
	console.log('backgroundController initialized from app-controllers.js');
	
}])
.controller('characterController', ['$scope', function($scope) {
	console.log('characterController initialized from app-controllers.js');
	$scope.click = function() {
		alert("Pikaaaaaaa!!!");
	};
}])
.controller('menuSidebarLeft', ['$scope', function($scope) {
	console.log('menuSidebarLeft initialized from app-controllers.js');
	
}])
.controller('menuSidebarRight', ['$scope', function($scope) {
	console.log('menuSidebarRight initialized from app-controllers.js');
	
}])
.controller('pageController', ['$scope', function($scope) {
	console.log('pageController initialized from app-controllers.js');
	
}])
.controller('pageMetaData', ['$scope','pageService', function($scope, pageService) {
	console.log('pageMetaData initialized from app-controllers.js');
	$scope.page = pageService;
}]);
