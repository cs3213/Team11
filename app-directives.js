VisualIDE.directive('templateHeader', function() {
	return {
		restrict: 'AE',
		templateUrl: './templates/header.php',
		link: function(scope, elem, attr) {
			console.log('templateHeader initialized from app-directives.js');
		}
	};
});