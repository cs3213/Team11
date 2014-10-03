<html data-ng-app="VisualIDE">
	
	<head>
		<page-header data-ng-controller="pageMetaData"><!-- see app-directives.js --></page-header>
	</head>
	
	<body data-ng-controller="pageController">
		<div class="sidebar sidebar-left" toggleable parent-active-class="sidebar-left-in" id="leftSidebar"
			ng-controller="menuSidebarLeft">
			<div class="scrollable sidebar-scrollable">
				<div class="scrollable-content">
					<h2 class="app-name">VisualIDE</h2>
					<div style="background-color:rgba(0,0,0,0.3);width:100%;">
						<a href="#/about">ABOUT</a> |
						<a href="#/objectives">OBJECTIVES</a> | 
						<a href="#/help">HELP</a>
					</div>
					<hr style="width:70%;" />
				</div>
			</div>
			<div ng-controller="authController">
				<form-login />
			</div>
		</div>
		<div class="sidebar sidebar-right" toggleable parent-active-class="sidebar-right-in" id="rightSidebar"
			ng-controller="menuSidebarRight">	
			<div class="scrollable sidebar-scrollable">
				<div class="scrollable-content">
					<div ng-show="tab!==1" style="padding-bottom:50px;padding-top:60px;" ng-controller="actionController">
						<div class="navbar navbar-app navbar-absolute-top" style="border-radius:0px;">
							<div class="navbar-brand navbar-brand-center">
								Drag n Drop Mode
							</div>
							<div class="btn-group pull-right">
								<a class="btn btn-link" style="font-size:25px;padding:13px;" ng-click="save()">
									<span class="fa fa-save"></span>
								</a>
							</div>
						</div>
						
						<div class="clearfix"></div>
						
						<div ui-sortable ng-model="actions">
							<span class="well well-sm form-control" ng-repeat="action in actions">{{ action }}</span>
						</div>
					</div>
					<div ng-show="tab===1" ng-controller="actionController">
						<div class="navbar navbar-app navbar-absolute-top" style="border-radius:0px;">
							<div class="navbar-brand navbar-brand-center">
								Hardcore Mode
							</div>
						</div>
						<textarea class="form-control" style="font-family:Courier;position:absolute;resize:none;top:50;bottom:0;"
							ng-bind="actions">
						</textarea>
					</div>
					<div class="navbar navbar-app navbar-absolute-bottom" style="border-radius:0px;">
						<div class="btn-group justified">
							<a class="btn btn-navbar" ng-click="tab=!1">
								<i class="fa fa-code fa-navbar"></i> Easymode
							</a>
							<a class="btn btn-navbar" ng-click="tab=1">
								<i class="fa fa-file-code-o fa-navbar"></i> Hardcore
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="app">
			<div class="navbar navbar-app navbar-absolute-top" style="border-radius:0px;">
				<div class="navbar-brand navbar-brand-center">
					VisualIDE
				</div>
				<div class="btn-group pull-left">
					<div ng-click="toggle('leftSidebar')" class="btn btn-navbar sidebar-toggle">
						<span class="fa fa-bars" style="font-size:20px;padding:15px;"></span>
					</div>
				</div>
				<div class="btn-group pull-right visible">
					<div ng-click="toggle('rightSidebar')" class="btn btn-navbar">
						<span class="fa fa-cubes" style="font-size:20px;padding:15px;"></span>
					</div>
				</div>
			</div>
			<!-- drawing board -->
			<background-instance ng-controller="backgroundController">
				<!-- only one background --> 
			</background-instance>
			<character-instance ng-controller="characterController">
			</character-instance>
			
			<!-- /drawing board -->
			<div class="navbar navbar-app navbar-absolute-bottom" style="border-radius:0px;">
				<div class="btn-group justified" ng-controller="actionController">
					<a ng-click="play()" class="btn btn-navbar">
						<i class="fa fa-play fa-navbar"></i> PLAY
					</a>
				</div>
			</div>
		</div>
		<script src="/assets/js/jquery-1.11.1.min.js"></script>
		<script src="/assets/js/jquery-ui-1.10.4.min.js"></script>
		<script src="/assets/js/angular.min.js"></script>
		<script src="/assets/js/angular-route.min.js"></script>
		<script src="/assets/js/angular-sanitize.min.js"></script>
		<script src="/assets/js/angular-ui-bootstrap.js"></script>
		<script src="/assets/js/angular-ui-sortable.js"></script>
		<script src="/assets/js/mobile-angular-ui.min.js"></script>
		<script src="/app.js"></script>
		<script src="/app-controllers.js"></script>
		<script src="/app-directives.js"></script>
		<script src="/app-services.js"></script>
	</body>
	
</html>