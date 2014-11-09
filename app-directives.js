VisualIDE
.directive('actionInstance', function() {
	return {
		restrict: 'E',
		templateUrl: './templates/action.php',
		link: function(scope, elem, attr) {
			console.log('actionInstance initialized from app-directives.js');
			
		}	
	};
})
.directive('backgroundInstance', ['backgroundService', function(backgroundService) {
	return {
		restrict: 'AE',
		templateUrl: './templates/background.php',
		link: function(scope, elem, attr) {
			console.log('backgroundInstance initialized from app-directives.js');
			scope.availableBackgrounds = backgroundService.backgrounds;
			scope.current = backgroundService.config;
		}	
	};
}])
.directive('characterInstance', ['characterService', function(characterService) {
	return {
		restrict: 'AE',
		templateUrl: './templates/character.php',
		link: function(scope, elem, attr) {
			console.log('characterInstance initialized from app-directives.js');
			scope.current = characterService.config[scope.$index];
			scope.availableCostumes = characterService.costumes;
			console.log(scope.current);
			scope.mouseClick = characterService.mouseClick;
		}	
	};
}])
.directive('formLogin', function($window) {
	return {
		restrict: 'AE',
		templateUrl: './templates/pageLogin.php',
		link: function(scope, elem, attr) {
			console.log('formLogin initialized from app-directives.js');
			scope.login = function() {
				$window.location = '/google/login';
			};
		}
	};
})
.directive('pageHeader', function() {
	return {
		restrict: 'AE',
		templateUrl: './templates/header.php',
		link: function(scope, elem, attr) {
			console.log('pageHeader initialized from app-directives.js');
			
		}
	};
});
