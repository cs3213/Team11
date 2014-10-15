var VisualIDE = angular.module('VisualIDE', ['ngRoute','ngSanitize','ui.bootstrap','ui.sortable','mobile-angular-ui', 'ui.utils'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: "/views/main.php",
		controller: 'sidepanelMain',
		title: 'Dashboard'});
	$routeProvider.when('/about', {
		templateUrl: "/views/about.php",
		controller: 'sidepanelAbout',
		title: 'My Profile'});
	$routeProvider.when('/objectives', {
		templateUrl: "/views/objectives.php",
		controller: 'sidepanelObjectives',
		title: 'My Groups'});
	$routeProvider.when('/help', {
		templateUrl: "/views/help.php",
		controller: 'sidepanelHelp',
		title: 'My Groups'});
});
